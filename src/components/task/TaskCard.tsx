
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Clock } from 'lucide-react';
import { Task } from '@/lib/types';
import { slideUp } from '@/lib/animations';

interface TaskCardProps {
  task: Task;
  subject: string;
  onView: () => void;
}

const TaskCard = ({ task, subject, onView }: TaskCardProps) => {
  const formattedDate = new Date(task.createdAt).toLocaleDateString();
  
  return (
    <motion.div {...slideUp}>
      <Card className="shadow-subtle">
        <CardContent className="p-0">
          <div className="flex flex-col sm:flex-row">
            <div className={`p-4 ${
              task.status === 'completed' ? 'bg-emerald-50' : 'bg-amber-50'
            } sm:w-16 flex items-center justify-center`}>
              {task.status === 'completed' ? (
                <CheckCircle className="h-8 w-8 text-emerald-500" />
              ) : (
                <Clock className="h-8 w-8 text-amber-500" />
              )}
            </div>
            <div className="p-6 flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-medium text-lg">
                    {subject}
                  </h3>
                  <p className="text-owl-slate text-sm">
                    {task.questions.length} questions • Created on {formattedDate}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {task.status === 'completed' && task.results && (
                    <div className="bg-owl-neutral rounded-full px-3 py-1 text-sm font-medium">
                      Score: {task.results.score}/{task.results.total}
                    </div>
                  )}
                  <Button onClick={onView} variant="outline" size="sm">
                    {task.status === 'completed' ? 'View Results' : 'View Task'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TaskCard;
