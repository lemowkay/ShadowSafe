import React, { useState, useRef, useEffect } from 'react';
import { Eye, EyeOff, Lock, Shield, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useApp } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';

interface PinSetupProps {
  type: 'normal' | 'decoy';
}

const PinSetup: React.FC<PinSetupProps> = ({ type }) => {
  const { setNormalPin, setDecoyPin, setSetupStep, normalPin } = useApp();
  const { toast } = useToast();
  
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Focus first input on mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handlePinInput = (index: number, value: string) => {
    if (value.length > 1) return; // Prevent multiple chars
    
    const newPin = pin.split('');
    newPin[index] = value;
    
    const updatedPin = newPin.join('').slice(0, 6); // Max 6 digits
    setPin(updatedPin);
    
    // Move to next input
    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when PIN is complete (4-6 digits)
    if (updatedPin.length >= 4 && (updatedPin.length === 6 || index === 5)) {
      setTimeout(() => handleContinue(updatedPin), 200);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace') {
      if (pin[index]) {
        // Clear current digit
        const newPin = pin.split('');
        newPin[index] = '';
        setPin(newPin.join(''));
      } else if (index > 0 && inputRefs.current[index - 1]) {
        // Move to previous input and clear it
        inputRefs.current[index - 1]?.focus();
        const newPin = pin.split('');
        newPin[index - 1] = '';
        setPin(newPin.join(''));
      }
    }
  };

  const handleContinue = (pinToUse?: string) => {
    const currentPin = pinToUse || pin;
    
    if (currentPin.length < 4) {
      toast({
        title: "PIN too short",
        description: "Please enter at least 4 digits",
        variant: "destructive"
      });
      return;
    }
    
    // Check if decoy PIN is different from normal PIN
    if (type === 'decoy' && currentPin === normalPin) {
      toast({
        title: "PIN must be different",
        description: "Your decoy PIN must be different from your normal PIN",
        variant: "destructive"
      });
      setPin('');
      // Clear inputs and focus first one
      inputRefs.current.forEach(input => {
        if (input) input.value = '';
      });
      inputRefs.current[0]?.focus();
      return;
    }
    
    // Save PIN and proceed
    if (type === 'normal') {
      setNormalPin(currentPin);
      setSetupStep('decoy-pin');
    } else {
      setDecoyPin(currentPin);
      setSetupStep('trusted-contact');
    }
    
    toast({
      title: "PIN set successfully",
      description: `Your ${type} PIN has been saved securely`,
    });
  };

  const isNormalPinType = type === 'normal';
  const canContinue = pin.length >= 4;
  
  const title = `Set Your ${isNormalPinType ? 'Normal' : 'Decoy'} PIN`;
  const description = isNormalPinType 
    ? "This PIN will give you access to your real phone interface"
    : "This PIN will activate decoy mode and trigger silent emergency alerts";

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 animate-slide-up">
      <div className="w-full max-w-sm space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center shadow-medium ${
            isNormalPinType ? 'bg-primary' : 'gradient-hero'
          }`}>
            {isNormalPinType ? (
              <Lock className="w-8 h-8 text-primary-foreground" />
            ) : (
              <Shield className="w-8 h-8 text-white" />
            )}
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-foreground">{title}</h1>
            <p className="text-muted-foreground">{description}</p>
          </div>
        </div>

        {/* PIN Input Card */}
        <Card className="p-6 bg-card border shadow-soft space-y-6">
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
                className="w-12 h-12 text-center text-lg font-semibold border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                maxLength={1}
                pattern="[0-9]*"
                inputMode="numeric"
              />
            ))}
          </div>

          {/* Show/Hide PIN Toggle */}
          <div className="flex justify-center">
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
                  Hide PIN
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 mr-2" />
                  Show PIN
                </>
              )}
            </Button>
          </div>

          {/* Continue Button */}
          <Button
            onClick={() => handleContinue()}
            disabled={!canContinue}
            variant={isNormalPinType ? "default" : "hero"}
            size="lg"
            className="w-full"
          >
            Continue
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Card>

        {/* Warning for Decoy PIN */}
        {type === 'decoy' && (
          <Card className="p-4 bg-warning/10 border-warning/20">
            <div className="flex items-start space-x-3">
              <Shield className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-warning">Important</h3>
                <p className="text-sm text-warning/90 mt-1">
                  Using this PIN will silently alert your trusted contact and activate decoy mode. 
                  Only use when you feel unsafe.
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Progress indicator */}
        <div className="flex justify-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-primary"></div>
          <div className={`w-2 h-2 rounded-full ${type === 'decoy' ? 'bg-primary' : 'bg-muted'}`}></div>
          <div className="w-2 h-2 rounded-full bg-muted"></div>
        </div>
      </div>
    </div>
  );
};

export default PinSetup;