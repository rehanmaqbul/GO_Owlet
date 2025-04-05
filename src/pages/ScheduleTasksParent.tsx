import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import { ArrowLeft, Calendar, BookOpen, Plus, Check, Trash2, User, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

// Mock children data for demonstration - in a real app, this would come from the auth context or API
const mockChildren = [
  { id: 'child-1', name: 'Alex Smith', age: 10, grade: 'Grade 5' },
  { id: 'child-2', name: 'Jamie Johnson', age: 8, grade: 'Grade 3' },
];

// Mock subjects data
const educationalSubjects = [
  { id: 'math', name: 'Mathematics', icon: '📊' },
  { id: 'science', name: 'Science', icon: '🔬' },
  { id: 'english', name: 'English', icon: '📝' },
  { id: 'history', name: 'History', icon: '🏛️' },
  { id: 'geography', name: 'Geography', icon: '🌎' },
  { id: 'art', name: 'Art', icon: '🎨' },
];

const skillsSubjects = [
  { id: 'critical-thinking', name: 'Critical Thinking', icon: '🧠' },
  { id: 'problem-solving', name: 'Problem Solving', icon: '🧩' },
  { id: 'creativity', name: 'Creativity', icon: '💡' },
  { id: 'communication', name: 'Communication', icon: '🗣️' },
  { id: 'collaboration', name: 'Collaboration', icon: '👥' },
  { id: 'time-management', name: 'Time Management', icon: '⏰' },
];

// Mock questions data
const mockQuestions = [
  { id: 'q1', subject: 'math', text: 'What is 5 + 7?', type: 'multiple_choice' },
  { id: 'q2', subject: 'math', text: 'What is 8 x 4?', type: 'multiple_choice' },
  { id: 'q3', subject: 'science', text: 'The Earth revolves around the ______.', type: 'fill_blank' },
  { id: 'q4', subject: 'english', text: 'Identify the proper noun in this sentence.', type: 'multiple_choice' },
  { id: 'q5', subject: 'critical-thinking', text: 'Solve this logical puzzle.', type: 'multiple_choice' },
];

// Interface for scheduled tasks
interface ScheduledTask {
  id: string;
  date: Date;
  childId: string;
  childName: string;
  subjects: Array<{id: string, name: string}>;
  questions: string[];
  taskName: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

const ScheduleTasksParent = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Date selection state
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [visibleDates, setVisibleDates] = useState<Date[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  // Task creation state
  const [scheduleType, setScheduleType] = useState<'weekly' | 'monthly'>('weekly');
  const [selectedChild, setSelectedChild] = useState('');
  const [selectedEducationalSubjects, setSelectedEducationalSubjects] = useState<string[]>([]);
  const [selectedSkillsSubjects, setSelectedSkillsSubjects] = useState<string[]>([]);
  const [selectedQuestions, setSelectedQuestions] = useState<{[subject: string]: string[]}>({});
  const [taskName, setTaskName] = useState('');
  
  // Scheduled tasks state
  const [scheduledTasks, setScheduledTasks] = useState<ScheduledTask[]>([]);
  const [showReviewPanel, setShowReviewPanel] = useState(false);
  
  // Calculate visible dates based on schedule type and current month
  useEffect(() => {
    let dates: Date[] = [];
    const today = new Date();
    
    if (scheduleType === 'weekly') {
      // Generate dates for this week and next week
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay()); // Start from Sunday
      
      for (let i = 0; i < 14; i++) {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);
        dates.push(date);
      }
    } else {
      // For monthly view, show the full month
      const year = currentMonth.getFullYear();
      const month = currentMonth.getMonth();
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      
      // Include some days from previous and next month for context
      const prevMonthDays = firstDay.getDay(); // Days to show from previous month
      const nextMonthDays = 6 - lastDay.getDay(); // Days to show from next month
      
      // Add days from previous month
      for (let i = prevMonthDays - 1; i >= 0; i--) {
        const date = new Date(year, month, -i);
        dates.push(date);
      }
      
      // Add days from current month
      for (let i = 1; i <= lastDay.getDate(); i++) {
        const date = new Date(year, month, i);
        dates.push(date);
      }
      
      // Add days from next month
      for (let i = 1; i <= nextMonthDays; i++) {
        const date = new Date(year, month + 1, i);
        dates.push(date);
      }
    }
    
    setVisibleDates(dates);
  }, [scheduleType, currentMonth]);
  
  // Format date for display
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', { 
      weekday: 'short', 
      day: 'numeric',
      month: 'short'
    }).format(date);
  };
  
  // Check if date is today
  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() && 
           date.getMonth() === today.getMonth() && 
           date.getFullYear() === today.getFullYear();
  };
  
  // Check if a date has scheduled tasks
  const hasScheduledTasks = (date: Date) => {
    return scheduledTasks.some(task => {
      const taskDate = new Date(task.date);
      return taskDate.getDate() === date.getDate() && 
             taskDate.getMonth() === date.getMonth() && 
             taskDate.getFullYear() === date.getFullYear();
    });
  };
  
  // Navigate to previous month/week
  const navigatePrevious = () => {
    if (scheduleType === 'weekly') {
      const newDate = new Date(visibleDates[0]);
      newDate.setDate(newDate.getDate() - 7);
      setCurrentMonth(newDate);
    } else {
      const newMonth = new Date(currentMonth);
      newMonth.setMonth(newMonth.getMonth() - 1);
      setCurrentMonth(newMonth);
    }
  };
  
  // Navigate to next month/week
  const navigateNext = () => {
    if (scheduleType === 'weekly') {
      const newDate = new Date(visibleDates[visibleDates.length - 1]);
      newDate.setDate(newDate.getDate() + 1);
      setCurrentMonth(newDate);
    } else {
      const newMonth = new Date(currentMonth);
      newMonth.setMonth(newMonth.getMonth() + 1);
      setCurrentMonth(newMonth);
    }
  };
  
  // Get filtered questions for a specific subject
  const getQuestionsForSubject = (subjectId: string) => {
    return mockQuestions.filter(q => q.subject === subjectId);
  };
  
  // Find subject name by ID
  const getSubjectName = (subjectId: string) => {
    const educational = educationalSubjects.find(s => s.id === subjectId);
    if (educational) return educational.name;
    
    const skill = skillsSubjects.find(s => s.id === subjectId);
    return skill ? skill.name : subjectId;
  };
  
  // Get all selected subjects
  const getAllSelectedSubjects = () => {
    return [
      ...selectedEducationalSubjects.map(id => {
        const subject = educationalSubjects.find(s => s.id === id);
        return { id, name: subject?.name || id };
      }),
      ...selectedSkillsSubjects.map(id => {
        const subject = skillsSubjects.find(s => s.id === id);
        return { id, name: subject?.name || id };
      })
    ];
  };
  
  // Handle child selection
  const handleChildSelect = (childId: string) => {
    setSelectedChild(childId === selectedChild ? '' : childId);
  };
  
  // Handle subject selection
  const handleSubjectSelect = (subjectId: string, type: 'educational' | 'skills') => {
    if (type === 'educational') {
      setSelectedEducationalSubjects(prev => 
        prev.includes(subjectId)
          ? prev.filter(id => id !== subjectId)
          : [...prev, subjectId]
      );
    } else {
      setSelectedSkillsSubjects(prev => 
        prev.includes(subjectId)
          ? prev.filter(id => id !== subjectId)
          : [...prev, subjectId]
      );
    }
  };
  
  // Toggle question selection
  const handleToggleQuestion = (subjectId: string, questionId: string) => {
    setSelectedQuestions(prev => {
      const subjectQuestions = prev[subjectId] || [];
      const updatedQuestions = subjectQuestions.includes(questionId)
        ? subjectQuestions.filter(id => id !== questionId)
        : [...subjectQuestions, questionId];
      
      return {
        ...prev,
        [subjectId]: updatedQuestions
      };
    });
  };
  
  // Save task for the selected date
  const handleSaveTask = () => {
    if (!selectedDate) {
      toast({
        title: "Date required",
        description: "Please select a date for this scheduled task.",
        variant: "destructive",
      });
      return;
    }
    
    if (!selectedChild) {
      toast({
        title: "Child required",
        description: "Please select a child for this task.",
        variant: "destructive",
      });
      return;
    }
    
    if (selectedEducationalSubjects.length === 0 && selectedSkillsSubjects.length === 0) {
      toast({
        title: "Subject required",
        description: "Please select at least one subject for this task.",
        variant: "destructive",
      });
      return;
    }
    
    if (!taskName) {
      toast({
        title: "Task name required",
        description: "Please provide a name for this task.",
        variant: "destructive",
      });
      return;
    }
    
    // Collect all selected questions across subjects
    const allQuestions: string[] = [];
    Object.values(selectedQuestions).forEach(questions => {
      allQuestions.push(...questions);
    });
    
    if (allQuestions.length === 0) {
      toast({
        title: "Questions required",
        description: "Please select at least one question for this task.",
        variant: "destructive",
      });
      return;
    }
    
    // Get child name
    const child = mockChildren.find(c => c.id === selectedChild);
    
    // Create new scheduled task
    const newTask: ScheduledTask = {
      id: `task-${Date.now()}`,
      date: selectedDate,
      childId: selectedChild,
      childName: child?.name || 'Unknown Child',
      subjects: getAllSelectedSubjects(),
      questions: allQuestions,
      taskName
    };
    
    // Add to scheduled tasks
    setScheduledTasks(prev => [...prev, newTask]);
    
    // Reset form for next task
    setSelectedEducationalSubjects([]);
    setSelectedSkillsSubjects([]);
    setSelectedQuestions({});
    setTaskName('');
    
    toast({
      title: "Task scheduled",
      description: `Task "${taskName}" has been scheduled for ${selectedDate.toLocaleDateString()}.`,
    });
  };
  
  // Send all scheduled tasks
  const handleSendScheduledTasks = () => {
    if (scheduledTasks.length === 0) {
      toast({
        title: "No tasks scheduled",
        description: "Please create at least one scheduled task.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Tasks scheduled successfully",
      description: `${scheduledTasks.length} tasks have been scheduled and will be sent automatically on their scheduled dates.`,
    });
    
    // Navigate back to parent assign task page
    setTimeout(() => {
      navigate('/parent-assign-task');
    }, 2000);
  };
  
  // Delete a scheduled task
  const handleDeleteTask = (taskId: string) => {
    setScheduledTasks(prev => prev.filter(task => task.id !== taskId));
    
    toast({
      title: "Task removed",
      description: "The scheduled task has been removed.",
    });
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-owl-neutral-lighter to-white">
      <Navbar />
      
      <main className="pt-24 px-4 pb-16 max-w-7xl mx-auto">
        <motion.div
          className="space-y-8"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={() => navigate('/parent-assign-task')}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-owl-slate-dark">Schedule Tasks</h1>
                <p className="text-owl-slate">Create tasks that will be automatically sent on specific dates</p>
              </div>
            </div>
            
            <Tabs value={scheduleType} onValueChange={(value) => setScheduleType(value as 'weekly' | 'monthly')}>
              <TabsList>
                <TabsTrigger value="weekly">Weekly</TabsTrigger>
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
              </TabsList>
            </Tabs>
          </motion.div>
          
          {/* Date Selection Row */}
          <motion.div variants={itemVariants} className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Calendar className="h-5 w-5 text-indigo-500" />
                Select Date
              </h2>
              
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={navigatePrevious}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                
                <span className="text-sm font-medium">
                  {scheduleType === 'weekly' 
                    ? `${formatDate(visibleDates[0] || new Date())} - ${formatDate(visibleDates[visibleDates.length - 1] || new Date())}` 
                    : new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(currentMonth)}
                </span>
                
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={navigateNext}
                >
                  <ArrowLeft className="h-4 w-4 transform rotate-180" />
                </Button>
              </div>
            </div>
            
            <ScrollArea className="w-full">
              <div className="flex gap-2 py-2 px-1 min-w-max">
                {visibleDates.map((date, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className={`flex flex-col h-auto py-2 px-3 min-w-[72px] ${
                      selectedDate && date.toDateString() === selectedDate.toDateString()
                        ? 'bg-indigo-100 text-indigo-700 border-indigo-200'
                        : isToday(date)
                        ? 'border-blue-200 border-dashed'
                        : 'border-gray-200'
                    } ${
                      hasScheduledTasks(date) ? 'ring-2 ring-indigo-200 ring-offset-1' : ''
                    }`}
                    onClick={() => setSelectedDate(date)}
                  >
                    <span className="text-xs font-normal opacity-70">{date.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                    <span className="text-lg font-semibold">{date.getDate()}</span>
                    <span className="text-xs font-normal opacity-70">{date.toLocaleDateString('en-US', { month: 'short' })}</span>
                    
                    {hasScheduledTasks(date) && (
                      <div className="w-2 h-2 rounded-full bg-indigo-500 mt-1"></div>
                    )}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </motion.div>
          
          {/* Task Creation Panel */}
          {selectedDate && !showReviewPanel && (
            <>
              <motion.div variants={itemVariants} className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-indigo-500" />
                  Create Task for {selectedDate.toLocaleDateString()}
                </h2>
                
                <div className="space-y-6">
                  {/* Task Name */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Task Name</label>
                    <Input
                      placeholder="Enter task name..."
                      className="border-gray-300 text-gray-800 focus:border-blue-400"
                      value={taskName}
                      onChange={(e) => setTaskName(e.target.value)}
                    />
                  </div>
                  
                  {/* Child Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Child</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {mockChildren.map((child) => (
                        <div
                          key={child.id}
                          className={`cursor-pointer p-4 rounded-lg transition-all border ${
                            selectedChild === child.id
                              ? 'bg-indigo-50 border-indigo-300 shadow-sm'
                              : 'bg-white border-gray-200 hover:bg-gray-50'
                          }`}
                          onClick={() => handleChildSelect(child.id)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                              {child.name.charAt(0)}
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-900">{child.name}</h3>
                              <p className="text-sm text-gray-500">{child.grade} • {child.age} years old</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Subject Selection */}
                  {selectedChild && (
                    <div className="space-y-6">
                      {/* Educational Tasks Section */}
                      <div>
                        <h3 className="text-md font-semibold mb-2 text-owl-slate-dark flex items-center gap-2">
                          Educational Tasks
                        </h3>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-4">
                          {educationalSubjects.map((subject) => (
                            <motion.button
                              key={subject.id}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => handleSubjectSelect(subject.id, 'educational')}
                              className={`px-3 py-4 rounded-lg shadow-sm transition-all duration-200 text-center
                                ${selectedEducationalSubjects.includes(subject.id)
                                  ? 'bg-indigo-600 text-white'
                                  : 'bg-white hover:bg-indigo-50 text-owl-slate-dark border border-gray-100'
                                }`}
                            >
                              <div className="text-2xl mb-1">{subject.icon}</div>
                              <span className="font-medium">{subject.name}</span>
                            </motion.button>
                          ))}
                        </div>
                      </div>
                      
                      {/* Other Skills Tasks Section */}
                      <div>
                        <h3 className="text-md font-semibold mb-2 text-owl-slate-dark flex items-center gap-2">
                          Other Skills Tasks
                        </h3>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                          {skillsSubjects.map((subject) => (
                            <motion.button
                              key={subject.id}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => handleSubjectSelect(subject.id, 'skills')}
                              className={`px-3 py-4 rounded-lg shadow-sm transition-all duration-200 text-center
                                ${selectedSkillsSubjects.includes(subject.id)
                                  ? 'bg-indigo-600 text-white'
                                  : 'bg-white hover:bg-indigo-50 text-owl-slate-dark border border-gray-100'
                                }`}
                            >
                              <div className="text-2xl mb-1">{subject.icon}</div>
                              <span className="font-medium">{subject.name}</span>
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
              
              {/* Questions for Each Selected Subject */}
              {[...selectedEducationalSubjects, ...selectedSkillsSubjects].length > 0 && (
                <motion.div variants={itemVariants} className="space-y-6">
                  {[...selectedEducationalSubjects, ...selectedSkillsSubjects].map(subjectId => (
                    <div key={subjectId} className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
                      <h3 className="text-md font-semibold mb-4 flex items-center justify-between">
                        <span>Questions for {getSubjectName(subjectId)}</span>
                        <Badge variant="outline" className="bg-indigo-50 text-indigo-700">
                          {selectedQuestions[subjectId]?.length || 0} selected
                        </Badge>
                      </h3>
                      
                      <div className="space-y-3 max-h-80 overflow-y-auto p-1">
                        {getQuestionsForSubject(subjectId).map((question) => (
                          <div
                            key={question.id}
                            className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                              (selectedQuestions[subjectId] || []).includes(question.id)
                                ? 'bg-indigo-50 border-indigo-200'
                                : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                            }`}
                            onClick={() => handleToggleQuestion(subjectId, question.id)}
                          >
                            <div className="flex-1">
                              <p className="font-medium text-gray-800">{question.text}</p>
                              <p className="text-xs text-gray-500 mt-1">Type: {question.type}</p>
                            </div>
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                              (selectedQuestions[subjectId] || []).includes(question.id)
                                ? 'bg-indigo-600 text-white'
                                : 'bg-white border border-gray-300'
                            }`}>
                              {(selectedQuestions[subjectId] || []).includes(question.id) && <Check className="w-3 h-3" />}
                            </div>
                          </div>
                        ))}
                        
                        {getQuestionsForSubject(subjectId).length === 0 && (
                          <div className="p-4 text-center text-gray-500 bg-gray-50 rounded-lg">
                            No questions available for this subject
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
              
              {/* Action Buttons */}
              <motion.div variants={itemVariants} className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setShowReviewPanel(true)}
                >
                  Review All Scheduled Tasks
                </Button>
                
                <Button
                  variant="outline"
                  className="border-indigo-200 text-indigo-700"
                  onClick={handleSaveTask}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Save Task for this Date
                </Button>
              </motion.div>
            </>
          )}
          
          {/* Review Panel for Scheduled Tasks */}
          {showReviewPanel && (
            <motion.div 
              variants={itemVariants}
              className="bg-white rounded-xl p-6 shadow-md border border-gray-100"
            >
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-indigo-500" />
                  Scheduled Tasks Overview
                </h2>
                <Button variant="ghost" size="sm" onClick={() => setShowReviewPanel(false)}>
                  <ArrowLeft className="w-4 h-4 mr-1" /> Back to Schedule
                </Button>
              </div>
              
              {Object.keys(scheduledTasks).length === 0 ? (
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                  <CalendarX className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-gray-700 mb-1">No tasks scheduled yet</h3>
                  <p className="text-gray-500 mb-4">Start by selecting a date and creating tasks</p>
                  <Button onClick={() => setShowReviewPanel(false)}>
                    Schedule a Task
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {Object.entries(scheduledTasks).map(([dateStr, tasks]) => {
                    const date = new Date(dateStr);
                    return (
                      <div key={dateStr} className="border border-gray-200 rounded-lg overflow-hidden">
                        <div className="bg-indigo-50 px-4 py-3 border-b border-indigo-100">
                          <h3 className="font-medium">
                            {date.toLocaleDateString('en-US', {
                              weekday: 'long',
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </h3>
                        </div>
                        <div className="divide-y divide-gray-100">
                          {tasks.map((task, idx) => (
                            <div key={idx} className="px-4 py-3 hover:bg-gray-50 transition-colors">
                              <div className="flex items-center justify-between mb-1">
                                <h4 className="font-medium text-gray-800">{task.name}</h4>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="text-red-500 h-8 hover:text-red-700 hover:bg-red-50"
                                  onClick={() => handleDeleteTask(dateStr)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                                <User className="h-3 w-3" /> 
                                <span>{mockChildren.find(c => c.id === task.childId)?.name || 'Unknown Child'}</span>
                              </div>
                              <div className="flex flex-wrap gap-2 mt-2">
                                {Object.entries(task.questions || {}).map(([subjectId, questionIds]) => 
                                  Array.isArray(questionIds) && questionIds.length > 0 ? (
                                    <Badge key={subjectId} className="bg-indigo-50 text-indigo-700 px-2 py-1">
                                      {getSubjectName(subjectId)}: {questionIds.length} questions
                                    </Badge>
                                  ) : null
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                  
                  <div className="flex justify-end mt-6">
                    <Button
                      className="bg-indigo-600 hover:bg-indigo-700 text-white"
                      onClick={handleSendScheduledTasks}
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Send All Scheduled Tasks
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default ScheduleTasksParent; 