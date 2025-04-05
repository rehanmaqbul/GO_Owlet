import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import { 
  educationalSubjects, 
  skillsSubjects, 
  mockChildren, 
  SubjectItem, 
  mockSubjectDetails 
} from '@/components/parent/check-tasks/mockData';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { 
  ArrowLeft, 
  ClipboardCheck, 
  Users, 
  Book, 
  Briefcase, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  PieChart,
  ChevronRight,
  Calendar,
  CheckSquare,
  X
} from 'lucide-react';

const TaskStatus = ({ status }: { status: string }) => {
  switch (status) {
    case 'completed':
      return (
        <div className="flex items-center gap-1 text-green-600 bg-green-50 py-1 px-2 rounded-full text-xs">
          <CheckCircle2 className="h-3 w-3" />
          <span>Completed</span>
        </div>
      );
    case 'in-progress':
      return (
        <div className="flex items-center gap-1 text-amber-600 bg-amber-50 py-1 px-2 rounded-full text-xs">
          <Clock className="h-3 w-3" />
          <span>In Progress</span>
        </div>
      );
    case 'not-started':
      return (
        <div className="flex items-center gap-1 text-gray-600 bg-gray-100 py-1 px-2 rounded-full text-xs">
          <AlertCircle className="h-3 w-3" />
          <span>Not Started</span>
        </div>
      );
    default:
      return null;
  }
};

