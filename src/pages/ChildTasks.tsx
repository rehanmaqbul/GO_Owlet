import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import TasksHeader from '@/components/child-tasks/TasksHeader';
import SubjectsGrid from '@/components/child-tasks/SubjectsGrid';
import Navbar from '@/components/Navbar';
import { Book, Clock, CheckCircle2, ListTodo, GraduationCap, Calendar, ArrowLeft, Filter, Headphones, BookOpen, Camera } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/auth';

// Mock task data for demonstration
const mockTasks = [
  { 
    id: '1', 
    title: "Math Quiz", 
    subject: "Mathematics", 
    due: "Today", 
    dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000), 
    completed: false, 
    assignedBy: "Teacher", 
    questionCount: 5,
    estimatedTime: "10 min",
    icon: Book
  },
  { 
    id: '2', 
    title: "Reading Assignment", 
    subject: "English", 
    due: "Tomorrow", 
    dueDate: new Date(Date.now() + 48 * 60 * 60 * 1000), 
    completed: false, 
    assignedBy: "Parent",
    questionCount: 3,
    estimatedTime: "15 min",
    icon: Book
  },
  { 
    id: '3', 
    title: "Science Project", 
    subject: "Science", 
    due: "Friday", 
    dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), 
    completed: true, 
    assignedBy: "Teacher",
    questionCount: 8,
    estimatedTime: "20 min",
    icon: Book
  },
  { 
    id: '4', 
    title: "Geography Quiz", 
    subject: "Geography", 
    due: "Next Monday", 
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), 
    completed: false, 
    assignedBy: "Parent",
    questionCount: 10,
    estimatedTime: "30 min",
    icon: Book
  },
  { 
    id: '5', 
    title: "History Assignment", 
    subject: "History", 
    due: "Yesterday", 
    dueDate: new Date(Date.now() - 24 * 60 * 60 * 1000), 
    completed: true, 
    assignedBy: "Teacher",
    questionCount: 6,
    estimatedTime: "25 min",
    icon: Book
  },
  { 
    id: 'reading', 
    title: "Reading Aloud Activity", 
    subject: "English", 
    due: "Today", 
    dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000), 
    completed: false, 
    assignedBy: "Teacher",
    questionCount: 5,
    estimatedTime: "15 min",
    icon: Book,
    activityType: "reading"
  },
  { 
    id: 'story', 
    title: "Story Reading Activity", 
    subject: "English", 
    due: "Tomorrow", 
    dueDate: new Date(Date.now() + 48 * 60 * 60 * 1000), 
    completed: false, 
    assignedBy: "Teacher",
    questionCount: 5,
    estimatedTime: "20 min",
    icon: BookOpen,
    activityType: "story"
  },
  { 
    id: 'listening', 
    title: "Listening Comprehension", 
    subject: "English", 
    due: "Friday", 
    dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), 
    completed: false, 
    assignedBy: "Teacher",
    questionCount: 5,
    estimatedTime: "15 min",
    icon: Headphones,
    activityType: "listening"
  },
  { 
    id: 'upload', 
    title: "Nature Collage Project", 
    subject: "Art", 
    due: "Next Week", 
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), 
    completed: false, 
    assignedBy: "Teacher",
    questionCount: 1,
    estimatedTime: "45 min",
    icon: Camera,
    activityType: "upload"
  }
];

// Group tasks by subject
const groupTasksBySubject = (tasks) => {
  return tasks.reduce((acc, task) => {
    acc[task.subject] = acc[task.subject] || [];
    acc[task.subject].push(task);
    return acc;
  }, {});
};

