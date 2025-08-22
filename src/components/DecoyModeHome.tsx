import React, { useState } from 'react';
import { 
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
  Heart,
  ShoppingBag,
  Video
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface FakeMessage {
  sender: string;
  message: string;
  time: string;
}

interface FakePost {
  user: string;
  content: string;
  likes: number;
  time: string;
}

const DecoyModeHome: React.FC = () => {
  const [selectedApp, setSelectedApp] = useState<string | null>(null);

  const currentTime = new Date().toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  // Fake data for decoy apps
  const fakeMessages: FakeMessage[] = [
    { sender: 'Mom', message: 'Hey, how are you?', time: '2:30 PM' },
    { sender: 'Alex', message: 'Talk later!', time: '1:45 PM' },
    { sender: 'Sarah', message: 'See you tomorrow', time: '12:20 PM' },
    { sender: 'Work Group', message: 'Meeting at 3 PM', time: '11:30 AM' },
  ];

  const fakePosts: FakePost[] = [
    { user: 'travel_lover', content: 'Beautiful sunset today! 🌅', likes: 127, time: '3h' },
    { user: 'foodie_dreams', content: 'Best pasta in town 🍝', likes: 89, time: '5h' },
    { user: 'fit_journey', content: 'Morning workout done! 💪', likes: 156, time: '8h' },
    { user: 'nature_pics', content: 'Hiking adventure continues', likes: 203, time: '12h' },
  ];

  const apps = [
    { name: 'Phone', icon: Phone, color: 'bg-green-500', hasContent: true },
    { name: 'WhatsApp', icon: MessageSquare, color: 'bg-green-600', hasContent: true },
    { name: 'Instagram', icon: Camera, color: 'bg-gradient-to-br from-purple-500 to-pink-500', hasContent: true },
    { name: 'Gmail', icon: Mail, color: 'bg-red-500', hasContent: true },
    { name: 'Calendar', icon: Calendar, color: 'bg-blue-500', hasContent: false },
    { name: 'Calculator', icon: Calculator, color: 'bg-gray-700', hasContent: false },
    { name: 'Clock', icon: Clock, color: 'bg-orange-500', hasContent: false },
    { name: 'Contacts', icon: User, color: 'bg-purple-500', hasContent: false },
    { name: 'Maps', icon: MapPin, color: 'bg-green-400', hasContent: false },
    { name: 'Spotify', icon: Music, color: 'bg-green-500', hasContent: false },
    { name: 'Photos', icon: Image, color: 'bg-blue-400', hasContent: false },
    { name: 'Chrome', icon: Globe, color: 'bg-blue-600', hasContent: false },
    { name: 'TikTok', icon: Video, color: 'bg-black', hasContent: false },
    { name: 'Amazon', icon: ShoppingBag, color: 'bg-orange-400', hasContent: false },
  ];

  const handleAppClick = (appName: string) => {
    if (apps.find(app => app.name === appName)?.hasContent) {
      setSelectedApp(appName);
    } else {
      // Show generic "loading" for apps without content
      console.log(`Opening ${appName} (decoy mode - no real functionality)`);
    }
  };

  const renderAppContent = () => {
    switch (selectedApp) {
      case 'WhatsApp':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-4 border-b">
              <Button variant="ghost" onClick={() => setSelectedApp(null)}>
                ← Back
              </Button>
              <h2 className="font-semibold">WhatsApp</h2>
              <div></div>
            </div>
            {fakeMessages.map((msg, index) => (
              <Card key={index} className="p-4 bg-card shadow-soft">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-card-foreground">{msg.sender}</h3>
                    <p className="text-muted-foreground mt-1">{msg.message}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{msg.time}</span>
                </div>
              </Card>
            ))}
          </div>
        );

      case 'Instagram':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-4 border-b">
              <Button variant="ghost" onClick={() => setSelectedApp(null)}>
                ← Back
              </Button>
              <h2 className="font-semibold">Instagram</h2>
              <div></div>
            </div>
            {fakePosts.map((post, index) => (
              <Card key={index} className="p-4 bg-card shadow-soft">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-white">{post.user[0].toUpperCase()}</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-card-foreground">{post.user}</h3>
                      <span className="text-xs text-muted-foreground">{post.time} ago</span>
                    </div>
                  </div>
                  <p className="text-card-foreground">{post.content}</p>
                  <div className="flex items-center space-x-4 pt-2 border-t">
                    <div className="flex items-center space-x-1">
                      <Heart className="w-4 h-4 text-red-500" />
                      <span className="text-sm text-muted-foreground">{post.likes}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        );

      case 'Gmail':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-4 border-b">
              <Button variant="ghost" onClick={() => setSelectedApp(null)}>
                ← Back
              </Button>
              <h2 className="font-semibold">Gmail</h2>
              <div></div>
            </div>
            {[
              { sender: 'Newsletter', subject: 'Weekly Updates', preview: 'Check out this week\'s highlights...', time: '10:30 AM' },
              { sender: 'Bank Alert', subject: 'Account Summary', preview: 'Your monthly statement is ready...', time: '9:15 AM' },
              { sender: 'Team Lead', subject: 'Project Update', preview: 'Great progress on the latest project...', time: '8:45 AM' },
            ].map((email, index) => (
              <Card key={index} className="p-4 bg-card shadow-soft">
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium text-card-foreground">{email.sender}</h3>
                    <span className="text-xs text-muted-foreground">{email.time}</span>
                  </div>
                  <h4 className="text-sm font-medium text-card-foreground">{email.subject}</h4>
                  <p className="text-sm text-muted-foreground">{email.preview}</p>
                </div>
              </Card>
            ))}
          </div>
        );

      case 'Phone':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-4 border-b">
              <Button variant="ghost" onClick={() => setSelectedApp(null)}>
                ← Back
              </Button>
              <h2 className="font-semibold">Recent Calls</h2>
              <div></div>
            </div>
            {[
              { name: 'Mom', type: 'Incoming', time: '2 hours ago' },
              { name: 'Doctor Office', type: 'Outgoing', time: 'Yesterday' },
              { name: 'Alex', type: 'Missed', time: 'Yesterday' },
              { name: 'Sarah', type: 'Incoming', time: '2 days ago' },
            ].map((call, index) => (
              <Card key={index} className="p-4 bg-card shadow-soft">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                      <span className="font-medium text-muted-foreground">{call.name[0]}</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-card-foreground">{call.name}</h3>
                      <p className="text-sm text-muted-foreground">{call.type} • {call.time}</p>
                    </div>
                  </div>
                  <Phone className="w-5 h-5 text-green-500" />
                </div>
              </Card>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  if (selectedApp) {
    return (
      <div className="min-h-screen bg-background p-6">
        {renderAppContent()}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      {/* Status Bar */}
      <div className="flex justify-between items-center p-4 text-sm text-foreground">
        <div className="flex items-center space-x-1">
          <div className="w-1 h-1 bg-current rounded-full opacity-60"></div>
          <div className="w-1 h-1 bg-current rounded-full opacity-60"></div>
          <div className="w-1 h-1 bg-current rounded-full"></div>
          <span className="ml-2 text-xs font-medium opacity-80">Carrier</span>
        </div>
        <div className="font-semibold">{currentTime}</div>
        <div className="flex items-center space-x-1">
          <div className="w-4 h-2 border border-current rounded-sm">
            <div className="w-3/4 h-full bg-current rounded-sm"></div>
          </div>
          <span className="text-xs">75%</span>
        </div>
      </div>

      {/* Home Screen Content */}
      <div className="flex-1 p-6 space-y-8">
        {/* Time Widget */}
        <Card className="p-6 bg-card/80 backdrop-blur border shadow-soft">
          <div className="text-center space-y-2">
            <div className="text-4xl font-light text-foreground">{currentTime}</div>
            <div className="text-muted-foreground">
              {new Date().toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
            </div>
          </div>
        </Card>

        {/* App Grid */}
        <div className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            {apps.slice(0, 12).map((app, index) => (
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

          {/* Additional apps row */}
          <div className="grid grid-cols-4 gap-4">
            {apps.slice(12).map((app, index) => (
              <button
                key={app.name}
                onClick={() => handleAppClick(app.name)}
                className="flex flex-col items-center space-y-2 p-2 rounded-xl hover:bg-muted/50 transition-colors active:scale-95 animate-fade-in"
                style={{ animationDelay: `${(index + 12) * 50}ms` }}
              >
                <div className={`w-14 h-14 ${app.color} rounded-2xl flex items-center justify-center shadow-soft`}>
                  <app.icon className="w-7 h-7 text-white" />
                </div>
                <span className="text-xs text-muted-foreground font-medium">{app.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Dock */}
      <div className="p-4">
        <div className="bg-card/80 backdrop-blur rounded-2xl p-3 shadow-large border">
          <div className="flex justify-center space-x-8">
            {[Phone, MessageSquare, Camera, Mail].map((Icon, index) => (
              <button
                key={index}
                onClick={() => handleAppClick(Icon.name || 'Phone')}
                className="w-14 h-14 bg-muted/50 rounded-xl flex items-center justify-center hover:bg-muted transition-colors active:scale-95"
              >
                <Icon className="w-6 h-6 text-foreground" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Hidden SOS indicator (invisible to user) */}
      <div className="hidden">
        🚨 SOS Active - Location and alerts being sent silently
      </div>
    </div>
  );
};

export default DecoyModeHome;