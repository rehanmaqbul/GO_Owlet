import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { fadeIn } from '@/lib/animations';
import { useNavigate } from 'react-router-dom';
import { Subject } from '@/lib/types';
import { Calendar as CalendarIcon, ChevronDown, Search, Filter, ArrowRight } from 'lucide-react';
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

const CheckTasksPage = () => {
  const navigate = useNavigate();
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedTimeframe, setSelectedTimeframe] = useState('Today');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubjects, setSelectedSubjects] = useState<SubjectItem[]>([]);
  const [showSubmissionDetails, setShowSubmissionDetails] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [showGradeFilter, setShowGradeFilter] = useState(false);
  
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
    if (selectedSubjects.length === 0) return;
    
    // Use a known subject ID from our mock data
    const subjectIdToUse = selectedSubjects.length > 0 ? 
      selectedSubjects.map(s => s.id).join(',') : 
      'subject-1';
    
    // Navigate to the task details page with our subject ID
    navigate(`/task-details?subjects=${subjectIdToUse}`);
  };
  
  const handleSubjectClick = (subject: SubjectItem) => {
    if (selectedSubjects.find(s => s.id === subject.id)) {
      setSelectedSubjects(selectedSubjects.filter(s => s.id !== subject.id));
    } else {
      setSelectedSubjects([...selectedSubjects, subject]);
    }
    
    if (selectedSubjects.length > 0) {
    setShowSubmissionDetails(true);
    }
  };

  const isSubjectSelected = (subjectId: string) => {
    return selectedSubjects.some(s => s.id === subjectId);
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
          {/* Header */}
          <motion.div variants={itemAnimation} className="mb-6">
            <h1 className="text-2xl font-bold text-owl-slate-dark">Check Tasks</h1>
            <p className="text-sm text-owl-slate">Review and grade student submissions</p>
          </motion.div>
          
          {/* Grade Buttons */}
          <motion.div variants={itemAnimation} className="bg-white rounded-lg shadow-sm p-4">
            <h2 className="text-sm font-medium text-gray-500 mb-3">Select Grade:</h2>
            <ScrollArea className="h-20 w-full pr-4">
              <div className="flex flex-wrap gap-2">
                  {grades.map((grade) => (
                  <Button
                    key={grade}
                    variant="outline"
                    size="sm"
                    className={`h-8 px-3 whitespace-nowrap ${selectedGrade === grade ? 'bg-indigo-100 text-indigo-700 border-indigo-200' : 'border-gray-200'}`}
                    onClick={() => handleGradeClick(grade)}
                  >
                      {grade}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </motion.div>
          
          {/* Search and Time Period */}
          <motion.div variants={itemAnimation} className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              {/* Search Input */}
              <div className="flex-1 relative">
                <Input
                  placeholder="Search student by name"
                  className="h-10 pl-9"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>
            
            {/* Time Period */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-gray-500 mr-1">Time period:</span>
                  {timeframeOptions.map((option) => (
                <Button
                  key={option}
                  variant="outline"
                  size="sm"
                  className={`h-8 px-3 ${selectedTimeframe === option ? 'bg-indigo-100 text-indigo-700 border-indigo-200' : 'border-gray-200'}`}
                  onClick={() => handleTimeframeClick(option)}
                >
                      {option}
                </Button>
              ))}
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className={`h-8 px-3 border-gray-200 ${selectedTimeframe === 'Custom' ? 'bg-indigo-100 text-indigo-700 border-indigo-200' : ''}`}
                  >
                    <CalendarIcon className="mr-2 h-3.5 w-3.5" />
                    {date ? format(date, "MMM d, yyyy") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleCustomDateSelect}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </motion.div>
          
          {/* Student search summary */}
          {searchQuery && (
            <motion.div 
              variants={itemAnimation}
              className="bg-indigo-50 rounded-lg p-3 text-indigo-700 flex items-center justify-between"
            >
              <span className="font-medium">
                Student: <strong>"{searchQuery}"</strong> - Total Tasks {selectedTimeframe}: {totalAssigned} assigned, {totalCompleted} completed
              </span>
              <Badge variant="outline" className="bg-white">
                {Math.round((totalCompleted / Math.max(totalAssigned, 1)) * 100)}% completion
              </Badge>
            </motion.div>
          )}
          
          {/* Subjects Grid */}
          {(selectedGrade || searchQuery) && (
            <motion.div variants={itemAnimation} className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium text-owl-slate-dark">
                  {searchQuery ? `Subjects for "${searchQuery}"` : `Subjects for ${selectedGrade}`}
                </h2>
              </div>
              
              <motion.div 
                variants={containerAnimation}
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3"
              >
                {filteredSubjects.map((subject) => (
                  <motion.button
                key={subject.id}
                    variants={itemAnimation}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex flex-col items-center justify-between p-4 shadow-sm rounded-lg text-sm transition-colors duration-200 ${
                  isSubjectSelected(subject.id) 
                        ? 'bg-indigo-600 text-white border-none' 
                        : 'bg-white hover:bg-indigo-50 border border-gray-100'
                }`}
                onClick={() => handleSubjectClick(subject)}
              >
                    <span className="font-medium mb-2">{subject.name}</span>
                    <div className={`w-full space-y-1 text-xs ${isSubjectSelected(subject.id) ? 'text-white' : ''}`}>
                      <div className={`flex justify-between p-1 rounded ${isSubjectSelected(subject.id) ? 'bg-indigo-700' : 'bg-gray-50'}`}>
                        <span>Assigned:</span>
                        <span className="font-medium">{subject.assignedTasks}</span>
                      </div>
                      <div className={`flex justify-between p-1 rounded ${isSubjectSelected(subject.id) ? 'bg-indigo-700' : 'bg-gray-50'}`}>
                        <span>Completed:</span>
                        <span className="font-medium">{subject.completedTasks}</span>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </motion.div>
              
              {/* Show Details Button */}
              {selectedSubjects.length > 0 && (
                <motion.div 
                  variants={itemAnimation}
                  className="flex justify-center mt-6"
                >
                  <Button 
                    className="bg-indigo-600 hover:bg-indigo-700"
                    onClick={handleViewTaskDetails}
                  >
                    Show Details
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </motion.div>
              )}
            </motion.div>
          )}
          
          {/* Prompt when nothing is selected */}
          {!selectedGrade && !searchQuery && (
            <motion.div
              variants={itemAnimation}
              className="bg-white rounded-lg shadow-sm p-8 text-center mt-8"
            >
              <div className="mb-4 mx-auto w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center">
                <Filter className="h-8 w-8 text-indigo-400" />
          </div>
              <h3 className="text-lg font-medium text-owl-slate-dark mb-2">Select a Grade or Search for a Student</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                Choose a grade from the buttons above or search for a specific student to see their tasks and progress.
              </p>
            </motion.div>
          )}
          
          {/* Selected Subjects Details */}
          {selectedSubjects.length > 0 && showSubmissionDetails && (
            <motion.div 
              variants={itemAnimation}
              className="bg-white rounded-lg shadow-sm p-4 mt-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-medium text-owl-slate-dark">
                  Selected Subjects ({selectedSubjects.length})
                </h3>
                <Badge variant="outline" className="bg-indigo-50 text-indigo-700 text-xs">
                  {selectedTimeframe}
                </Badge>
              </div>
              
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <div className="bg-gray-50 px-3 py-1.5 rounded-md">
                    <span className="text-sm text-gray-500">Total Assigned:</span>
                    <span className="ml-2 font-medium text-indigo-700">{selectedSubjects.reduce((sum, s) => sum + s.assignedTasks, 0)}</span>
                  </div>
                  
                  <div className="bg-gray-50 px-3 py-1.5 rounded-md">
                    <span className="text-sm text-gray-500">Total Completed:</span>
                    <span className="ml-2 font-medium text-indigo-700">{selectedSubjects.reduce((sum, s) => sum + s.completedTasks, 0)}</span>
                  </div>
                  
                  <div className="bg-indigo-50 px-3 py-1.5 rounded-md">
                    <span className="text-sm text-indigo-700">Completion Rate:</span>
                    <span className="ml-2 font-medium text-indigo-700">
                      {Math.round((selectedSubjects.reduce((sum, s) => sum + s.completedTasks, 0) / 
                                   Math.max(selectedSubjects.reduce((sum, s) => sum + s.assignedTasks, 0), 1)) * 100)}%
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                  {selectedSubjects.map((subject) => (
                    <motion.div 
                      key={subject.id} 
                      className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                      whileHover={{ backgroundColor: 'rgba(79, 70, 229, 0.05)' }}
                    >
                      <div>
                        <p className="text-sm font-medium">{subject.name}</p>
                        <div className="flex mt-1 text-xs text-gray-500 space-x-3">
                          <span>Assigned: {subject.assignedTasks}</span>
                          <span>Completed: {subject.completedTasks}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default CheckTasksPage;
