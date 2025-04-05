
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Message } from '@/lib/types';
import { Contact } from '@/components/messages/types';
import { mockMessages } from './mockData';
import { getConversationKey } from './messagingUtils';

interface UseConversationManagerProps {
  selectedContact: Contact | null;
  contacts: Contact[];
  setContacts: React.Dispatch<React.SetStateAction<Contact[]>>;
  userRole?: 'teacher' | 'parent' | 'child';
}

export const useConversationManager = ({
  selectedContact,
  contacts,
  setContacts,
  userRole
}: UseConversationManagerProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  
  // Determine the role if not provided
  const role = userRole || user?.role;
  
  useEffect(() => {
    if (!selectedContact) {
      setMessages([]);
      return;
    }
    
    // Get the conversation based on user role
    const userId = user?.id || (role === 'teacher' ? 'teacher-1' : role === 'parent' ? 'parent-1' : 'child-1');
    const conversationKey = getConversationKey(userId, selectedContact.id);
    
    // Filter messages for selected contact
    const conversation = mockMessages[conversationKey] || [];
    setMessages(conversation);
    
    // Mark messages as read
    if (selectedContact.unread > 0) {
      // Update the contact's unread count
      const updatedContacts = contacts.map(c => {
        if (c.id === selectedContact.id) {
          return { ...c, unread: 0 };
        }
        return c;
      });
      setContacts(updatedContacts);
    }
  }, [selectedContact, contacts, setContacts, role, user]);
  
  const handleSendMessage = (messageText: string, mediaUrl: string | null = null) => {
    if (!selectedContact || (!messageText.trim() && !mediaUrl)) return;
    
    // Create a default user ID based on role if none exists
    const senderId = user?.id || (role === 'teacher' ? 'teacher-1' : role === 'parent' ? 'parent-1' : 'child-1');
    
    // Create new message
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      senderId,
      receiverId: selectedContact.id,
      text: messageText,
      mediaUrl: mediaUrl || undefined,
      read: false,
      createdAt: new Date()
    };
    
    // Update messages state
    setMessages(prev => [...prev, newMessage]);
    
    // Update mockMessages data structure
    const conversationKey = getConversationKey(senderId, selectedContact.id);
    if (mockMessages[conversationKey]) {
      mockMessages[conversationKey].push(newMessage);
    } else {
      mockMessages[conversationKey] = [newMessage];
    }
    
    // Update last message for contact
    const updatedContacts = contacts.map(c => {
      if (c.id === selectedContact.id) {
        return { 
          ...c, 
          lastMessage: mediaUrl ? (messageText.trim() ? messageText : 'Sent an attachment') : messageText
        };
      }
      return c;
    });
    setContacts(updatedContacts);
    
    toast({
      title: "Message sent",
      description: `Your message has been sent to ${selectedContact.name}.`,
    });
  };
  
  return {
    messages,
    handleSendMessage
  };
};
