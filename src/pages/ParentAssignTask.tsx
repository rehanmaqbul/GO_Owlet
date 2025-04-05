import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Users, 
  Book, 
  Briefcase, 
  ListChecks, 
  FileText, 
  Check, 
  FileImage, 
  PlusCircle, 
  Calendar,
  Wand2,
  Plus,
  ChevronDown,
  Edit,
  X,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { format, startOfWeek, addDays, addWeeks } from 'date-fns';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";

// Mock children data for demonstration - in a real app, this would come from the auth context or API
const mockChildren = [
  { id: 'child-1', name: 'Alex Smith', age: 10, grade: 'Grade 5', avatar: 'https://i.pravatar.cc/150?img=3' },
  { id: 'child-2', name: 'Jamie Johnson', age: 8, grade: 'Grade 3', avatar: 'https://i.pravatar.cc/150?img=5' },
];

// Mock subjects with chapters and lessons
const subjects = {
  'Mathematics': {
    chapters: {
      'Numbers': ['Addition', 'Subtraction', 'Multiplication', 'Division'],
      'Algebra': ['Variables', 'Equations', 'Inequalities', 'Functions'],
      'Geometry': ['Shapes', 'Angles', 'Area', 'Volume'],
    },
    color: 'blue'
  },
  'Science': {
    chapters: {
      'Physics': ['Forces', 'Energy', 'Motion', 'Waves'],
      'Chemistry': ['Atoms', 'Elements', 'Compounds', 'Reactions'],
      'Biology': ['Cells', 'Genetics', 'Ecosystems', 'Evolution'],
    },
    color: 'amber'
  },
  'English': {
    chapters: {
      'Grammar': ['Nouns', 'Verbs', 'Adjectives', 'Adverbs'],
      'Literature': ['Poetry', 'Prose', 'Drama', 'Novels'],
      'Writing': ['Essays', 'Stories', 'Reports', 'Letters'],
    },
    color: 'green'
  }
};

// Mock data for initial calendar display
const mockSubjectData = [
  {
    subject: 'Mathematics',
    chapter: 'Numbers',
    lesson: 'Addition',
    questionType: 'Practice Questions',
    description: 'Mix of MCQs, Yes/No, True/False, Fill in the blank and Multi-select',
  },
  {
    subject: 'Science',
    chapter: 'Physics',
    lesson: 'Energy',
    questionType: 'Practice Questions',
    description: 'Mix of MCQs, Yes/No, True/False, Fill in the blank and Multi-select',
  }
];

// Add question type categorization like in the Teacher component
// Group question types by category
const PRACTICE_QUESTION_TYPES: string[] = [
  'Practice Questions'
];

const ACTIVITY_QUESTION_TYPES: string[] = [
  'Read Out Loud',
  'Listen and Answer',
  'Story and Answer',
  'Do and Upload'
];

// Update the questionTypes array to include all types with descriptions
const questionTypes = [
  'Practice Questions',
  'Read Out Loud',
  'Listen and Answer',
  'Story and Answer',
  'Do and Upload'
];

