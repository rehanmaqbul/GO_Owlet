
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Contact, ContactType } from '@/components/messages/types';
import { mockContacts, mockMessages } from './mockData';
import { getConversationKey, getUnreadCount } from './messagingUtils';

interface UseContactsManagerProps {
  userRole?: 'teacher' | 'parent' | 'child';
  recipientId?: string;
}

export const useContactsManager = ({ userRole, recipientId }: UseContactsManagerProps = {}) => {
  const { user } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  
  // Determine the role if not provided
  const role = userRole || user?.role;
  
  useEffect(() => {
    // Generate appropriate contacts based on user role
    if (role) {
      let contactsList: Contact[] = [];
      
      switch (role) {
        case 'teacher':
          // Teachers message parents and students
          contactsList = [
            ...mockContacts.parents.map(parent => {
              const conversationKey = getConversationKey('teacher-1', parent.id);
              const conversation = mockMessages[conversationKey] || [];
              const lastMessage = conversation[conversation.length - 1];
              const unreadCount = getUnreadCount(conversation, 'teacher-1');
              
              return {
                id: parent.id,
                name: parent.name,
                type: 'parent' as ContactType,
                email: parent.email,
                lastMessage: lastMessage?.text,
                unread: unreadCount
              };
            }),
            // Add students to teacher contacts
            ...mockContacts.children.map(child => {
              const conversationKey = getConversationKey('teacher-1', child.id);
              const conversation = mockMessages[conversationKey] || [];
              const lastMessage = conversation[conversation.length - 1];
              const unreadCount = getUnreadCount(conversation, 'teacher-1');
              
              return {
                id: child.id,
                name: child.name,
                type: 'child' as ContactType,
                avatar: child.avatar,
                lastMessage: lastMessage?.text,
                unread: unreadCount
              };
            })
          ];
          break;
          
        case 'parent':
          // Parents message teachers and children
          contactsList = [
            ...mockContacts.teachers.map(teacher => {
              const conversationKey = getConversationKey('parent-1', teacher.id);
              const conversation = mockMessages[conversationKey] || [];
              const lastMessage = conversation[conversation.length - 1];
              const unreadCount = getUnreadCount(conversation, 'parent-1');
              
              return {
                id: teacher.id,
                name: teacher.name,
                type: 'teacher' as ContactType,
                avatar: teacher.avatar,
                lastMessage: lastMessage?.text,
                unread: unreadCount
              };
            }),
            ...mockContacts.children.map(child => {
              const conversationKey = getConversationKey('parent-1', child.id);
              const conversation = mockMessages[conversationKey] || [];
              const lastMessage = conversation[conversation.length - 1];
              const unreadCount = getUnreadCount(conversation, 'parent-1');
              
              return {
                id: child.id,
                name: child.name,
                type: 'child' as ContactType,
                avatar: child.avatar,
                lastMessage: lastMessage?.text,
                unread: unreadCount
              };
            })
          ];
          break;
          
        case 'child':
          // Children message parents and teachers
          contactsList = [
            {
              id: 'parent-1',
              name: 'Mom / Dad',
              type: 'parent' as ContactType,
              avatar: '',
              lastMessage: mockMessages['parent-1_child-1']?.[mockMessages['parent-1_child-1'].length - 1]?.text,
              unread: getUnreadCount(mockMessages['parent-1_child-1'] || [], 'child-1')
            },
            ...mockContacts.teachers.map(teacher => {
              const conversationKey = getConversationKey('child-1', teacher.id);
              const conversation = mockMessages[conversationKey] || [];
              const lastMessage = conversation[conversation.length - 1];
              const unreadCount = getUnreadCount(conversation, 'child-1');
              
              return {
                id: teacher.id,
                name: teacher.name,
                type: 'teacher' as ContactType,
                avatar: teacher.avatar,
                lastMessage: lastMessage?.text,
                unread: unreadCount
              };
            })
          ];
          break;
      }
      
      setContacts(contactsList);
      
      // If recipientId is provided, set it as the selected contact
      if (recipientId) {
        const contact = contactsList.find(c => c.id === recipientId);
        if (contact) {
          setSelectedContact(contact);
        }
      }
    }
  }, [role, recipientId]);

  return {
    contacts,
    selectedContact,
    setContacts,
    setSelectedContact
  };
};
