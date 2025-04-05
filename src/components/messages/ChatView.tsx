
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, PaperclipIcon, Send, User } from 'lucide-react';
import { Message } from '@/lib/types';
import { Contact } from '@/components/messages/types';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ChatViewProps {
  selectedContact: Contact | null;
  messages: Message[];
  userId: string;
  onSendMessage: (message: string) => void;
  onBackClick?: () => void;
  showBackButton?: boolean;
}

export const ChatView = ({ 
  selectedContact, 
  messages, 
  userId, 
  onSendMessage,
  onBackClick,
  showBackButton = false
}: ChatViewProps) => {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Scroll to bottom of messages
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    onSendMessage(newMessage);
    setNewMessage('');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <Card className="shadow-subtle h-[600px] flex flex-col">
      {selectedContact ? (
        <>
          <div className="p-4 border-b flex items-center">
            {showBackButton && (
              <Button 
                variant="ghost" 
                size="icon"
                className="lg:hidden mr-2"
                onClick={onBackClick}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            
            <Avatar className="h-8 w-8">
              <AvatarImage src={selectedContact.avatar} alt={selectedContact.name} />
              <AvatarFallback className={selectedContact.type === 'teacher' 
                ? 'bg-blue-100 text-blue-800' 
                : selectedContact.type === 'parent' 
                  ? 'bg-green-100 text-green-800'
                  : 'bg-purple-100 text-purple-800'}>
                {getInitials(selectedContact.name)}
              </AvatarFallback>
            </Avatar>
            
            <div className="ml-3">
              <p className="font-medium">{selectedContact.name}</p>
              <p className="text-xs text-gray-500">
                {selectedContact.type.charAt(0).toUpperCase() + selectedContact.type.slice(1)}
              </p>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.length > 0 ? (
              messages.map(message => (
                <motion.div 
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.senderId === userId ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[70%] rounded-lg p-3 ${
                      message.senderId === userId 
                        ? 'bg-owl-blue text-white' 
                        : 'bg-white border'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p className={`text-xs mt-1 ${
                      message.senderId === userId 
                        ? 'text-blue-100' 
                        : 'text-gray-500'
                    }`}>
                      {formatTime(new Date(message.createdAt))}
                    </p>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-gray-500">No messages yet. Send a message to start the conversation.</p>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          <div className="p-3 border-t">
            <div className="flex items-center">
              <Button variant="ghost" size="icon" className="text-gray-500">
                <PaperclipIcon className="h-5 w-5" />
              </Button>
              
              <Textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 mx-2 resize-none"
                rows={1}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              
              <Button 
                variant="default"
                className="bg-owl-blue hover:bg-owl-blue/90 text-white"
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </>
      ) : (
        <div className="h-full flex items-center justify-center p-4 text-center">
          <div>
            <h3 className="font-medium mb-2">Select a contact</h3>
            <p className="text-gray-500 text-sm">Choose a contact from the list to start messaging</p>
          </div>
        </div>
      )}
    </Card>
  );
};
