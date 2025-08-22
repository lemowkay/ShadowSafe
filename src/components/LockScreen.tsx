import React, { useState, useEffect } from 'react';
import { Fingerprint, Delete } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';

type UnlockMode = 'normal' | 'decoy';

interface LockScreenProps {
  onUnlock: (mode: UnlockMode) => void;
  requiredPinLength?: number; // optional, default to 6
}

const LockScreen: React.FC<LockScreenProps> = ({ onUnlock, requiredPinLength = 6 }) => {
  const { authenticateWithPin } = useApp();
  const { toast } = useToast();

  const [pin, setPin] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [locked, setLocked] = useState(true);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) =>
    date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

  const formatDate = (date: Date) =>
    date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  const handleNumberPress = (num: string) => {
    if (!locked || pin.length >= requiredPinLength) return;

    const newPin = pin + num;
    setPin(newPin);

    // Authenticate ONLY when PIN length matches required length
    if (newPin.length === requiredPinLength) {
      handleAuthenticate(newPin);
    }
  };

  const handleBackspace = () => {
    if (!locked) return;
    setPin(prev => prev.slice(0, -1));
  };

  const handleAuthenticate = (pinToCheck: string) => {
    const result = authenticateWithPin(pinToCheck); // returns 'normal', 'decoy', or null

    if (result === 'normal' || result === 'decoy') {
      setAttempts(0);
      setLocked(false);
      onUnlock(result);
      if (result === 'decoy') {
        console.log('Decoy mode activated - SOS triggered silently');
      }
    } else {
      setAttempts(prev => prev + 1);
      setPin('');

      const lockScreen = document.getElementById('lock-screen');
      if (lockScreen) {
        lockScreen.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => (lockScreen.style.animation = ''), 500);
      }

      if (attempts >= 4) {
        toast({
          title: 'iPhone is disabled',
          description: 'Try again in 1 minute',
          variant: 'destructive',
        });
      }
    }
  };

  const keypadNumbers = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['', '0', ''],
  ];

  return locked ? (
    <div
      id="lock-screen"
      className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex flex-col text-white relative overflow-hidden"
    >
      {/* Dynamic Wallpaper */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-teal-900/20 animate-pulse"></div>

      {/* Status Bar */}
      <div className="flex justify-between items-center p-4 text-sm relative z-10">
        <div className="flex items-center space-x-1">
          <div className="flex space-x-1">
            <div className="w-1 h-1 bg-white rounded-full"></div>
            <div className="w-1 h-1 bg-white rounded-full"></div>
            <div className="w-1 h-1 bg-white rounded-full"></div>
            <div className="w-1 h-1 bg-white/50 rounded-full"></div>
          </div>
          <span className="ml-2">Carrier</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-6 h-3 border border-white rounded-sm">
            <div className="w-4 h-1 bg-white rounded-sm m-0.5"></div>
          </div>
          <span>100%</span>
        </div>
      </div>

      {/* Time Display */}
      <div className="flex-1 flex flex-col items-center justify-center space-y-8 relative z-10">
        <div className="text-center space-y-2">
          <div className="text-7xl font-thin tracking-wider">{formatTime(currentTime)}</div>
          <div className="text-xl font-light text-white/80">{formatDate(currentTime)}</div>
        </div>

        {/* PIN Dots */}
        <div className="flex space-x-4 mt-16">
          {[...Array(requiredPinLength)].map((_, index) => (
            <div
              key={index}
              className={`w-4 h-4 rounded-full border-2 border-white transition-all duration-200 ${
                index < pin.length ? 'bg-white' : 'bg-transparent'
              }`}
            />
          ))}
        </div>

        {attempts > 0 && (
          <div className="text-red-400 text-sm mt-4">
            {attempts >= 5 ? 'iPhone is disabled' : 'Incorrect PIN'}
          </div>
        )}
      </div>

      {/* Keypad */}
      <div className="pb-8 px-8 relative z-10">
        <div className="grid grid-cols-3 gap-6 max-w-xs mx-auto">
          {keypadNumbers.flat().map((num, index) => (
            <div key={index} className="flex justify-center">
              {num === '' ? (
                index === 9 ? (
                  <Button
                    variant="ghost"
                    size="lg"
                    className="w-20 h-20 rounded-full bg-white/10 hover:bg-white/20 border-0 text-white"
                    onClick={() => {}}
                  >
                    <Fingerprint className="w-8 h-8" />
                  </Button>
                ) : index === 11 ? (
                  <Button
                    variant="ghost"
                    size="lg"
                    className="w-20 h-20 rounded-full bg-white/10 hover:bg-white/20 border-0 text-white"
                    onClick={handleBackspace}
                    disabled={pin.length === 0}
                  >
                    <Delete className="w-6 h-6" />
                  </Button>
                ) : (
                  <div className="w-20 h-20"></div>
                )
              ) : (
                <Button
                  variant="ghost"
                  size="lg"
                  className="w-20 h-20 rounded-full bg-white/10 hover:bg-white/20 border-0 text-white text-3xl font-light"
                  onClick={() => handleNumberPress(num)}
                  disabled={attempts >= 5}
                >
                  {num}
                </Button>
              )}
            </div>
          ))}
        </div>

        {/* Bottom Actions */}
        <div className="flex justify-between items-center mt-8">
          <Button variant="ghost" className="text-white/60 hover:text-white">
            Emergency
          </Button>
          <Button variant="ghost" className="text-white/60 hover:text-white">
            Cancel
          </Button>
        </div>
      </div>

      {/* Shake Animation */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-10px); }
            75% { transform: translateX(10px); }
          }
        `
      }} />
    </div>
  ) : null;
};

export default LockScreen;
