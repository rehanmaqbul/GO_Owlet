import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, Check, ChevronDown, Plus, Edit, Calendar, Wand2 } from 'lucide-react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, addDays, addWeeks } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Question types
type QuestionType = 
  | 'practice_questions' 
  | 'read_and_answer' 
  | 'listen_and_answer' 
  | 'story_and_answer'
  | 'do_and_upload';

// Group question types by category
const PRACTICE_QUESTION_TYPES: QuestionType[] = [
  'practice_questions'
];

const ACTIVITY_QUESTION_TYPES: QuestionType[] = [
  'read_and_answer',
  'listen_and_answer',
  'story_and_answer',
  'do_and_upload'
];

const QUESTION_TYPES: {id: QuestionType; name: string; description: string}[] = [
  { id: 'practice_questions', name: 'Practice Questions', description: 'Mix of MCQs, Yes/No, True/False, Fill in the blank and Multi-select' },
  { id: 'read_and_answer', name: 'Read Out Loud', description: 'Upload audio and answer questions' },
  { id: 'listen_and_answer', name: 'Listen and Answer', description: 'Listen to audio and answer questions' },
  { id: 'story_and_answer', name: 'Story and Answer', description: 'Read story and answer questions' },
  { id: 'do_and_upload', name: 'Do and Upload', description: 'Complete task and upload image' }
];

interface Subject {
  id: string;
  name: string;
}

interface DaySubject {
  id: string;
  subject: string;
  chapter: string;
  lesson: string;
  questionType: QuestionType;
}

interface DayPlan {
  date: Date;
  dayName: string;
  subjects: DaySubject[];
}

interface WeeklyPlan {
  id: string;
  title: string;
  grade: string;
  weekStarting: Date;
  days: DayPlan[];
  createdAt: Date;
}

interface LearningPlanGeneratorProps {
  grades: { id: string; name: string; }[];
  subjects: { id: string; name: string; }[];
  chapters: Record<string, string[]>;
  lessons: Record<string, Record<string, string[]>>;
}

