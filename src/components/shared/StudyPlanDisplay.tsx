import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Edit2, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

interface Task {
  id: string;
  title: string;
  type: 'mixed_practice' | 'reading' | 'listening' | 'story' | 'image_upload';
  subject: string;
  chapter: string;
  lesson: string;
  description: string;
  questions?: number;
  dayOfWeek: string;
  date: Date;
}

interface StudyPlan {
  id: string;
  name: string;
  duration: 'weekly' | 'monthly';
  startDate: Date;
  endDate: Date;
  tasks: Task[];
}

interface StudyPlanDisplayProps {
  plan: StudyPlan;
  onEdit?: (taskId: string) => void;
  onDelete?: (taskId: string) => void;
  isEditable?: boolean;
}

const taskTypeColors = {
  mixed_practice: 'bg-blue-100 text-blue-700 border-blue-200',
  reading: 'bg-green-100 text-green-700 border-green-200',
  listening: 'bg-purple-100 text-purple-700 border-purple-200',
  story: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  image_upload: 'bg-orange-100 text-orange-700 border-orange-200'
};

const taskTypeIcons = {
  mixed_practice: '📝',
  reading: '📚',
  listening: '🎧',
  story: '📖',
  image_upload: '📸'
};

export const StudyPlanDisplay = ({ plan, onEdit, onDelete, isEditable = false }: StudyPlanDisplayProps) => {
  // Group tasks by date
  const tasksByDate = plan.tasks.reduce((acc, task) => {
    const dateKey = format(task.date, 'yyyy-MM-dd');
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(task);
    return acc;
  }, {} as Record<string, Task[]>);

  return (
    <div className="space-y-8">
      {Object.entries(tasksByDate).map(([dateKey, tasks]) => {
        const date = new Date(dateKey);
        return (
          <Card key={dateKey} className="w-full">
            <CardHeader className="border-b bg-gray-50">
              <div className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                <Calendar className="h-5 w-5 text-gray-500" />
                {format(date, 'EEEE, MMMM d, yyyy')}
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                {tasks.map((task) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border rounded-lg overflow-hidden"
                  >
                    <div className="flex items-center justify-between p-4 bg-white">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{taskTypeIcons[task.type]}</span>
                        <div>
                          <h3 className="font-medium text-gray-900">{task.title}</h3>
                          <p className="text-sm text-gray-500">{task.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={taskTypeColors[task.type]}>
                          {task.type === 'mixed_practice' ? 'Core Practice' : task.type.split('_').map(word => 
                            word.charAt(0).toUpperCase() + word.slice(1)
                          ).join(' ')}
                        </Badge>
                        {isEditable && (
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => onEdit?.(task.id)}
                              className="text-blue-600 hover:text-blue-700"
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => onDelete?.(task.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="px-4 py-3 bg-gray-50 border-t">
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="font-medium">{task.subject}</span>
                        <span>•</span>
                        <span>{task.chapter}</span>
                        <span>•</span>
                        <span>{task.lesson}</span>
                        {task.questions && (
                          <>
                            <span>•</span>
                            <span>{task.questions} questions</span>
                          </>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}; 