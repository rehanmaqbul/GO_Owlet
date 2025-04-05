
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MessageHeaderProps {
  title: string;
  subtitle: string;
  onBackClick?: () => void;
  showBackButton?: boolean;
}

export const MessageHeader = ({ 
  title, 
  subtitle, 
  onBackClick,
  showBackButton = false
}: MessageHeaderProps) => {
  return (
    <div className="flex items-center mb-6">
      {showBackButton && (
        <Button 
          variant="ghost" 
          className="mr-2"
          onClick={onBackClick}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      )}
      <div>
        <h1 className="text-2xl font-medium">{title}</h1>
        <p className="text-owl-slate mt-1">{subtitle}</p>
      </div>
    </div>
  );
};
