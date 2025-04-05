// Mock data for subject details
export interface Question {
  id: string;
  text: string;
  type: 'multiple_choice' | 'fill_blank' | 'true_false' | 'reading';
  options?: string[];
  correctAnswer: string;
  childAnswer?: string;
  isCorrect?: boolean;
}

export interface SubjectDetail {
  id: string;
  name: string;
  category: 'educational' | 'skills';
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  percentage: number;
  questions: Question[];
  grade?: string;
  assignedTasks?: number;
  completedTasks?: number;
}

// Mock subject details with questions
const mockSubjectDetails: Record<string, SubjectDetail> = {
  'subject-1': {
    id: 'subject-1',
    name: 'Science',
    category: 'educational',
    totalQuestions: 5,
    correctAnswers: 3,
    wrongAnswers: 2,
    percentage: 60,
    grade: '5',
    assignedTasks: 10,
    completedTasks: 8,
    questions: [
      {
        id: 'q1',
        text: 'Which planet is known as the Red Planet?',
        type: 'multiple_choice',
        options: ['Earth', 'Mars', 'Venus', 'Jupiter'],
        correctAnswer: 'Mars',
        childAnswer: 'Mars',
        isCorrect: true
      },
      {
        id: 'q2',
        text: 'What is the chemical symbol for water?',
        type: 'fill_blank',
        correctAnswer: 'H2O',
        childAnswer: 'H2O',
        isCorrect: true
      },
      {
        id: 'q3',
        text: 'Is the sun a star?',
        type: 'true_false',
        options: ['True', 'False'],
        correctAnswer: 'True',
        childAnswer: 'True',
        isCorrect: true
      },
      {
        id: 'q4',
        text: 'Which gas do plants absorb from the atmosphere?',
        type: 'multiple_choice',
        options: ['Oxygen', 'Carbon Dioxide', 'Nitrogen', 'Hydrogen'],
        correctAnswer: 'Carbon Dioxide',
        childAnswer: 'Oxygen',
        isCorrect: false
      },
      {
        id: 'q5',
        text: 'The Earth rotates around its axis once every ___ hours.',
        type: 'fill_blank',
        correctAnswer: '24',
        childAnswer: '12',
        isCorrect: false
      }
    ]
  },
  'subject-2': {
    id: 'subject-2',
    name: 'Math',
    category: 'educational',
    totalQuestions: 4,
    correctAnswers: 3,
    wrongAnswers: 1,
    percentage: 75,
    grade: '5',
    assignedTasks: 8,
    completedTasks: 7,
    questions: [
      {
        id: 'q6',
        text: 'What is 7 × 8?',
        type: 'multiple_choice',
        options: ['54', '56', '64', '72'],
        correctAnswer: '56',
        childAnswer: '56',
        isCorrect: true
      },
      {
        id: 'q7',
        text: 'What is the square root of 81?',
        type: 'fill_blank',
        correctAnswer: '9',
        childAnswer: '9',
        isCorrect: true
      },
      {
        id: 'q8',
        text: 'Is 17 a prime number?',
        type: 'true_false',
        options: ['True', 'False'],
        correctAnswer: 'True',
        childAnswer: 'True',
        isCorrect: true
      },
      {
        id: 'q9',
        text: 'What is 12 ÷ 4?',
        type: 'fill_blank',
        correctAnswer: '3',
        childAnswer: '4',
        isCorrect: false
      }
    ]
  },
  'subject-3': {
    id: 'subject-3',
    name: 'English',
    category: 'educational',
    totalQuestions: 3,
    correctAnswers: 2,
    wrongAnswers: 1,
    percentage: 67,
    grade: '5',
    assignedTasks: 12,
    completedTasks: 10,
    questions: [
      {
        id: 'q10',
        text: 'Which of these is a pronoun?',
        type: 'multiple_choice',
        options: ['Run', 'She', 'Happy', 'Quickly'],
        correctAnswer: 'She',
        childAnswer: 'She',
        isCorrect: true
      },
      {
        id: 'q11',
        text: 'What is the past tense of "eat"?',
        type: 'fill_blank',
        correctAnswer: 'ate',
        childAnswer: 'ate',
        isCorrect: true
      },
      {
        id: 'q12',
        text: 'A sentence must always end with a period.',
        type: 'true_false',
        options: ['True', 'False'],
        correctAnswer: 'False',
        childAnswer: 'True',
        isCorrect: false
      }
    ]
  }
};

// Helper function to get a subject's details by ID
export const getSubjectDetails = (subjectId: string): SubjectDetail | null => {
  console.log(`Getting subject details for ID: ${subjectId}`);
  // If it's one of our known subjects, return the details
  if (mockSubjectDetails[subjectId]) {
    return mockSubjectDetails[subjectId];
  }
  
  // For any other ID, return a default subject to prevent loading errors
  return {
    id: subjectId,
    name: `Subject ${subjectId}`,
    category: 'educational',
    totalQuestions: 5,
    correctAnswers: 4,
    wrongAnswers: 1,
    percentage: 80,
    grade: '5',
    assignedTasks: 10,
    completedTasks: 8,
    questions: [
      {
        id: 'q1',
        text: 'Sample question 1',
        type: 'multiple_choice',
        options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
        correctAnswer: 'Option 2',
        childAnswer: 'Option 2',
        isCorrect: true
      },
      {
        id: 'q2',
        text: 'Sample question 2',
        type: 'fill_blank',
        correctAnswer: 'Answer',
        childAnswer: 'Answer',
        isCorrect: true
      }
    ]
  };
}; 