export const LearningPlanGenerator = ({ grades, subjects, chapters, lessons }: LearningPlanGeneratorProps) => {
  const { toast } = useToast();
  const [selectedGrade, setSelectedGrade] = useState<string>('');
  const [planDuration, setPlanDuration] = useState<'weekly' | 'monthly'>('weekly');
  const [weekStarting, setWeekStarting] = useState<Date>(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [weekDates, setWeekDates] = useState<Date[]>([]);
  const [dayPlans, setDayPlans] = useState<DayPlan[]>([]);
  const [editingDay, setEditingDay] = useState<string | null>(null);
  const [editingSubject, setEditingSubject] = useState<string | null>(null);
  const [savedPlans, setSavedPlans] = useState<WeeklyPlan[]>([]);
  const [activeTab, setActiveTab] = useState<string>('create');
  const [selectedPlan, setSelectedPlan] = useState<WeeklyPlan | null>(null);

  // Modal state for subject selection
  const [modalOpen, setModalOpen] = useState(false);
  const [modalDay, setModalDay] = useState<string>('');
  const [modalSelectedSubject, setModalSelectedSubject] = useState<string>('');
  const [modalSelectedChapter, setModalSelectedChapter] = useState<string>('');
  const [modalSelectedLesson, setModalSelectedLesson] = useState<string>('');
  const [modalSelectedQuestionType, setModalSelectedQuestionType] = useState<QuestionType>('practice_questions');

  // Add a state to control visibility of planning UI
  const [showPlanningUI, setShowPlanningUI] = useState<boolean>(false);

  useEffect(() => {
    calculateWeekDates(weekStarting);
  }, [weekStarting, planDuration]);

  const calculateWeekDates = (startDate: Date) => {
    // For monthly plans, include 28 days (4 weeks)
    const daysToInclude = planDuration === 'weekly' ? 7 : 28;
    const dates = Array(daysToInclude).fill(0).map((_, i) => addDays(startDate, i));
    setWeekDates(dates);

    // Initialize empty day plans
    const newDayPlans = dates.map(date => ({
      date,
      dayName: format(date, 'EEEE'),
      subjects: []
    }));
    setDayPlans(newDayPlans);
  };

  const moveWeek = (direction: 'prev' | 'next') => {
    const newStartDate = direction === 'next' 
      ? addWeeks(weekStarting, 1) 
      : addWeeks(weekStarting, -1);
    setWeekStarting(newStartDate);
  };

  const openAddSubjectModal = (dayName: string) => {
    setModalDay(dayName);
    setModalSelectedSubject('');
    setModalSelectedChapter('');
    setModalSelectedLesson('');
    setModalSelectedQuestionType('practice_questions');
    setModalOpen(true);
  };

  const openEditSubjectModal = (dayName: string, subject: DaySubject) => {
    const subjectId = subjects.find(s => s.name === subject.subject)?.id || '';
    
    setModalDay(dayName);
    setModalSelectedSubject(subjectId);
    setModalSelectedChapter(subject.chapter);
    setModalSelectedLesson(subject.lesson);
    setModalSelectedQuestionType(subject.questionType);
    setEditingSubject(subject.id);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalDay('');
    setModalSelectedSubject('');
    setModalSelectedChapter('');
    setModalSelectedLesson('');
    setModalSelectedQuestionType('practice_questions');
    setEditingSubject(null);
  };

  const addSubjectToDay = () => {
    if (!modalDay || !modalSelectedSubject || !modalSelectedChapter || !modalSelectedLesson || !modalSelectedQuestionType) {
      toast({
        title: "Missing Information",
        description: "Please select all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Check if adding an activity-type question (only allow one per day)
    if (ACTIVITY_QUESTION_TYPES.includes(modalSelectedQuestionType)) {
      const dayPlan = dayPlans.find(day => day.dayName.toLowerCase() === modalDay.toLowerCase());
      const activityTypeCount = dayPlan?.subjects.filter(s => 
        ACTIVITY_QUESTION_TYPES.includes(s.questionType) && 
        (editingSubject ? s.id !== editingSubject : true)
      ).length || 0;

      if (activityTypeCount >= 1) {
        toast({
          title: "Limit Exceeded",
          description: "You can only assign one activity-type question (Reading, Listening, etc.) per day.",
          variant: "destructive",
        });
        return;
      }
    }

    const subjectObj = subjects.find(s => s.id === modalSelectedSubject);
    if (!subjectObj) return;

    const newSubject: DaySubject = {
      id: editingSubject || `subject-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      subject: subjectObj.name,
      chapter: modalSelectedChapter,
      lesson: modalSelectedLesson,
      questionType: modalSelectedQuestionType
    };

    setDayPlans(prev => prev.map(day => {
      if (day.dayName.toLowerCase() === modalDay.toLowerCase()) {
        // If editing, replace the existing subject
        if (editingSubject) {
          return {
            ...day,
            subjects: day.subjects.map(s => s.id === editingSubject ? newSubject : s)
          };
        }
        // Otherwise add a new subject
        return {
          ...day,
          subjects: [...day.subjects, newSubject]
        };
      }
      return day;
    }));

    closeModal();

    toast({
      title: editingSubject ? "Subject Updated" : "Subject Added",
      description: `${subjectObj.name} has been ${editingSubject ? 'updated' : 'added'} for ${modalDay}.`
    });
  };

  const removeSubjectFromDay = (dayName: string, subjectId: string) => {
    setDayPlans(prev => prev.map(day => {
      if (day.dayName.toLowerCase() === dayName.toLowerCase()) {
        return {
          ...day,
          subjects: day.subjects.filter(s => s.id !== subjectId)
        };
      }
      return day;
    }));
  };

  const saveDayPlan = (dayName: string) => {
    toast({
      title: "Day Plan Saved",
      description: `The plan for ${dayName} has been saved.`
    });
  };

  const saveWeeklyPlan = () => {
    if (!selectedGrade || dayPlans.every(day => day.subjects.length === 0)) {
      toast({
        title: "Cannot Save Plan",
        description: "Please select a grade and add at least one subject to a day.",
        variant: "destructive",
      });
      return;
    }

    // If editing an existing plan, update it instead of creating a new one
    if (selectedPlan) {
      const updatedPlan: WeeklyPlan = {
        ...selectedPlan,
        title: `Grade ${grades.find(g => g.id === selectedGrade)?.name} Plan - ${planDuration === 'weekly' ? 'Week' : 'Month'} of ${format(weekStarting, 'MMM d, yyyy')}`,
        grade: selectedGrade,
        weekStarting,
        days: [...dayPlans]
      };

      setSavedPlans(prev => prev.map(p => p.id === selectedPlan.id ? updatedPlan : p));
      
      toast({
        title: "Plan Updated",
        description: `Your ${planDuration} plan has been updated successfully.`
      });
    } else {
      // Create a new plan
      const newPlan: WeeklyPlan = {
        id: `plan-${Date.now()}`,
        title: `Grade ${grades.find(g => g.id === selectedGrade)?.name} Plan - ${planDuration === 'weekly' ? 'Week' : 'Month'} of ${format(weekStarting, 'MMM d, yyyy')}`,
        grade: selectedGrade,
        weekStarting,
        days: [...dayPlans],
        createdAt: new Date()
      };

      setSavedPlans(prev => [newPlan, ...prev]);
      
      toast({
        title: "Plan Saved",
        description: `Your ${planDuration} plan has been saved successfully.`
      });
    }

    // Clear selected plan and switch to saved plans tab
    setSelectedPlan(null);
    setSelectedGrade('');
    setPlanDuration('weekly');
    setShowPlanningUI(false);
    setActiveTab('saved');
  };

  const createAutomaticPlan = () => {
    if (!selectedGrade) {
      toast({
        title: "Missing Information",
        description: "Please select a grade first.",
        variant: "destructive",
      });
      return;
    }

    // Make sure we're working with fresh dayPlans based on current duration setting
    calculateWeekDates(weekStarting);

    // Create an array to hold new day plans based on the current dayPlans
    const newDayPlans = [...dayPlans].map(day => ({
      ...day,
      subjects: [] // Clear existing subjects
    }));

    // For each day, add 4 subjects (3 practice + 1 activity)
    newDayPlans.forEach((day, dayIndex) => {
      // Skip weekends for automatic plan if desired
      const isWeekend = day.dayName === 'Saturday' || day.dayName === 'Sunday';
      if (isWeekend) return;

      // Add 3 practice question subjects
      for (let i = 0; i < 3; i++) {
        // Pick random subject, chapter, lesson, and question type
        const subjectIndex = (dayIndex + i) % subjects.length;
        const subject = subjects[subjectIndex];
        
        if (!subject) continue;
        
        const subjectChapters = chapters[subject.name] || [];
        if (subjectChapters.length === 0) continue;
        
        const chapterIndex = i % subjectChapters.length;
        const chapter = subjectChapters[chapterIndex];
        
        const subjectLessons = lessons[subject.name]?.[chapter] || [];
        if (subjectLessons.length === 0) continue;
        
        const lessonIndex = dayIndex % subjectLessons.length;
        const lesson = subjectLessons[lessonIndex];
        
        // Create subject with practice questions
        day.subjects.push({
          id: `auto-subject-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          subject: subject.name,
          chapter,
          lesson,
          questionType: 'practice_questions'
        });
      }
      
      // Add 1 activity-type question
      const activitySubjectIndex = (dayIndex + 3) % subjects.length;
      const activitySubject = subjects[activitySubjectIndex];
      
      if (activitySubject) {
        const subjectChapters = chapters[activitySubject.name] || [];
        if (subjectChapters.length > 0) {
          const chapterIndex = dayIndex % subjectChapters.length;
          const chapter = subjectChapters[chapterIndex];
          
          const subjectLessons = lessons[activitySubject.name]?.[chapter] || [];
          if (subjectLessons.length > 0) {
            const lessonIndex = dayIndex % subjectLessons.length;
            const lesson = subjectLessons[lessonIndex];
            
            // Select activity question type
            const questionType = ACTIVITY_QUESTION_TYPES[dayIndex % ACTIVITY_QUESTION_TYPES.length];
            
            // Create subject
            day.subjects.push({
              id: `auto-subject-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
              subject: activitySubject.name,
              chapter,
              lesson,
              questionType
            });
          }
        }
      }
    });

    // Update day plans
    setDayPlans(newDayPlans);
    
    toast({
      title: "Plan Generated",
      description: `Automatic ${planDuration} plan created successfully with 4 subjects per weekday.`
    });
  };

  const editSavedPlan = (plan: WeeklyPlan) => {
    setSelectedGrade(plan.grade);
    setPlanDuration(plan.title.toLowerCase().includes('month') ? 'monthly' : 'weekly');
    setWeekStarting(plan.weekStarting);
    setDayPlans(plan.days);
    setSelectedPlan(plan);
    setActiveTab('create');
    setShowPlanningUI(true);
  };

  const deleteSavedPlan = (planId: string) => {
    setSavedPlans(prev => prev.filter(p => p.id !== planId));
    
    toast({
      title: "Plan Deleted",
      description: "The plan has been deleted."
    });
  };
  
  const getQuestionTypeName = (type: QuestionType): string => {
    return QUESTION_TYPES.find(t => t.id === type)?.name || type;
  };

  const getQuestionTypeDescription = (type: QuestionType): string => {
    return QUESTION_TYPES.find(t => t.id === type)?.description || '';
  };

  // Add a function to start a new plan
  const startNewPlan = () => {
    setSelectedGrade('');
    setPlanDuration('weekly');
    setWeekStarting(startOfWeek(new Date(), { weekStartsOn: 1 }));
    calculateWeekDates(startOfWeek(new Date(), { weekStartsOn: 1 }));
    setShowPlanningUI(false);
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="create">Create Plan</TabsTrigger>
          <TabsTrigger value="saved">Saved Plans</TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="space-y-4">
          <Card className="p-4">
            <div className="flex flex-wrap items-center justify-between mb-4 gap-2">
              <h2 className="text-xl font-bold">
                {selectedPlan ? 'Edit Plan' : 'Create Plan'}
                {selectedPlan && <span className="ml-2 text-sm font-normal text-gray-500">
                  ({format(selectedPlan.createdAt, 'MMM d, yyyy')})
                </span>}
              </h2>
              <div className="flex flex-wrap items-center gap-2">
                <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Select Grade" />
                  </SelectTrigger>
                  <SelectContent>
                    {grades.map(grade => (
                      <SelectItem key={grade.id} value={grade.id}>
                        {grade.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select 
                  value={planDuration} 
                  onValueChange={(value: 'weekly' | 'monthly') => {
                    setPlanDuration(value);
                    // Recalculate dates when duration changes without showing planning UI
                    calculateWeekDates(weekStarting);
                  }}
                >
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Plan Duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>

                {!showPlanningUI && selectedGrade && planDuration && (
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => {
                        // Recalculate dates with fresh data for current settings
                        calculateWeekDates(weekStarting);
                        setShowPlanningUI(true);
                      }}
                      className="flex items-center gap-1"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      <span>Create Plan Manually</span>
                    </Button>
                    
                    <Button
                      onClick={() => {
                        createAutomaticPlan();
                        setShowPlanningUI(true);
                      }}
                      variant="outline"
                      className="flex items-center gap-1"
                    >
                      <Wand2 className="h-4 w-4 mr-1" />
                      <span>Create Plan Automatically</span>
                    </Button>
                  </div>
                )}

                {showPlanningUI && (
                  <>
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
                    
                    <Button onClick={saveWeeklyPlan}>
                      {selectedPlan ? 'Update Plan' : 'Save Plan'}
                    </Button>
                    
                    <Button 
                      variant="ghost"
                      onClick={() => {
                        if (selectedPlan) {
                          startNewPlan();
                        } else {
                          setShowPlanningUI(false);
                        }
                      }}
                    >
                      {selectedPlan ? 'Cancel Edit' : 'Cancel'}
                    </Button>
                  </>
                )}
              </div>
            </div>

            {showPlanningUI && (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <tbody>
                    {dayPlans.map((day, dayIndex) => (
                      <tr key={day.dayName} className={dayIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
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
                          <div className="text-sm text-gray-600">
                            {format(day.date, 'dd MMMM')}
                          </div>
                        </td>
                        
                        {day.subjects.map((subject, i) => (
                          <React.Fragment key={subject.id}>
                            <td className="border border-gray-300 p-3 bg-blue-100">
                              <div className="font-medium">{subject.subject}</div>
                            </td>
                            <td className="border border-gray-300 p-3">
                              <div className="flex justify-between items-start">
                                <div>
                                  <div className="font-medium">{subject.chapter}</div>
                                  <div className="text-sm">{subject.lesson}</div>
                                  <div className="text-xs text-gray-600 mt-1">
                                    <Badge variant={ACTIVITY_QUESTION_TYPES.includes(subject.questionType) ? "secondary" : "outline"} className="mt-1">
                                      {getQuestionTypeName(subject.questionType)}
                                    </Badge>
                                    <div className="text-xs text-gray-500 mt-0.5">{getQuestionTypeDescription(subject.questionType)}</div>
                                  </div>
                                </div>
                                <div className="flex gap-1">
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-6 w-6"
                                    onClick={() => openEditSubjectModal(day.dayName, subject)}
                                  >
                                    <Edit className="h-3 w-3" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-6 w-6"
                                    onClick={() => removeSubjectFromDay(day.dayName, subject.id)}
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            </td>
                          </React.Fragment>
                        ))}

                        <td className="border border-gray-300 p-3 bg-blue-100">
                          <Button 
                            variant="ghost" 
                            className="flex items-center justify-center w-full"
                            onClick={() => openAddSubjectModal(day.dayName)}
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            <span>Add Subject</span>
                          </Button>
                        </td>
                        
                        <td className="border border-gray-300 p-3 bg-green-100 text-center">
                          <Button 
                            variant="ghost"
                            className="h-full w-full"
                            onClick={() => saveDayPlan(day.dayName)}
                          >
                            Save
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {!showPlanningUI && !selectedGrade && (
              <div className="bg-gray-50 rounded-lg p-6 text-center">
                <h3 className="text-lg font-medium mb-2">Create a New Learning Plan</h3>
                <p className="text-gray-600 mb-4">Select a grade and plan duration to get started</p>
              </div>
            )}

            {!showPlanningUI && selectedGrade && planDuration && (
              <div className="bg-gray-50 rounded-lg p-6 text-center">
                <h3 className="text-lg font-medium mb-2">Ready to Create Your {planDuration === 'weekly' ? 'Weekly' : 'Monthly'} Plan</h3>
                <p className="text-gray-600 mb-4">Choose how you want to create your plan for Grade {grades.find(g => g.id === selectedGrade)?.name}</p>
              </div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="saved" className="space-y-4">
          <h2 className="text-xl font-bold">Saved Plans</h2>
          
          {savedPlans.length === 0 ? (
            <Card className="p-6 text-center">
              <p>No saved plans yet. Create a plan to get started.</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {savedPlans.map(plan => (
                <Card key={plan.id} className="p-4">
                  <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-lg">{plan.title}</h3>
                        <div className="flex gap-1">
                          <Button variant="outline" size="sm" onClick={() => editSavedPlan(plan)}>
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-500" onClick={() => deleteSavedPlan(plan.id)}>
                            <X className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        <div className="text-sm">
                          <div className="flex items-center text-gray-700 mb-1">
                            <Calendar className="h-3 w-3 mr-1" />
                            <span>Week starting: {format(plan.weekStarting, 'MMMM d, yyyy')}</span>
                          </div>
                          <div className="text-gray-700 mb-1">
                            <span className="font-medium">Grade:</span> {grades.find(g => g.id === plan.grade)?.name}
                          </div>
                          <div className="text-gray-700">
                            <span className="font-medium">Created:</span> {format(plan.createdAt, 'MMMM d, yyyy')}
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <div className="font-medium text-sm mb-1">Plan Summary:</div>
                          <div className="bg-gray-50 p-2 rounded text-sm">
                            <div className="flex gap-2 flex-wrap">
                              {plan.days
                                .filter(day => day.subjects.length > 0)
                                .map(day => (
                                  <Badge key={day.dayName} variant="outline" className="py-1">
                                    {day.dayName}: {day.subjects.length} tasks
                                  </Badge>
                                ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="w-full md:w-1/3 bg-gray-50 p-3 rounded">
                      <h4 className="font-medium text-sm mb-2">Subject Distribution</h4>
                      <div className="space-y-2">
                        {/* Calculate subject distribution */}
                        {(() => {
                          const subjectCount: Record<string, number> = {};
                          let totalSubjects = 0;
                          
                          plan.days.forEach(day => {
                            day.subjects.forEach(subject => {
                              subjectCount[subject.subject] = (subjectCount[subject.subject] || 0) + 1;
                              totalSubjects++;
                            });
                          });
                          
                          if (totalSubjects === 0) return <div className="text-sm text-gray-500">No subjects assigned</div>;
                          
                          return Object.entries(subjectCount)
                            .sort(([, countA], [, countB]) => countB - countA)
                            .map(([subject, count]) => (
                              <div key={subject} className="flex justify-between items-center text-sm">
                                <span>{subject}</span>
                                <div className="flex items-center">
                                  <span className="mr-2">{count}</span>
                                  <div className="bg-blue-100 h-2 w-20 rounded-full overflow-hidden">
                                    <div 
                                      className="bg-blue-500 h-full" 
                                      style={{ width: `${(count / totalSubjects) * 100}%` }}
                                    />
                                  </div>
                                </div>
                              </div>
                            ));
                        })()}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">
                {editingSubject ? 'Edit Subject' : 'Add Subject'} for {modalDay}
              </h3>
              <Button variant="ghost" size="icon" onClick={closeModal}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Subject:</label>
                <Select 
                  value={modalSelectedSubject} 
                  onValueChange={(value) => {
                    setModalSelectedSubject(value);
                    setModalSelectedChapter('');
                    setModalSelectedLesson('');
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map(subject => (
                      <SelectItem key={subject.id} value={subject.id}>
                        {subject.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {modalSelectedSubject && (
                <div>
                  <label className="block text-sm font-medium mb-1">Chapter:</label>
                  <Select 
                    value={modalSelectedChapter} 
                    onValueChange={(value) => {
                      setModalSelectedChapter(value);
                      setModalSelectedLesson('');
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Chapter" />
                    </SelectTrigger>
                    <SelectContent>
                      {(() => {
                        const subject = subjects.find(s => s.id === modalSelectedSubject);
                        const subjectName = subject?.name || '';
                        const chapterList = chapters[subjectName] || [];
                        
                        return chapterList.map(chapter => (
                          <SelectItem key={chapter} value={chapter}>
                            {chapter}
                          </SelectItem>
                        ));
                      })()}
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              {modalSelectedChapter && (
                <div>
                  <label className="block text-sm font-medium mb-1">Lesson:</label>
                  <Select value={modalSelectedLesson} onValueChange={setModalSelectedLesson}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Lesson" />
                    </SelectTrigger>
                    <SelectContent>
                      {(() => {
                        const subject = subjects.find(s => s.id === modalSelectedSubject);
                        const subjectName = subject?.name || '';
                        const lessonList = lessons[subjectName]?.[modalSelectedChapter] || [];
                        
                        return lessonList.map(lesson => (
                          <SelectItem key={lesson} value={lesson}>
                            {lesson}
                          </SelectItem>
                        ));
                      })()}
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              {modalSelectedLesson && (
                <div>
                  <label className="block text-sm font-medium mb-1">Question Type:</label>
                  <Select value={modalSelectedQuestionType} onValueChange={(value: QuestionType) => setModalSelectedQuestionType(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Question Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <div className="p-1 border-b mb-1">
                        <span className="text-xs font-medium text-gray-500">Practice Questions</span>
                      </div>
                      {QUESTION_TYPES.filter(type => PRACTICE_QUESTION_TYPES.includes(type.id)).map(type => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name}
                          <span className="text-xs block text-gray-500">{type.description}</span>
                        </SelectItem>
                      ))}
                      <div className="p-1 border-b mb-1 mt-2">
                        <span className="text-xs font-medium text-gray-500">Activities (Max 1 Per Day)</span>
                      </div>
                      {QUESTION_TYPES.filter(type => ACTIVITY_QUESTION_TYPES.includes(type.id)).map(type => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name}
                          <span className="text-xs block text-gray-500">{type.description}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              <div className="pt-4">
                <Button
                  className="w-full"
                  onClick={addSubjectToDay}
                  disabled={!modalSelectedSubject || !modalSelectedChapter || !modalSelectedLesson || !modalSelectedQuestionType}
                >
                  {editingSubject ? 'Update Subject' : 'Add Subject'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 