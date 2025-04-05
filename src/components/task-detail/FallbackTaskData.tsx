import { Task, Question, Subject, Curriculum, QuestionType } from '@/lib/types';

// Fallback data for Task ID 1
export const fallbackTask1: Task = {
  id: '1',
  name: 'Math Quiz',
  subject: 'Mathematics' as Subject,
  status: 'pending',
  questions: ['q1', 'q4'],
  assignedByRole: 'teacher',
  assignedById: 'teacher-1',
  childId: 'child-1',
  curriculum: 'american' as Curriculum,
  grade: 'Grade 5',
  dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
  createdAt: new Date(),
  updatedAt: new Date(),
  results: undefined
};

// Fallback data for Task ID 2
export const fallbackTask2: Task = {
  id: '2',
  name: 'Geography and Science',
  subject: 'Geography' as Subject,
  status: 'pending',
  questions: ['q2', 'q3', 'q5'],
  assignedByRole: 'parent',
  assignedById: 'parent-1',
  childId: 'child-1',
  curriculum: 'american' as Curriculum,
  grade: 'Grade 5',
  dueDate: new Date(Date.now() + 48 * 60 * 60 * 1000),
  createdAt: new Date(),
  updatedAt: new Date(),
  results: undefined
};

// Fallback questions for both tasks
export const fallbackQuestions: Record<string, Question> = {
  'q1': {
    id: 'q1',
    text: 'What is 5 + 7?',
    type: 'multiple_choice' as QuestionType,
    options: ['10', '12', '15', '8'],
    correctAnswer: '12',
    subject: 'Mathematics' as Subject,
    curriculum: 'american' as Curriculum,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  'q2': {
    id: 'q2',
    text: 'The capital of France is ________.',
    type: 'fill_blank' as QuestionType,
    options: [],
    correctAnswer: 'Paris',
    subject: 'Geography' as Subject,
    curriculum: 'american' as Curriculum,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  'q3': {
    id: 'q3',
    text: 'The Earth is flat.',
    type: 'true_false' as QuestionType,
    options: ['True', 'False'],
    correctAnswer: 'False',
    subject: 'Science' as Subject,
    curriculum: 'american' as Curriculum,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  'q4': {
    id: 'q4',
    text: 'How many sides does a triangle have?',
    type: 'multiple_choice' as QuestionType,
    options: ['3', '4', '5', '6'],
    correctAnswer: '3',
    subject: 'Mathematics' as Subject,
    curriculum: 'american' as Curriculum,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  'q5': {
    id: 'q5',
    text: 'Is water a solid at room temperature?',
    type: 'yes_no' as QuestionType,
    options: ['Yes', 'No'],
    correctAnswer: 'No',
    subject: 'Science' as Subject,
    curriculum: 'american' as Curriculum,
    createdAt: new Date(),
    updatedAt: new Date()
  }
};

// Get task by ID
export const getFallbackTask = (id: string): Task | null => {
  if (id === '1') return fallbackTask1;
  if (id === '2') return fallbackTask2;
  return null;
};

// Get questions for a task
export const getFallbackQuestions = (questionIds: string[]): Question[] => {
  return questionIds.map(id => fallbackQuestions[id]).filter(Boolean);
}; 