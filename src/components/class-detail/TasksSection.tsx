
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ClipboardList, Plus } from 'lucide-react';
import { Task } from '@/lib/types';

interface TasksSectionProps {
  tasks: Task[];
  handleAssignTask: () => void;
  handleViewTask: (taskId: string) => void;
}

export const TasksSection = ({ tasks, handleAssignTask, handleViewTask }: TasksSectionProps) => {
  return (
    <Card className="shadow-subtle h-fit">
      <CardHeader>
        <CardTitle className="flex items-center">
          <ClipboardList className="h-5 w-5 mr-2 text-owl-blue" />
          Tasks
        </CardTitle>
        <CardDescription>
          Assignments for this class
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {tasks.length > 0 ? (
          <ul className="space-y-2">
            {tasks.map(task => (
              <li 
                key={task.id}
                className="p-3 bg-white rounded-lg shadow-sm"
              >
                <div className="flex justify-between items-start mb-2">
                  <p className="font-medium">Task {task.id.split('-')[1]}</p>
                  <Badge variant={task.status === 'completed' ? 'default' : 'outline'}>
                    {task.status === 'completed' ? 'Completed' : 'Pending'}
                  </Badge>
                </div>
                <p className="text-xs text-owl-slate mb-1">
                  Questions: {task.questions.length}
                </p>
                {task.dueDate && (
                  <p className="text-xs text-owl-slate mb-2">
                    Due: {task.dueDate.toLocaleDateString()}
                  </p>
                )}
                <Button 
                  size="sm" 
                  variant="outline"
                  className="w-full mt-1"
                  onClick={() => handleViewTask(task.id)}
                >
                  View Details
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-4">
            <p className="text-owl-slate mb-4">No tasks assigned to this class yet.</p>
          </div>
        )}
        
        <Button onClick={handleAssignTask} className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Assign New Task
        </Button>
      </CardContent>
    </Card>
  );
};
