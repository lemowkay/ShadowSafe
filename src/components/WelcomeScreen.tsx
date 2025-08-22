import React from 'react';
import { Shield, Lock, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useApp } from '@/contexts/AppContext';

const WelcomeScreen: React.FC = () => {
  const { setSetupStep } = useApp();

  const handleGetStarted = () => {
    setSetupStep('normal-pin');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 animate-fade-in">
      <div className="w-full max-w-sm space-y-8">
        {/* App Logo and Title */}
        <div className="text-center space-y-4">
          <div className="w-20 h-20 mx-auto gradient-hero rounded-full flex items-center justify-center shadow-large">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">ShadowSafe</h1>
            <p className="text-muted-foreground text-lg">Your personal safety app</p>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="space-y-4">
          <Card className="p-4 bg-card border shadow-soft">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Lock className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-card-foreground">Dual PIN Protection</h3>
                <p className="text-sm text-muted-foreground">Normal and decoy modes for safety</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-card border shadow-soft">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-safe/10 rounded-lg flex items-center justify-center">
                <Phone className="w-5 h-5 text-safe" />
              </div>
              <div>
                <h3 className="font-semibold text-card-foreground">Emergency Alerts</h3>
                <p className="text-sm text-muted-foreground">Silent SOS to trusted contacts</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Welcome Message */}
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">
            ShadowSafe protects you with a dual-mode interface. 
            Set up your normal PIN and a decoy PIN that triggers silent emergency alerts.
          </p>
        </div>

        {/* Get Started Button */}
        <Button 
          onClick={handleGetStarted}
          variant="hero"
          size="lg"
          className="w-full"
        >
          Get Started
        </Button>

        {/* Privacy Note */}
        <p className="text-xs text-muted-foreground text-center">
          All data is stored locally on your device for maximum privacy and security.
        </p>
      </div>
    </div>
  );
};

export default WelcomeScreen;