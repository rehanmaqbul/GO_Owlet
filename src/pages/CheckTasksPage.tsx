import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { fadeIn } from '@/lib/animations';
import { useNavigate } from 'react-router-dom';
import { Subject } from '@/lib/types';
import { Calendar as CalendarIcon, ChevronDown, Search, Filter, ArrowRight, Mail, DownloadCloud, Pencil, FileText, User } from 'lucide-react';
import { grades } from '@/data/curriculum-data';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table";
import { CheckSquare, Copy, BookOpen, Mic, Image, CheckCircle, Clock, AlertCircle, RefreshCw } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SubjectItem {
  id: string;
  name: string;
  grade: string;
  assignedTasks: number;
  completedTasks: number;
}

const subjects: SubjectItem[] = [
  { id: 'subject-1', name: 'Science', grade: '5', assignedTasks: 12, completedTasks: 8 },
  { id: 'subject-2', name: 'Math', grade: '2', assignedTasks: 18, completedTasks: 15 },
  { id: 'subject-3', name: 'English', grade: '2', assignedTasks: 14, completedTasks: 9 },
  { id: 'subject-4', name: 'French', grade: '7', assignedTasks: 9, completedTasks: 6 },
  { id: 'subject-5', name: 'Chemistry', grade: '8', assignedTasks: 11, completedTasks: 10 },
  { id: 'subject-6', name: 'Biology', grade: '6', assignedTasks: 15, completedTasks: 12 },
  { id: 'subject-7', name: 'Physics', grade: '9', assignedTasks: 12, completedTasks: 8 },
  { id: 'subject-8', name: 'History', grade: '4', assignedTasks: 10, completedTasks: 5 },
  { id: 'subject-9', name: 'Geography', grade: '5', assignedTasks: 8, completedTasks: 7 },
  { id: 'subject-10', name: 'Computer Science', grade: '7', assignedTasks: 14, completedTasks: 11 },
  { id: 'subject-11', name: 'Art', grade: '3', assignedTasks: 6, completedTasks: 4 },
  { id: 'subject-12', name: 'Music', grade: '4', assignedTasks: 5, completedTasks: 3 },
  { id: 'subject-13', name: 'Physical Education', grade: '5', assignedTasks: 7, completedTasks: 7 },
  { id: 'subject-14', name: 'Social Studies', grade: '6', assignedTasks: 9, completedTasks: 6 },
  { id: 'subject-15', name: 'Drama', grade: '7', assignedTasks: 4, completedTasks: 3 },
  { id: 'subject-16', name: 'Economics', grade: '8', assignedTasks: 13, completedTasks: 9 },
];

const timeframeOptions = [
  "Today", 
  "This Week", 
  "This Month", 
  "Previous Week",
  "Previous Month"
];

const formatGradeDisplay = (grade: string) => {
  // Extract just the number from the grade for more compact display
  if (grade.includes(' ')) {
    const parts = grade.split(' ');
    return `G${parts[1]}`;
  }
  return grade;
};

const containerAnimation = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const itemAnimation = {
  hidden: { opacity: 0, y: 10 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24
    }
  }
};

// Define task types with icons
const taskTypes = [
  { id: 'mcq', name: 'Multiple Choice', icon: CheckSquare },
  { id: 'tf', name: 'True/False', icon: Copy },
  { id: 'reading', name: 'Reading', icon: BookOpen },
  { id: 'recording', name: 'Audio Recording', icon: Mic },
  { id: 'upload', name: 'Image Upload', icon: Image },
  { id: 'all', name: 'All Types', icon: FileText },
];

// Define status types with icons
const statusTypes = [
  { id: 'completed', name: 'Completed', icon: CheckCircle, color: 'bg-green-100 text-green-700' },
  { id: 'pending', name: 'Pending', icon: Clock, color: 'bg-amber-100 text-amber-700' },
  { id: 'overdue', name: 'Overdue', icon: AlertCircle, color: 'bg-red-100 text-red-700' },
  { id: 'resubmitted', name: 'Resubmitted', icon: RefreshCw, color: 'bg-blue-100 text-blue-700' },
  { id: 'all', name: 'All Status', icon: FileText, color: 'bg-gray-100 text-gray-700' },
];

