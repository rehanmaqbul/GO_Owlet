
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SubjectTasksHeaderProps {
  subjectName: string;
  taskCount: number;
}

const SubjectTasksHeader = ({ subjectName, taskCount }: SubjectTasksHeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate('/child-tasks')}
          className="mr-4"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-owl-slate-dark">{subjectName} Tasks</h1>
          <p className="text-owl-slate">
            {taskCount > 0 
              ? `You have ${taskCount} task${taskCount !== 1 ? 's' : ''} assigned` 
              : 'No tasks assigned yet'}
          </p>
        </div>
      </div>
    </header>
  );
};

export default SubjectTasksHeader;
