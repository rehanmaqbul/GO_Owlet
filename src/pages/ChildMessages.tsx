import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { fadeIn } from '@/lib/animations';
import { ContactList } from '@/components/messages/ContactList';
import { ChatView } from '@/components/messages/ChatView';
import { MessageHeader } from '@/components/messages/MessageHeader';
import { useMessagingService } from '@/hooks/useMessagingService';

const ChildMessages = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const {
    contacts,
    selectedContact,
    messages,
    handleSelectContact,
    handleSendMessage,
    setSelectedContact
  } = useMessagingService({ userRole: 'child' });
  
  const handleGoBack = () => {
    navigate('/child-dashboard');
  };
  
  const handleGoToTasks = () => {
    navigate('/child-tasks');
  };
  
  if (!user) return null;
  
  return (
    <div className="min-h-screen bg-warm-neutral">
      <Navbar />
      
      <main className="pt-20 px-4 pb-16 max-w-7xl mx-auto">
        <motion.div {...fadeIn}>
          <MessageHeader 
            title="Messages" 
            subtitle="Chat with your parents and teachers"
            onBackClick={handleGoBack}
            showBackButton={true}
          />
          
          <div className="mb-4 flex gap-3">
            <Button 
              variant="outline" 
              onClick={handleGoBack}
              className="bg-white/70 hover:bg-white/90"
            >
              Dashboard
            </Button>
            <Button 
              variant="outline" 
              onClick={handleGoToTasks}
              className="bg-white/70 hover:bg-white/90"
            >
              Tasks
            </Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Contact list */}
            <div className="lg:col-span-1">
              <ContactList 
                contacts={contacts}
                selectedContact={selectedContact}
                onSelectContact={handleSelectContact}
                searchPlaceholder="Search contacts..."
              />
            </div>
            
            {/* Chat section */}
            <div className="lg:col-span-3">
              <ChatView
                selectedContact={selectedContact}
                messages={messages}
                userId={user.id}
                onSendMessage={handleSendMessage}
                onBackClick={() => setSelectedContact(null)}
                showBackButton={true}
              />
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default ChildMessages;
