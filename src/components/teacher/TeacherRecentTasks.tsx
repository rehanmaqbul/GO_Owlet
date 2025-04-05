import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { slideUp } from '@/lib/animations';

export const TeacherRecentTasks = () => {
  const navigate = useNavigate();
  const [recentTasks] = useState([
    { id: 'task-1', class: 'Grade 5 Science', type: 'Class Assignment', submissions: 18, total: 25, date: '2 days ago' },
    { id: 'task-2', class: 'Grade 7 French', type: 'Class Assignment', submissions: 15, total: 20, date: '1 day ago' },
    { id: 'task-3', class: 'Grade 2 Math', type: 'Class Assignment', submissions: 22, total: 30, date: '3 days ago' },
    { id: 'task-4', class: 'Grade 2 English', type: 'Class Assignment', submissions: 12, total: 15, date: 'Today' }
  ]);

  const handleViewTask = (taskId: string) => {
    navigate(`/tasks/${taskId}`);
  };

  return (
    <>
      {recentTasks.map((task) => (
        <motion.div key={task.id} {...slideUp} transition={{ delay: 0.05 }}>
          <Card className="shadow-sm hover:shadow-md transition-shadow border-0">
            <CardContent className="p-3 flex justify-between items-center">
              <div className="text-left">
                <h3 className="text-sm font-medium">{task.class}</h3>
                <p className="text-xs text-muted-foreground">{task.type}</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className={`text-xs px-2 py-0.5 rounded-full text-[10px] 
                    ${task.submissions/task.total >= 0.7 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-amber-100 text-amber-700'}`
                  }>
                    {task.submissions}/{task.total}
                  </div>
                  <div className="flex items-center text-[10px] text-gray-400">
                    <Clock className="h-3 w-3 mr-0.5" />
                    {task.date}
                  </div>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="bg-white hover:bg-gray-50 text-xs h-7 px-2"
                onClick={() => handleViewTask(task.id)}
              >
                View
                <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </>
  );
};
