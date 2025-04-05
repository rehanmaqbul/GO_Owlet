
import { Task } from '@/lib/types';

// Mock data for tasks
export const mockTasks: Task[] = [
  {
    id: 'task-1',
    name: 'Math Fundamentals',
    childId: 'child-1',
    assignedById: 'parent-1',
    assignedByRole: 'parent',
    subject: 'math',
    curriculum: 'american',
    questions: ['q1', 'q2', 'q3'],
    status: 'pending',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'task-2',
    name: 'English Reading',
    childId: 'child-1',
    assignedById: 'parent-1',
    assignedByRole: 'parent',
    subject: 'english',
    curriculum: 'american',
    questions: ['q4', 'q5'],
    status: 'completed',
    results: {
      score: 2,
      total: 2,
      answers: {
        'q4': 'answer1',
        'q5': 'answer2',
      },
    },
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    updatedAt: new Date(),
  },
  {
    id: 'task-3',
    name: 'Science Experiment',
    childId: 'child-1',
    assignedById: 'teacher-1',
    assignedByRole: 'teacher',
    subject: 'science',
    curriculum: 'american',
    questions: ['q6', 'q7', 'q8', 'q9'],
    status: 'completed',
    results: {
      score: 3,
      total: 4,
      answers: {
        'q6': 'answer1',
        'q7': 'answer2',
        'q8': 'answer3',
        'q9': 'answer4',
      },
    },
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(),
  },
  {
    id: 'task-4',
    name: 'French Vocabulary',
    childId: 'child-1',
    assignedById: 'parent-1',
    assignedByRole: 'parent',
    subject: 'french',
    curriculum: 'american',
    questions: ['q10', 'q11'],
    status: 'completed',
    results: {
      score: 1,
      total: 2,
      answers: {
        'q10': 'answer1',
        'q11': 'answer2',
      },
    },
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(),
  },
];
