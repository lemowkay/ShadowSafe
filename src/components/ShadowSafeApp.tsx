import React, { useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';
import WelcomeScreen from '@/components/WelcomeScreen';
import PinSetup from '@/components/PinSetup';
import TrustedContactSetup from '@/components/TrustedContactSetup';
import LockScreen from '@/components/LockScreen';
import NormalModeHome from '@/components/NormalModeHome';
import DecoyModeHome from '@/components/DecoyModeHome';

const ShadowSafeApp: React.FC = () => {
  const { mode, setupStep, isSetupComplete } = useApp();

  // Request notification permission on app load
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // If setup is not complete, show setup flow
  if (!isSetupComplete) {
    switch (setupStep) {
      case 'welcome':
        return <WelcomeScreen />;
      case 'normal-pin':
        return <PinSetup type="normal" />;
      case 'decoy-pin':
        return <PinSetup type="decoy" />;
      case 'trusted-contact':
        return <TrustedContactSetup />;
      default:
        return <WelcomeScreen />;
    }
  }

  // If setup is complete, show appropriate mode
  switch (mode) {
    case 'normal':
      return <NormalModeHome />;
    case 'decoy':
      return <DecoyModeHome />;
    default:
      // Default to lock screen if no mode is set
      return <LockScreen />;
  }
};

export default ShadowSafeApp;