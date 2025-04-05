import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Task, Question } from '@/lib/types';
import { getTaskById, getQuestionsById } from '@/services/task/taskService';
import { useTaskErrorHandler } from './taskErrorHandler';
import { getFallbackTask, getFallbackQuestions } from '@/components/task-detail/FallbackTaskData';

export const useTaskData = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const { handleTaskNotFound, handleFetchError } = useTaskErrorHandler();
  
  const [task, setTask] = useState<Task | null>(null);
  const [taskQuestions, setTaskQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  console.log('useTaskData hook - taskId from params:', taskId);

  useEffect(() => {
    const loadTaskData = async () => {
      console.log('loadTaskData - Starting to load task with ID:', taskId);
      setIsLoading(true);
      setError(null);
      
      // Record start time to ensure minimum loading time
      const startTime = Date.now();
      const minimumLoadingTime = 1500; // 1.5 seconds minimum loading time
      
      try {
        if (!taskId) {
          console.log('loadTaskData - No taskId provided');
          setError('No task ID provided');
          await ensureMinimumLoadingTime(startTime, minimumLoadingTime);
          setIsLoading(false);
          return;
        }
        
        // Special handling for numeric IDs to ensure compatibility with different mock data sources
        const normalizedTaskId = taskId.toString();
        console.log('loadTaskData - Normalized taskId:', normalizedTaskId);
        
        // Direct fallback for task IDs 1 and 2
        if (normalizedTaskId === '1' || normalizedTaskId === '2') {
          console.log(`loadTaskData - Using direct fallback for task ID ${normalizedTaskId}`);
          const fallbackTask = getFallbackTask(normalizedTaskId);
          
          if (fallbackTask) {
            setTask(fallbackTask);
            if (fallbackTask.questions && fallbackTask.questions.length > 0) {
              const questionsData = getFallbackQuestions(fallbackTask.questions);
              setTaskQuestions(questionsData);
            }
            
            await ensureMinimumLoadingTime(startTime, minimumLoadingTime);
            setIsLoading(false);
            return;
          }
        }
        
        // Regular API fetch for other task IDs
        try {
          console.log('loadTaskData - Calling getTaskById with taskId:', normalizedTaskId);
          const taskData = await getTaskById(normalizedTaskId);
          console.log('loadTaskData - taskData received:', taskData);
          
          if (!taskData) {
            console.error('loadTaskData - No task found with ID:', normalizedTaskId);
            
            // Attempt to handle common issues with task-1 vs 1 format
            const alternateIds = [
              // Try both formats - with and without prefix
              normalizedTaskId.startsWith('task-') ? normalizedTaskId.replace('task-', '') : `task-${normalizedTaskId}`,
              // Also try simple numeric values
              normalizedTaskId.replace(/\D/g, '')
            ];
            
            console.log('loadTaskData - Trying alternate IDs:', alternateIds);
            
            let foundTask = null;
            for (const altId of alternateIds) {
              if (altId === normalizedTaskId) continue; // Skip if same as original
              
              try {
                console.log('loadTaskData - Trying alternate ID:', altId);
                const altTaskData = await getTaskById(altId);
                if (altTaskData) {
                  console.log('loadTaskData - Found task with alternate ID:', altId);
                  foundTask = altTaskData;
                  break;
                }
              } catch (err) {
                console.log('loadTaskData - Error with alternate ID:', altId, err);
              }
            }
            
            if (foundTask) {
              console.log('loadTaskData - Using task found with alternate ID');
              setTask(foundTask);
              
              // If the task is completed, load the answers
              if (foundTask.status === 'completed' && foundTask.results) {
                console.log('loadTaskData - Setting answers from completed task');
                setAnswers(foundTask.results.answers);
              }
              
              // Fetch questions if available
              if (foundTask.questions && foundTask.questions.length > 0) {
                console.log('loadTaskData - Fetching questions for IDs:', foundTask.questions);
                const questionsData = await getQuestionsById(foundTask.questions);
                console.log('loadTaskData - questionsData received:', questionsData);
                setTaskQuestions(questionsData);
              } else {
                console.log('loadTaskData - No questions available for task');
              }
              
              await ensureMinimumLoadingTime(startTime, minimumLoadingTime);
              setIsLoading(false);
              return;
            }
            
            setError(`Task with ID ${normalizedTaskId} not found`);
            await ensureMinimumLoadingTime(startTime, minimumLoadingTime);
            setIsLoading(false);
            return;
          }
          
          setTask(taskData);
          
          // If the task is completed, load the answers
          if (taskData.status === 'completed' && taskData.results) {
            console.log('loadTaskData - Setting answers from completed task');
            setAnswers(taskData.results.answers);
          }
          
          // Fetch questions if available
          if (taskData.questions && taskData.questions.length > 0) {
            console.log('loadTaskData - Fetching questions for IDs:', taskData.questions);
            const questionsData = await getQuestionsById(taskData.questions);
            console.log('loadTaskData - questionsData received:', questionsData);
            setTaskQuestions(questionsData);
          } else {
            console.log('loadTaskData - No questions available for task');
          }
        } catch (err: any) {
          console.error('loadTaskData - Error during task fetch:', err);
          if (err.code === 'PGRST116') {
            handleTaskNotFound();
            return;
          }
          throw err;
        }
      } catch (err: any) {
        console.error('loadTaskData - General error:', err);
        handleFetchError(err);
        setError('Failed to load task data. Please try again later.');
      } finally {
        // Ensure we show the loading screen for at least the minimum time
        await ensureMinimumLoadingTime(startTime, minimumLoadingTime);
        console.log('loadTaskData - Finished loading, setting isLoading to false');
        setIsLoading(false);
      }
    };

    // Helper function to ensure minimum loading time
    const ensureMinimumLoadingTime = async (startTime: number, minimumTime: number) => {
      const elapsedTime = Date.now() - startTime;
      if (elapsedTime < minimumTime) {
        await new Promise(resolve => setTimeout(resolve, minimumTime - elapsedTime));
      }
    };

    loadTaskData();
  }, [taskId, handleTaskNotFound, handleFetchError]);

  return {
    task,
    setTask,
    taskQuestions,
    answers,
    setAnswers,
    isLoading,
    error
  };
};
