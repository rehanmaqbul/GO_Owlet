
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { fetchChildTasks } from '@/services/task/taskService';
import { Task } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Clock, Calendar, CheckCircle2 } from 'lucide-react';
import EmptyTasksView from './EmptyTasksView';

// Adapter component to convert Task to expected TaskCard props
const TaskCardAdapter = ({ task, onClick }: { task: Task; onClick: () => void }) => {
  return (
    <Card key={task.id} className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-medium">{task.name}</h3>
          <Badge 
            variant={task.status === 'completed' ? "secondary" : "outline"} 
            className={task.status === 'completed' ? "bg-green-100 text-green-800 hover:bg-green-200" : ""}
          >
            {task.status === 'completed' ? "Completed" : "Pending"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm text-muted-foreground mb-4">
          {task.subject} task ({task.questions.length} questions)
        </p>
        <div className="flex flex-wrap gap-4 text-sm">
          {task.dueDate && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
            </div>
          )}
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Approx. {task.questions.length * 2} min</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <CheckCircle2 className="h-4 w-4" />
            <span>{task.questions.length} questions</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full"
          onClick={onClick}
          variant={task.status === 'completed' ? "outline" : "default"}
        >
          {task.status === 'completed' ? "Review Task" : "Start Task"}
        </Button>
      </CardFooter>
    </Card>
  );
};

interface TasksListProps {
  subject: string;
}

const TasksList = ({ subject }: TasksListProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTasks = async () => {
      if (!user?.id) return;
      
      try {
        setIsLoading(true);
        
        const childId = user.id;
        const fetchedTasks = await fetchChildTasks(childId);
        
        // Add missing updatedAt property and ensure correct types
        const formattedTasks: Task[] = fetchedTasks.map(task => ({
          id: task.id,
          name: task.name,
          subject: task.subject as any,
          status: task.status as any,
          questions: task.questions || [],
          assignedByRole: task.assigned_by_role as any,
          assignedById: task.assigned_by_id,
          childId: task.child_id,
          curriculum: task.curriculum as any,
          grade: task.grade,
          dueDate: task.due_date ? new Date(task.due_date) : undefined,
          createdAt: new Date(task.created_at),
          updatedAt: new Date(task.updated_at || task.created_at),
          results: task.results ? {
            score: typeof task.results === 'object' && task.results !== null ? 
              (task.results.score || 0) : 0,
            total: typeof task.results === 'object' && task.results !== null ? 
              (task.results.total || 0) : 0,
            answers: typeof task.results === 'object' && task.results !== null ? 
              (task.results.answers as Record<string, string> || {}) : {}
          } : undefined
        }));
        
        // Filter tasks by subject
        const subjectTasks = formattedTasks.filter(
          task => task.subject.toLowerCase() === subject.toLowerCase()
        );
        
        setTasks(subjectTasks);
      } catch (error) {
        console.error('Error loading tasks:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadTasks();
  }, [user, subject]);

  // Handle task click
  const handleTaskClick = (taskId: string) => {
    navigate(`/tasks/${taskId}`);
  };

  // Split tasks by status
  const pendingTasks = tasks.filter(task => task.status === 'pending');
  const completedTasks = tasks.filter(task => task.status === 'completed');

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 animate-pulse">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-36 bg-gray-200 rounded-xl"></div>
        ))}
      </div>
    );
  }

  if (tasks.length === 0) {
    return <EmptyTasksView subject={subject} />;
  }

  return (
    <div className="space-y-8">
      {pendingTasks.length > 0 && (
        <div>
          <h2 className="text-lg font-medium mb-3">Pending Tasks ({pendingTasks.length})</h2>
          <div className="grid grid-cols-1 gap-4">
            {pendingTasks.map(task => (
              <TaskCardAdapter 
                key={task.id}
                task={task}
                onClick={() => handleTaskClick(task.id)}
              />
            ))}
          </div>
        </div>
      )}
      
      {completedTasks.length > 0 && (
        <div>
          <h2 className="text-lg font-medium mb-3">Completed Tasks ({completedTasks.length})</h2>
          <div className="grid grid-cols-1 gap-4">
            {completedTasks.map(task => (
              <TaskCardAdapter 
                key={task.id}
                task={task}
                onClick={() => handleTaskClick(task.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TasksList;
