
import { useMessagingService } from './useMessagingService';

export const useMessaging = () => {
  // Use the new centralized messaging service
  return useMessagingService();
};
