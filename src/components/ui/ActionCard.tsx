import { ReactNode } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

interface ActionCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  buttonText: string;
  onClick: () => void;
  buttonIcon?: ReactNode;
}

const ActionCard = ({
  title,
  description,
  icon: Icon,
  buttonText,
  onClick,
  buttonIcon
}: ActionCardProps) => {
  return (
    <Card className="overflow-hidden border-stone-200 bg-stone-50 shadow-sm">
      <div className="p-6">
        <div className="mb-4 p-3 bg-amber-100 rounded-full w-fit">
          <Icon className="h-6 w-6 text-amber-700" />
        </div>
        <h3 className="text-lg font-semibold mb-1 text-gray-800">{title}</h3>
        <p className="text-gray-600 text-sm mb-4">{description}</p>
        <Button 
          className="bg-amber-600 hover:bg-amber-700 text-white"
          onClick={onClick}
        >
          {buttonIcon}
          {buttonText}
        </Button>
      </div>
    </Card>
  );
};

export { ActionCard }; 