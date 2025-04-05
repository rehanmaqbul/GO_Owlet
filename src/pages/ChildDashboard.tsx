import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen, 
  GraduationCap,
  Rocket,
  Gamepad2,
  Trophy,
  MessageSquare,
  Star,
  Lightbulb,
  Calendar,
  Clock,
  CheckCircle2,
  ListTodo,
  AlertCircle
} from 'lucide-react';
import { DashboardLayout, SidebarSection, SidebarNavItem } from '@/components/layout/DashboardLayout';
import { ActionCard } from '@/components/ui/ActionCard';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Task, Subject, Curriculum } from '@/lib/types';

// Mock data for tasks with UI-specific properties
const mockDashboardTasks = [
  { 
    id: "1", 
    title: "Math Quiz", 
    subject: "Mathematics", 
    due: "Today", 
    dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000), 
    completed: false, 
    assignedBy: "Teacher", 
    questionCount: 5,
    estimatedTime: "10 min"
  },
  { 
    id: "2", 
    title: "Reading Assignment", 
    subject: "English", 
    due: "Tomorrow", 
    dueDate: new Date(Date.now() + 48 * 60 * 60 * 1000), 
    completed: false, 
    assignedBy: "Parent",
    questionCount: 3,
    estimatedTime: "15 min"
  },
  { 
    id: "3", 
    title: "Science Project", 
    subject: "Science", 
    due: "Friday", 
    dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), 
    completed: true, 
    assignedBy: "Teacher",
    questionCount: 8,
    estimatedTime: "20 min"
  }
];

// Mock data for progress
const mockProgress = {
  totalPoints: 245,
  streak: 5,
  completion: 78,
  level: 8
};

const ChildDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState('learn');
  const [taskView, setTaskView] = useState<'all' | 'pending' | 'completed'>('all');
  const [message, setMessage] = useState<{text: string; type: 'success' | 'error'} | null>(null);
  
  // Debug - log all mock task IDs
  useEffect(() => {
    console.log('ChildDashboard - mockDashboardTasks IDs:', mockDashboardTasks.map(task => task.id));
  }, []);

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const handleTaskClick = (taskId: string) => {
    // Navigate directly to the task without delay
    navigate(`/task/${taskId}`);
  };

  // Check if the child should be redirected (if not authenticated or not a child)
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (user.role !== 'child') {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  if (!user || user.role !== 'child') return null;

  // Filter tasks based on task view selection
  const filteredTasks = taskView === 'all' 
    ? mockDashboardTasks
    : taskView === 'pending' 
      ? mockDashboardTasks.filter(task => !task.completed)
      : mockDashboardTasks.filter(task => task.completed);
  
  // Calculate task statistics
  const taskStats = {
    total: mockDashboardTasks.length,
    pending: mockDashboardTasks.filter(task => !task.completed).length,
    completed: mockDashboardTasks.filter(task => task.completed).length,
    completionPercentage: Math.round((mockDashboardTasks.filter(task => task.completed).length / mockDashboardTasks.length) * 100) || 0
  };

  // Create sidebar content
  const sidebarContent = (
    <>
      <SidebarSection title="MY ADVENTURES">
        <SidebarNavItem 
          icon={<BookOpen size={18} className="mr-2 text-amber-700" />}
          label="Learning Hub"
          onClick={() => handleNavigate('/learning-hub')}
          active={selectedTab === 'learn'}
        />
        <SidebarNavItem 
          icon={<ListTodo size={18} className="mr-2 text-amber-700" />}
          label="My Assignments"
          onClick={() => navigate('/child-tasks')}
          active={selectedTab === 'assignments'}
        />
        <SidebarNavItem 
          icon={<Gamepad2 size={18} className="mr-2 text-amber-700" />}
          label="Games & Fun"
          onClick={() => handleNavigate('/fun-games')}
          active={selectedTab === 'games'}
        />
        <SidebarNavItem 
          icon={<Trophy size={18} className="mr-2 text-amber-700" />}
          label="My Rewards"
          onClick={() => handleNavigate('/my-rewards')}
          active={selectedTab === 'rewards'}
        />
        <SidebarNavItem 
          icon={<Lightbulb size={18} className="mr-2 text-amber-700" />}
          label="Learning Tips"
          onClick={() => handleNavigate('/learning-tips')}
          active={selectedTab === 'tips'}
        />
        <SidebarNavItem 
          icon={<MessageSquare size={18} className="mr-2 text-amber-700" />}
          label="Messages"
          onClick={() => navigate('/child-messages')}
          active={selectedTab === 'messages'}
        />
      </SidebarSection>
      
      <SidebarSection title="MY PROGRESS">
        <div className="bg-amber-100/50 rounded-md p-4">
          <div className="flex items-center gap-2 mb-3">
            <Star className="h-5 w-5 text-amber-500" />
            <p className="text-sm font-bold text-gray-800">{mockProgress.totalPoints} POINTS</p>
          </div>
          
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1 text-gray-600">
                <span>Level {mockProgress.level}</span>
                <span>Level {mockProgress.level + 1}</span>
              </div>
              <Progress value={mockProgress.completion} className="h-2 bg-amber-100" indicatorClassName="bg-amber-600" />
            </div>
            
            <div className="flex justify-between text-xs">
              <span className="flex items-center text-gray-700">
                <Calendar className="h-3 w-3 mr-1" />
                {mockProgress.streak} day streak
              </span>
              <span className="bg-amber-600 text-white px-2 py-0.5 rounded-full text-[10px]">
                {mockProgress.completion}% complete
              </span>
            </div>
          </div>
        </div>
      </SidebarSection>
    </>
  );

  // Create header content
  const headerContent = (
    <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-6 rounded-xl shadow-sm border border-amber-200">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">
        Hi {user.name || 'Explorer'}! 👋
      </h1>
      <p className="text-gray-600">
        Ready for today's adventures in learning?
      </p>
      
      <div className="mt-4 flex items-center bg-white/60 rounded-lg px-4 py-2 w-fit">
        <Star className="h-5 w-5 text-amber-500 mr-2" />
        <span className="font-semibold text-amber-700">
          {mockProgress.totalPoints} points earned
        </span>
        <span className="mx-2 text-gray-400">•</span>
        <span className="text-gray-600">Level {mockProgress.level}</span>
      </div>
    </div>
  );

  // Task card component for consistent display
  const TaskCard = ({ task }: { task: typeof mockDashboardTasks[0] }) => {
    return (
      <Card 
        key={task.id} 
        className={`border ${task.completed ? 'border-green-200 bg-green-50' : 'border-amber-200 bg-amber-50'} shadow-sm hover:shadow-md transition-all cursor-pointer transform hover:-translate-y-1`}
        onClick={(e) => {
          // Only navigate if the click wasn't on the button
          if (!(e.target as HTMLElement).closest('button')) {
            handleTaskClick(task.id);
          }
        }}
      >
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-base font-medium text-gray-800">{task.title}</h3>
              <p className="text-sm text-gray-600">{task.subject}</p>
            </div>
            <Badge className={`${task.completed ? 'bg-green-100 text-green-700' : 'bg-amber-200 text-amber-700'} hover:${task.completed ? 'bg-green-200' : 'bg-amber-300'}`}>
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
              <span>{task.questionCount} questions</span>
            </div>
            <div className="flex items-center gap-1">
              <GraduationCap className="h-3 w-3" />
              <span>By: {task.assignedBy}</span>
            </div>
          </div>
          
          <Button 
            className={`w-full ${task.completed ? 'bg-green-600 hover:bg-green-700' : 'bg-amber-600 hover:bg-amber-700'} text-white`}
            onClick={() => handleTaskClick(task.id)}
          >
            {task.completed ? 'Review' : 'Start Mission'}
          </Button>
        </div>
      </Card>
    );
  };

  // Create task summary section
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

  return (
    <DashboardLayout
      sidebarContent={sidebarContent}
      headerContent={headerContent}
      logoIcon={<Rocket size={18} />}
    >
      {/* Success/Error Message */}
      {message && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mb-4 p-3 rounded-lg text-center ${
            message.type === 'success' 
              ? 'bg-green-100 text-green-700 border border-green-200' 
              : 'bg-red-100 text-red-700 border border-red-200'
          }`}
        >
          {message.text}
        </motion.div>
      )}
      
      {selectedTab === 'learn' && (
        <>
          {/* Today's Tasks */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Today's Missions</h2>
              <Button 
                variant="outline"
                className="border-amber-200 text-amber-700 hover:bg-amber-100"
                onClick={() => navigate('/child-tasks')}
              >
                View All Tasks
                  </Button>
          </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {mockDashboardTasks.filter(task => !task.completed).slice(0, 3).map(task => (
                <TaskCard key={task.id} task={task} />
              ))}
              
              {mockDashboardTasks.filter(task => !task.completed).length === 0 && (
                <div className="col-span-3 text-center p-8 bg-amber-50 rounded-lg border border-amber-200">
                  <div className="bg-amber-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                    <CheckCircle2 className="h-6 w-6 text-amber-600" />
                      </div>
                  <h3 className="text-lg font-medium text-gray-800 mb-1">All Caught Up!</h3>
                  <p className="text-gray-600">You've completed all your assigned tasks.</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Action cards */}
                      <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Fun Activities</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <ActionCard
                title="Learning Hub"
                description="Explore fun lessons and activities"
                icon={BookOpen}
                buttonText="Explore"
                onClick={() => handleNavigate('/learning-hub')}
              />
              
              <ActionCard
                title="Fun Games"
                description="Play educational games and puzzles"
                icon={Gamepad2}
                buttonText="Play Now"
                onClick={() => handleNavigate('/fun-games')}
              />
              
              <ActionCard
                title="My Rewards"
                description="See your achievements and prizes"
                icon={Trophy}
                buttonText="View Rewards"
                onClick={() => handleNavigate('/my-rewards')}
              />
              
              <ActionCard
                title="Learning Tips"
                description="Discover helpful study tips and tricks"
                icon={Lightbulb}
                buttonText="Get Tips"
                onClick={() => handleNavigate('/learning-tips')}
              />
                        </div>
                      </div>
        </>
      )}
      
      {selectedTab === 'assignments' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-6 rounded-xl shadow-md text-white">
            <h2 className="text-2xl font-bold mb-2">My Assignments</h2>
            <p className="opacity-90">Complete your tasks to earn points and rewards!</p>
          </div>
          
          <TasksSummary />
          
          <div className="flex border-b border-amber-200 mb-4">
            <Button
              variant="ghost"
              className={`pb-2 rounded-none ${taskView === 'all' ? 'border-b-2 border-amber-600 text-amber-700' : 'text-gray-600'}`}
              onClick={() => setTaskView('all')}
            >
              All Tasks
            </Button>
            <Button
              variant="ghost"
              className={`pb-2 rounded-none ${taskView === 'pending' ? 'border-b-2 border-amber-600 text-amber-700' : 'text-gray-600'}`}
              onClick={() => setTaskView('pending')}
            >
              Pending ({taskStats.pending})
            </Button>
                      <Button 
              variant="ghost"
              className={`pb-2 rounded-none ${taskView === 'completed' ? 'border-b-2 border-amber-600 text-amber-700' : 'text-gray-600'}`}
              onClick={() => setTaskView('completed')}
            >
              Completed ({taskStats.completed})
                      </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTasks.map(task => (
              <TaskCard key={task.id} task={task} />
            ))}
            
            {filteredTasks.length === 0 && (
              <div className="col-span-2 text-center p-8 bg-amber-50 rounded-lg border border-amber-200">
                <div className="bg-amber-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <AlertCircle className="h-6 w-6 text-amber-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-1">No Tasks Found</h3>
                <p className="text-gray-600">
                  {taskView === 'pending' 
                    ? "You don't have any pending tasks right now."
                    : taskView === 'completed' 
                      ? "You haven't completed any tasks yet."
                      : "You don't have any tasks assigned to you."}
                </p>
              </div>
            )}
              </div>
        </motion.div>
      )}
      
      {/* Other tabs content would go here */}
      {selectedTab === 'games' && (
        <div className="text-center p-10 bg-amber-50 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Games & Fun</h2>
          <p className="text-gray-600 mb-4">Educational games coming soon!</p>
          <Button 
            className="bg-amber-600 hover:bg-amber-700 text-white"
            onClick={() => handleNavigate('/fun-games')}
          >
            Play Games
          </Button>
        </div>
      )}
      
      {selectedTab === 'rewards' && (
        <div className="text-center p-10 bg-amber-50 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">My Rewards</h2>
          <p className="text-gray-600 mb-4">Your achievements and rewards will appear here.</p>
          <Button 
            className="bg-amber-600 hover:bg-amber-700 text-white"
            onClick={() => handleNavigate('/my-rewards')}
          >
            View Rewards
          </Button>
        </div>
      )}
      
      {selectedTab === 'messages' && (
        <div className="text-center p-10 bg-amber-50 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Messages</h2>
          <p className="text-gray-600 mb-4">You have no new messages.</p>
          <Button 
            className="bg-amber-600 hover:bg-amber-700 text-white"
            onClick={() => handleNavigate('/child-messages')}
          >
            Open Messages
          </Button>
    </div>
      )}
    </DashboardLayout>
  );
};

export default ChildDashboard;
