
import { Subject } from '@/lib/types';

export interface SubjectTask {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  estimatedTime: string;
  questionCount: number;
  completed: boolean;
}

export const getSubjectTasks = (subject: string): SubjectTask[] => {
  const formattedSubject = subject.toLowerCase().replace(/_/g, ' ');
  
  switch (formattedSubject) {
    case 'math':
      return [
        {
          id: 'math-1',
          title: 'Addition and Subtraction',
          description: 'Practice basic addition and subtraction operations.',
          dueDate: 'Tomorrow',
          estimatedTime: '15 mins',
          questionCount: 3,
          completed: false
        },
        {
          id: 'task-1',
          title: 'Math Practice',
          description: 'Practice various math problems including multiple choice questions.',
          dueDate: 'Today',
          estimatedTime: '20 mins',
          questionCount: 3,
          completed: false
        }
      ];
    case 'science':
      return [
        {
          id: 'science-2',
          title: 'Plant Life Cycle',
          description: 'Learn about the different stages of plant growth.',
          dueDate: 'Friday',
          estimatedTime: '25 mins',
          questionCount: 4,
          completed: false
        }
      ];
    case 'english':
      return [
        {
          id: 'task-2',
          title: 'English Assessment',
          description: 'Test your English knowledge with various question types.',
          dueDate: 'Monday',
          estimatedTime: '30 mins',
          questionCount: 2,
          completed: true
        },
        {
          id: 'english-1',
          title: 'Reading and Comprehension',
          description: 'Practice reading out loud and answer comprehension questions.',
          dueDate: 'Wednesday',
          estimatedTime: '25 mins',
          questionCount: 5,
          completed: false
        }
      ];
    case 'french':
      return [
        {
          id: 'french-1',
          title: 'Basic Vocabulary',
          description: 'Practice basic French vocabulary with listening exercises.',
          dueDate: 'Next Week',
          estimatedTime: '20 mins',
          questionCount: 6,
          completed: false
        }
      ];
    case 'social studies':
      return [
        {
          id: 'social-1',
          title: 'World Geography',
          description: 'Learn about world geography through stories and questions.',
          dueDate: 'Thursday',
          estimatedTime: '40 mins',
          questionCount: 5,
          completed: false
        }
      ];
    default:
      return [];
  }
};

export const formatSubjectName = (subject: string): string => {
  const formattedSubject = subject.replace(/_/g, ' ');
  return formattedSubject
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
