
import { Curriculum, Question, Subject } from '@/lib/types';

// Sample questions for the parent task assignment
export const mockQuestions: Question[] = [
  {
    id: 'q1',
    text: 'What is 2 + 2?',
    type: 'multiple_choice',
    curriculum: 'american',
    subject: 'math',
    options: ['3', '4', '5', '6'],
    correctAnswer: '4',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'q2',
    text: 'Water boils at 100 degrees Celsius.',
    type: 'true_false',
    curriculum: 'american',
    subject: 'science',
    correctAnswer: 'True',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'q3',
    text: 'Is the Earth flat?',
    type: 'yes_no',
    curriculum: 'american',
    subject: 'science',
    correctAnswer: 'No',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'q4',
    text: 'The capital of France is ________.',
    type: 'fill_blank',
    curriculum: 'england',
    subject: 'social_studies',
    correctAnswer: 'Paris',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'q5',
    text: 'Which planet is known as the Red Planet?',
    type: 'multiple_choice',
    curriculum: 'american',
    subject: 'science',
    options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
    correctAnswer: 'Mars',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Sample children for parent to select
export const mockChildren = [
  { id: 'child1', name: 'Alex Smith', age: 8, grade: 'Grade 3' },
  { id: 'child2', name: 'Taylor Jones', age: 6, grade: 'Grade 1' }
];

// Sample tasks for demonstration
export const mockTasks = [
  {
    id: 'task1',
    name: 'Math Practice',
    childId: 'child1',
    assignedById: 'parent1',
    assignedByRole: 'parent' as const,
    subject: 'math',
    curriculum: 'american',
    grade: 'Grade 3',
    questions: ['q1', 'q5'],
    status: 'pending' as const,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'task2',
    name: 'Science Quiz',
    childId: 'child1',
    assignedById: 'parent1',
    assignedByRole: 'parent' as const,
    subject: 'science',
    curriculum: 'american',
    grade: 'Grade 3',
    questions: ['q2', 'q3', 'q5'],
    status: 'completed' as const,
    results: {
      score: 3,
      total: 3,
      answers: {
        'q2': 'True',
        'q3': 'No',
        'q5': 'Mars'
      }
    },
    createdAt: new Date(),
    updatedAt: new Date()
  }
];
