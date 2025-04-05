
import { useAuth } from '@/contexts/AuthContext';
import { useContactsManager } from './useContactsManager';
import { useConversationManager } from './useConversationManager';
import { formatTime, getInitials } from './messagingUtils';
import { Contact } from '@/components/messages/types';

interface UseMessagingServiceProps {
  userRole?: 'teacher' | 'parent' | 'child';
  recipientId?: string;
}

export const useMessagingService = (props: UseMessagingServiceProps = {}) => {
  const { user } = useAuth();
  
  // Use the contacts manager to handle contact-related state and logic
  const {
    contacts,
    selectedContact,
    setContacts,
    setSelectedContact
  } = useContactsManager(props);
  
  // Use the conversation manager to handle message-related state and logic
  const {
    messages,
    handleSendMessage
  } = useConversationManager({
    selectedContact,
    contacts,
    setContacts,
    userRole: props.userRole
  });
  
  const handleSelectContact = (contact: Contact) => {
    setSelectedContact(contact);
  };
  
  return {
    user,
    contacts,
    selectedContact,
    messages,
    handleSelectContact,
    handleSendMessage,
    formatTime,
    getInitials,
    setSelectedContact
  };
};
