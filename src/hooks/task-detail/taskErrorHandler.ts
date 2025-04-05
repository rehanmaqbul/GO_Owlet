
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

export const useTaskErrorHandler = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleTaskNotFound = () => {
    toast({
      title: "Task not found",
      description: "The requested task could not be found.",
      variant: "destructive",
    });
    navigate('/tasks');
  };
  
  const handleFetchError = (error: unknown) => {
    console.error('Error fetching task data:', error);
    toast({
      title: "Error loading task",
      description: "There was a problem loading the task details.",
      variant: "destructive",
    });
  };
  
  return {
    handleTaskNotFound,
    handleFetchError
  };
};
