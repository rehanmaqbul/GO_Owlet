import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import { fadeIn } from '@/lib/animations';
import { ContactList } from '@/components/messages/ContactList';
import { ChatView } from '@/components/messages/ChatView';
import { MessageHeader } from '@/components/messages/MessageHeader';
import { useMessagingService } from '@/hooks/useMessagingService';

const ParentMessages = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const {
    contacts,
    selectedContact,
    messages,
    handleSelectContact,
    handleSendMessage,
    setSelectedContact
  } = useMessagingService({ userRole: 'parent' });
  
  const handleGoBack = () => {
    navigate('/parent-dashboard');
  };
  
  if (!user) return null;
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-owl-neutral-lighter to-white">
      <Navbar />
      
      <main className="pt-20 px-4 pb-16 max-w-7xl mx-auto">
        <motion.div {...fadeIn}>
          <MessageHeader 
            title="Messages" 
            subtitle="Chat with your children and their teachers"
            onBackClick={handleGoBack}
            showBackButton={true}
          />
          
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

export default ParentMessages;
