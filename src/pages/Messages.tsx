
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { fadeIn } from '@/lib/animations';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { ChatHeader } from '@/components/messages/ChatHeader';
import { MessagesList } from '@/components/messages/MessagesList';
import { MessageInput } from '@/components/messages/MessageInput';
import { useMessagingService } from '@/hooks/useMessagingService';

const Messages = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { messages, formatTime, handleSendMessage } = useMessagingService();

  if (!user) return null;

  const chatUser = user.role === 'parent' 
    ? { id: 'child-1', name: 'Child User', role: 'child' as const, email: 'child@example.com' } 
    : { id: 'parent-1', name: 'Parent User', role: 'parent' as const, email: 'parent@example.com' };

  const pageTitle = user.role === 'parent' ? 'Message to Child' : 'Message from and to Parent';

  return (
    <div className="min-h-screen bg-owl-neutral">
      <Navbar />
      
      <main className="pt-24 px-4 pb-16 max-w-4xl mx-auto">
        <motion.div className="space-y-6" {...fadeIn}>
          <div>
            <h1 className="text-2xl font-medium text-owl-slate-dark">{pageTitle}</h1>
            <p className="text-owl-slate mt-1">
              {user.role === 'parent' 
                ? 'Chat with your child' 
                : 'Chat with your parent'}
            </p>
          </div>
          
          <Card className="shadow-subtle overflow-hidden">
            <ChatHeader chatUser={chatUser} />
            <MessagesList 
              messages={messages} 
              userId={user.id}
              formatTime={formatTime}
            />
            <MessageInput onSendMessage={(text) => handleSendMessage(text)} />
          </Card>
        </motion.div>
      </main>
    </div>
  );
};

export default Messages;
