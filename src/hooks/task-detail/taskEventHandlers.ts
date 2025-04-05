
import { Question } from '@/lib/types';
import { submitTaskAnswers } from '@/services/task/taskService';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';

export const useTaskEventHandlers = (
  taskId: string, 
  questions: Question[],
  answers: Record<string, string>,
  setIsSubmitting: (value: boolean) => void
) => {
  const navigate = useNavigate();
  
  // Handle task submission
  const handleSubmitTask = async () => {
    try {
      setIsSubmitting(true);
      
      // Calculate score
      let score = 0;
      const total = questions.length;
      
      questions.forEach(question => {
        const userAnswer = answers[question.id] || '';
        const correctAnswer = question.correctAnswer;
        
        // Skip scoring for reading questions
        if (question.type === 'reading') {
          return;
        }
        
        // Check if answer is correct
        if (userAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
          score += 1;
        }
      });
      
      // Update task with results
      await submitTaskAnswers(taskId, answers, score, total);
      
      toast({
        title: "Task submitted successfully",
        description: `Your score: ${score}/${total}`,
      });
      
      // Reload the page to show results
      window.location.reload();
    } catch (error) {
      console.error('Error submitting task:', error);
      toast({
        title: "Error submitting task",
        description: "There was a problem submitting your task. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isAnswerComplete = (questionIndex: number): boolean => {
    const question = questions[questionIndex];
    return !!answers[question.id];
  };
  
  const allQuestionsAnswered = (): boolean => {
    return questions.every(question => !!answers[question.id]);
  };
  
  return {
    handleSubmitTask,
    isAnswerComplete,
    allQuestionsAnswered
  };
};
