import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { useTaskData } from './useTaskData';
import { useTaskEventHandlers } from './taskEventHandlers';
import { Question, QuestionType } from '@/lib/types';
import { UseTaskDetailReturn } from './types';
import { isAnswerCorrect as checkIsAnswerCorrect } from './taskUtils';

export const useTaskDetail = (): UseTaskDetailReturn => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { taskId } = useParams<{ taskId: string }>();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  
  // Get task data
  const {
    task,
    taskQuestions,
    answers,
    setAnswers,
    isLoading,
    error: taskLoadError
  } = useTaskData();
  
  // Display error if task loading failed
  useEffect(() => {
    if (taskLoadError) {
      setLoadingError(taskLoadError);
      console.error("Task loading error:", taskLoadError);
    }
  }, [taskLoadError]);
  
  // Get task event handlers
  const {
    handleSubmitTask,
    isAnswerComplete,
    allQuestionsAnswered
  } = useTaskEventHandlers(
    task?.id || '', 
    taskQuestions,
    answers,
    setIsSubmitting
  );
  
  // Handle answer change
  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };
  
  // Navigate to next question
  const handleNextQuestion = () => {
    if (currentQuestionIndex < taskQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };
  
  // Navigate to previous question
  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };
  
  // Handle audio recording
  const handleAudioRecording = async (questionId: string) => {
    console.log('Audio recording not implemented yet for question:', questionId);
    // Implementation would go here
  };
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    // Only parents and children should access this page
    if (user?.role !== 'parent' && user?.role !== 'child' && user?.role !== 'teacher') {
      navigate('/dashboard');
    }
  }, [isAuthenticated, user, navigate]);

  return {
    user,
    task,
    taskQuestions,
    answers,
    currentQuestionIndex,
    isSubmitting,
    isLoading,
    loadingError,
    handleAnswerChange,
    handleNextQuestion,
    handlePreviousQuestion,
    isAnswerCorrect: (userAnswer: string, correctAnswer: string, questionType: QuestionType) => 
      checkIsAnswerCorrect(userAnswer, correctAnswer, questionType),
    handleSubmitTask,
    handleAudioRecording
  };
};
