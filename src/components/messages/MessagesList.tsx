
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { Message } from '@/lib/types';
import { cn } from '@/lib/utils';

interface MessagesListProps {
  messages: Message[];
  userId: string;
  formatTime: (date: Date) => string;
}

export const MessagesList = ({ messages, userId, formatTime }: MessagesListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Scroll to bottom of messages
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="h-[400px] overflow-y-auto p-4 bg-owl-neutral/30">
      <div className="space-y-4">
        {messages.map((msg) => {
          const isCurrentUser = msg.senderId === userId;
          
          return (
            <motion.div 
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex",
                isCurrentUser ? "justify-end" : "justify-start"
              )}
            >
              <div className={cn(
                "max-w-[75%] rounded-lg px-4 py-2",
                isCurrentUser 
                  ? "bg-owl-blue text-white rounded-br-none" 
                  : "bg-white text-owl-slate-dark rounded-bl-none"
              )}>
                {msg.text && <p className="break-words">{msg.text}</p>}
                
                {msg.mediaUrl && (
                  <div className="mt-2 rounded overflow-hidden">
                    <img 
                      src={msg.mediaUrl} 
                      alt="Shared media" 
                      className="max-w-full h-auto"
                    />
                  </div>
                )}
                
                <div className={cn(
                  "text-xs mt-1 flex items-center",
                  isCurrentUser ? "text-blue-100 justify-end" : "text-owl-slate"
                )}>
                  <Clock className="h-3 w-3 mr-1" />
                  {formatTime(new Date(msg.createdAt))}
                </div>
              </div>
            </motion.div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};
