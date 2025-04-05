
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Task } from '@/lib/types';

interface TaskDetailHeaderProps {
  task: Task | null;
  isCompleted: boolean;
}

export const TaskDetailHeader = ({ task, isCompleted }: TaskDetailHeaderProps) => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // This will navigate to the previous page in history
  };

  return (
    <div className="flex items-center space-x-4">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={handleGoBack}
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>
      <div>
        <h1 className="text-2xl font-medium text-owl-slate-dark">
          {isCompleted ? 'Task Results' : 'Complete Task'}
        </h1>
        <p className="text-owl-slate mt-1">
          {isCompleted 
            ? `Score: ${task?.results?.score}/${task?.results?.total}` 
            : `Answer ${task?.questions.length} questions`}
        </p>
      </div>
    </div>
  );
};
