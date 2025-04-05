
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { assignTask } from '@/services/task/assignTaskService';
import { TaskType, Curriculum } from '@/lib/types';

export const useTaskAssignment = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCurriculum, setSelectedCurriculum] = useState<Curriculum | ''>('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');
  const [taskName, setTaskName] = useState('');
  const [taskType, setTaskType] = useState<TaskType>('curriculum');
  const [selectedChild, setSelectedChild] = useState('');
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  
  // Confirmation dialog state
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  
  const handleQuestionToggle = (questionId: string) => {
    setSelectedQuestions(prev => 
      prev.includes(questionId) 
        ? prev.filter(id => id !== questionId) 
        : [...prev, questionId]
    );
  };
  
  const handleReset = () => {
    setSearchQuery('');
    setSelectedCurriculum('');
    setSelectedSubject('');
    setSelectedGrade('');
    setTaskName('');
    setSelectedQuestions([]);
    setTaskType('curriculum');
  };
  
  const handleSendTask = async () => {
    if (!taskName) {
      toast({
        title: "Task name required",
        description: "Please enter a name for the task.",
        variant: "destructive",
      });
      return;
    }
    
    if (!selectedChild) {
      toast({
        title: "No child selected",
        description: "Please select a child to assign this task to.",
        variant: "destructive",
      });
      return;
    }
    
    if (selectedQuestions.length === 0) {
      toast({
        title: "No questions selected",
        description: "Please select at least one question for the task.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      console.log('Sending task with values:', {
        taskName,
        childId: selectedChild,
        userId: user?.id,
        subject: selectedSubject,
        curriculum: selectedCurriculum,
        grade: selectedGrade,
        questions: selectedQuestions,
        taskType
      });
      
      // Save task to database
      await assignTask({
        taskName,
        childId: selectedChild,
        userId: user?.id || '',
        subject: selectedSubject,
        curriculum: selectedCurriculum,
        grade: selectedGrade,
        questions: selectedQuestions,
        taskType
      });
      
      toast({
        title: "Task assigned successfully",
        description: `Task "${taskName}" has been sent to your child.`,
      });
      
      // Show confirmation dialog
      setShowConfirmDialog(true);
    } catch (error) {
      console.error('Error assigning task:', error);
      toast({
        title: "Error assigning task",
        description: "There was a problem assigning the task. Please try again later.",
        variant: "destructive",
      });
    }
  };
  
  const handleContinue = () => {
    // Reset form and keep user on the page to create another task
    handleReset();
    setShowConfirmDialog(false);
  };
  
  const handleFinish = () => {
    // Navigate back to parent dashboard
    navigate('/parent-dashboard');
  };
  
  return {
    searchQuery,
    setSearchQuery,
    selectedCurriculum,
    setSelectedCurriculum,
    selectedSubject,
    setSelectedSubject,
    selectedGrade,
    setSelectedGrade,
    taskName,
    setTaskName,
    taskType,
    setTaskType,
    selectedChild,
    setSelectedChild,
    selectedQuestions,
    setSelectedQuestions,
    showConfirmDialog,
    setShowConfirmDialog,
    handleQuestionToggle,
    handleReset,
    handleSendTask,
    handleContinue,
    handleFinish
  };
};
