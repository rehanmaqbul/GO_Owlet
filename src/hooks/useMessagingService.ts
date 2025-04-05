
import { useAuth } from '@/contexts/AuthContext';
import { useMessagingService as useMessagingServiceImpl } from './messaging/useMessagingService';

interface UseMessagingServiceProps {
  userRole?: 'teacher' | 'parent' | 'child';
  recipientId?: string;
}

export const useMessagingService = (props: UseMessagingServiceProps = {}) => {
  // Use the new implementation
  return useMessagingServiceImpl(props);
};
