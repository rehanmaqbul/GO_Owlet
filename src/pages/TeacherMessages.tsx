
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { fadeIn } from '@/lib/animations';
import Navbar from '@/components/Navbar';
import { ContactList } from '@/components/messages/ContactList';
import { ChatView } from '@/components/messages/ChatView';
import { MessageHeader } from '@/components/messages/MessageHeader';
import { useMessagingService } from '@/hooks/useMessagingService';

const TeacherMessages = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const initialRecipientId = location.state?.recipientId;
  
  const {
    contacts,
    selectedContact,
    messages,
    handleSelectContact,
    handleSendMessage,
    setSelectedContact
  } = useMessagingService({ 
    userRole: 'teacher',
    recipientId: initialRecipientId
  });
  
  const handleGoBack = () => {
    navigate('/teacher-dashboard');
  };

  if (!isAuthenticated || !user || user.role !== 'teacher') {
    // Redirect to login if not authenticated or not a teacher
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-owl-neutral">
      <Navbar />
      
      <main className="pt-24 px-4 pb-16 max-w-6xl mx-auto">
        <motion.div className="space-y-6" {...fadeIn}>
          <MessageHeader 
            title="Messages" 
            subtitle="Communicate with parents about their children's progress"
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
                searchPlaceholder="Search parents..."
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

export default TeacherMessages;