const ParentCheckTasks = () => {
  const navigate = useNavigate();
  const [selectedChild, setSelectedChild] = useState('');
  const [selectedSubjects, setSelectedSubjects] = useState<SubjectItem[]>([]);
  const [viewMode, setViewMode] = useState<'all' | 'in-progress' | 'completed'>('all');
  
  // Simulate loading some task data
  const [taskProgress, setTaskProgress] = useState<Record<string, any>>({});
  
  useEffect(() => {
    if (selectedChild) {
      // In a real app, this would be fetched from an API
      setTaskProgress({
        'subject-1': { 
          total: 10, 
          completed: 6, 
          inProgress: 3, 
          notStarted: 1,
          lastActive: '2 days ago',
          status: 'in-progress'
        },
        'subject-2': { 
          total: 8, 
          completed: 8, 
          inProgress: 0, 
          notStarted: 0,
          lastActive: '1 day ago',
          status: 'completed'
        },
        'subject-3': { 
          total: 12, 
          completed: 3, 
          inProgress: 5, 
          notStarted: 4,
          lastActive: 'Just now',
          status: 'in-progress'
        },
        'subject-11': { 
          total: 5, 
          completed: 0, 
          inProgress: 1, 
          notStarted: 4,
          lastActive: '3 days ago',
          status: 'in-progress'
        },
      });
    }
  }, [selectedChild]);
  
  // Filter subjects that have assigned tasks for the selected child
  // In a real app, this would fetch from an API based on the selected child
  const getAssignedSubjects = (childId: string, category: 'educational' | 'skills') => {
    if (!childId) return [];
    
    // For this mock implementation, we'll just use the subjects that have details in taskProgress
    const availableSubjectIds = Object.keys(taskProgress);
    
    const sourceSubjects = category === 'educational' ? educationalSubjects : skillsSubjects;
    
    return sourceSubjects.filter(subject => 
      availableSubjectIds.includes(subject.id) && subject.category === category
    );
  };
  
  const assignedEducationalSubjects = selectedChild ? getAssignedSubjects(selectedChild, 'educational') : [];
  const assignedSkillsSubjects = selectedChild ? getAssignedSubjects(selectedChild, 'skills') : [];
  
  // Filter subjects based on view mode
  const filterSubjectsByStatus = (subjects: SubjectItem[]) => {
    if (viewMode === 'all') return subjects;
    
    return subjects.filter(subject => {
      const progress = taskProgress[subject.id];
      if (viewMode === 'completed') {
        return progress && progress.status === 'completed';
      } else if (viewMode === 'in-progress') {
        return progress && progress.status === 'in-progress';
      }
      return false;
    });
  };
  
  const filteredEducationalSubjects = filterSubjectsByStatus(assignedEducationalSubjects);
  const filteredSkillsSubjects = filterSubjectsByStatus(assignedSkillsSubjects);
  
  const handleChildSelect = (childId: string) => {
    setSelectedChild(childId);
    // Reset selections when changing child
    setSelectedSubjects([]);
  };
  
  const handleSubjectClick = (subject: SubjectItem) => {
    setSelectedSubjects([subject]);
    
    // In a real app, navigate to details page
    // For now, just show a toast
    navigate(`/task-details-page?childId=${selectedChild}&subject=${subject.id}`);
  };
  
  const navigateToDashboard = () => {
    navigate('/parent-dashboard');
  };
  
  // Animation variants
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

  // Get child object
  const currentChild = mockChildren.find(child => child.id === selectedChild);
  
  // Calculate total progress stats
  const totalStats = selectedChild ? {
    total: Object.values(taskProgress).reduce((sum, item) => sum + item.total, 0),
    completed: Object.values(taskProgress).reduce((sum, item) => sum + item.completed, 0),
    inProgress: Object.values(taskProgress).reduce((sum, item) => sum + item.inProgress, 0),
    notStarted: Object.values(taskProgress).reduce((sum, item) => sum + item.notStarted, 0),
  } : { total: 0, completed: 0, inProgress: 0, notStarted: 0 };
  
  const completionPercentage = totalStats.total > 0 
    ? Math.round((totalStats.completed / totalStats.total) * 100) 
    : 0;
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-owl-neutral-lighter to-white">
      <Navbar />
      
      <main className="pt-24 px-4 pb-16">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div 
            className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 p-6 mb-8 shadow-lg"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative z-10 flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
            <Button 
              onClick={navigateToDashboard}
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full bg-white/20 text-white hover:bg-white/30 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
                  <h1 className="text-3xl font-bold text-white">Check Tasks</h1>
                </div>
                <p className="text-white/90 mt-2 ml-10">
                  Review and track your child's progress on assigned tasks
                </p>
              </div>
          </div>
          
            {/* Decorative elements */}
            <div className="absolute right-6 top-6 w-24 h-24 bg-white/10 rounded-full"></div>
            <div className="absolute right-16 bottom-0 w-16 h-16 bg-white/5 rounded-full"></div>
            <div className="absolute left-1/2 top-1/3 w-8 h-8 bg-white/10 rounded-full"></div>
          </motion.div>
          
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            {/* Children Selection */}
            <motion.div variants={itemVariants}>
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
                <h2 className="text-xl font-semibold mb-6 text-owl-slate-dark flex items-center gap-2">
                  <Users className="h-5 w-5 text-amber-500" />
                  Select Child
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {mockChildren.map((child) => (
                    <div 
                      key={child.id}
                      onClick={() => handleChildSelect(child.id)}
                      className={`
                        flex flex-col items-center gap-2 p-4 rounded-lg shadow-sm transition-all duration-200 cursor-pointer
                        ${selectedChild === child.id 
                          ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white border-transparent' 
                          : 'bg-white hover:bg-gray-50 text-owl-slate-dark border border-gray-100'}
                      `}
                    >
                      <Avatar className="h-16 w-16 border-2 border-white">
                        <AvatarFallback className="bg-amber-200 text-amber-800">
                          {child.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="font-medium text-center">{child.name}</div>
                      <div className={`text-xs ${selectedChild === child.id ? 'text-white/80' : 'text-gray-500'}`}>
                        {child.grade}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          
          {selectedChild && (
            <>
                {/* Progress Summary Card */}
                <motion.div 
                  variants={itemVariants}
                  className="bg-white rounded-xl p-6 shadow-md border border-gray-100"
                >
                  <div className="flex flex-col lg:flex-row gap-6">
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold mb-4 text-owl-slate-dark flex items-center gap-2">
                        <PieChart className="h-5 w-5 text-amber-500" />
                        Progress Summary for {currentChild?.name}
                      </h2>
                      
                      <div className="bg-amber-50 rounded-lg p-4 mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-amber-800">Overall Completion</span>
                          <span className="text-sm font-bold text-amber-800">{completionPercentage}%</span>
                        </div>
                        <Progress value={completionPercentage} className="h-2 bg-amber-200" indicatorClassName="bg-amber-500" />
                        
                        <div className="grid grid-cols-3 gap-2 mt-4">
                          <div className="text-center">
                            <div className="text-amber-800 font-bold text-xl">{totalStats.completed}</div>
                            <div className="text-amber-700 text-xs">Completed</div>
                          </div>
                          <div className="text-center">
                            <div className="text-amber-800 font-bold text-xl">{totalStats.inProgress}</div>
                            <div className="text-amber-700 text-xs">In Progress</div>
                          </div>
                          <div className="text-center">
                            <div className="text-amber-800 font-bold text-xl">{totalStats.notStarted}</div>
                            <div className="text-amber-700 text-xs">Not Started</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="lg:w-1/3 bg-gray-50 rounded-lg p-4">
                      <h3 className="font-semibold mb-3 text-gray-700 flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-amber-500" />
                        Recent Activity
                      </h3>
                      
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 bg-white p-2 rounded-md shadow-sm">
                          <div className="bg-blue-100 rounded-full p-1">
                            <Book className="h-4 w-4 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-medium">Science</div>
                            <div className="text-xs text-gray-500">Active just now</div>
                          </div>
                          <TaskStatus status="in-progress" />
                        </div>
                        
                        <div className="flex items-center gap-2 bg-white p-2 rounded-md shadow-sm">
                          <div className="bg-green-100 rounded-full p-1">
                            <Book className="h-4 w-4 text-green-600" />
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-medium">Math</div>
                            <div className="text-xs text-gray-500">Active 1 day ago</div>
                          </div>
                          <TaskStatus status="completed" />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
                
                {/* Task Viewing Options */}
                <motion.div 
                  variants={itemVariants}
                  className="bg-white rounded-xl p-6 shadow-md border border-gray-100"
                >
                  <h2 className="text-xl font-semibold mb-4 text-owl-slate-dark flex items-center gap-2">
                    <ClipboardCheck className="h-5 w-5 text-amber-500" />
                    Assigned Tasks
                  </h2>
                  
                  <Tabs defaultValue="all" onValueChange={(val) => setViewMode(val as any)}>
                    <TabsList className="mb-6 bg-amber-50">
                      <TabsTrigger 
                        value="all" 
                        className="data-[state=active]:bg-amber-500 data-[state=active]:text-white"
                      >
                        All Tasks
                      </TabsTrigger>
                      <TabsTrigger 
                        value="in-progress" 
                        className="data-[state=active]:bg-amber-500 data-[state=active]:text-white"
                      >
                        In Progress
                      </TabsTrigger>
                      <TabsTrigger 
                        value="completed" 
                        className="data-[state=active]:bg-amber-500 data-[state=active]:text-white"
                      >
                        Completed
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="all" className="mt-0">
                      <TasksList 
                        educationalSubjects={filteredEducationalSubjects}
                        skillsSubjects={filteredSkillsSubjects}
                        taskProgress={taskProgress}
                        handleSubjectClick={handleSubjectClick}
                      />
                    </TabsContent>
                    
                    <TabsContent value="in-progress" className="mt-0">
                      <TasksList 
                        educationalSubjects={filteredEducationalSubjects}
                        skillsSubjects={filteredSkillsSubjects}
                        taskProgress={taskProgress}
                handleSubjectClick={handleSubjectClick}
              />
                    </TabsContent>
                    
                    <TabsContent value="completed" className="mt-0">
                      <TasksList 
                        educationalSubjects={filteredEducationalSubjects}
                        skillsSubjects={filteredSkillsSubjects}
                        taskProgress={taskProgress}
                        handleSubjectClick={handleSubjectClick}
                      />
                    </TabsContent>
                  </Tabs>
                </motion.div>
            </>
          )}
            
            {/* Show message when no child is selected */}
            {!selectedChild && (
              <motion.div variants={itemVariants} className="bg-white rounded-xl p-8 shadow-md border border-gray-100 text-center">
                <div className="bg-amber-50 rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-amber-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Select a Child to Get Started</h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Choose a child from the list above to view their task progress and status.
                </p>
              </motion.div>
          )}
        </motion.div>
        </div>
      </main>
    </div>
  );
};

// Components for task list
const TasksList = ({ 
  educationalSubjects, 
  skillsSubjects, 
  taskProgress, 
  handleSubjectClick 
}: { 
  educationalSubjects: SubjectItem[],
  skillsSubjects: SubjectItem[],
  taskProgress: Record<string, any>,
  handleSubjectClick: (subject: SubjectItem) => void
}) => {
  if (educationalSubjects.length === 0 && skillsSubjects.length === 0) {
    return (
      <div className="text-center p-8 bg-gray-50 rounded-lg">
        <div className="bg-amber-50 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
          <CheckSquare className="h-6 w-6 text-amber-500" />
        </div>
        <h3 className="text-lg font-medium text-gray-800 mb-2">No Tasks Found</h3>
        <p className="text-gray-600 max-w-md mx-auto mb-4">
          There are no tasks matching your current filter criteria.
        </p>
        <Button variant="outline" className="border-amber-300 text-amber-600 hover:bg-amber-50">
          Assign New Tasks
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Educational Subjects */}
      {educationalSubjects.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Book className="h-5 w-5 text-amber-500" />
            <h3 className="font-semibold text-gray-700">Educational Tasks</h3>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            {educationalSubjects.map(subject => (
              <TaskCard 
                key={subject.id}
                subject={subject}
                progress={taskProgress[subject.id]}
                onClick={() => handleSubjectClick(subject)}
              />
            ))}
          </div>
        </div>
      )}
      
      {/* Skills Subjects */}
      {skillsSubjects.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center gap-2 mb-3">
            <Briefcase className="h-5 w-5 text-amber-500" />
            <h3 className="font-semibold text-gray-700">Skills Tasks</h3>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            {skillsSubjects.map(subject => (
              <TaskCard 
                key={subject.id}
                subject={subject}
                progress={taskProgress[subject.id]}
                onClick={() => handleSubjectClick(subject)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Task card for displaying each subject
const TaskCard = ({ 
  subject, 
  progress, 
  onClick 
}: {
  subject: SubjectItem,
  progress: any,
  onClick: () => void
}) => {
  const completionPercentage = Math.round((progress.completed / progress.total) * 100);
  
  return (
    <Card 
      className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer border border-gray-100"
      onClick={onClick}
    >
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-full ${subject.category === 'educational' ? 'bg-blue-50' : 'bg-purple-50'}`}>
              {subject.icon ? (
                <span className="text-xl">{subject.icon}</span>
              ) : (
                <Book className={`h-4 w-4 ${subject.category === 'educational' ? 'text-blue-500' : 'text-purple-500'}`} />
              )}
            </div>
            <div>
              <h4 className="font-semibold">{subject.name}</h4>
              <div className="text-xs text-gray-500">Last active: {progress.lastActive}</div>
            </div>
          </div>
          
          <TaskStatus status={progress.status} />
        </div>
        
        <div className="space-y-2 mb-3">
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-600">Completion:</span>
            <span className="font-medium">{completionPercentage}%</span>
          </div>
          <Progress value={completionPercentage} className="h-1.5" />
        </div>
        
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="bg-green-50 p-1 rounded">
            <span className="block font-medium text-green-700">{progress.completed}</span>
            <span className="text-green-600">Completed</span>
          </div>
          <div className="bg-amber-50 p-1 rounded">
            <span className="block font-medium text-amber-700">{progress.inProgress}</span>
            <span className="text-amber-600">In Progress</span>
          </div>
          <div className="bg-gray-50 p-1 rounded">
            <span className="block font-medium text-gray-700">{progress.notStarted}</span>
            <span className="text-gray-600">Not Started</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-t border-gray-100">
        <span className="text-xs font-medium text-gray-500">Tasks: {progress.total}</span>
        <span className="text-xs text-amber-600 flex items-center">
          View Details <ChevronRight className="h-3 w-3 ml-1" />
        </span>
      </div>
    </Card>
  );
};

export default ParentCheckTasks;
