
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

interface EmptyTasksViewProps {
  subject?: string;
}

const EmptyTasksView = ({ subject }: EmptyTasksViewProps) => {
  const navigate = useNavigate();
  
  const subjectDisplay = subject ? subject.charAt(0).toUpperCase() + subject.slice(1) : 'this subject';
  
  return (
    <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-300">
      <BookOpen className="h-12 w-12 mx-auto text-gray-400" />
      <h3 className="mt-4 text-lg font-medium text-gray-900">No tasks found</h3>
      <p className="mt-1 text-sm text-gray-500">
        You don't have any tasks for {subjectDisplay} yet.
      </p>
      <div className="mt-6">
        <Button
          onClick={() => navigate('/dashboard')}
          variant="outline"
        >
          Return to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default EmptyTasksView;
