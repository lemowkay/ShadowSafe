import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface Message {
  sender: string;
  text: string;
}

const MessagesScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [reply, setReply] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'Emily', text: 'Hey! How are you today?' },
    { sender: 'You', text: 'I’m good, thanks! How about you?' },
    { sender: 'Emily', text: 'Did you finish the homework?' },
    { sender: 'You', text: 'Not yet, still working on it.' },
    { sender: 'Emily', text: 'Okay, let me know if you need help.' },
    { sender: 'You', text: 'Sure, thanks!' },
    { sender: 'Emily', text: 'Also, are you coming to the club meeting later?' },
    { sender: 'You', text: 'Yes, I’ll be there around 5 PM.' },
    { sender: 'Emily', text: 'Great! See you then.' },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSend = () => {
    if (reply.trim() !== '') {
      setMessages([...messages, { sender: 'You', text: reply }]);
      setReply('');
    }
  };

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-gray-300">
        <h2 className="text-xl font-semibold">Messages</h2>
        <Button variant="ghost" onClick={onBack}>
          Back
        </Button>
      </div>

      {/* Messages area */}
      <div className="flex-1 p-4 overflow-y-auto flex flex-col space-y-2">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg max-w-xs ${
              msg.sender === 'Emily' ? 'bg-gray-200 self-start' : 'bg-blue-200 self-end'
            }`}
          >
            <strong>{msg.sender}:</strong> {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Reply input */}
      <div className="p-4 border-t border-gray-300 flex items-center space-x-2">
        <input
          type="text"
          className="flex-1 border border-gray-300 rounded-xl p-2 focus:outline-none"
          placeholder="Type your message..."
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <Button onClick={handleSend}>Send</Button>
      </div>
    </div>
  );
};

export default MessagesScreen;
