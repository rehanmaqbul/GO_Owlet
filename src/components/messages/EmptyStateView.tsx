
import { MessageCircle } from 'lucide-react';

interface EmptyStateViewProps {
  message?: string;
}

export const EmptyStateView = ({ message = "No messages to display" }: EmptyStateViewProps) => {
  return (
    <div className="h-[600px] flex flex-col items-center justify-center bg-white rounded-lg shadow-subtle">
      <div className="h-16 w-16 rounded-full bg-owl-blue-light/20 flex items-center justify-center mb-4">
        <MessageCircle className="h-8 w-8 text-owl-blue" />
      </div>
      <p className="text-gray-500 text-center">
        {message}
      </p>
    </div>
  );
};
