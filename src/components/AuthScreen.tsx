import React, { useState, useRef, useEffect } from 'react';
import { Shield, Smartphone, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useApp } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';

const AuthScreen: React.FC = () => {
  const { authenticateWithPin } = useApp();
  const { toast } = useToast();
  
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [attempts, setAttempts] = useState(0);
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Focus first input on mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handlePinInput = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newPin = pin.split('');
    newPin[index] = value;
    
    const updatedPin = newPin.join('').slice(0, 6);
    setPin(updatedPin);
    
    // Move to next input
    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when pin is complete
    if (updatedPin.length >= 4 && updatedPin.length === 6 || (updatedPin.length >= 4 && index === 5)) {
      setTimeout(() => handleAuthenticate(updatedPin), 100);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace') {
      if (pin[index]) {
        const newPin = pin.split('');
        newPin[index] = '';
        setPin(newPin.join(''));
      } else if (index > 0 && inputRefs.current[index - 1]) {
        inputRefs.current[index - 1]?.focus();
        const newPin = pin.split('');
        newPin[index - 1] = '';
        setPin(newPin.join(''));
      }
    }
  };

  const handleAuthenticate = (pinToCheck?: string) => {
    const checkPin = pinToCheck || pin;
    
    if (checkPin.length < 4) {
      toast({
        title: "PIN too short",
        description: "Please enter at least 4 digits",
        variant: "destructive"
      });
      return;
    }

    const result = authenticateWithPin(checkPin);
    
    if (result === null) {
      setAttempts(prev => prev + 1);
      setPin('');
      
      toast({
        title: "Incorrect PIN",
        description: `Please try again. Attempts: ${attempts + 1}/5`,
        variant: "destructive"
      });

      // Clear inputs and focus first one
      inputRefs.current.forEach(input => {
        if (input) input.value = '';
      });
      inputRefs.current[0]?.focus();

      if (attempts >= 4) {
        toast({
          title: "Too many attempts",
          description: "Please wait before trying again",
          variant: "destructive"
        });
      }
    } else {
      // Success - mode will be set by authenticateWithPin
      setAttempts(0);
      
      if (result === 'decoy') {
        // Silent success - don't show any success message for decoy mode
        console.log('Decoy mode activated - SOS triggered silently');
      } else {
        toast({
          title: "Welcome back",
          description: "Access granted",
        });
      }
    }
  };

  const currentTime = new Date().toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 flex flex-col">
      {/* Status Bar Simulation */}
      <div className="flex justify-between items-center p-4 text-sm text-muted-foreground">
        <div className="flex items-center space-x-1">
          <div className="w-1 h-1 bg-current rounded-full"></div>
          <div className="w-1 h-1 bg-current rounded-full"></div>
          <div className="w-1 h-1 bg-current rounded-full opacity-50"></div>
          <span className="ml-2 text-xs">Carrier</span>
        </div>
        <div className="font-medium">{currentTime}</div>
        <div className="flex items-center space-x-1">
          <div className="w-4 h-2 border border-current rounded-sm">
            <div className="w-3 h-1 bg-current rounded-sm m-0.5"></div>
          </div>
          <span className="text-xs">100%</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-12">
        {/* App Icon */}
        <div className="text-center space-y-6">
          <div className="w-24 h-24 mx-auto gradient-hero rounded-2xl flex items-center justify-center shadow-large animate-scale-in">
            <Shield className="w-12 h-12 text-white" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-foreground">ShadowSafe</h1>
            <p className="text-muted-foreground">Enter your PIN to continue</p>
          </div>
        </div>

        {/* PIN Input */}
        <Card className="w-full max-w-sm p-6 bg-card/50 backdrop-blur border shadow-soft space-y-6">
          {/* PIN Input Grid */}
          <div className="flex justify-center space-x-3">
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type={showPin ? 'text' : 'password'}
                value={pin[index] || ''}
                onChange={(e) => handlePinInput(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 text-center text-lg font-semibold border border-input rounded-lg bg-background/80 backdrop-blur focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                maxLength={1}
                pattern="[0-9]*"
                inputMode="numeric"
                disabled={attempts >= 5}
              />
            ))}
          </div>

          {/* Controls */}
          <div className="flex justify-between items-center">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowPin(!showPin)}
              className="text-muted-foreground hover:text-foreground"
            >
              {showPin ? (
                <>
                  <EyeOff className="w-4 h-4 mr-2" />
                  Hide
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 mr-2" />
                  Show
                </>
              )}
            </Button>

            <Button
              onClick={() => handleAuthenticate()}
              disabled={pin.length < 4 || attempts >= 5}
              variant="default"
              size="sm"
            >
              Unlock
            </Button>
          </div>

          {attempts > 0 && (
            <div className="text-center text-sm text-destructive">
              {attempts >= 5 ? 'Too many attempts. Please wait.' : `Incorrect PIN (${attempts}/5)`}
            </div>
          )}
        </Card>

        {/* Bottom App Icons */}
        <div className="flex justify-center space-x-8 opacity-60">
          <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center">
            <Smartphone className="w-6 h-6 text-muted-foreground" />
          </div>
          <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center">
            <Shield className="w-6 h-6 text-muted-foreground" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;