// Task interface
interface Task {
  id: string;
  name: string;
  subject: string;
  type: string;
  status: string;
  assignedDate: string;
  deadline: string;
  submittedDate?: string;
  grade?: number;
  student?: string;
  chapter?: string;
  lesson?: string;
  submissions?: number;
  totalStudents?: number;
}

// Mock tasks data
const mockTasks: Task[] = [
  {
    id: 'task-1',
    name: 'Chapter 3: Photosynthesis MCQ',
    subject: 'Science',
    type: 'mcq',
    status: 'completed',
    assignedDate: '2023-09-15',
    deadline: '2023-09-22',
    submittedDate: '2023-09-20',
    grade: 85,
    chapter: 'Chapter 3',
    lesson: 'Photosynthesis',
    submissions: 18,
    totalStudents: 25
  },
  {
    id: 'task-2',
    name: 'States of Matter: True/False Questions',
    subject: 'Science',
    type: 'tf',
    status: 'pending',
    assignedDate: '2023-09-18',
    deadline: '2023-09-25',
    chapter: 'Chapter 4',
    lesson: 'States of Matter',
    submissions: 12,
    totalStudents: 25
  },
  {
    id: 'task-3',
    name: 'Reading Comprehension: The Water Cycle',
    subject: 'Science',
    type: 'reading',
    status: 'overdue',
    assignedDate: '2023-09-10',
    deadline: '2023-09-17',
    chapter: 'Chapter 2',
    lesson: 'The Water Cycle',
    submissions: 20,
    totalStudents: 25
  },
  {
    id: 'task-4',
    name: 'Record Your Science Experiment',
    subject: 'Science',
    type: 'recording',
    status: 'resubmitted',
    assignedDate: '2023-09-05',
    deadline: '2023-09-12',
    submittedDate: '2023-09-14',
    chapter: 'Chapter 1',
    lesson: 'Scientific Method',
    submissions: 22,
    totalStudents: 25
  },
  {
    id: 'task-5',
    name: 'Upload Your Lab Results',
    subject: 'Science',
    type: 'upload',
    status: 'completed',
    assignedDate: '2023-08-28',
    deadline: '2023-09-04',
    submittedDate: '2023-09-02',
    grade: 92,
    chapter: 'Chapter 1',
    lesson: 'Laboratory Safety',
    submissions: 25,
    totalStudents: 25
  }
];

const CheckTasksPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedTimeframe, setSelectedTimeframe] = useState('Today');
  const [searchQuery, setSearchQuery] = useState('');
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [showGradeFilter, setShowGradeFilter] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [taskList, setTaskList] = useState<Task[]>(mockTasks);
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  
  // Report generation states
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [reportScope, setReportScope] = useState('class');
  const [reportContent, setReportContent] = useState('completion');
  const [reportFormat, setReportFormat] = useState('pdf');
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  
  // View mode and student selection
  const [viewMode, setViewMode] = useState<'grade' | 'student'>('grade');
  const [selectedStudent, setSelectedStudent] = useState<string>('');

  // Mock student data
  const mockStudents = [
    { id: 'student-1', name: 'Alex Johnson', grade: 'Grade 5', tasks: mockTasks.map(task => ({ ...task, status: Math.random() > 0.5 ? 'completed' : 'pending' })) },
    { id: 'student-2', name: 'Sarah Williams', grade: 'Grade 5', tasks: mockTasks.map(task => ({ ...task, status: Math.random() > 0.5 ? 'completed' : 'pending' })) },
    { id: 'student-3', name: 'Michael Brown', grade: 'Grade 5', tasks: mockTasks.map(task => ({ ...task, status: Math.random() > 0.5 ? 'completed' : 'overdue' })) },
    { id: 'student-4', name: 'Emily Davis', grade: 'Grade 5', tasks: mockTasks.map(task => ({ ...task, status: Math.random() > 0.5 ? 'completed' : 'pending' })) },
  ];

  // Filter students based on selected grade
  const filteredStudents = selectedGrade 
    ? mockStudents.filter(student => student.grade === selectedGrade)
    : mockStudents;

  // Get tasks for selected student
  const getStudentTasks = (studentId: string) => {
    const student = mockStudents.find(s => s.id === studentId);
    return student ? student.tasks : [];
  };

  // Effect to update subject data based on selected timeframe
  useEffect(() => {
    // In a real app, this would fetch data from the server
    // For this demo, we'll just make the component re-render
    console.log(`Timeframe selected: ${selectedTimeframe}`);
  }, [selectedTimeframe]);
  
  // Effect to filter subjects when search query changes
  useEffect(() => {
    if (searchQuery) {
      // Reset selected grade when searching for a student
      setSelectedGrade('');
    }
  }, [searchQuery]);

  const handleViewTaskDetails = () => {
    if (subjects.length === 0) return;
    
    // Use a known subject ID from our mock data
    const subjectIdToUse = subjects.length > 0 ? 
      subjects.map(s => s.id).join(',') : 
      'subject-1';
    
    // Navigate to the task details page with our subject ID
    navigate(`/task-details?subjects=${subjectIdToUse}`);
  };
  
  const handleSubjectClick = (subject: SubjectItem) => {
    // This function is no longer used in the new implementation
  };

  const isSubjectSelected = (subjectId: string) => {
    // This function is no longer used in the new implementation
    return false;
  };

  const handleGradeClick = (grade: string) => {
    // Clear search when selecting a grade
    setSearchQuery('');
    setSelectedGrade(grade === selectedGrade ? '' : grade);
  };

  const handleTimeframeClick = (timeframe: string) => {
    setSelectedTimeframe(timeframe);
  };

  const handleCustomDateSelect = (date: Date | undefined) => {
    if (date) {
      setDate(date);
      setSelectedTimeframe('Custom');
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    // When searching, we should reset grade selection
    if (e.target.value) {
      setSelectedGrade('');
    }
  };

  // Filter subjects based on grade or search
  const filteredSubjects = searchQuery
    ? subjects.filter(subject => 
        // Simulate searching for student names (in a real app, this would query student data)
        // For demo, we'll just show some random subjects as if they were completed by the searched student
        Math.random() > 0.5)
    : selectedGrade 
      ? subjects.filter(subject => subject.grade === selectedGrade.replace('Grade ', ''))
      : [];

  // Get total stats for display
  const totalAssigned = filteredSubjects.reduce((sum, subj) => sum + subj.assignedTasks, 0);
  const totalCompleted = filteredSubjects.reduce((sum, subj) => sum + subj.completedTasks, 0);
  
  const handleTaskRowClick = (taskId: string) => {
    setExpandedTaskId(taskId === expandedTaskId ? null : taskId);
  };

  const handleViewTask = (taskId: string) => {
    navigate(`/view-submissions/${taskId}`);
  };

  const handleSendReminder = (taskId: string) => {
    navigate(`/send-reminder/${taskId}`);
  };

  const handleEditDeadline = (taskId: string) => {
    navigate(`/edit-deadline/${taskId}`);
  };

  // Helper to get the status badge
  const getStatusBadge = (status: string): React.ReactNode => {
    const statusInfo = statusTypes.find(s => s.id === status);
    if (!statusInfo) return null;
    
    const StatusIcon = statusInfo.icon;
    
    return (
      <Badge variant="outline" className={`${statusInfo.color} flex items-center gap-1 px-2`}>
        <StatusIcon className="h-3 w-3" />
        <span>{statusInfo.name}</span>
      </Badge>
    );
  };

  // Helper to get the task type icon
  const getTaskTypeIcon = (type: string): React.ReactNode => {
    const typeInfo = taskTypes.find(t => t.id === type);
    if (!typeInfo) return null;
    
    const TypeIcon = typeInfo.icon;
    
    return (
      <div className="flex items-center gap-2">
        <TypeIcon className="h-4 w-4 text-gray-500" />
        <span>{typeInfo.name}</span>
      </div>
    );
  };

  // Handle report generation
  const handleGenerateReport = () => {
    setShowReportDialog(true);
  };

  const handleReportSubmit = () => {
    setIsGeneratingReport(true);
    
    // Simulate report generation
    setTimeout(() => {
      setIsGeneratingReport(false);
      setShowReportDialog(false);
      
      toast({
        title: "Report Generated",
        description: `Your ${reportFormat.toUpperCase()} report has been generated and is ready for download.`,
        duration: 5000,
      });
    }, 2000);
  };

  // Update search placeholder based on view mode
  const getSearchPlaceholder = () => {
    if (viewMode === 'student') {
      return "Search by student name or roll number...";
    }
    return "Search tasks...";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-owl-neutral-lighter to-white">
      <Navbar />
      
      <main className="pt-24 px-4 pb-12 max-w-7xl mx-auto">
        <motion.div 
          className="space-y-6" 
          initial="hidden"
          animate="show"
          variants={containerAnimation}
        >
          {/* Header with View Mode Toggle */}
          <motion.div variants={itemAnimation} className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-owl-slate-dark">Check Tasks</h1>
              <p className="text-sm text-owl-slate">Review and grade student submissions</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-white rounded-lg shadow-sm p-1 inline-flex">
                <Button
                  variant={viewMode === 'grade' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => {
                    setViewMode('grade');
                    setSearchQuery('');
                    setSelectedStudent('');
                  }}
                  className={viewMode === 'grade' ? 'bg-amber-100 text-amber-700' : ''}
                >
                  Grade View
                </Button>
                <Button
                  variant={viewMode === 'student' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => {
                    setViewMode('student');
                    setSelectedGrade('');
                  }}
                  className={viewMode === 'student' ? 'bg-amber-100 text-amber-700' : ''}
                >
                  Student View
                </Button>
              </div>
              <Button 
                variant="outline" 
                onClick={() => navigate('/generate-report')}
                className="flex items-center space-x-2"
              >
                <FileText className="h-4 w-4" />
                <span>Generate Report</span>
              </Button>
            </div>
          </motion.div>
          
          {/* Filters Section */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {viewMode === 'grade' ? (
              // Grade selection for Grade View
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Grade</label>
                <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Select Grade" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[200px] bg-white">
                    <ScrollArea className="h-[180px]">
                      <SelectGroup>
                        <SelectLabel className="text-gray-500 font-medium">Grades</SelectLabel>
                        {grades.map((grade) => (
                          <SelectItem 
                            key={grade} 
                            value={grade}
                            className="py-1.5 hover:bg-gray-100 focus:bg-gray-100 cursor-pointer"
                          >
                            {grade}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </ScrollArea>
                  </SelectContent>
                </Select>
              </div>
            ) : (
              // Student search for Student View
              <div className="space-y-2">
                <label className="text-sm font-medium">Search Student</label>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder={getSearchPlaceholder()}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 h-10"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium">Timeframe</label>
              <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Select timeframe" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectGroup>
                    <SelectLabel className="text-gray-500 font-medium">Timeframes</SelectLabel>
                    {timeframeOptions.map((timeframe) => (
                      <SelectItem 
                        key={timeframe} 
                        value={timeframe}
                        className="hover:bg-gray-100 focus:bg-gray-100 cursor-pointer"
                      >
                        {timeframe}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Task Search</label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 h-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full h-10 justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Prompt when no selection */}
          {!selectedGrade && viewMode === 'grade' && !searchQuery && (
            <motion.div
              variants={itemAnimation}
              className="bg-white rounded-lg shadow-sm p-5 text-center mt-4"
            >
              <div className="flex items-center justify-center">
                <Filter className="h-5 w-5 text-amber-400 mr-2" />
                <p className="text-sm text-owl-slate-dark">
                  Please select a grade to view tasks
                </p>
              </div>
            </motion.div>
          )}

          {!searchQuery && viewMode === 'student' && (
            <motion.div
              variants={itemAnimation}
              className="bg-white rounded-lg shadow-sm p-5 text-center mt-4"
            >
              <div className="flex items-center justify-center">
                <Search className="h-5 w-5 text-amber-400 mr-2" />
                <p className="text-sm text-owl-slate-dark">
                  Search for a student by name or roll number
                </p>
              </div>
            </motion.div>
          )}

          {/* Rest of the existing content */}
          {((viewMode === 'grade' && selectedGrade) || (viewMode === 'student' && searchQuery)) && (
            <>
              {/* Task Status Tabs */}
              <motion.div variants={itemAnimation}>
                <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
                  <TabsList className="bg-white shadow-sm border border-gray-100 p-1 rounded-lg">
                    <TabsTrigger 
                      value="all" 
                      className="data-[state=active]:bg-amber-100 data-[state=active]:text-amber-700"
                    >
                      All Tasks
                    </TabsTrigger>
                    <TabsTrigger 
                      value="pending" 
                      className="data-[state=active]:bg-amber-100 data-[state=active]:text-amber-700"
                    >
                      Pending
                    </TabsTrigger>
                    <TabsTrigger 
                      value="completed" 
                      className="data-[state=active]:bg-amber-100 data-[state=active]:text-amber-700"
                    >
                      Completed
                    </TabsTrigger>
                    <TabsTrigger 
                      value="overdue" 
                      className="data-[state=active]:bg-amber-100 data-[state=active]:text-amber-700"
                    >
                      Overdue
                    </TabsTrigger>
                  </TabsList>
                  
                  {/* Task List tabs content */}
                  <TabsContent value="all" className="mt-4">
                    <TaskListContent 
                      tasks={viewMode === 'grade' ? taskList : getStudentTasks(selectedStudent)}
                      expandedTaskId={expandedTaskId}
                      onTaskRowClick={handleTaskRowClick}
                      onViewTask={handleViewTask}
                      onSendReminder={handleSendReminder}
                      onEditDeadline={handleEditDeadline}
                      getStatusBadge={getStatusBadge}
                      getTaskTypeIcon={getTaskTypeIcon}
                      viewMode={viewMode}
                      students={filteredStudents}
                      selectedStudent={selectedStudent}
                      onStudentSelect={setSelectedStudent}
                    />
                  </TabsContent>
                  
                  <TabsContent value="pending" className="mt-4">
                    <TaskListContent 
                      tasks={taskList.filter(task => task.status === 'pending')}
                      expandedTaskId={expandedTaskId}
                      onTaskRowClick={handleTaskRowClick}
                      onViewTask={handleViewTask}
                      onSendReminder={handleSendReminder}
                      onEditDeadline={handleEditDeadline}
                      getStatusBadge={getStatusBadge}
                      getTaskTypeIcon={getTaskTypeIcon}
                      viewMode={viewMode}
                      students={filteredStudents}
                      selectedStudent={selectedStudent}
                      onStudentSelect={setSelectedStudent}
                    />
                  </TabsContent>
                  
                  <TabsContent value="completed" className="mt-4">
                    <TaskListContent 
                      tasks={taskList.filter(task => task.status === 'completed')}
                      expandedTaskId={expandedTaskId}
                      onTaskRowClick={handleTaskRowClick}
                      onViewTask={handleViewTask}
                      onSendReminder={handleSendReminder}
                      onEditDeadline={handleEditDeadline}
                      getStatusBadge={getStatusBadge}
                      getTaskTypeIcon={getTaskTypeIcon}
                      viewMode={viewMode}
                      students={filteredStudents}
                      selectedStudent={selectedStudent}
                      onStudentSelect={setSelectedStudent}
                    />
                  </TabsContent>
                  
                  <TabsContent value="overdue" className="mt-4">
                    <TaskListContent 
                      tasks={taskList.filter(task => task.status === 'overdue')}
                      expandedTaskId={expandedTaskId}
                      onTaskRowClick={handleTaskRowClick}
                      onViewTask={handleViewTask}
                      onSendReminder={handleSendReminder}
                      onEditDeadline={handleEditDeadline}
                      getStatusBadge={getStatusBadge}
                      getTaskTypeIcon={getTaskTypeIcon}
                      viewMode={viewMode}
                      students={filteredStudents}
                      selectedStudent={selectedStudent}
                      onStudentSelect={setSelectedStudent}
                    />
                  </TabsContent>
                </Tabs>
              </motion.div>
              
              {/* Progress Dashboard */}
              <motion.div variants={itemAnimation} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Class Progress Card */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Class Progress</CardTitle>
                    <CardDescription>Overall class performance</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Tasks Completed</span>
                          <span className="font-medium">75%</span>
                        </div>
                        <Progress value={75} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Average Score</span>
                          <span className="font-medium">83%</span>
                        </div>
                        <Progress value={83} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>On-time Submissions</span>
                          <span className="font-medium">92%</span>
                        </div>
                        <Progress value={92} className="h-2" />
                      </div>
                      
                      <div className="pt-2 flex justify-center">
                        <div className="grid grid-cols-2 gap-4 w-full">
                          <div className="text-center p-2 bg-amber-50 rounded-md">
                            <div className="text-amber-700 font-semibold text-xl">42</div>
                            <div className="text-xs text-gray-500">Total Tasks</div>
                          </div>
                          <div className="text-center p-2 bg-green-50 rounded-md">
                            <div className="text-green-700 font-semibold text-xl">5</div>
                            <div className="text-xs text-gray-500">Day Streak</div>
                          </div>
                        </div>
                  </div>
                </div>
                  </CardContent>
                </Card>
                
                {/* Performance by Task Type */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Performance by Task Type</CardTitle>
                    <CardDescription>Completion rates by activity type</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <div className="flex items-center gap-2">
                            <CheckSquare className="h-4 w-4 text-blue-600" />
                            <span>Multiple Choice</span>
                          </div>
                          <span className="font-medium">92%</span>
                        </div>
                        <Progress value={92} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <div className="flex items-center gap-2">
                            <Copy className="h-4 w-4 text-green-600" />
                            <span>True/False</span>
                          </div>
                          <span className="font-medium">88%</span>
                        </div>
                        <Progress value={88} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <div className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4 text-purple-600" />
                            <span>Reading</span>
                          </div>
                          <span className="font-medium">75%</span>
                        </div>
                        <Progress value={75} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <div className="flex items-center gap-2">
                            <Mic className="h-4 w-4 text-red-600" />
                            <span>Recording</span>
                          </div>
                          <span className="font-medium">65%</span>
                        </div>
                        <Progress value={65} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                      <div className="flex items-center gap-2">
                            <Image className="h-4 w-4 text-amber-600" />
                            <span>Image Upload</span>
                          </div>
                          <span className="font-medium">70%</span>
                        </div>
                        <Progress value={70} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Recent Activity */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Recent Activity</CardTitle>
                    <CardDescription>Latest submissions and updates</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[230px] pr-4">
                      <div className="space-y-4">
                        <div className="flex gap-3 items-start">
                          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700">
                            <CheckCircle className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Alex Johnson submitted Math Quiz</p>
                            <p className="text-xs text-gray-500">10 minutes ago</p>
                          </div>
                        </div>
                        <div className="flex gap-3 items-start">
                          <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700">
                            <Clock className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Deadline approaching for Science Project</p>
                            <p className="text-xs text-gray-500">2 hours ago</p>
                          </div>
                        </div>
                        <div className="flex gap-3 items-start">
                          <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-700">
                            <CheckCircle className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">You graded 5 English assignments</p>
                            <p className="text-xs text-gray-500">Yesterday at 2:30 PM</p>
                          </div>
                        </div>
                        <div className="flex gap-3 items-start">
                          <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center text-red-700">
                            <AlertCircle className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">3 overdue assignments in History</p>
                            <p className="text-xs text-gray-500">Yesterday at 10:15 AM</p>
                          </div>
                        </div>
                        <div className="flex gap-3 items-start">
                          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700">
                            <RefreshCw className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Jamie Smith resubmitted Science task</p>
                            <p className="text-xs text-gray-500">2 days ago</p>
                          </div>
                        </div>
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </motion.div>
            </>
          )}
          
          {/* Report Generation Dialog */}
          <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Generate Report</DialogTitle>
                <DialogDescription>
                  Customize your report settings
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Report Scope</label>
                  <Select value={reportScope} onValueChange={setReportScope}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select scope" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="class">Class-wise</SelectItem>
                      <SelectItem value="student">Student-wise</SelectItem>
                      <SelectItem value="subject">Subject-wise</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Report Content</label>
                  <Select value={reportContent} onValueChange={setReportContent}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select content" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="completion">Completion Rates</SelectItem>
                      <SelectItem value="scores">Scores & Grades</SelectItem>
                      <SelectItem value="overdue">Overdue Tasks</SelectItem>
                      <SelectItem value="comprehensive">Comprehensive (All Data)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Report Format</label>
                  <Select value={reportFormat} onValueChange={setReportFormat}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF Document</SelectItem>
                      <SelectItem value="xlsx">Excel Spreadsheet</SelectItem>
                      <SelectItem value="csv">CSV File</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowReportDialog(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleReportSubmit}
                  className="bg-amber-600 hover:bg-amber-700"
                  disabled={isGeneratingReport}
                >
                  {isGeneratingReport ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <DownloadCloud className="mr-2 h-4 w-4" />
                      Generate Report
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </motion.div>
      </main>
    </div>
  );
};

// Task List Table Component
interface TaskListContentProps {
  tasks: Task[];
  expandedTaskId: string | null;
  onTaskRowClick: (taskId: string) => void;
  onViewTask: (taskId: string) => void;
  onSendReminder: (taskId: string) => void;
  onEditDeadline: (taskId: string) => void;
  getStatusBadge: (status: string) => React.ReactNode;
  getTaskTypeIcon: (type: string) => React.ReactNode;
  viewMode: 'grade' | 'student';
  students?: typeof mockStudents;
  selectedStudent?: string;
  onStudentSelect?: (studentId: string) => void;
}

const TaskListContent = ({ 
  tasks, 
  expandedTaskId, 
  onTaskRowClick, 
  onViewTask, 
  onSendReminder,
  onEditDeadline,
  getStatusBadge,
  getTaskTypeIcon,
  viewMode,
  students,
  selectedStudent,
  onStudentSelect
}: TaskListContentProps) => {
  if (viewMode === 'student' && (!students || students.length === 0)) {
    return (
      <div className="bg-white rounded-lg p-8 text-center">
        <div className="mb-4 mx-auto w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center">
          <FileText className="h-8 w-8 text-amber-400" />
        </div>
        <h3 className="text-lg font-medium text-owl-slate-dark mb-2">No Students Found</h3>
        <p className="text-gray-500 max-w-md mx-auto">
          No students match your current grade selection. Try selecting a different grade.
        </p>
      </div>
    );
  }

  if (viewMode === 'student') {
    return (
      <div className="space-y-4">
        {/* Student Selection */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-lg font-medium mb-4">Select Student</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {students?.map((student) => (
              <div
                key={student.id}
                className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                  selectedStudent === student.id
                    ? 'border-amber-500 bg-amber-50'
                    : 'border-gray-200 hover:border-amber-500 hover:bg-amber-50'
                }`}
                onClick={() => onStudentSelect?.(student.id)}
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
                    <User className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-medium">{student.name}</p>
                    <p className="text-sm text-gray-500">{student.grade}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Show tasks table only if a student is selected */}
        {selectedStudent && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 bg-amber-50 border-b border-amber-100">
              <h3 className="font-medium">
                Tasks for {students?.find(s => s.id === selectedStudent)?.name}
              </h3>
            </div>
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="w-[300px]">Task Name</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Deadline</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks.map((task) => (
                  <>
                    <TableRow 
                      key={task.id}
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => onTaskRowClick(task.id)}
                    >
                      <TableCell className="font-medium">{task.name}</TableCell>
                      <TableCell>{task.subject}</TableCell>
                      <TableCell>{getTaskTypeIcon(task.type)}</TableCell>
                      <TableCell>{getStatusBadge(task.status)}</TableCell>
                      <TableCell className="text-right">
                        {format(new Date(task.deadline), 'MMM d, yyyy')}
                      </TableCell>
                    </TableRow>

                    {/* Expanded View */}
                    {expandedTaskId === task.id && (
                      <TableRow className="bg-gray-50">
                        <TableCell colSpan={5} className="p-0">
                          <div className="p-4">
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <h3 className="text-lg font-medium">{task.name}</h3>
                                <p className="text-sm text-gray-500">
                                  {task.chapter} - {task.lesson}
                                </p>
                              </div>
                              <div className="flex gap-2">
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  className="bg-amber-600 text-white hover:bg-amber-700"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onViewTask(task.id);
                                  }}
                                >
                                  <FileText className="h-4 w-4 mr-2" />
                                  View Submission
                                </Button>
                                {task.status !== 'completed' && (
                                  <>
                                    <Button 
                                      size="sm" 
                                      variant="outline"
                                      className="bg-indigo-600 text-white hover:bg-indigo-700"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        onEditDeadline(task.id);
                                      }}
                                    >
                                      <Pencil className="h-4 w-4 mr-2" />
                                      Edit Deadline
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      variant="outline"
                                      className="bg-amber-600 text-white hover:bg-amber-700"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        onSendReminder(task.id);
                                      }}
                                    >
                                      <Mail className="h-4 w-4 mr-2" />
                                      Send Reminder
                                    </Button>
                                  </>
                                )}
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                              <div className="bg-gray-100 p-3 rounded-lg">
                                <p className="text-xs text-gray-500">Assigned Date</p>
                                <p className="font-medium">{format(new Date(task.assignedDate), 'MMM d, yyyy')}</p>
                              </div>
                              <div className="bg-gray-100 p-3 rounded-lg">
                                <p className="text-xs text-gray-500">Deadline</p>
                                <p className="font-medium">{format(new Date(task.deadline), 'MMM d, yyyy')}</p>
                              </div>
                              <div className="bg-gray-100 p-3 rounded-lg">
                                <p className="text-xs text-gray-500">Status</p>
                                <div className="mt-1">{getStatusBadge(task.status)}</div>
                              </div>
                            </div>
                            
                            {/* Task Details */}
                            <div className="bg-white border border-gray-200 rounded-lg p-3">
                              <h4 className="text-sm font-medium mb-2">Task Details</h4>
                              <div className="text-sm text-gray-500 space-y-2">
                                <p>Subject: {task.subject}</p>
                                <p>Chapter: {task.chapter}</p>
                                <p>Lesson: {task.lesson}</p>
                                {task.submittedDate && (
                                  <p>Submitted: {format(new Date(task.submittedDate), 'MMM d, yyyy')}</p>
                                )}
                                {task.grade && (
                                  <p>Grade: {task.grade}%</p>
                                )}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    );
  }

  // Original grade view code
  if (tasks.length === 0) {
    return (
      <div className="bg-white rounded-lg p-8 text-center">
        <div className="mb-4 mx-auto w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center">
          <FileText className="h-8 w-8 text-amber-400" />
        </div>
        <h3 className="text-lg font-medium text-owl-slate-dark mb-2">No Tasks Found</h3>
        <p className="text-gray-500 max-w-md mx-auto">
          No tasks match your current filters. Try adjusting your filter criteria to see more results.
        </p>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="w-[300px]">Task Name</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-center">Submissions</TableHead>
            <TableHead className="text-right">Deadline</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <>
              <TableRow 
                key={task.id}
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => onTaskRowClick(task.id)}
              >
                <TableCell className="font-medium">{task.name}</TableCell>
                <TableCell>{task.subject}</TableCell>
                <TableCell>{getTaskTypeIcon(task.type)}</TableCell>
                <TableCell>{getStatusBadge(task.status)}</TableCell>
                <TableCell className="text-center">
                  {task.submissions}/{task.totalStudents}
                </TableCell>
                <TableCell className="text-right">
                  {format(new Date(task.deadline), 'MMM d, yyyy')}
                </TableCell>
              </TableRow>
              
              {/* Expanded View */}
              {expandedTaskId === task.id && (
                <TableRow className="bg-gray-50">
                  <TableCell colSpan={6} className="p-0">
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-medium">{task.name}</h3>
                          <p className="text-sm text-gray-500">
                            {task.chapter} - {task.lesson}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="bg-amber-600 text-white hover:bg-amber-700"
                            onClick={(e) => {
                              e.stopPropagation();
                              onViewTask(task.id);
                            }}
                          >
                            <FileText className="h-4 w-4 mr-2" />
                            View Submission
                          </Button>
                          {task.status !== 'completed' && (
                            <>
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="bg-indigo-600 text-white hover:bg-indigo-700"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onEditDeadline(task.id);
                                }}
                              >
                                <Pencil className="h-4 w-4 mr-2" />
                                Edit Deadline
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="bg-amber-600 text-white hover:bg-amber-700"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onSendReminder(task.id);
                                }}
                              >
                                <Mail className="h-4 w-4 mr-2" />
                                Send Reminder
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="bg-gray-100 p-3 rounded-lg">
                          <p className="text-xs text-gray-500">Assigned Date</p>
                          <p className="font-medium">{format(new Date(task.assignedDate), 'MMM d, yyyy')}</p>
                        </div>
                        <div className="bg-gray-100 p-3 rounded-lg">
                          <p className="text-xs text-gray-500">Deadline</p>
                          <p className="font-medium">{format(new Date(task.deadline), 'MMM d, yyyy')}</p>
                        </div>
                        <div className="bg-gray-100 p-3 rounded-lg">
                          <p className="text-xs text-gray-500">Submission Rate</p>
                          <div className="flex items-center gap-2">
                            <Progress value={(task.submissions! / task.totalStudents!) * 100} className="h-2 flex-1" />
                            <span className="text-sm font-medium">{Math.round((task.submissions! / task.totalStudents!) * 100)}%</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Student submissions preview would go here */}
                      <div className="bg-white border border-gray-200 rounded-lg p-3">
                        <h4 className="text-sm font-medium mb-2">Student Submissions Preview</h4>
                        <p className="text-sm text-gray-500">
                          Click "View Submission" to see detailed student submissions and provide feedback.
                        </p>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CheckTasksPage;
