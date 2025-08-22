import React, { useState } from 'react';
import { Phone, Mail, CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useApp } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';

const TrustedContactSetup: React.FC = () => {
  const { setTrustedContact, setMode } = useApp();
  const { toast } = useToast();
  
  const [contact, setContact] = useState('');
  const [contactType, setContactType] = useState<'phone' | 'email'>('phone');

  const validateContact = (value: string, type: 'phone' | 'email'): boolean => {
    if (type === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value);
    } else {
      const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
      return phoneRegex.test(value.replace(/\s/g, ''));
    }
  };

  const handleComplete = () => {
    if (!contact.trim()) {
      toast({
        title: "Contact required",
        description: "Please enter a trusted contact",
        variant: "destructive"
      });
      return;
    }

    if (!validateContact(contact, contactType)) {
      toast({
        title: "Invalid contact",
        description: `Please enter a valid ${contactType}`,
        variant: "destructive"
      });
      return;
    }

    setTrustedContact(contact);
    
    toast({
      title: "Setup complete!",
      description: "ShadowSafe is now ready to protect you",
    });

    // Brief delay to show success, then go to normal mode
    setTimeout(() => {
      setMode('normal');
    }, 1500);
  };

  const formatPhoneInput = (value: string): string => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `${numbers.slice(0, 3)} ${numbers.slice(3)}`;
    if (numbers.length <= 10) return `${numbers.slice(0, 3)} ${numbers.slice(3, 6)} ${numbers.slice(6)}`;
    return `${numbers.slice(0, 3)} ${numbers.slice(3, 6)} ${numbers.slice(6, 10)}`;
  };

  const handleContactChange = (value: string) => {
    if (contactType === 'phone') {
      setContact(formatPhoneInput(value));
    } else {
      setContact(value);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 animate-slide-up">
      <div className="w-full max-w-sm space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto gradient-safe rounded-full flex items-center justify-center shadow-medium">
            <Phone className="w-8 h-8 text-white" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-foreground">Add Trusted Contact</h1>
            <p className="text-muted-foreground">
              This contact will receive emergency alerts when decoy mode is activated
            </p>
          </div>
        </div>

        {/* Contact Form Card */}
        <Card className="p-6 bg-card border shadow-soft space-y-6">
          {/* Contact Type Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-card-foreground">Contact Method</Label>
            <div className="flex space-x-2">
              <Button
                type="button"
                variant={contactType === 'phone' ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  setContactType('phone');
                  setContact('');
                }}
                className="flex-1"
              >
                <Phone className="w-4 h-4 mr-2" />
                Phone
              </Button>
              <Button
                type="button"
                variant={contactType === 'email' ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  setContactType('email');
                  setContact('');
                }}
                className="flex-1"
              >
                <Mail className="w-4 h-4 mr-2" />
                Email
              </Button>
            </div>
          </div>

          {/* Contact Input */}
          <div className="space-y-2">
            <Label htmlFor="contact" className="text-sm font-medium text-card-foreground">
              {contactType === 'phone' ? 'Phone Number' : 'Email Address'}
            </Label>
            <Input
              id="contact"
              type={contactType === 'phone' ? 'tel' : 'email'}
              placeholder={contactType === 'phone' ? '123 456 7890' : 'trusted@example.com'}
              value={contact}
              onChange={(e) => handleContactChange(e.target.value)}
              className="text-base"
            />
          </div>

          {/* Complete Setup Button */}
          <Button
            onClick={handleComplete}
            disabled={!contact.trim()}
            variant="safe"
            size="lg"
            className="w-full"
          >
            Complete Setup
            <CheckCircle className="w-4 h-4 ml-2" />
          </Button>
        </Card>

        {/* Info Card */}
        <Card className="p-4 bg-safe/10 border-safe/20">
          <div className="flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-safe flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-safe">Privacy & Security</h3>
              <p className="text-sm text-safe/90 mt-1">
                Your trusted contact information is stored securely on your device and will only 
                be used for emergency alerts.
              </p>
            </div>
          </div>
        </Card>

        {/* Progress indicator */}
        <div className="flex justify-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-primary"></div>
          <div className="w-2 h-2 rounded-full bg-primary"></div>
          <div className="w-2 h-2 rounded-full bg-primary"></div>
        </div>
      </div>
    </div>
  );
};

export default TrustedContactSetup;