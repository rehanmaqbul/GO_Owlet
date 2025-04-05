
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import { fadeIn, slideUp } from '@/lib/animations';
import { CheckCircle } from 'lucide-react';
import { Subject, Task } from '@/lib/types';

interface ChildTaskViewProps {
  tasks: Task[];
  subjects: { id: Subject; name: string; color: string }[];
  handleViewTask: (taskId: string) => void;
}

const ChildTaskView = ({ tasks, subjects, handleViewTask }: ChildTaskViewProps) => {
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  
  // Get tasks by subject
  const getTasksBySubject = (subject: Subject) => {
    return tasks.filter(task => task.subject === subject);
  };

  // Get counts of pending tasks by subject
  const getPendingTasksCount = (subject: Subject) => {
    return tasks.filter(task => task.subject === subject && task.status === 'pending').length;
  };

  return (
    <motion.div className="space-y-6" {...fadeIn}>
      <div>
        <h1 className="text-2xl font-medium text-owl-slate-dark">My Tasks</h1>
        <p className="text-owl-slate mt-1">Complete your tasks to earn rewards!</p>
      </div>
      
      <Tabs defaultValue="subjects" className="w-full">
        <TabsList className="grid grid-cols-2 w-full max-w-md">
          <TabsTrigger value="subjects">Subjects</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
        
        <TabsContent value="subjects" className="mt-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {subjects.map(subject => (
              <motion.div 
                key={subject.id}
                className="hover-scale"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <Button 
                  variant="outline"
                  className={`h-24 w-full flex flex-col items-center justify-center text-center ${subject.color} border-transparent`}
                  onClick={() => setSelectedSubject(subject.id)}
                >
                  {getPendingTasksCount(subject.id) > 0 && (
                    <span className="absolute -top-2 -right-2 bg-[#9b87f5] text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                      {getPendingTasksCount(subject.id)}
                    </span>
                  )}
                  {subject.name}
                </Button>
              </motion.div>
            ))}
          </div>
          
          {selectedSubject && (
            <motion.div {...slideUp} className="mt-6">
              <Card className="shadow-subtle">
                <CardHeader>
                  <CardTitle>
                    {subjects.find(s => s.id === selectedSubject)?.name} Tasks
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {getTasksBySubject(selectedSubject)
                      .filter(task => task.status === 'pending')
                      .map(task => (
                        <li key={task.id} className="border p-4 rounded-lg">
                          <div className="flex justify-between items-center">
                            <div>
                              <span className="font-medium">
                                {task.questions.length} questions
                              </span>
                              <p className="text-sm text-owl-slate">
                                From: {task.assignedByRole === 'parent' ? 'Parent' : 'Teacher'}
                              </p>
                            </div>
                            <Button
                              size="sm"
                              onClick={() => handleViewTask(task.id)}
                            >
                              Start Task
                            </Button>
                          </div>
                        </li>
                      ))}
                    {getTasksBySubject(selectedSubject).filter(task => task.status === 'pending').length === 0 && (
                      <p className="text-center text-owl-slate py-4">No pending tasks for this subject</p>
                    )}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </TabsContent>
        
        <TabsContent value="completed" className="space-y-4 mt-4">
          {tasks.filter(task => task.status === 'completed').length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tasks
                .filter(task => task.status === 'completed')
                .map(task => (
                  <motion.div key={task.id} {...slideUp} className="hover-scale">
                    <Card className="border-none shadow-owlet overflow-hidden">
                      <CardHeader className="bg-emerald-50 pb-2">
                        <div className="h-10 w-10 rounded-lg bg-white/90 backdrop-blur-sm shadow-sm flex items-center justify-center">
                          <CheckCircle className="h-6 w-6 text-emerald-500" />
                        </div>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <CardTitle className="text-xl mb-1">
                          {subjects.find(s => s.id === task.subject)?.name}
                        </CardTitle>
                        <CardDescription className="mb-4">
                          Score: {task.results?.score}/{task.results?.total}
                        </CardDescription>
                        <Button 
                          variant="outline"
                          onClick={() => handleViewTask(task.id)}
                          className="w-full"
                        >
                          View Results
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-subtle p-6 text-center">
              <p className="text-owl-slate">You haven't completed any tasks yet.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default ChildTaskView;