export default function ChildTasks() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  
  // Filter tasks based on selected filter
  const filteredTasks = mockTasks.filter(task => {
    // Filter by status
    if (activeFilter === 'pending' && task.completed) return false;
    if (activeFilter === 'completed' && !task.completed) return false;
    
    // Filter by subject if selected
    if (selectedSubject && task.subject !== selectedSubject) return false;
    
    // Filter by search query
    if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !task.subject.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
  // Calculate stats
  const taskStats = {
    total: mockTasks.length,
    pending: mockTasks.filter(task => !task.completed).length,
    completed: mockTasks.filter(task => task.completed).length,
    completionPercentage: Math.round((mockTasks.filter(task => task.completed).length / mockTasks.length) * 100) || 0
  };
  
  // Group tasks by subject
  const tasksBySubject = groupTasksBySubject(mockTasks);
  const subjects = Object.keys(tasksBySubject);
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };
  
  const handleFilterChange = (filter: 'all' | 'pending' | 'completed') => {
    setActiveFilter(filter);
  };
  
  const handleSubjectClick = (subject: string) => {
    setSelectedSubject(subject === selectedSubject ? null : subject);
  };
  
  const handleGoBack = () => {
    navigate('/child-dashboard');
  };
  
  const handleTaskClick = (taskId: string) => {
    navigate(`/task/${taskId}`);
  };
  
  // Render task card
  const TaskCard = ({ task }) => {
    // Determine the appropriate route based on task type or id
    const getTaskRoute = (task) => {
      // Number-based tasks (1-4)
      if (task.id === '1' || task.id === '2' || task.id === '3' || task.id === '4') {
        return `/task/${task.id}`;
      } 
      // Activity-type based routing
      else if (task.activityType === "reading") {
        return '/task/reading';
      }
      else if (task.activityType === "story") {
        return '/task/story';
      }
      else if (task.activityType === "listening") {
        return '/task/listening';
      }
      else if (task.activityType === "upload") {
        return '/task/upload';
      }
      // Default task route for other IDs
      else {
        return `/task/${task.id}`;
      }
    };
    
    // Determine icon to display
    const TaskIcon = task.icon || Book;
    
    return (
      <Card className={`border ${task.completed ? 'border-green-200 bg-green-50' : 'border-amber-200 bg-amber-50'} shadow-sm hover:shadow transition-shadow`}>
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-start gap-2">
              <div className="mt-1">
                <TaskIcon className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <h3 className="text-base font-medium text-gray-800">{task.title}</h3>
                <p className="text-sm text-gray-600">{task.subject}</p>
              </div>
            </div>
            <Badge className={`${task.completed ? 'bg-green-100 text-green-700' : 'bg-amber-200 text-amber-700'}`}>
              {task.completed ? 'Completed' : `Due: ${task.due}`}
            </Badge>
          </div>
          
          <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-3">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{task.estimatedTime}</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" />
              <span>{task.questionCount} question{task.questionCount !== 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-center gap-1">
              <GraduationCap className="h-3 w-3" />
              <span>By: {task.assignedBy}</span>
            </div>
          </div>
          
          <Button 
            className={`w-full ${task.completed ? 'bg-green-600 hover:bg-green-700' : 'bg-amber-600 hover:bg-amber-700'} text-white`}
            onClick={() => navigate(getTaskRoute(task))}
          >
            {task.completed ? 'Review' : 'Start Mission'}
          </Button>
        </CardContent>
      </Card>
    );
  };
  
  // Task summary section
  const TasksSummary = () => (
    <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 mb-6">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-medium text-gray-800">Tasks Summary</h3>
        <span className="text-sm bg-amber-600 text-white px-2 py-1 rounded-full">
          {taskStats.completionPercentage}% Complete
        </span>
      </div>
      
      <div className="mb-2">
        <Progress value={taskStats.completionPercentage} className="h-2 bg-amber-200" indicatorClassName="bg-amber-600" />
      </div>
      
      <div className="grid grid-cols-3 gap-2 text-sm">
        <div className="p-2 bg-white/60 rounded text-center">
          <p className="text-gray-600">Total</p>
          <p className="font-semibold text-gray-800">{taskStats.total}</p>
        </div>
        <div className="p-2 bg-white/60 rounded text-center">
          <p className="text-gray-600">Pending</p>
          <p className="font-semibold text-amber-700">{taskStats.pending}</p>
        </div>
        <div className="p-2 bg-white/60 rounded text-center">
          <p className="text-gray-600">Completed</p>
          <p className="font-semibold text-green-700">{taskStats.completed}</p>
        </div>
      </div>
    </div>
  );
  
  // Subject filter chips
  const SubjectFilters = () => (
    <div className="flex flex-wrap gap-2 mb-4">
      {subjects.map((subject) => (
        <Button
          key={subject}
          variant="outline"
          className={`text-sm ${selectedSubject === subject ? 'bg-amber-100 border-amber-300 text-amber-800' : 'bg-white border-amber-200 text-gray-700'}`}
          onClick={() => handleSubjectClick(subject)}
        >
          {subject}
        </Button>
      ))}
      {selectedSubject && (
        <Button
          variant="ghost"
          className="text-sm text-amber-700"
          onClick={() => setSelectedSubject(null)}
        >
          Clear filter
        </Button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-stone-100">
      <Navbar />
      
      <main className="pt-24 px-4 pb-16">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div 
            className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 p-6 mb-8 shadow-lg"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative z-10 flex items-start gap-4">
              <Button 
                onClick={handleGoBack}
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full bg-white/20 text-white hover:bg-white/30 hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-white">My Assignments</h1>
                <p className="text-white/90 mt-2">
                  View and complete your assigned tasks
                </p>
                
                <div className="mt-4 bg-white/20 p-2 rounded-lg inline-flex items-center text-white">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>You have {taskStats.pending} pending tasks</span>
                </div>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute right-6 top-6 w-24 h-24 bg-white/10 rounded-full"></div>
            <div className="absolute right-16 bottom-0 w-16 h-16 bg-white/5 rounded-full"></div>
            <div className="absolute left-1/2 top-1/3 w-8 h-8 bg-white/10 rounded-full"></div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            <TasksSummary />
            
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <Tabs defaultValue="all">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                  <TabsList className="bg-amber-100">
                    <TabsTrigger 
                      value="all" 
                      onClick={() => handleFilterChange('all')}
                      className="data-[state=active]:bg-amber-500 data-[state=active]:text-white"
                    >
                      All Tasks
                    </TabsTrigger>
                    <TabsTrigger 
                      value="pending" 
                      onClick={() => handleFilterChange('pending')}
                      className="data-[state=active]:bg-amber-500 data-[state=active]:text-white"
                    >
                      Pending
                    </TabsTrigger>
                    <TabsTrigger 
                      value="completed" 
                      onClick={() => handleFilterChange('completed')}
                      className="data-[state=active]:bg-amber-500 data-[state=active]:text-white" 
                    >
                      Completed
                    </TabsTrigger>
                  </TabsList>
                  
                  <div className="flex items-center">
                    <Button variant="outline" size="sm" className="border-amber-200 gap-1 text-amber-700 hover:bg-amber-50">
                      <Filter className="h-4 w-4 text-amber-600" />
                      Filter
                    </Button>
                  </div>
                </div>
                
                <SubjectFilters />
                
                <TabsContent value="all" className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredTasks.length > 0 ? (
                      filteredTasks.map(task => (
                        <TaskCard key={task.id} task={task} />
                      ))
                    ) : (
                      <div className="col-span-2 text-center p-8 bg-amber-50 rounded-lg border border-amber-200">
                        <div className="bg-amber-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                          <ListTodo className="h-6 w-6 text-amber-600" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-800 mb-1">No Tasks Found</h3>
                        <p className="text-gray-600">
                          {searchQuery 
                            ? "No tasks match your search criteria."
                            : selectedSubject
                              ? `No ${activeFilter !== 'all' ? activeFilter : ''} tasks found for ${selectedSubject}.`
                              : `No ${activeFilter} tasks to display.`}
                        </p>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="pending" className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredTasks.length > 0 ? (
                      filteredTasks.map(task => (
                        <TaskCard key={task.id} task={task} />
                      ))
                    ) : (
                      <div className="col-span-2 text-center p-8 bg-amber-50 rounded-lg border border-amber-200">
                        <div className="bg-amber-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                          <CheckCircle2 className="h-6 w-6 text-amber-600" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-800 mb-1">All Caught Up!</h3>
                        <p className="text-gray-600">You don't have any pending tasks right now.</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="completed" className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredTasks.length > 0 ? (
                      filteredTasks.map(task => (
                        <TaskCard key={task.id} task={task} />
                      ))
                    ) : (
                      <div className="col-span-2 text-center p-8 bg-amber-50 rounded-lg border border-amber-200">
                        <div className="bg-amber-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                          <ListTodo className="h-6 w-6 text-amber-600" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-800 mb-1">No Completed Tasks</h3>
                        <p className="text-gray-600">You haven't completed any tasks yet. Keep going!</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            
            {/* Motivational footer */}
        <motion.div 
              className="mt-12 text-center p-8 rounded-2xl bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h3 className="text-xl font-bold text-amber-700 mb-2">
                Keep Up the Great Work!
              </h3>
              <p className="text-amber-600/80 max-w-lg mx-auto">
                Every task you complete is a step towards becoming smarter and stronger.
                What will you learn today?
              </p>
            </motion.div>
        </motion.div>
        </div>
      </main>
    </div>
  );
}
