import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft, 
  BarChart2, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Award,
  Bookmark,
  BookOpen,
  AlertCircle
} from 'lucide-react';

// Mock children
const mockChildren = [
  { id: 'child-1', name: 'Alex Smith', age: 10, grade: 'Grade 5' },
  { id: 'child-2', name: 'Jamie Johnson', age: 8, grade: 'Grade 3' },
];

// Mock subjects
const mockSubjects = [
  { id: 'subject-1', name: 'Mathematics', completed: 75, inProgress: 15, notStarted: 10 },
  { id: 'subject-2', name: 'Science', completed: 60, inProgress: 20, notStarted: 20 },
  { id: 'subject-3', name: 'English', completed: 85, inProgress: 10, notStarted: 5 },
  { id: 'subject-4', name: 'History', completed: 40, inProgress: 30, notStarted: 30 },
  { id: 'subject-5', name: 'Art', completed: 90, inProgress: 5, notStarted: 5 },
];

// Mock weekly progress data
const mockWeeklyProgress = [
  { day: 'Monday', completed: 5 },
  { day: 'Tuesday', completed: 3 },
  { day: 'Wednesday', completed: 7 },
  { day: 'Thursday', completed: 2 },
  { day: 'Friday', completed: 4 },
  { day: 'Saturday', completed: 1 },
  { day: 'Sunday', completed: 0 },
];

// Mock achievements
const mockAchievements = [
  { id: 'achievement-1', title: 'Math Master', description: 'Completed 10 math assignments with 90%+ accuracy', date: '2023-09-15', icon: '🧮' },
  { id: 'achievement-2', title: 'Reading Star', description: 'Read 5 books and completed all comprehension exercises', date: '2023-09-10', icon: '📚' },
  { id: 'achievement-3', title: 'Science Explorer', description: 'Completed all science experiments with excellence', date: '2023-09-05', icon: '🔬' },
];

