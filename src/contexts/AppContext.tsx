import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type AppMode = 'setup' | 'normal' | 'decoy';
export type SetupStep = 'welcome' | 'normal-pin' | 'decoy-pin' | 'trusted-contact' | 'complete';

interface AppState {
  mode: AppMode;
  setupStep: SetupStep;
  normalPin: string | null;
  decoyPin: string | null;
  trustedContact: string | null;
  isSetupComplete: boolean;
}

interface AppContextType extends AppState {
  setMode: (mode: AppMode) => void;
  setSetupStep: (step: SetupStep) => void;
  setNormalPin: (pin: string) => void;
  setDecoyPin: (pin: string) => void;
  setTrustedContact: (contact: string) => void;
  authenticateWithPin: (pin: string) => AppMode | null;
  triggerSOS: () => void;
  resetApp: () => void;
}

const defaultState: AppState = {
  mode: 'setup',
  setupStep: 'welcome',
  normalPin: null,
  decoyPin: null,
  trustedContact: null,
  isSetupComplete: false,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, setState] = useState<AppState>(() => {
    // Load state from localStorage if available
    const saved = localStorage.getItem('shadowsafe-state');
    return saved ? { ...defaultState, ...JSON.parse(saved) } : defaultState;
  });

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('shadowsafe-state', JSON.stringify(state));
  }, [state]);

  const setMode = (mode: AppMode) => {
    setState(prev => ({ ...prev, mode }));
  };

  const setSetupStep = (setupStep: SetupStep) => {
    setState(prev => ({ ...prev, setupStep }));
  };

  const setNormalPin = (normalPin: string) => {
    setState(prev => ({ ...prev, normalPin }));
  };

  const setDecoyPin = (decoyPin: string) => {
    setState(prev => ({ ...prev, decoyPin }));
  };

  const setTrustedContact = (trustedContact: string) => {
    setState(prev => ({ 
      ...prev, 
      trustedContact, 
      isSetupComplete: true,
      setupStep: 'complete'
    }));
  };

  const authenticateWithPin = (pin: string): AppMode | null => {
    if (pin === state.normalPin) {
      setMode('normal');
      return 'normal';
    } else if (pin === state.decoyPin) {
      setMode('decoy');
      // Trigger SOS silently
      triggerSOS();
      return 'decoy';
    }
    return null;
  };

  const triggerSOS = () => {
    // Silent SOS alert - in real app this would send location, contact trusted person
    if (state.trustedContact) {
      console.log('🚨 SOS Alert triggered silently');
      console.log('📍 Sending location to:', state.trustedContact);
      console.log('📧 Alert sent - user in decoy mode');
      
      // Simulate sending alert (in real app: send SMS, email, push notification)
      setTimeout(() => {
        if ('Notification' in window) {
          new Notification('ShadowSafe Alert', {
            body: 'Emergency alert sent to trusted contact',
            icon: '/favicon.ico',
            tag: 'sos-alert'
          });
        }
      }, 2000);
    }
  };

  const resetApp = () => {
    setState(defaultState);
    localStorage.removeItem('shadowsafe-state');
  };

  const contextValue: AppContextType = {
    ...state,
    setMode,
    setSetupStep,
    setNormalPin,
    setDecoyPin,
    setTrustedContact,
    authenticateWithPin,
    triggerSOS,
    resetApp,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};