import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface Task {
  id: string;
  type: 'mcq' | 'fill_blank' | 'multi_select' | 'yes_no' | 'true_false' | 'reading' | 'listening' | 'story' | 'image_upload';
  subject: string;
  chapter: string;
  lesson: string;
  questions: number;
  dayOfWeek: string;
}

interface StudyPlan {
  id: string;
  name: string;
  duration: 'weekly' | 'monthly' | 'custom';
  startDate: Date;
  endDate?: Date;
  tasks: Task[];
}

export const StudyPlanGenerator = () => {
  const [plan, setPlan] = useState<StudyPlan>({
    id: '1',
    name: 'Weekly Study Plan',
    duration: 'weekly',
    startDate: new Date(),
    tasks: []
  });

  const subjects = [
    { id: 'math', name: 'Mathematics' },
    { id: 'science', name: 'Science' },
    { id: 'english', name: 'English' },
    { id: 'history', name: 'History' }
  ];

  const chapters = {
    math: ['Algebra', 'Geometry', 'Statistics'],
    science: ['Physics', 'Chemistry', 'Biology'],
    english: ['Grammar', 'Literature', 'Writing'],
    history: ['Ancient', 'Modern', 'World Wars']
  };

  const lessons = {
    math: {
      Algebra: ['Linear Equations', 'Quadratic Equations', 'Polynomials'],
      Geometry: ['Triangles', 'Circles', 'Polygons'],
      Statistics: ['Mean', 'Median', 'Mode']
    },
    science: {
      Physics: ['Forces', 'Energy', 'Waves'],
      Chemistry: ['Atoms', 'Elements', 'Compounds'],
      Biology: ['Cells', 'Genetics', 'Ecosystems']
    }
  };

  const taskTypes = [
    { id: 'mcq', name: 'Multiple Choice Questions' },
    { id: 'fill_blank', name: 'Fill in the Blanks' },
    { id: 'multi_select', name: 'Multi-Select Questions' },
    { id: 'yes_no', name: 'Yes/No Questions' },
    { id: 'true_false', name: 'True/False Questions' },
    { id: 'reading', name: 'Reading Comprehension' },
    { id: 'listening', name: 'Listening Comprehension' },
    { id: 'story', name: 'Story Questions' },
    { id: 'image_upload', name: 'Image Upload Task' }
  ];

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const addTask = () => {
    const newTask: Task = {
      id: Date.now().toString(),
      type: 'mcq',
      subject: subjects[0].id,
      chapter: chapters[subjects[0].id][0],
      lesson: lessons[subjects[0].id][chapters[subjects[0].id][0]][0],
      questions: 1,
      dayOfWeek: daysOfWeek[0]
    };
    setPlan(prev => ({ ...prev, tasks: [...prev.tasks, newTask] }));
  };

  const updateTask = (taskId: string, field: keyof Task, value: any) => {
    setPlan(prev => ({
      ...prev,
      tasks: prev.tasks.map(task =>
        task.id === taskId ? { ...task, [field]: value } : task
      )
    }));
  };

  const removeTask = (taskId: string) => {
    setPlan(prev => ({
      ...prev,
      tasks: prev.tasks.filter(task => task.id !== taskId)
    }));
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Study Plan Generator</span>
          <div className="flex gap-2">
            <Select
              value={plan.duration}
              onValueChange={(value: 'weekly' | 'monthly' | 'custom') =>
                setPlan(prev => ({ ...prev, duration: value }))
              }
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={addTask}>
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {plan.tasks.map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="border rounded-lg p-4 space-y-4"
            >
              <div className="flex items-center justify-between">
                <Badge variant="outline">Task {index + 1}</Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeTask(task.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Select
                  value={task.type}
                  onValueChange={(value: Task['type']) =>
                    updateTask(task.id, 'type', value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Task Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {taskTypes.map(type => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={task.subject}
                  onValueChange={(value) => {
                    updateTask(task.id, 'subject', value);
                    updateTask(task.id, 'chapter', chapters[value][0]);
                    updateTask(task.id, 'lesson', lessons[value][chapters[value][0]][0]);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map(subject => (
                      <SelectItem key={subject.id} value={subject.id}>
                        {subject.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={task.chapter}
                  onValueChange={(value) => {
                    updateTask(task.id, 'chapter', value);
                    updateTask(task.id, 'lesson', lessons[task.subject][value][0]);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chapter" />
                  </SelectTrigger>
                  <SelectContent>
                    {chapters[task.subject].map(chapter => (
                      <SelectItem key={chapter} value={chapter}>
                        {chapter}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={task.lesson}
                  onValueChange={(value) => updateTask(task.id, 'lesson', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Lesson" />
                  </SelectTrigger>
                  <SelectContent>
                    {lessons[task.subject][task.chapter].map(lesson => (
                      <SelectItem key={lesson} value={lesson}>
                        {lesson}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={task.dayOfWeek}
                  onValueChange={(value) => updateTask(task.id, 'dayOfWeek', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Day of Week" />
                  </SelectTrigger>
                  <SelectContent>
                    {daysOfWeek.map(day => (
                      <SelectItem key={day} value={day}>
                        {day}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {['mcq', 'fill_blank', 'multi_select', 'yes_no', 'true_false'].includes(task.type) && (
                  <Input
                    type="number"
                    min="1"
                    max="4"
                    value={task.questions}
                    onChange={(e) => updateTask(task.id, 'questions', parseInt(e.target.value))}
                    placeholder="Number of questions"
                  />
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}; 