
import { User } from 'lucide-react';
import { User as UserType } from '@/lib/types';
import { Contact } from '@/components/messages/types';

interface ChatHeaderProps {
  chatUser: UserType | Contact;
}

export const ChatHeader = ({ chatUser }: ChatHeaderProps) => {
  // Determine the role text based on the object type
  const roleText = 'type' in chatUser 
    ? chatUser.type.charAt(0).toUpperCase() + chatUser.type.slice(1) 
    : chatUser.role === 'parent' ? 'Parent' : 'Child';

  return (
    <div className="bg-white p-4 border-b flex items-center space-x-3">
      <div className="h-10 w-10 rounded-full bg-owl-blue-light flex items-center justify-center">
        <User className="h-5 w-5 text-owl-blue" />
      </div>
      <div>
        <p className="font-medium">{chatUser.name}</p>
        <p className="text-xs text-owl-slate">{roleText}</p>
      </div>
    </div>
  );
};