const ParentAssignTask = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  // State for new task assignment flow
  const [selectedChildren, setSelectedChildren] = useState<string[]>([]);
  const [planDuration, setPlanDuration] = useState<string | null>(null);
  const [planCreationMethod, setPlanCreationMethod] = useState<string | null>(null);
  const [weekStarting, setWeekStarting] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [days, setDays] = useState<{date: Date, dayName: string}[]>([]);
  const [activeTab, setActiveTab] = useState<'create' | 'saved'>('create');
  const [savedPlans, setSavedPlans] = useState<Array<{
    id: string;
    title: string;
    planType: 'weekly' | 'monthly';
    createdAt: Date;
    children: string[];
    subjects: Record<string, Array<{
      id: string;
      subject: string;
      chapter: string;
      lesson: string;
      questionType: string;
    }>>;
    planCreationMethod: 'manual' | 'automatic';
    weekStarting: Date;
  }>>([]);
  // State to keep track if a subject has been added in manual mode
  const [hasAddedSubject, setHasAddedSubject] = useState<boolean>(false);
  
  // State for subject dialog
  const [isAddSubjectOpen, setIsAddSubjectOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<any | null>(null);
  const [selectedDay, setSelectedDay] = useState<any | null>(null);
  const [subjectSelection, setSubjectSelection] = useState<string>('Mathematics');
  const [chapterSelection, setChapterSelection] = useState<string>('');
  const [lessonSelection, setLessonSelection] = useState<string>('');
  const [questionTypeSelection, setQuestionTypeSelection] = useState<string>('Read Out Loud');
  
  // State for day subjects
  const [daySubjects, setDaySubjects] = useState<Record<string, Array<{
    id: string;
    subject: string;
    chapter: string;
    lesson: string;
    questionType: string;
  }>>>({});
  
  // New state for viewing/editing saved plan
  const [viewingPlan, setViewingPlan] = useState<string | null>(null);
  const [isEditingPlan, setIsEditingPlan] = useState<boolean>(false);
  
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
  
  // Calculate week dates when plan duration or week starting date changes
  useEffect(() => {
    if (planDuration) {
      calculateDays();
    }
  }, [planDuration, weekStarting]);
  
  // Reset plan creation form when switching from 'saved' to 'create' tab
  useEffect(() => {
    if (activeTab === 'create') {
      // If coming from 'saved' tab, reset everything
      if (viewingPlan) {
        setSelectedChildren([]);
        setPlanDuration(null);
        setPlanCreationMethod(null);
        setDaySubjects({});
        setHasAddedSubject(false);
        setViewingPlan(null);
        setIsEditingPlan(false);
      }
    }
  }, [activeTab, viewingPlan]);
  
  const calculateDays = () => {
    if (!planDuration) return;
    
    // For monthly plans, include 28 days (4 weeks)
    const daysToInclude = planDuration === 'weekly' ? 7 : 28;
    
    // Create array of day objects with date and dayName
    const daysList = Array(daysToInclude).fill(0).map((_, i) => {
      const date = addDays(weekStarting, i);
      return {
        date,
        dayName: format(date, 'EEEE')
      };
    });
    
    setDays(daysList);
    
    // If in automatic mode, regenerate subjects
    if (planCreationMethod === 'automatic') {
      // Use setTimeout to ensure days are updated first
      setTimeout(() => {
        const newRandomSubjects = generateRandomSubjects(daysList);
        setDaySubjects(newRandomSubjects);
        setHasAddedSubject(true);
      }, 50);
    }
  };
  
  const handleReturnToDashboard = () => {
    navigate('/parent-dashboard');
  };
  
  const handleChildSelect = (childId: string) => {
    setSelectedChildren(prev => {
      if (prev.includes(childId)) {
        return prev.filter(id => id !== childId);
      } else {
        return [...prev, childId];
      }
    });
  };

  const handlePlanDurationChange = (value: string) => {
    setPlanDuration(value as 'weekly' | 'monthly');
    
    // Immediately calculate days when plan duration changes
    // This will trigger the useEffect that generates random subjects
    setTimeout(() => {
      calculateDays();
    }, 0);
  };
  
  const moveWeek = (direction: 'prev' | 'next') => {
    const newStartDate = direction === 'next' 
      ? addWeeks(weekStarting, 1) 
      : addWeeks(weekStarting, -1);
    setWeekStarting(newStartDate);
  };
  
  // Validation to enable plan duration selection
  const isPlanDurationSelectionEnabled = selectedChildren.length > 0;
  
  // Function to get background color class based on subject
  const getSubjectColorClass = (subject: string) => {
    const colorMap: Record<string, string> = {
      'Mathematics': 'bg-blue-50',
      'Science': 'bg-amber-50',
      'English': 'bg-green-50',
      'History': 'bg-purple-50',
      'Geography': 'bg-teal-50'
    };
    
    return colorMap[subject] || 'bg-gray-50';
  };
  
  // Function to get text color class based on subject
  const getSubjectTextColorClass = (subject: string) => {
    const colorMap: Record<string, string> = {
      'Mathematics': 'text-blue-800',
      'Science': 'text-amber-800',
      'English': 'text-green-800',
      'History': 'text-purple-800',
      'Geography': 'text-teal-800'
    };
    
    return colorMap[subject] || 'text-gray-800';
  };
  
  // Function to get secondary text color class based on subject
  const getSecondaryTextColorClass = (subject: string) => {
    const colorMap: Record<string, string> = {
      'Mathematics': 'text-blue-600',
      'Science': 'text-amber-600',
      'English': 'text-green-600',
      'History': 'text-purple-600',
      'Geography': 'text-teal-600'
    };
    
    return colorMap[subject] || 'text-gray-600';
  };
  
  // Modify the addOrEditSubject function to fix error when editing
  const handleAddOrEditSubject = () => {
    if (!selectedDay) return;
    
    const dayKey = format(selectedDay.date, 'yyyy-MM-dd');
    const subjectData = {
      id: editingSubject ? editingSubject.id : `subject-${Date.now()}`,
      subject: subjectSelection,
      chapter: chapterSelection,
      lesson: lessonSelection,
      questionType: questionTypeSelection
    };
    
    // Get current subjects for this day
    const daySubjectsList = daySubjects[dayKey] || [];
    
    // Check if adding an activity-type question (only allow one per day)
    if (ACTIVITY_QUESTION_TYPES.includes(questionTypeSelection)) {
      // When editing, we need to exclude the current subject being edited from the count
      const activityTypeCount = daySubjectsList.filter(s => 
        ACTIVITY_QUESTION_TYPES.includes(s.questionType) && 
        (editingSubject ? s.id !== editingSubject.id : true)
      ).length;

      if (activityTypeCount >= 1) {
        toast({
          title: "Limit Exceeded",
          description: "You can only assign one activity-type question (Reading, Listening, etc.) per day.",
          variant: "destructive",
        });
        return;
      }
    }
    
    // Check if adding too many practice questions (max 3 per day)
    if (PRACTICE_QUESTION_TYPES.includes(questionTypeSelection)) {
      // When editing, we need to exclude the current subject being edited from the count
      const practiceTypeCount = daySubjectsList.filter(s => 
        PRACTICE_QUESTION_TYPES.includes(s.questionType) && 
        (editingSubject ? s.id !== editingSubject.id : true)
      ).length;

      // Only show error if we're adding a new practice question or changing from activity to practice
      const isChangingToNewPractice = editingSubject && 
        !PRACTICE_QUESTION_TYPES.includes(editingSubject.questionType) && 
        PRACTICE_QUESTION_TYPES.includes(questionTypeSelection);
        
      if (practiceTypeCount >= 3 && (!editingSubject || isChangingToNewPractice)) {
        toast({
          title: "Limit Exceeded",
          description: "You can only assign up to three practice questions per day.",
          variant: "destructive",
        });
        return;
      }
    }
    
    // Check total subjects per day (max 4)
    // Only apply this check when adding a new subject, not when editing
    if (daySubjectsList.length >= 4 && !editingSubject) {
      toast({
        title: "Limit Exceeded",
        description: "You can only assign up to four subjects per day.",
        variant: "destructive",
      });
      return;
    }

    setDaySubjects(prev => {
      const prevDaySubjects = prev[dayKey] || [];
      
      if (editingSubject) {
        // Edit existing subject
        return {
          ...prev,
          [dayKey]: prevDaySubjects.map(s => s.id === editingSubject.id ? subjectData : s)
        };
      } else {
        // Add new subject
        return {
          ...prev,
          [dayKey]: [...prevDaySubjects, subjectData]
        };
      }
    });
    
    // Set hasAddedSubject to true for UI updates
    if (!editingSubject) {
      setHasAddedSubject(true);
    }
    
    closeSubjectDialog();
  };
  
  const openAddSubjectDialog = (day: any) => {
    setSelectedDay(day);
    setEditingSubject(null);
    // Set default values
    setSubjectSelection('Mathematics');
    
    // Set default chapter based on selected subject
    const defaultChapter = Object.keys(subjects['Mathematics'].chapters)[0];
    setChapterSelection(defaultChapter);
    
    // Set default lesson based on selected chapter
    const defaultLesson = subjects['Mathematics'].chapters[defaultChapter][0];
    setLessonSelection(defaultLesson);
    
    setQuestionTypeSelection('Read Out Loud');
    setIsAddSubjectOpen(true);
  };
  
  const openEditSubjectDialog = (day: any, subject: any) => {
    setSelectedDay(day);
    setEditingSubject(subject);
    setSubjectSelection(subject.subject);
    setChapterSelection(subject.chapter);
    setLessonSelection(subject.lesson);
    setQuestionTypeSelection(subject.questionType);
    setIsAddSubjectOpen(true);
  };
  
  const closeSubjectDialog = () => {
    setIsAddSubjectOpen(false);
    setSelectedDay(null);
    setEditingSubject(null);
  };
  
  const deleteSubject = (day: any, subjectId: string) => {
    const dayKey = format(day.date, 'yyyy-MM-dd');
    
    toast({
      title: "Subject Deleted",
      description: `Subject has been removed from ${format(day.date, 'EEEE')}`
    });
    
    setDaySubjects(prev => {
      const updated = {
        ...prev,
        [dayKey]: (prev[dayKey] || []).filter(s => s.id !== subjectId)
      };
      
      // If this was the last subject for this day in manual mode, update hasAddedSubject
      if (planCreationMethod === 'manual') {
        let anySubjectsLeft = false;
        Object.values(updated).forEach(subjects => {
          if (subjects.length > 0) {
            anySubjectsLeft = true;
          }
        });
        
        if (!anySubjectsLeft) {
          setHasAddedSubject(false);
        }
      }
      
      return updated;
    });
  };
  
  // Function to get available chapters based on selected subject
  const getAvailableChapters = () => {
    if (!subjectSelection || !subjects[subjectSelection]) return [];
    return Object.keys(subjects[subjectSelection].chapters);
  };
  
  // Function to get available lessons based on selected subject and chapter
  const getAvailableLessons = () => {
    if (!subjectSelection || !chapterSelection || !subjects[subjectSelection]?.chapters[chapterSelection]) return [];
    return subjects[subjectSelection].chapters[chapterSelection];
  };
  
  // Effect to update chapter and lesson when subject changes
  useEffect(() => {
    if (subjectSelection) {
      const chapters = getAvailableChapters();
      if (chapters.length > 0) {
        const newChapter = chapters[0];
        setChapterSelection(newChapter);
        
        const lessons = subjects[subjectSelection].chapters[newChapter];
        if (lessons && lessons.length > 0) {
          setLessonSelection(lessons[0]);
        } else {
          setLessonSelection('');
        }
      }
    }
  }, [subjectSelection]);
  
  // Effect to update lesson when chapter changes
  useEffect(() => {
    if (subjectSelection && chapterSelection) {
      const lessons = getAvailableLessons();
      if (lessons.length > 0) {
        setLessonSelection(lessons[0]);
      } else {
        setLessonSelection('');
      }
    }
  }, [chapterSelection]);
  
  // Handle switching to Create Plan tab
  const handleSwitchToCreate = () => {
    setActiveTab('create');
    setSelectedChildren([]);
    setPlanDuration(null);
    setPlanCreationMethod(null);
    setDaySubjects({});
    setHasAddedSubject(false);
    setViewingPlan(null);
    setIsEditingPlan(false);
  };

  // Fix the automatic plan generation timing issue
  // Add effect to generate subjects when plan creation method changes or days change
  useEffect(() => {
    if (planCreationMethod === 'automatic' && days.length > 0) {
      setDaySubjects(generateRandomSubjects());
      setHasAddedSubject(true);
    }
  }, [planCreationMethod, days.length]);

  // Update the generateRandomSubjects function to properly handle all days in the plan duration
  const generateRandomSubjects = (daysList = days) => {
    const randomSubjects: Record<string, Array<{
      id: string;
      subject: string;
      chapter: string;
      lesson: string;
      questionType: string;
    }>> = {};
    
    // Make sure we have days to process
    if (!daysList || daysList.length === 0) return randomSubjects;
    
    // For each day, create a balanced set of subjects
    daysList.forEach(day => {
      const dayKey = format(day.date, 'yyyy-MM-dd');
      const daySubjects = [];
      
      const availableSubjects = Object.keys(subjects);
      const isWeekend = day.dayName === 'Saturday' || day.dayName === 'Sunday';
      
      // If it's a weekend, add fewer subjects
      const numSubjects = isWeekend ? 2 : 4;
      const numPractice = isWeekend ? 1 : 3;
      
      // Create random subjects for this day
      // First add practice questions (up to 3)
      for (let i = 0; i < numPractice; i++) {
        // Create a unique ID for each subject to avoid React key warnings
        const uniqueId = `subject-${Date.now()}-${i}-${Math.random().toString(36).substring(2, 7)}`;
        
        // Pick a random subject (avoid repeats if possible)
        const usedSubjects = daySubjects.map(s => s.subject);
        const availableSubjectsForDay = availableSubjects.filter(s => !usedSubjects.includes(s));
        const subjectPool = availableSubjectsForDay.length > 0 ? availableSubjectsForDay : availableSubjects;
        
        const subject = subjectPool[Math.floor(Math.random() * subjectPool.length)];
        
        // Pick a random chapter
        const chapters = Object.keys(subjects[subject].chapters);
        const chapter = chapters[Math.floor(Math.random() * chapters.length)];
        
        // Pick a random lesson
        const lessons = subjects[subject].chapters[chapter];
        const lesson = lessons[Math.floor(Math.random() * lessons.length)];
        
        daySubjects.push({
          id: uniqueId,
          subject,
          chapter,
          lesson,
          questionType: 'Practice Questions'
        });
      }
      
      // Then add one activity question
      if (numSubjects > numPractice) {
        // Create a unique ID for the activity
        const uniqueId = `subject-${Date.now()}-activity-${Math.random().toString(36).substring(2, 7)}`;
        
        // Pick a subject that hasn't been used for a practice question if possible
        const usedSubjects = daySubjects.map(s => s.subject);
        const availableSubjectsForDay = availableSubjects.filter(s => !usedSubjects.includes(s));
        const subjectPool = availableSubjectsForDay.length > 0 ? availableSubjectsForDay : availableSubjects;
        
        const subject = subjectPool[Math.floor(Math.random() * subjectPool.length)];
        
        // Pick a random chapter
        const chapters = Object.keys(subjects[subject].chapters);
        const chapter = chapters[Math.floor(Math.random() * chapters.length)];
        
        // Pick a random lesson
        const lessons = subjects[subject].chapters[chapter];
        const lesson = lessons[Math.floor(Math.random() * lessons.length)];
        
        // Pick a random activity question type
        const questionType = ACTIVITY_QUESTION_TYPES[Math.floor(Math.random() * ACTIVITY_QUESTION_TYPES.length)];
        
        daySubjects.push({
          id: uniqueId,
          subject,
          chapter,
          lesson,
          questionType
        });
      }
      
      randomSubjects[dayKey] = daySubjects;
    });
    
    return randomSubjects;
  };

  // Update the handlePlanCreationMethodChange function to avoid timing issues
  const handlePlanCreationMethodChange = (value: string) => {
    setPlanCreationMethod(value as 'manual' | 'automatic' | '');
    
    if (value === 'manual') {
      // If manual is selected, clear subjects
      setDaySubjects({});
      setHasAddedSubject(false);
    }
    // Automatic plan generation will be handled by the useEffect
  };

  // Update handleViewPlan to use the saved plan's weekStarting date
  const handleViewPlan = (plan: any) => {
    setViewingPlan(plan.id);
    setSelectedChildren([...plan.children]);
    setPlanDuration(plan.planType);
    setPlanCreationMethod(plan.planCreationMethod || 'automatic');
    
    // Use the saved weekStarting or fallback to current week
    const planWeekStart = plan.weekStarting ? new Date(plan.weekStarting) : startOfWeek(new Date(), { weekStartsOn: 1 });
    setWeekStarting(planWeekStart);
    
    // If there are saved subjects, use them
    if (plan.subjects && Object.keys(plan.subjects).length > 0) {
      setDaySubjects(plan.subjects);
    } else {
      // Empty subjects - will be generated by calculateDays effect if needed
      setDaySubjects({});
    }
    
    // Calculate days - this will trigger subject generation for automatic plans
    setTimeout(() => {
      calculateDays();
      setHasAddedSubject(true);
    }, 50);
    
    setActiveTab('saved');
    setIsEditingPlan(true);

    toast({
      title: "Viewing Plan",
      description: `You are now viewing ${plan.title}`
    });
  };

  // Update handleSavePlanChanges to save the changes to the plan
  const handleSavePlanChanges = () => {
    if (!viewingPlan) return;
    
    // Update the plan with current changes
    setSavedPlans(prev => prev.map(plan => {
      if (plan.id === viewingPlan) {
        return {
          ...plan,
          subjects: {...daySubjects},
          children: [...selectedChildren]
        };
      }
      return plan;
    }));
    
    toast({
      title: "Plan Updated",
      description: "Your changes have been saved"
    });
  };

  // Add this function to handle deleting a saved plan
  const handleDeletePlan = (planId: string) => {
    setSavedPlans(prev => prev.filter(plan => plan.id !== planId));
    
    toast({
      title: "Plan Deleted",
      description: "The plan has been permanently deleted."
    });
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
                  <h1 className="text-3xl font-bold text-white">Assign New Task</h1>
                </div>
                <p className="text-white/90 mt-2 ml-10">
                  Create and assign learning tasks for your children
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
            {/* Create/Saved Plan Tabs - Moved above children selection */}
            <motion.div variants={itemVariants}>
              <div className="bg-white rounded-xl shadow-md border border-gray-100">
                <div className="p-4 flex justify-between items-center border-b">
                  <div className="flex gap-4">
                    <button 
                      className={`text-lg font-medium pb-2 ${activeTab === 'create' ? 'border-b-2 border-amber-500 text-amber-700' : 'text-gray-500'}`}
                      onClick={handleSwitchToCreate}
                    >
                      Create Plan
                    </button>
                    <button 
                      className={`text-lg font-medium pb-2 ${activeTab === 'saved' ? 'border-b-2 border-amber-500 text-amber-700' : 'text-gray-500'}`}
                      onClick={() => {
                        setActiveTab('saved');
                        setViewingPlan(null);
                        setIsEditingPlan(false);
                      }}
                    >
                      Saved Plans
                    </button>
                  </div>
                </div>
                
                {activeTab === 'saved' && (
                  <div className="p-4">
                    {!viewingPlan ? (
                      // Show list of saved plans
                      <>
                        <h3 className="text-lg font-semibold mb-4">Your Saved Plans</h3>
                        
                        {savedPlans.length === 0 ? (
                          <div className="text-center py-8 bg-gray-50 rounded-lg">
                            <p className="text-gray-500">No saved plans yet. Create and save a plan to see it here.</p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {savedPlans.map(plan => (
                              <div 
                                key={plan.id} 
                                className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                              >
                                <div className="flex justify-between">
                                  <div>
                                    <h4 className="font-semibold text-lg">{plan.title}</h4>
                                    <p className="text-sm text-gray-500">
                                      Created on {format(plan.createdAt, 'MMMM d, yyyy')} • 
                                      {' '}{plan.planType === 'weekly' ? 'Weekly Plan' : 'Monthly Plan'}
                                    </p>
                                    <div className="flex gap-2 mt-1">
                                      {plan.children.map(childId => {
                                        const child = mockChildren.find(c => c.id === childId);
                                        return child ? (
                                          <div key={childId} className="flex items-center bg-amber-100 px-2 py-1 rounded-full text-xs text-amber-800">
                                            <span>{child.name}</span>
                                          </div>
                                        ) : null;
                                      })}
                                    </div>
                                  </div>
                                  <div className="flex gap-2">
                                    <Button 
                                      size="sm" 
                                      variant="outline"
                                      onClick={() => handleViewPlan(plan)}
                                    >
                                      View and Edit
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      variant="outline" 
                                      className="text-red-500 hover:text-red-700"
                                      onClick={() => handleDeletePlan(plan.id)}
                                    >
                                      Delete
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      // Show the selected plan for viewing/editing
                      <>
                        <div className="flex justify-between items-center mb-6">
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => {
                                setViewingPlan(null);
                                setIsEditingPlan(false);
                              }}
                              className="flex items-center gap-1"
                            >
                              <ArrowLeft className="h-4 w-4" />
                              Back to Plans
                            </Button>
                            <h3 className="text-lg font-semibold">
                              {savedPlans.find(p => p.id === viewingPlan)?.title}
                            </h3>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              className="bg-amber-500 hover:bg-amber-600"
                              onClick={handleSavePlanChanges}
                            >
                              Save Changes
                            </Button>
                          </div>
                        </div>
                        
                        {/* Plan details with subjects in edit mode */}
                        {planDuration && (
                          <motion.div 
                            variants={itemVariants}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                          >
                            <div className="bg-white rounded-xl shadow-md border border-gray-100">
                              <div className="p-4 flex justify-between items-center border-b">
                                <div className="flex gap-4">
                                  <span className="text-lg font-medium">
                                    {planCreationMethod === 'automatic' ? 'Automatic Plan' : 'Manual Plan'}
                                  </span>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                  <Button variant="outline" size="icon" onClick={() => moveWeek('prev')}>
                                    <ChevronDown className="h-4 w-4 rotate-90" />
                                  </Button>
                                  <span className="text-sm whitespace-nowrap">
                                    {planDuration === 'weekly' ? 'Week' : 'Month'} of {format(weekStarting, 'MMM d, yyyy')}
                                  </span>
                                  <Button variant="outline" size="icon" onClick={() => moveWeek('next')}>
                                    <ChevronDown className="h-4 w-4 -rotate-90" />
                                  </Button>
                                </div>
                              </div>
                              
                              <div className="overflow-x-auto p-4">
                                <table className="w-full border-collapse">
                                  <tbody>
                                    {days.slice(0, planDuration === 'weekly' ? 7 : days.length).map((day, dayIndex) => (
                                      <tr key={dayIndex} className={dayIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                        <td className="border border-gray-300 p-3 w-[150px]">
                                          <div className={`font-medium ${
                                            day.dayName === 'Monday' ? 'text-orange-700' :
                                            day.dayName === 'Tuesday' ? 'text-blue-700' :
                                            day.dayName === 'Wednesday' ? 'text-teal-700' :
                                            day.dayName === 'Thursday' ? 'text-purple-700' :
                                            day.dayName === 'Friday' ? 'text-blue-700' :
                                            day.dayName === 'Saturday' ? 'text-orange-700' :
                                            'text-red-700'
                                          }`}>
                                            {day.dayName}
                                          </div>
                                          <div className="text-sm text-gray-500">
                                            {format(day.date, 'dd MMMM')}
                                          </div>
                                        </td>
                                        
                                        {/* Show subjects for this day if any exist */}
                                        {daySubjects[format(day.date, 'yyyy-MM-dd')]?.length > 0 ? (
                                          <>
                                            {daySubjects[format(day.date, 'yyyy-MM-dd')].map((subject, i) => (
                                              <td key={subject.id} className={`border border-gray-300 p-3 ${getSubjectColorClass(subject.subject)} w-[200px]`}>
                                                <div className="flex justify-between">
                                                  <div className={`text-lg font-medium ${getSubjectTextColorClass(subject.subject)}`}>{subject.subject}</div>
                                                  <div className="flex gap-1">
                                                    <Button 
                                                      variant="ghost" 
                                                      size="icon" 
                                                      className={`h-5 w-5 ${getSecondaryTextColorClass(subject.subject)} hover:bg-opacity-10 hover:bg-gray-100`}
                                                      onClick={() => openEditSubjectDialog(day, subject)}
                                                    >
                                                      <Edit className="h-3 w-3" />
                                                    </Button>
                                                    <Button 
                                                      variant="ghost" 
                                                      size="icon" 
                                                      className={`h-5 w-5 ${getSecondaryTextColorClass(subject.subject)} hover:bg-opacity-10 hover:bg-gray-100`}
                                                      onClick={() => deleteSubject(day, subject.id)}
                                                    >
                                                      <X className="h-3 w-3" />
                                                    </Button>
                                                  </div>
                                                </div>
                                                <div className={`text-sm font-medium ${getSecondaryTextColorClass(subject.subject)}`}>{subject.chapter}</div>
                                                <div className="text-sm">{subject.lesson}</div>
                                                
                                                <div className="mt-2 p-2 bg-white rounded-md text-xs">
                                                  <div className="font-medium">{subject.questionType}</div>
                                                  {subject.questionType === 'Practice Questions' && (
                                                    <div className="text-gray-500">Mix of MCQs, Yes/No, True/False, Fill in the blank and Multi-select</div>
                                                  )}
                                                  {subject.questionType === 'Read Out Loud' && (
                                                    <div className="text-gray-500">Upload audio and answer questions</div>
                                                  )}
                                                  {subject.questionType === 'Listen and Answer' && (
                                                    <div className="text-gray-500">Listen to audio and answer questions</div>
                                                  )}
                                                  {subject.questionType === 'Story and Answer' && (
                                                    <div className="text-gray-500">Read story and answer questions</div>
                                                  )}
                                                  {subject.questionType === 'Do and Upload' && (
                                                    <div className="text-gray-500">Complete task and upload image</div>
                                                  )}
                                                </div>
                                              </td>
                                            ))}
                                            
                                            {/* Add Subject button if we haven't filled the row yet */}
                                            {daySubjects[format(day.date, 'yyyy-MM-dd')].length < 4 && (
                                              <td 
                                                colSpan={4 - daySubjects[format(day.date, 'yyyy-MM-dd')].length} 
                                                className="border border-gray-300 p-3 text-center"
                                              >
                                                <Button 
                                                  variant="outline" 
                                                  size="sm"
                                                  onClick={() => openAddSubjectDialog(day)}
                                                >
                                                  <Plus className="h-4 w-4 mr-1" />
                                                  Add {daySubjects[format(day.date, 'yyyy-MM-dd')].length > 0 ? 'another ' : ''}Subject
                                                </Button>
                                              </td>
                                            )}
                                          </>
                                        ) : (
                                          // No subjects for this day yet
                                          <td 
                                            colSpan={4} 
                                            className="border border-gray-300 p-3 text-center"
                                          >
                                            <Button 
                                              variant="outline" 
                                              size="sm"
                                              onClick={() => openAddSubjectDialog(day)}
                                            >
                                              <Plus className="h-4 w-4 mr-1" />
                                              Add Subject
                                            </Button>
                                          </td>
                                        )}
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            </motion.div>

            {activeTab === 'create' && (
              <>
                {/* Children Selection with Avatars */}
                <motion.div variants={itemVariants}>
                  <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
                    <h2 className="text-xl font-semibold mb-6 text-owl-slate-dark flex items-center gap-2">
                      <Users className="h-5 w-5 text-amber-500" />
                      Select Children
                    </h2>
                    
                    <div className="flex flex-wrap gap-4 mb-2">
                      {mockChildren.map((child) => (
                        <div 
                          key={child.id}
                          onClick={() => handleChildSelect(child.id)}
                          className={`
                            flex items-center gap-3 p-3 rounded-lg shadow-sm transition-all duration-200 cursor-pointer
                            ${selectedChildren.includes(child.id) 
                              ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white border-transparent' 
                              : 'bg-white hover:bg-gray-50 text-owl-slate-dark border border-gray-100'}
                          `}
                        >
                          <Avatar className="h-12 w-12 border-2 border-white">
                            <AvatarImage src={child.avatar} alt={child.name} />
                            <AvatarFallback className="bg-amber-200 text-amber-800">
                              {child.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{child.name}</div>
                            <div className={`text-xs ${selectedChildren.includes(child.id) ? 'text-white/80' : 'text-gray-500'}`}>
                              {child.grade} • {child.age} years old
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {selectedChildren.length === 0 && (
                      <p className="text-sm text-amber-600 mt-2">
                        Please select at least one child to continue.
                      </p>
                    )}
                  </div>
                </motion.div>
              
                {/* Plan Creation Options */}
                <motion.div variants={itemVariants}>
                  <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
                    <h2 className="text-xl font-semibold mb-6 text-owl-slate-dark">
                      Weekly or Monthly Task Assignment Plan
                    </h2>
                    
                    <div className="space-y-6">
                      {/* Plan Creation Method */}
                      <div>
                        <h3 className="text-lg font-medium mb-3 text-gray-800">Plan Creation Method</h3>
                        <RadioGroup 
                          value={planCreationMethod} 
                          onValueChange={handlePlanCreationMethodChange}
                          className="flex space-x-6"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="manual" id="manual" />
                            <Label htmlFor="manual" className="flex items-center gap-2 cursor-pointer">
                              <Plus className="h-4 w-4 text-amber-600" />
                              Create Plan Manually
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="automatic" id="automatic" />
                            <Label htmlFor="automatic" className="flex items-center gap-2 cursor-pointer">
                              <Wand2 className="h-4 w-4 text-amber-600" />
                              Create Plan Automatically
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>
                      
                      {/* Add explanatory text below the radio buttons */}
                      <div className="mt-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-md border border-gray-200">
                        <p className="mb-2">
                          <span className="font-semibold">Manually:</span> You will create the plan by adding subjects to specific days. You can add up to 4 subjects per day (3 practice and 1 activity).
                        </p>
                        <p>
                          <span className="font-semibold">Automatically:</span> The system will generate a balanced plan with appropriate subjects for each day. You can still edit any day or subject after it's created.
                        </p>
                      </div>
                      
                      {/* Plan Duration */}
                      <div>
                        <h3 className="text-lg font-medium mb-3 text-gray-800">Plan Duration</h3>
                        <RadioGroup 
                          value={planDuration} 
                          onValueChange={handlePlanDurationChange}
                          className="flex space-x-6"
                          disabled={!isPlanDurationSelectionEnabled}
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="weekly" id="weekly" disabled={!isPlanDurationSelectionEnabled} />
                            <Label 
                              htmlFor="weekly" 
                              className={`flex items-center gap-2 cursor-pointer ${!isPlanDurationSelectionEnabled ? 'text-gray-400' : ''}`}
                            >
                              <Calendar className={`h-4 w-4 ${isPlanDurationSelectionEnabled ? 'text-amber-600' : 'text-gray-400'}`} />
                              Schedule Weekly Plan
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="monthly" id="monthly" disabled={!isPlanDurationSelectionEnabled} />
                            <Label 
                              htmlFor="monthly" 
                              className={`flex items-center gap-2 cursor-pointer ${!isPlanDurationSelectionEnabled ? 'text-gray-400' : ''}`}
                            >
                              <Calendar className={`h-4 w-4 ${isPlanDurationSelectionEnabled ? 'text-amber-600' : 'text-gray-400'}`} />
                              Schedule Monthly Plan
                            </Label>
                          </div>
                        </RadioGroup>
                        
                        {!isPlanDurationSelectionEnabled && (
                          <p className="text-sm text-amber-600 mt-2">
                            Please select a child first to enable plan duration selection.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
            
                {/* Calendar Table View - Only show when plan duration is selected and not saving a plan */}
                {planDuration && !viewingPlan && (
                  <motion.div 
                    variants={itemVariants}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="bg-white rounded-xl shadow-md border border-gray-100">
                      <div className="p-4 flex justify-between items-center border-b">
                        <div className="flex gap-4">
                          <span className="text-lg font-medium">
                            {planCreationMethod === 'automatic' ? 'Automatic Plan' : 'Manual Plan'}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="icon" onClick={() => moveWeek('prev')}>
                            <ChevronDown className="h-4 w-4 rotate-90" />
                          </Button>
                          <span className="text-sm whitespace-nowrap">
                            {planDuration === 'weekly' ? 'Week' : 'Month'} of {format(weekStarting, 'MMM d, yyyy')}
                          </span>
                          <Button variant="outline" size="icon" onClick={() => moveWeek('next')}>
                            <ChevronDown className="h-4 w-4 -rotate-90" />
                          </Button>
                          
                          <Button 
                            onClick={() => {
                              const newPlan = {
                                id: `plan-${Date.now()}`,
                                title: `${planDuration === 'weekly' ? 'Weekly' : 'Monthly'} Plan - ${format(weekStarting, 'MMMM yyyy')}`,
                                planType: planDuration as 'weekly' | 'monthly',
                                createdAt: new Date(),
                                children: [...selectedChildren],
                                subjects: {...daySubjects},
                                planCreationMethod: planCreationMethod as 'manual' | 'automatic',
                                weekStarting: weekStarting
                              };
                              
                              setSavedPlans(prev => [newPlan, ...prev]);
                              
                              toast({
                                title: "Plan Saved",
                                description: `The ${planDuration} plan has been saved.`
                              });
                              
                              // Reset form after saving
                              setSelectedChildren([]);
                              setPlanDuration(null);
                              setPlanCreationMethod(null);
                              setDaySubjects({});
                              setHasAddedSubject(false);
                            }}
                          >
                            Save Plan
                          </Button>
                        </div>
                      </div>
                      
                      <div className="overflow-x-auto p-4">
                        <table className="w-full border-collapse">
                          <tbody>
                            {days.slice(0, planDuration === 'weekly' ? 7 : days.length).map((day, dayIndex) => (
                              <tr key={dayIndex} className={dayIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                <td className="border border-gray-300 p-3 w-[150px]">
                                  <div className={`font-medium ${
                                    day.dayName === 'Monday' ? 'text-orange-700' :
                                    day.dayName === 'Tuesday' ? 'text-blue-700' :
                                    day.dayName === 'Wednesday' ? 'text-teal-700' :
                                    day.dayName === 'Thursday' ? 'text-purple-700' :
                                    day.dayName === 'Friday' ? 'text-blue-700' :
                                    day.dayName === 'Saturday' ? 'text-orange-700' :
                                    'text-red-700'
                                  }`}>
                                    {day.dayName}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {format(day.date, 'dd MMMM')}
                                  </div>
                                </td>
                                
                                {planCreationMethod === 'automatic' ? (
                                  // Display the dynamically generated subjects from daySubjects
                                  <>
                                    {daySubjects[format(day.date, 'yyyy-MM-dd')]?.map((subject, i) => (
                                      <td key={subject.id} className={`border border-gray-300 p-3 ${getSubjectColorClass(subject.subject)} w-[200px]`}>
                                        <div className="flex justify-between">
                                          <div className={`text-lg font-medium ${getSubjectTextColorClass(subject.subject)}`}>{subject.subject}</div>
                                          <div className="flex gap-1">
                                            <Button 
                                              variant="ghost" 
                                              size="icon" 
                                              className={`h-5 w-5 ${getSecondaryTextColorClass(subject.subject)} hover:bg-opacity-10 hover:bg-gray-100`}
                                              onClick={() => openEditSubjectDialog(day, subject)}
                                            >
                                              <Edit className="h-3 w-3" />
                                            </Button>
                                            <Button 
                                              variant="ghost" 
                                              size="icon" 
                                              className={`h-5 w-5 ${getSecondaryTextColorClass(subject.subject)} hover:bg-opacity-10 hover:bg-gray-100`}
                                              onClick={() => deleteSubject(day, subject.id)}
                                            >
                                              <X className="h-3 w-3" />
                                            </Button>
                                          </div>
                                        </div>
                                        <div className={`text-sm font-medium ${getSecondaryTextColorClass(subject.subject)}`}>{subject.chapter}</div>
                                        <div className="text-sm">{subject.lesson}</div>
                                        
                                        <div className="mt-2 p-2 bg-white rounded-md text-xs">
                                          <div className="font-medium">{subject.questionType}</div>
                                          {subject.questionType === 'Practice Questions' && (
                                            <div className="text-gray-500">Mix of MCQs, Yes/No, True/False, Fill in the blank and Multi-select</div>
                                          )}
                                          {subject.questionType === 'Read Out Loud' && (
                                            <div className="text-gray-500">Upload audio and answer questions</div>
                                          )}
                                          {subject.questionType === 'Listen and Answer' && (
                                            <div className="text-gray-500">Listen to audio and answer questions</div>
                                          )}
                                          {subject.questionType === 'Story and Answer' && (
                                            <div className="text-gray-500">Read story and answer questions</div>
                                          )}
                                          {subject.questionType === 'Do and Upload' && (
                                            <div className="text-gray-500">Complete task and upload image</div>
                                          )}
                                        </div>
                                      </td>
                                    ))}
                                    
                                    {/* Add Subject button if we haven't filled the row yet */}
                                    {daySubjects[format(day.date, 'yyyy-MM-dd')]?.length < 4 && (
                                      <td 
                                        colSpan={4 - (daySubjects[format(day.date, 'yyyy-MM-dd')]?.length || 0)} 
                                        className="border border-gray-300 p-3 text-center"
                                      >
                                        <Button 
                                          variant="outline" 
                                          size="sm"
                                          onClick={() => openAddSubjectDialog(day)}
                                        >
                                          <Plus className="h-4 w-4 mr-1" />
                                          Add {daySubjects[format(day.date, 'yyyy-MM-dd')]?.length > 0 ? 'another ' : ''}Subject
                                        </Button>
                                      </td>
                                    )}
                                  </>
                                ) : (
                                  // Manual plan layout
                                  <>
                                    {/* Show subjects for this specific day if any exist */}
                                    {daySubjects[format(day.date, 'yyyy-MM-dd')]?.length > 0 ? (
                                      <>
                                        {daySubjects[format(day.date, 'yyyy-MM-dd')].map((subject, i) => (
                                          <td key={subject.id} className={`border border-gray-300 p-3 ${getSubjectColorClass(subject.subject)} w-[200px]`}>
                                            <div className="flex justify-between">
                                              <div className={`text-lg font-medium ${getSubjectTextColorClass(subject.subject)}`}>{subject.subject}</div>
                                              <div className="flex gap-1">
                                                <Button 
                                                  variant="ghost" 
                                                  size="icon" 
                                                  className={`h-5 w-5 ${getSecondaryTextColorClass(subject.subject)} hover:bg-opacity-10 hover:bg-gray-100`}
                                                  onClick={() => openEditSubjectDialog(day, subject)}
                                                >
                                                  <Edit className="h-3 w-3" />
                                                </Button>
                                                <Button 
                                                  variant="ghost" 
                                                  size="icon" 
                                                  className={`h-5 w-5 ${getSecondaryTextColorClass(subject.subject)} hover:bg-opacity-10 hover:bg-gray-100`}
                                                  onClick={() => deleteSubject(day, subject.id)}
                                                >
                                                  <X className="h-3 w-3" />
                                                </Button>
                                              </div>
                                            </div>
                                            <div className={`text-sm font-medium ${getSecondaryTextColorClass(subject.subject)}`}>{subject.chapter}</div>
                                            <div className="text-sm">{subject.lesson}</div>
                                            
                                            <div className="mt-2 p-2 bg-white rounded-md text-xs">
                                              <div className="font-medium">{subject.questionType}</div>
                                              {subject.questionType === 'Practice Questions' && (
                                                <div className="text-gray-500">Mix of MCQs, Yes/No, True/False, Fill in the blank and Multi-select</div>
                                              )}
                                              {subject.questionType === 'Read Out Loud' && (
                                                <div className="text-gray-500">Upload audio and answer questions</div>
                                              )}
                                              {subject.questionType === 'Listen and Answer' && (
                                                <div className="text-gray-500">Listen to audio and answer questions</div>
                                              )}
                                              {subject.questionType === 'Story and Answer' && (
                                                <div className="text-gray-500">Read story and answer questions</div>
                                              )}
                                              {subject.questionType === 'Do and Upload' && (
                                                <div className="text-gray-500">Complete task and upload image</div>
                                              )}
                                            </div>
                                          </td>
                                        ))}
                                        
                                        {/* Add Subject button if we haven't filled the row yet */}
                                        {daySubjects[format(day.date, 'yyyy-MM-dd')].length < 4 && (
                                          <td 
                                            colSpan={4 - daySubjects[format(day.date, 'yyyy-MM-dd')].length} 
                                            className="border border-gray-300 p-3 text-center"
                                          >
                                            <Button 
                                              variant="outline" 
                                              size="sm"
                                              onClick={() => openAddSubjectDialog(day)}
                                            >
                                              <Plus className="h-4 w-4 mr-1" />
                                              Add {daySubjects[format(day.date, 'yyyy-MM-dd')].length > 0 ? 'another ' : ''}Subject
                                            </Button>
                                          </td>
                                        )}
                                      </>
                                    ) : (
                                      // No subjects for this day yet
                                      <td 
                                        colSpan={4} 
                                        className="border border-gray-300 p-3 text-center"
                                      >
                                        <Button 
                                          variant="outline" 
                                          size="sm"
                                          onClick={() => openAddSubjectDialog(day)}
                                        >
                                          <Plus className="h-4 w-4 mr-1" />
                                          Add Subject
                                        </Button>
                                      </td>
                                    )}
                                  </>
                                )}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </motion.div>
                )}
              </>
            )}
          </motion.div>
        </div>
        
        {/* Add/Edit Subject Dialog */}
        <Dialog open={isAddSubjectOpen} onOpenChange={setIsAddSubjectOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingSubject ? 'Edit Subject' : `Add Subject for ${selectedDay ? format(selectedDay.date, 'EEEE') : ''}`}
              </DialogTitle>
              <DialogDescription>
                Choose the subject, chapter, lesson, and question type.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              {/* Subject Selection */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="subject" className="text-right">
                  Subject:
                </Label>
                <div className="col-span-3">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between"
                      >
                        {subjectSelection}
                        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Search subjects..." />
                        <CommandEmpty>No subject found.</CommandEmpty>
                        <CommandGroup>
                          {Object.keys(subjects).map((subject) => (
                            <CommandItem
                              key={subject}
                              value={subject}
                              onSelect={(value) => {
                                setSubjectSelection(value);
                                const popoverTrigger = document.querySelector('[data-state="open"][role="combobox"]') as HTMLElement;
                                if (popoverTrigger) popoverTrigger.click(); // Close the popover
                              }}
                            >
                              <Check
                                className={`mr-2 h-4 w-4 ${
                                  subject === subjectSelection ? "opacity-100" : "opacity-0"
                                }`}
                              />
                              {subject}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              
              {/* Chapter Selection */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="chapter" className="text-right">
                  Chapter:
                </Label>
                <div className="col-span-3">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between"
                      >
                        {chapterSelection}
                        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Search chapters..." />
                        <CommandEmpty>No chapter found.</CommandEmpty>
                        <CommandGroup>
                          {getAvailableChapters().map((chapter) => (
                            <CommandItem
                              key={chapter}
                              value={chapter}
                              onSelect={(value) => {
                                setChapterSelection(value);
                                const popoverTrigger = document.querySelector('[data-state="open"][role="combobox"]') as HTMLElement;
                                if (popoverTrigger) popoverTrigger.click(); // Close the popover
                              }}
                            >
                              <Check
                                className={`mr-2 h-4 w-4 ${
                                  chapter === chapterSelection ? "opacity-100" : "opacity-0"
                                }`}
                              />
                              {chapter}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
          </div>
              </div>
              
              {/* Lesson Selection */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="lesson" className="text-right">
                  Lesson:
                </Label>
                <div className="col-span-3">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between"
                      >
                        {lessonSelection}
                        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Search lessons..." />
                        <CommandEmpty>No lesson found.</CommandEmpty>
                        <CommandGroup>
                          {getAvailableLessons().map((lesson) => (
                            <CommandItem
                              key={lesson}
                              value={lesson}
                              onSelect={(value) => {
                                setLessonSelection(value);
                                const popoverTrigger = document.querySelector('[data-state="open"][role="combobox"]') as HTMLElement;
                                if (popoverTrigger) popoverTrigger.click(); // Close the popover
                              }}
                            >
                              <Check
                                className={`mr-2 h-4 w-4 ${
                                  lesson === lessonSelection ? "opacity-100" : "opacity-0"
                                }`}
                              />
                              {lesson}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              
              {/* Question Type Selection */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="questionType" className="text-right">
                  Question Type:
                </Label>
                <div className="col-span-3">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between"
                      >
                        {questionTypeSelection}
                        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Search question types..." />
                        <CommandEmpty>No question type found.</CommandEmpty>
                        <CommandGroup>
                          {questionTypes.map((type) => (
                            <CommandItem
                              key={type}
                              value={type}
                              onSelect={(value) => {
                                setQuestionTypeSelection(value);
                                const popoverTrigger = document.querySelector('[data-state="open"][role="combobox"]') as HTMLElement;
                                if (popoverTrigger) popoverTrigger.click(); // Close the popover
                              }}
                            >
                              <Check
                                className={`mr-2 h-4 w-4 ${
                                  type === questionTypeSelection ? "opacity-100" : "opacity-0"
                                }`}
                              />
                              {type}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={closeSubjectDialog}>Cancel</Button>
              <Button onClick={handleAddOrEditSubject} className="bg-amber-500 hover:bg-amber-600">
                {editingSubject ? 'Save Changes' : 'Add Subject'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default ParentAssignTask;
