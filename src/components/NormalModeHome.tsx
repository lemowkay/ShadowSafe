import React, { useState } from 'react';
import { 
  Settings, 
  Phone, 
  MessageSquare, 
  Camera, 
  Mail, 
  Calendar,
  Calculator,
  Clock,
  User,
  MapPin,
  Music,
  Image,
  Globe,
  MoreHorizontal
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useApp } from '@/contexts/AppContext';

// Updated Messages screen
const MessagesScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [reply, setReply] = useState('');

  const handleSend = () => {
    if (reply.trim() !== '') {
      alert(`You replied: ${reply}`);
      setReply('');
    }
  };

  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-gray-300">
        <h2 className="text-xl font-semibold">Messages</h2>
        <Button variant="ghost" onClick={onBack}>Back</Button>
      </div>

      {/* Messages area */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        <div className="p-4 bg-gray-200 rounded-lg max-w-xs">
          <strong>Emily:</strong> Hey! How are you today?
        </div>
        <div className="p-4 bg-gray-200 rounded-lg max-w-xs">
          <strong>Emily:</strong> Did you finish the homework?
        </div>
      </div>

      {/* Reply input */}
      <div className="p-4 border-t border-gray-300 flex items-center space-x-2">
        <input
          type="text"
          className="flex-1 border border-gray-300 rounded-xl p-2 focus:outline-none"
          placeholder="Type your message..."
          value={reply}
          onChange={(e) => setReply(e.target.value)}
        />
        <Button onClick={handleSend}>Send</Button>
      </div>
    </div>
  );
};

const NormalModeHome: React.FC = () => {
  const { resetApp } = useApp();
  const [showSettings, setShowSettings] = useState(false);
  const [activeApp, setActiveApp] = useState<string | null>(null);

  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const currentDate = new Date().toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });

  const apps = [
    { name: 'Phone', icon: Phone, color: 'bg-green-500' },
    { name: 'Messages', icon: MessageSquare, color: 'bg-blue-500' },
    { name: 'Camera', icon: Camera, color: 'bg-gray-600' },
    { name: 'Mail', icon: Mail, color: 'bg-blue-400' },
    { name: 'Calendar', icon: Calendar, color: 'bg-red-500' },
    { name: 'Calculator', icon: Calculator, color: 'bg-gray-700' },
    { name: 'Clock', icon: Clock, color: 'bg-orange-500' },
    { name: 'Contacts', icon: User, color: 'bg-purple-500' },
    { name: 'MapPin', icon: MapPin, color: 'bg-green-400' },
    { name: 'Music', icon: Music, color: 'bg-pink-500' },
    { name: 'Photos', icon: Image, color: 'bg-yellow-500' },
    { name: 'Browser', icon: Globe, color: 'bg-indigo-500' },
  ];

  const handleAppClick = (appName: string) => {
    if (appName === 'Messages') {
      setActiveApp('Messages'); // open Messages screen
    } else {
      console.log(`Opening ${appName} in normal mode`);
    }
  };

  const handleBack = () => setActiveApp(null);

  // Render Messages screen if active
  if (activeApp === 'Messages') {
    return <MessagesScreen onBack={handleBack} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      {/* Status Bar */}
      <div className="flex justify-between items-center p-4 text-sm text-foreground">
        <div className="flex items-center space-x-1">
          <div className="w-1 h-1 bg-current rounded-full"></div>
          <div className="w-1 h-1 bg-current rounded-full"></div>
          <div className="w-1 h-1 bg-current rounded-full"></div>
          <span className="ml-2 text-xs font-medium">Carrier</span>
        </div>
        <div className="font-semibold">{currentTime}</div>
        <div className="flex items-center space-x-1">
          <div className="w-4 h-2 border border-current rounded-sm">
            <div className="w-full h-full bg-safe rounded-sm"></div>
          </div>
          <span className="text-xs">100%</span>
        </div>
      </div>

      {/* Home Screen Content */}
      <div className="flex-1 p-6 space-y-8">
        {/* Date & Time Widget */}
        <Card className="p-6 bg-card/80 backdrop-blur border shadow-soft">
          <div className="text-center space-y-2">
            <div className="text-4xl font-light text-foreground">{currentTime}</div>
            <div className="text-muted-foreground">{currentDate}</div>
          </div>
        </Card>

        {/* App Grid */}
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-foreground">Apps</h2>
          <div className="grid grid-cols-4 gap-4">
            {apps.map((app, index) => (
              <button
                key={app.name}
                onClick={() => handleAppClick(app.name)}
                className="flex flex-col items-center space-y-2 p-2 rounded-xl hover:bg-muted/50 transition-colors active:scale-95 animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className={`w-14 h-14 ${app.color} rounded-2xl flex items-center justify-center shadow-soft`}>
                  <app.icon className="w-7 h-7 text-white" />
                </div>
                <span className="text-xs text-muted-foreground font-medium">{app.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Settings Access */}
        <Card className="p-4 bg-card/50 backdrop-blur border shadow-soft">
          <Button
            onClick={() => setShowSettings(!showSettings)}
            variant="ghost"
            className="w-full justify-between"
          >
            <div className="flex items-center space-x-3">
              <Settings className="w-5 h-5 text-muted-foreground" />
              <span>ShadowSafe Settings</span>
            </div>
            <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
          </Button>
          
          {showSettings && (
            <div className="mt-4 pt-4 border-t space-y-2 animate-slide-up">
              <Button
                onClick={resetApp}
                variant="destructive"
                size="sm"
                className="w-full"
              >
                Reset App (Demo)
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                This will clear all settings and return to welcome screen
              </p>
            </div>
          )}
        </Card>
      </div>

      {/* Bottom Dock */}
      <div className="p-4">
        <div className="bg-card/80 backdrop-blur rounded-2xl p-3 shadow-large border">
          <div className="flex justify-center space-x-8">
            {[Phone, MessageSquare, Camera, Mail].map((Icon, index) => (
              <button
                key={index}
                onClick={() => handleAppClick(index === 1 ? 'Messages' : Icon.name)}
                className="w-14 h-14 bg-muted/50 rounded-xl flex items-center justify-center hover:bg-muted transition-colors active:scale-95"
              >
                <Icon className="w-6 h-6 text-foreground" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NormalModeHome;
