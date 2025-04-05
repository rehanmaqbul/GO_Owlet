import { Message } from '@/lib/types';

// Format time for messages
export const formatTime = (date: Date): string => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  // If today, show time
  if (diff < 24 * 60 * 60 * 1000) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  
  // If this week, show day name
  if (diff < 7 * 24 * 60 * 60 * 1000) {
    return date.toLocaleDateString([], { weekday: 'short' });
  }
  
  // Otherwise show date
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
};

// Get conversation key from user IDs
export const getConversationKey = (userId1: string, userId2: string): string => {
  // Always use the same order for consistent keys
  return [userId1, userId2].sort().join('_');
};

// Get unread count for a user's messages
export const getUnreadCount = (messages: Message[], userId: string): number => {
  return messages.filter(msg => msg.receiverId === userId && !msg.read).length;
};

// Get initials from name
export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};
