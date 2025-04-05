
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart } from '@/components/ui/chart';
import { motion } from 'framer-motion';
import { fadeIn, slideUp } from '@/lib/animations';
import { Plus } from 'lucide-react';
import { Subject, Task } from '@/lib/types';
import TaskCard from './TaskCard';

interface ParentTaskViewProps {
  tasks: Task[];
  subjects: { id: Subject; name: string; color: string }[];
  handleCreateTask: () => void;
  handleViewTask: (taskId: string) => void;
}

const ParentTaskView = ({ tasks, subjects, handleCreateTask, handleViewTask }: ParentTaskViewProps) => {
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  
  // Get tasks by subject
  const getTasksBySubject = (subject: Subject) => {
    return tasks.filter(task => task.subject === subject);
  };

  // Get counts of pending tasks by subject
  const getPendingTasksCount = (subject: Subject) => {
    return tasks.filter(task => task.subject === subject && task.status === 'pending').length;
  };

  // Get best performing subject
  const getBestPerformingSubject = () => {
    const subjectScores: Record<string, { correct: number, total: number }> = {};
    
    tasks.forEach(task => {
      if (task.status === 'completed' && task.results) {
        if (!subjectScores[task.subject]) {
          subjectScores[task.subject] = { correct: 0, total: 0 };
        }
        
        subjectScores[task.subject].correct += task.results.score;
        subjectScores[task.subject].total += task.results.total;
      }
    });
    
    let bestSubject = null;
    let bestPercentage = 0;
    
    Object.entries(subjectScores).forEach(([subject, scores]) => {
      const percentage = scores.total > 0 ? (scores.correct / scores.total) * 100 : 0;
      if (percentage > bestPercentage) {
        bestPercentage = percentage;
        bestSubject = subject;
      }
    });
    
    return {
      subject: bestSubject,
      percentage: bestPercentage,
    };
  };

  // Get worst performing subject
  const getWorstPerformingSubject = () => {
    const subjectScores: Record<string, { correct: number, total: number }> = {};
    
    tasks.forEach(task => {
      if (task.status === 'completed' && task.results) {
        if (!subjectScores[task.subject]) {
          subjectScores[task.subject] = { correct: 0, total: 0 };
        }
        
        subjectScores[task.subject].correct += task.results.score;
        subjectScores[task.subject].total += task.results.total;
      }
    });
    
    let worstSubject = null;
    let worstPercentage = 100;
    
    Object.entries(subjectScores).forEach(([subject, scores]) => {
      const percentage = scores.total > 0 ? (scores.correct / scores.total) * 100 : 0;
      if (percentage < worstPercentage && scores.total > 0) {
        worstPercentage = percentage;
        worstSubject = subject;
      }
    });
    
    return {
      subject: worstSubject,
      percentage: worstPercentage,
    };
  };

  // Prepare chart data
  const getChartData = () => {
    const subjectScores: Record<string, { correct: number, total: number }> = {};
    
    tasks.forEach(task => {
      if (task.status === 'completed' && task.results) {
        if (!subjectScores[task.subject]) {
          subjectScores[task.subject] = { correct: 0, total: 0 };
        }
        
        subjectScores[task.subject].correct += task.results.score;
        subjectScores[task.subject].total += task.results.total;
      }
    });
    
    return Object.entries(subjectScores).map(([subject, scores]) => {
      const subjectInfo = subjects.find(s => s.id === subject);
      const percentage = scores.total > 0 ? (scores.correct / scores.total) * 100 : 0;
      
      return {
        name: subjectInfo?.name || subject,
        score: Math.round(percentage),
      };
    });
  };

  return (
    <motion.div className="space-y-6" {...fadeIn}>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-medium text-owl-slate-dark">Tasks</h1>
        <Button onClick={handleCreateTask}>
          <Plus className="mr-2 h-4 w-4" /> Assign New Task
        </Button>
      </div>
      
      <Tabs defaultValue="status" className="w-full">
        <TabsList className="grid grid-cols-2 w-full max-w-md">
          <TabsTrigger value="status">Check Task Status</TabsTrigger>
          <TabsTrigger value="manage">Manage Tasks</TabsTrigger>
        </TabsList>
        
        <TabsContent value="status" className="space-y-6 mt-4">
          <Card className="shadow-subtle">
            <CardHeader>
              <CardTitle>Task Performance</CardTitle>
              <CardDescription>
                Overall performance of your child on assigned tasks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <h3 className="text-sm font-medium text-green-800 mb-1">Best Performing Subject</h3>
                  {getBestPerformingSubject().subject ? (
                    <>
                      <p className="text-xl font-bold text-green-600">
                        {subjects.find(s => s.id === getBestPerformingSubject().subject)?.name}
                      </p>
                      <p className="text-sm text-green-600">
                        {Math.round(getBestPerformingSubject().percentage)}% correct answers
                      </p>
                    </>
                  ) : (
                    <p className="text-sm text-green-600">No completed tasks yet</p>
                  )}
                </div>
                
                <div className="p-4 bg-red-50 rounded-lg">
                  <h3 className="text-sm font-medium text-red-800 mb-1">Needs Improvement</h3>
                  {getWorstPerformingSubject().subject ? (
                    <>
                      <p className="text-xl font-bold text-red-600">
                        {subjects.find(s => s.id === getWorstPerformingSubject().subject)?.name}
                      </p>
                      <p className="text-sm text-red-600">
                        {Math.round(getWorstPerformingSubject().percentage)}% correct answers
                      </p>
                    </>
                  ) : (
                    <p className="text-sm text-red-600">No completed tasks yet</p>
                  )}
                </div>
              </div>
              
              <div className="h-[300px]">
                <h3 className="text-sm font-medium mb-4">Subject Performance</h3>
                <BarChart
                  data={getChartData()}
                  index="name"
                  categories={["score"]}
                  colors={["#9b87f5"]}
                  valueFormatter={(value) => `${value}%`}
                  yAxisWidth={48}
                />
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-subtle">
            <CardHeader>
              <CardTitle>Completed Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {tasks.filter(task => task.status === 'completed').map(task => (
                  <li key={task.id} className="border p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-medium">
                          {subjects.find(s => s.id === task.subject)?.name || task.subject}
                        </span>
                        <p className="text-sm text-owl-slate">
                          Score: {task.results?.score}/{task.results?.total} ({task.results ? Math.round((task.results.score / task.results.total) * 100) : 0}%)
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewTask(task.id)}
                      >
                        View Details
                      </Button>
                    </div>
                  </li>
                ))}
                {tasks.filter(task => task.status === 'completed').length === 0 && (
                  <p className="text-center text-owl-slate py-4">No completed tasks yet</p>
                )}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="manage" className="space-y-4 mt-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {subjects.map(subject => (
              <Button 
                key={subject.id}
                variant="outline"
                className={`h-24 flex flex-col items-center justify-center text-center ${getPendingTasksCount(subject.id) > 0 ? 'border-[#9b87f5]' : ''}`}
                onClick={() => setSelectedSubject(subject.id)}
              >
                {getPendingTasksCount(subject.id) > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#9b87f5] text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                    {getPendingTasksCount(subject.id)}
                  </span>
                )}
                {subject.name}
              </Button>
            ))}
          </div>
          
          {selectedSubject && (
            <motion.div {...slideUp}>
              <Card className="shadow-subtle mt-6">
                <CardHeader>
                  <CardTitle>
                    {subjects.find(s => s.id === selectedSubject)?.name} Tasks
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {getTasksBySubject(selectedSubject).map(task => (
                      <li key={task.id} className="border p-4 rounded-lg">
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="font-medium">
                              {task.status === 'pending' ? 'Pending' : 'Completed'}
                            </span>
                            <p className="text-sm text-owl-slate">
                              {task.questions.length} questions
                            </p>
                          </div>
                          <Button
                            variant={task.status === 'pending' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => handleViewTask(task.id)}
                          >
                            {task.status === 'pending' ? 'View Task' : 'View Results'}
                          </Button>
                        </div>
                      </li>
                    ))}
                    {getTasksBySubject(selectedSubject).length === 0 && (
                      <p className="text-center text-owl-slate py-4">No tasks for this subject</p>
                    )}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default ParentTaskView;
