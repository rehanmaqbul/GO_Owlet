
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Calendar, CheckCircle2 } from 'lucide-react';
import { SubjectTask } from '@/utils/subjectTasksData';

interface TaskCardProps {
  task: SubjectTask;
}

const TaskCard = ({ task }: TaskCardProps) => {
  const navigate = useNavigate();
  
  return (
    <Card key={task.id} className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{task.title}</CardTitle>
          <Badge 
            variant={task.completed ? "secondary" : "outline"} 
            className={task.completed ? "bg-green-100 text-green-800 hover:bg-green-200" : ""}
          >
            {task.completed ? "Completed" : "Pending"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm text-muted-foreground mb-4">{task.description}</p>
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Due: {task.dueDate}</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{task.estimatedTime}</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <CheckCircle2 className="h-4 w-4" />
            <span>{task.questionCount} questions</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full"
          onClick={() => navigate(`/task/${task.id}`)}
          variant={task.completed ? "outline" : "default"}
        >
          {task.completed ? "Review Task" : "Start Task"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TaskCard;