// Progress status component
const ProgressStatus = ({ status, value }: { status: 'completed' | 'in-progress' | 'not-started', value: number }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'completed':
        return { icon: <CheckCircle2 className="h-4 w-4" />, color: 'text-green-600', bgColor: 'bg-green-100' };
      case 'in-progress':
        return { icon: <Clock className="h-4 w-4" />, color: 'text-amber-600', bgColor: 'bg-amber-100' };
      case 'not-started':
        return { icon: <AlertCircle className="h-4 w-4" />, color: 'text-gray-500', bgColor: 'bg-gray-100' };
    }
  };

  const { icon, color, bgColor } = getStatusConfig();

  return (
    <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${bgColor} ${color}`}>
      {icon}
      <span className="text-sm font-medium">{value}%</span>
    </div>
  );
};

const ParentProgressReports = () => {
  const navigate = useNavigate();
  const [selectedChild, setSelectedChild] = useState(mockChildren[0].id);
  const [activeTab, setActiveTab] = useState('overview');

  const handleReturnToDashboard = () => {
    navigate('/parent-dashboard');
  };

  const selectedChildData = mockChildren.find(child => child.id === selectedChild);

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
                    onClick={handleReturnToDashboard}
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full bg-white/20 text-white hover:bg-white/30 hover:text-white"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <h1 className="text-3xl font-bold text-white">Progress Reports</h1>
                </div>
                <p className="text-white/90 mt-2 ml-10">
                  Track your child's learning journey and achievements
                </p>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute right-6 top-6 w-24 h-24 bg-white/10 rounded-full"></div>
            <div className="absolute right-16 bottom-0 w-16 h-16 bg-white/5 rounded-full"></div>
            <div className="absolute left-1/2 top-1/3 w-8 h-8 bg-white/10 rounded-full"></div>
          </motion.div>
          
          {/* Child selector and tabs */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <Select value={selectedChild} onValueChange={setSelectedChild}>
                <SelectTrigger className="w-full md:w-60">
                  <SelectValue placeholder="Select a child" />
                </SelectTrigger>
                <SelectContent>
                  {mockChildren.map(child => (
                    <SelectItem key={child.id} value={child.id}>
                      {child.name} ({child.grade})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Content based on selected tab */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-8">
                <TabsTrigger value="overview" className="px-4 py-2">
                  Overview
                </TabsTrigger>
                <TabsTrigger value="subjects" className="px-4 py-2">
                  Subjects
                </TabsTrigger>
                <TabsTrigger value="achievements" className="px-4 py-2">
                  Achievements
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Overall progress card */}
                  <Card className="col-span-1 md:col-span-1 shadow-md border-amber-100">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <BarChart2 className="h-5 w-5 text-amber-500" />
                        Overall Progress
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col items-center justify-center py-6">
                        <div className="relative h-36 w-36">
                          <svg className="w-full h-full" viewBox="0 0 100 100">
                            <circle 
                              cx="50" 
                              cy="50" 
                              r="40" 
                              fill="none" 
                              stroke="#f3f4f6" 
                              strokeWidth="10" 
                            />
                            <circle 
                              cx="50" 
                              cy="50" 
                              r="40" 
                              fill="none" 
                              stroke="#f59e0b" 
                              strokeWidth="10" 
                              strokeDasharray={2 * Math.PI * 40}
                              strokeDashoffset={2 * Math.PI * 40 * (1 - 0.72)} 
                              strokeLinecap="round"
                              transform="rotate(-90 50 50)"
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center flex-col">
                            <span className="text-3xl font-bold text-gray-800">72%</span>
                            <span className="text-xs text-gray-500">Completed</span>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2 w-full mt-6">
                          <div className="flex flex-col items-center">
                            <div className="bg-green-100 p-2 rounded-full">
                              <CheckCircle2 className="h-5 w-5 text-green-600" />
                            </div>
                            <span className="text-xs mt-1 text-gray-600">Completed</span>
                            <span className="font-medium">72%</span>
                          </div>
                          <div className="flex flex-col items-center">
                            <div className="bg-amber-100 p-2 rounded-full">
                              <Clock className="h-5 w-5 text-amber-600" />
                            </div>
                            <span className="text-xs mt-1 text-gray-600">In Progress</span>
                            <span className="font-medium">18%</span>
                          </div>
                          <div className="flex flex-col items-center">
                            <div className="bg-gray-100 p-2 rounded-full">
                              <AlertCircle className="h-5 w-5 text-gray-600" />
                            </div>
                            <span className="text-xs mt-1 text-gray-600">Not Started</span>
                            <span className="font-medium">10%</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Weekly progress card */}
                  <Card className="col-span-1 md:col-span-2 shadow-md border-amber-100">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-amber-500" />
                        Weekly Activity
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="py-4">
                        <div className="flex items-end h-48 gap-4">
                          {mockWeeklyProgress.map((day, index) => (
                            <div key={index} className="flex-1 flex flex-col items-center gap-2">
                              <div 
                                className="bg-amber-500 w-full rounded-t-md" 
                                style={{ 
                                  height: `${(day.completed / 7) * 100}%`,
                                  minHeight: day.completed > 0 ? '10%' : '5%',
                                  opacity: day.completed > 0 ? 1 : 0.3
                                }}
                              ></div>
                              <span className="text-xs text-gray-600">{day.day.substring(0, 3)}</span>
                              <span className="text-sm font-medium">{day.completed}</span>
                            </div>
                          ))}
                        </div>
                        <div className="flex justify-between mt-6 text-sm text-gray-500 border-t pt-3">
                          <span>Total tasks completed this week: 22</span>
                          <span>Daily average: 3.1</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Recent achievement card */}
                  <Card className="col-span-1 md:col-span-3 shadow-md border-amber-100">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Award className="h-5 w-5 text-amber-500" />
                        Recent Achievements
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
                        {mockAchievements.map(achievement => (
                          <div key={achievement.id} className="bg-amber-50 rounded-lg p-4 flex items-start gap-3">
                            <div className="text-3xl">{achievement.icon}</div>
                            <div>
                              <h3 className="font-semibold text-gray-800">{achievement.title}</h3>
                              <p className="text-sm text-gray-600 mt-1">{achievement.description}</p>
                              <div className="text-xs text-amber-700 mt-2">
                                Achieved on {new Date(achievement.date).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="subjects">
                <div className="grid grid-cols-1 gap-6">
                  {mockSubjects.map(subject => (
                    <motion.div 
                      key={subject.id} 
                      variants={itemVariants}
                    >
                      <Card className="shadow-md hover:shadow-lg transition-shadow border-amber-100">
                        <CardContent className="pt-6">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-amber-100 rounded-lg">
                                <BookOpen className="h-5 w-5 text-amber-600" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-lg text-gray-800">{subject.name}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                  <ProgressStatus status="completed" value={subject.completed} />
                                  <ProgressStatus status="in-progress" value={subject.inProgress} />
                                  <ProgressStatus status="not-started" value={subject.notStarted} />
                                </div>
                              </div>
                            </div>
                            
                            <div className="w-full md:w-1/2">
                              <div className="flex justify-between mb-1">
                                <span className="text-xs text-gray-500">Overall Progress</span>
                                <span className="text-xs font-medium text-amber-600">{subject.completed}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div 
                                  className="bg-amber-500 h-2.5 rounded-full" 
                                  style={{ width: `${subject.completed}%` }}
                                ></div>
                              </div>
                            </div>
                            
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="border-amber-200 text-amber-700 hover:bg-amber-50"
                            >
                              View Details
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="achievements">
                <Card className="shadow-md border-amber-100">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-amber-500" />
                      All Achievements
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {/* Earned achievements */}
                      {mockAchievements.map(achievement => (
                        <motion.div 
                          key={achievement.id} 
                          variants={itemVariants}
                          className="bg-amber-50 border border-amber-100 rounded-lg p-5"
                        >
                          <div className="flex items-start gap-4">
                            <div className="text-4xl">{achievement.icon}</div>
                            <div>
                              <h3 className="font-semibold text-gray-800">{achievement.title}</h3>
                              <p className="text-sm text-gray-600 mt-1">{achievement.description}</p>
                              <div className="mt-3 flex items-center gap-1 text-xs text-green-600">
                                <CheckCircle2 className="h-3 w-3" />
                                <span>Earned on {new Date(achievement.date).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                      
                      {/* Locked achievements */}
                      <motion.div 
                        variants={itemVariants}
                        className="bg-gray-50 border border-gray-200 rounded-lg p-5 opacity-70"
                      >
                        <div className="flex items-start gap-4">
                          <div className="text-4xl">🔬</div>
                          <div>
                            <h3 className="font-semibold text-gray-700">Science Whiz</h3>
                            <p className="text-sm text-gray-500 mt-1">Complete 10 science lessons with perfect scores</p>
                            <div className="mt-3 flex items-center gap-1 text-xs text-amber-600">
                              <Bookmark className="h-3 w-3" />
                              <span>Progress: 7/10 completed</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                      
                      <motion.div 
                        variants={itemVariants}
                        className="bg-gray-50 border border-gray-200 rounded-lg p-5 opacity-70"
                      >
                        <div className="flex items-start gap-4">
                          <div className="text-4xl">🥇</div>
                          <div>
                            <h3 className="font-semibold text-gray-700">Top Performer</h3>
                            <p className="text-sm text-gray-500 mt-1">Maintain 95%+ average across all subjects for a month</p>
                            <div className="mt-3 flex items-center gap-1 text-xs text-amber-600">
                              <Bookmark className="h-3 w-3" />
                              <span>Progress: 92% current average</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default ParentProgressReports; 