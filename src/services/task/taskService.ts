import { supabase } from '@/integrations/supabase/client';
import { Task, Question, Curriculum, Subject, QuestionType } from '@/lib/types';
import { Json } from '@/integrations/supabase/types';

// Mock data for development and fallback
const mockQuestions: Question[] = [
  {
    id: "q1",
    text: "What is 5 + 7?",
    type: "multiple_choice" as QuestionType,
    options: ["10", "12", "15", "8"],
    correctAnswer: "12",
    subject: "Mathematics" as Subject,
    curriculum: "american" as Curriculum,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "q2",
    text: "The capital of France is ________.",
    type: "fill_blank" as QuestionType,
    options: [],
    correctAnswer: "Paris",
    subject: "Geography" as Subject,
    curriculum: "american" as Curriculum,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "q3",
    text: "The Earth is flat.",
    type: "true_false" as QuestionType,
    options: ["True", "False"],
    correctAnswer: "False",
    subject: "Science" as Subject,
    curriculum: "american" as Curriculum,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "q4",
    text: "How many sides does a triangle have?",
    type: "multiple_choice" as QuestionType,
    options: ["3", "4", "5", "6"],
    correctAnswer: "3",
    subject: "Mathematics" as Subject,
    curriculum: "american" as Curriculum,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "q5",
    text: "Is water a solid at room temperature?",
    type: "yes_no" as QuestionType,
    options: ["Yes", "No"],
    correctAnswer: "No",
    subject: "Science" as Subject,
    curriculum: "american" as Curriculum,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const mockTasks: Record<string, Task> = {
  "1": {
    id: "1",
    name: "Math Quiz",
    subject: "Mathematics" as Subject,
    status: "pending",
    questions: ["q1", "q4"],
    assignedByRole: "teacher",
    assignedById: "teacher-1",
    childId: "child-1",
    curriculum: "american" as Curriculum,
    grade: "Grade 5",
    dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
    createdAt: new Date(),
    updatedAt: new Date(),
    results: undefined
  },
  "2": {
    id: "2",
    name: "Geography and Science",
    subject: "Geography" as Subject,
    status: "pending",
    questions: ["q2", "q3", "q5"],
    assignedByRole: "parent",
    assignedById: "parent-1",
    childId: "child-1",
    curriculum: "american" as Curriculum,
    grade: "Grade 5",
    dueDate: new Date(Date.now() + 48 * 60 * 60 * 1000),
    createdAt: new Date(),
    updatedAt: new Date(),
    results: undefined
  },
  "3": {
    id: "3",
    name: "Science Test",
    subject: "Science" as Subject,
    status: "completed",
    questions: ["q3", "q5"],
    assignedByRole: "teacher",
    assignedById: "teacher-1",
    childId: "child-1",
    curriculum: "american" as Curriculum,
    grade: "Grade 5",
    dueDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
    createdAt: new Date(),
    updatedAt: new Date(),
    results: {
      score: 2,
      total: 2,
      answers: {
        "q3": "False",
        "q5": "No"
      }
    }
  }
};

// Original fetchChildTasks implementation
export const originalFetchChildTasks = async (childId: string): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('child_id', childId)
      .order('created_at', { ascending: false });
      
    if (error) {
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in originalFetchChildTasks:', error);
    throw error;
  }
};

/**
 * Fetches a specific task by ID
 */
export const getTaskById = async (taskId: string): Promise<Task | null> => {
  console.log('getTaskById - called with taskId:', taskId, 'type:', typeof taskId);
  try {
    // Attempt to use Supabase first
    try {
      console.log('getTaskById - Attempting Supabase fetch for taskId:', taskId);
      const { data, error } = await supabase
        .rpc('get_task_by_id', { p_task_id: taskId });
      
      if (error) {
        console.error('getTaskById - Supabase error:', error);
        throw error;
      }

      if (!data || data.length === 0) {
        // If no data from Supabase, fall back to mock data
        console.log(`getTaskById - No task found in database for ID: ${taskId}, checking mock data`);
        
        // Convert taskId to string in case it's a number
        const taskIdStr = String(taskId);
        console.log('getTaskById - Available mock task IDs:', Object.keys(mockTasks));
        console.log('getTaskById - Looking up taskIdStr:', taskIdStr);
        
        const mockTask = mockTasks[taskIdStr];
        console.log('getTaskById - mockTask found:', mockTask ? 'yes' : 'no', mockTask);
        return mockTask || null;
      }

      console.log('getTaskById - Supabase data received:', data[0]);
      const taskData = data[0];
      
      // Convert the database model to our application model
      const task: Task = {
        id: taskData.id as string,
        name: taskData.name as string,
        subject: (taskData.subject || '') as Subject,
        status: (taskData.status || 'pending') as 'pending' | 'completed' | 'saved',
        questions: taskData.questions as string[] || [],
        assignedByRole: (taskData.assigned_by_role || 'parent') as 'teacher' | 'parent',
        assignedById: taskData.assigned_by_id as string,
        childId: taskData.child_id as string,
        curriculum: (taskData.curriculum || 'american') as Curriculum,
        grade: taskData.grade as string,
        dueDate: taskData.due_date ? new Date(taskData.due_date as string) : undefined,
        createdAt: new Date(taskData.created_at as string),
        updatedAt: new Date(taskData.updated_at as string),
        results: taskData.results ? 
          processTaskResults(taskData.results) : 
          undefined
      };

      return task;
    } catch (supabaseError) {
      console.warn("getTaskById - Supabase error, checking mock data:", supabaseError);
      // Fall back to mock data
      console.log('getTaskById - mockTasks available:', Object.keys(mockTasks));
      
      // Convert taskId to string in case it's a number
      const taskIdStr = String(taskId);
      console.log('getTaskById - Looking up taskIdStr:', taskIdStr);
      
      const mockTask = mockTasks[taskIdStr];
      console.log('getTaskById - mockTask found:', mockTask ? 'yes' : 'no', mockTask);
      return mockTask || null;
    }
  } catch (error) {
    console.error('Error in getTaskById:', error);
    // Last resort fallback to mock data
    
    // Convert taskId to string in case it's a number
    const taskIdStr = String(taskId);
    console.log('getTaskById - Last resort, looking up taskIdStr:', taskIdStr);
    
    const mockTask = mockTasks[taskIdStr];
    console.log('getTaskById - Last resort, mockTask found:', mockTask ? 'yes' : 'no');
    return mockTask || null;
  }
};

// Helper function to process task results with proper type checking
const processTaskResults = (results: any): Task['results'] => {
  if (!results) return undefined;
  
  // Convert string to object if needed
  const resultsObj = typeof results === 'string' ? JSON.parse(results) : results;
  
  return {
    score: typeof resultsObj.score === 'number' ? resultsObj.score : 0,
    total: typeof resultsObj.total === 'number' ? resultsObj.total : 0,
    answers: resultsObj.answers ? resultsObj.answers : {}
  };
};

/**
 * Fetches all questions for a specific task
 */
export const getQuestionsById = async (questionIds: string[]): Promise<Question[]> => {
  console.log('getQuestionsById - called with questionIds:', questionIds);
  try {
    if (!questionIds || questionIds.length === 0) {
      console.log('getQuestionsById - No question IDs provided');
      return [];
    }

    // Try to get data from Supabase
    try {
      console.log('getQuestionsById - Attempting Supabase fetch');
      const { data, error } = await supabase
        .rpc('get_questions_by_ids', { 
          p_question_ids: questionIds 
        });
      
      if (error) {
        console.error('getQuestionsById - Supabase error:', error);
        throw error;
      }

      if (!data || data.length === 0) {
        // If no data from Supabase, fall back to mock data
        console.log('getQuestionsById - No questions found in database, using mock data');
        const mockResults = mockQuestions.filter(q => questionIds.includes(q.id));
        console.log('getQuestionsById - Mock questions found:', mockResults.length);
        return mockResults;
      }

      console.log('getQuestionsById - Supabase data received, count:', data.length);
      
      // Transform the database model to our application model
      const questions: Question[] = data.map((question: any) => {
        let options: string[] = [];
        
        // Parse answers from JSON if available
        if (question.answers) {
          try {
            const parsedAnswers = typeof question.answers === 'string' 
              ? JSON.parse(question.answers) 
              : question.answers;
              
            if (Array.isArray(parsedAnswers)) {
              options = parsedAnswers;
            } else if (typeof parsedAnswers === 'object') {
              options = Object.values(parsedAnswers);
            }
          } catch (e) {
            console.error('Error parsing answers:', e);
          }
        }
        
        // Create curriculum and subject objects
        const curriculum = (question.curriculum_id || 'american') as Curriculum;
        
        const subject = (question.subject || '') as Subject;
        
        return {
          id: question.id,
          text: question.question_text,
          type: question.question_type as QuestionType,
          options,
          correctAnswer: question.correct_answer || '',
          subject,
          curriculum,
          storyText: question.explanation,
          audioUrl: question.audio_url,
          imageUrl: question.image_url,
          videoUrl: question.video_url,
          createdAt: new Date(question.created_at),
          updatedAt: new Date(question.updated_at || question.created_at)
        };
      });

      return questions;
    } catch (supabaseError) {
      console.warn("getQuestionsById - Supabase error, using mock data:", supabaseError);
      // Fall back to mock data
      const mockResults = mockQuestions.filter(q => questionIds.includes(q.id));
      console.log('getQuestionsById - Mock questions after Supabase error, count:', mockResults.length);
      return mockResults;
    }
  } catch (error) {
    console.error('Error in getQuestionsById:', error);
    // Last resort fallback to mock data
    const mockResults = mockQuestions.filter(q => questionIds.includes(q.id));
    console.log('getQuestionsById - Last resort mock questions, count:', mockResults.length);
    return mockResults;
  }
};

/**
 * Submits answers for a task
 */
export const submitTaskAnswers = async (
  taskId: string, 
  answers: Record<string, string>,
  score?: number,
  total?: number
): Promise<boolean> => {
  try {
    // First get the current task
    const { data: taskData, error: taskError } = await supabase
      .rpc('get_task_by_id', { p_task_id: taskId });
    
    if (taskError) {
      throw taskError;
    }

    if (!taskData || taskData.length === 0) {
      throw new Error('Task not found');
    }
    
    const task = taskData[0];
    
    // Process the current results safely
    let currentResults: any = {};
    if (task.results) {
      // Parse if string, otherwise use as is
      currentResults = typeof task.results === 'string' 
        ? JSON.parse(task.results) 
        : task.results;
    }
    
    // Ensure we have a valid object structure
    const currentAnswers = currentResults.answers || {};
    
    // Prepare the updated results object
    const updatedResults = {
      answers: {
        ...currentAnswers,
        ...answers
      },
      score: score !== undefined ? score : (currentResults.score || 0),
      total: total !== undefined ? total : (currentResults.total || 0)
    };
    
    // Count completed questions
    const completedQuestions = Object.keys(updatedResults.answers).length;
    
    // Update the task with the new results
    const { error: updateError } = await supabase
      .from('tasks')
      .update({
        results: updatedResults,
        status: completedQuestions >= (task.questions || []).length ? 
          'completed' : 'in-progress'
      })
      .eq('id', taskId);
    
    if (updateError) {
      throw updateError;
    }
    
    return true;
  } catch (error) {
    console.error('Error submitting task answers:', error);
    throw error;
  }
};

/**
 * Creates a new task
 */
export const createTask = async (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .insert({
        name: task.name,
        subject: task.subject,
        questions: task.questions,
        assigned_by_role: task.assignedByRole,
        assigned_by_id: task.assignedById,
        child_id: task.childId,
        curriculum: task.curriculum,
        grade: task.grade,
        due_date: task.dueDate?.toISOString(),
        status: 'pending'
      })
      .select('id');
    
    if (error) {
      console.error('Error creating task:', error);
      throw error;
    }

    return data[0].id;
  } catch (error) {
    console.error('Error in createTask:', error);
    throw error;
  }
};

/**
 * Fetches all tasks for a specific child
 */
export const fetchChildTasks = async (childId: string): Promise<any[]> => {
  try {
    // Try to get real data first
    try {
      const result = await originalFetchChildTasks(childId);
      if (result && result.length > 0) {
        return result;
      }
    } catch (err) {
      console.warn("Error in originalFetchChildTasks, using mock data:", err);
    }
    
    // Fallback to mock data
    console.log("No tasks found in database for child, using mock data");
    return Object.values(mockTasks);
  } catch (error) {
    console.warn("Error fetching child tasks, using mock data:", error);
    return Object.values(mockTasks);
  }
};

/**
 * Updates task results
 */
export const updateTaskWithResults = async (
  taskId: string, 
  answers: Record<string, string>,
  score: number,
  total: number
): Promise<boolean> => {
  return submitTaskAnswers(taskId, answers, score, total);
};

// Alias for backward compatibility
export const fetchTaskById = getTaskById;
export const fetchQuestionsByIds = getQuestionsById;
