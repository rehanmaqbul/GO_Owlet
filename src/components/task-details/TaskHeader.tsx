
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface TaskHeaderProps {
  childName: string;
}

export const TaskHeader = ({ childName }: TaskHeaderProps) => {
  const navigate = useNavigate();

  const navigateToDashboard = () => {
    navigate('/parent-dashboard');
  };

  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-medium">Task Details for {childName}</h1>
      <Button 
        onClick={navigateToDashboard}
        variant="outline"
        className="flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Dashboard
      </Button>
    </div>
  );
};
