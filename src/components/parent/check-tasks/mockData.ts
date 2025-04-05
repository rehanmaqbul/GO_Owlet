export interface SubjectItem {
  id: string;
  name: string;
  category: 'educational' | 'skills';
  icon?: string;
}

export interface Question {
  id: string;
  text: string;
  type: 'multiple_choice' | 'fill_blank' | 'true_false' | 'reading' | 'activity';
  options?: string[];
  correctAnswer: string;
  childAnswer?: string;
  isCorrect?: boolean;
  activityContent?: string;
  relatedQuestions?: string[]; // IDs of related practice questions
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
}

// Educational subjects
export const educationalSubjects: SubjectItem[] = [
  { id: 'subject-1', name: 'Science', category: 'educational', icon: '🔬' },
  { id: 'subject-2', name: 'Math', category: 'educational', icon: '📊' },
  { id: 'subject-3', name: 'English', category: 'educational', icon: '📝' },
  { id: 'subject-4', name: 'French', category: 'educational', icon: '🇫🇷' },
  { id: 'subject-5', name: 'Chemistry', category: 'educational', icon: '⚗️' },
  { id: 'subject-6', name: 'Biology', category: 'educational', icon: '🧬' },
  { id: 'subject-7', name: 'Physics', category: 'educational', icon: '🔭' },
  { id: 'subject-8', name: 'History', category: 'educational', icon: '🏛️' },
  { id: 'subject-9', name: 'Geography', category: 'educational', icon: '🌎' },
  { id: 'subject-10', name: 'Computer Science', category: 'educational', icon: '💻' },
];

// Skills subjects
export const skillsSubjects: SubjectItem[] = [
  { id: 'subject-11', name: 'Art', category: 'skills', icon: '🎨' },
  { id: 'subject-12', name: 'Music', category: 'skills', icon: '🎵' },
  { id: 'subject-13', name: 'Physical Education', category: 'skills', icon: '🏃' },
  { id: 'subject-14', name: 'Social Studies', category: 'skills', icon: '👥' },
  { id: 'subject-15', name: 'Drama', category: 'skills', icon: '🎭' },
  { id: 'subject-16', name: 'Economics', category: 'skills', icon: '📈' },
];

// Combine all subjects for backward compatibility
export const subjects: SubjectItem[] = [...educationalSubjects, ...skillsSubjects];

// Mock data for children
export const mockChildren = [
  { id: 'child-1', name: 'Alex Smith', age: 10, grade: 'Grade 5' },
  { id: 'child-2', name: 'Jamie Johnson', age: 8, grade: 'Grade 3' },
];

// Mock subject details with questions
export const mockSubjectDetails: Record<string, SubjectDetail> = {
  'subject-1': {
    id: 'subject-1',
    name: 'Science',
    category: 'educational',
    totalQuestions: 12,
    correctAnswers: 7,
    wrongAnswers: 3,
    percentage: 70,
    questions: [
      {
        id: 'q-activity-1',
        text: 'Watch the video about the Solar System and answer the following questions',
        type: 'reading',
        correctAnswer: 'Video about planets and solar system (8:30)',
        childAnswer: 'Watched video (8:30)',
        isCorrect: true,
        activityContent: 'This interactive video explains the structure of our solar system, including all planets and their characteristics.',
        relatedQuestions: ['q1', 'q2', 'q3']
      },
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
        text: 'Which planet is closest to the Sun?',
        type: 'multiple_choice',
        options: ['Mercury', 'Venus', 'Earth', 'Mars'],
        correctAnswer: 'Mercury',
        childAnswer: 'Mercury',
        isCorrect: true
      },
      {
        id: 'q3',
        text: 'How many planets are in our Solar System?',
        type: 'fill_blank',
        correctAnswer: '8',
        childAnswer: '9',
        isCorrect: false
      },
      {
        id: 'q-activity-2',
        text: 'Complete the experiment on water properties and answer the related questions',
        type: 'reading',
        correctAnswer: 'Hands-on experiment with water properties',
        childAnswer: 'Completed experiment',
        isCorrect: true,
        activityContent: 'This activity involved measuring water temperatures, observing freezing and boiling points, and understanding states of matter.',
        relatedQuestions: ['q4', 'q5', 'q6', 'q7']
      },
      {
        id: 'q4',
        text: 'What is the chemical symbol for water?',
        type: 'fill_blank',
        correctAnswer: 'H2O',
        childAnswer: 'H2O',
        isCorrect: true
      },
      {
        id: 'q5',
        text: 'At what temperature (in Celsius) does water boil at standard pressure?',
        type: 'multiple_choice',
        options: ['0°C', '50°C', '100°C', '212°C'],
        correctAnswer: '100°C',
        childAnswer: '100°C',
        isCorrect: true
      },
      {
        id: 'q6',
        text: 'Is the sun a star?',
        type: 'true_false',
        options: ['True', 'False'],
        correctAnswer: 'True',
        childAnswer: 'True',
        isCorrect: true
      },
      {
        id: 'q7',
        text: 'Which gas do plants absorb from the atmosphere?',
        type: 'multiple_choice',
        options: ['Oxygen', 'Carbon Dioxide', 'Nitrogen', 'Hydrogen'],
        correctAnswer: 'Carbon Dioxide',
        childAnswer: 'Oxygen',
        isCorrect: false
      },
      {
        id: 'q8',
        text: 'The Earth rotates around its axis once every ___ hours.',
        type: 'fill_blank',
        correctAnswer: '24',
        childAnswer: '12',
        isCorrect: false
      },
      {
        id: 'q9',
        text: 'All mammals give birth to live young.',
        type: 'true_false',
        options: ['True', 'False'],
        correctAnswer: 'False',
        childAnswer: 'True',
        isCorrect: false
      },
      {
        id: 'q10',
        text: 'How many bones are in the adult human body?',
        type: 'multiple_choice',
        options: ['106', '206', '306', '406'],
        correctAnswer: '206',
        childAnswer: '206',
        isCorrect: true
      }
    ]
  },
  'subject-2': {
    id: 'subject-2',
    name: 'Math',
    category: 'educational',
    totalQuestions: 12,
    correctAnswers: 9,
    wrongAnswers: 3,
    percentage: 75,
    questions: [
      {
        id: 'q-activity-3',
        text: 'Complete the interactive multiplication table activity',
        type: 'reading',
        correctAnswer: 'Interactive multiplication table exercise',
        childAnswer: 'Completed multiplication table exercise',
        isCorrect: true,
        activityContent: 'This interactive activity helped practice multiplication tables from 1-12 through games and visual aids.',
        relatedQuestions: ['q11', 'q12', 'q13', 'q14']
      },
      {
        id: 'q11',
        text: 'What is 7 × 8?',
        type: 'multiple_choice',
        options: ['54', '56', '64', '72'],
        correctAnswer: '56',
        childAnswer: '56',
        isCorrect: true
      },
      {
        id: 'q12',
        text: 'What is 12 × 11?',
        type: 'fill_blank',
        correctAnswer: '132',
        childAnswer: '132',
        isCorrect: true
      },
      {
        id: 'q13',
        text: 'What is 9 × 6?',
        type: 'multiple_choice',
        options: ['45', '54', '56', '64'],
        correctAnswer: '54',
        childAnswer: '54',
        isCorrect: true
      },
      {
        id: 'q14',
        text: 'What is 5 × 7?',
        type: 'fill_blank',
        correctAnswer: '35',
        childAnswer: '35',
        isCorrect: true
      },
      {
        id: 'q-activity-4',
        text: 'Complete the fractions and decimals conversion worksheet',
        type: 'reading',
        correctAnswer: 'Fractions to decimals conversion practice sheet',
        childAnswer: 'Completed conversion worksheet',
        isCorrect: true,
        activityContent: 'This activity focused on understanding the relationship between fractions and decimals through visual representations and conversion exercises.',
        relatedQuestions: ['q15', 'q16', 'q17', 'q18']
      },
      {
        id: 'q15',
        text: 'What is the square root of 81?',
        type: 'fill_blank',
        correctAnswer: '9',
        childAnswer: '9',
        isCorrect: true
      },
      {
        id: 'q16',
        text: 'Is 17 a prime number?',
        type: 'true_false',
        options: ['True', 'False'],
        correctAnswer: 'True',
        childAnswer: 'True',
        isCorrect: true
      },
      {
        id: 'q17',
        text: 'What is 1/4 + 1/2?',
        type: 'multiple_choice',
        options: ['1/6', '2/6', '3/4', '1'],
        correctAnswer: '3/4',
        childAnswer: '1/6',
        isCorrect: false
      },
      {
        id: 'q18',
        text: 'What is 0.25 as a fraction in simplest form?',
        type: 'fill_blank',
        correctAnswer: '1/4',
        childAnswer: '1/4',
        isCorrect: true
      },
      {
        id: 'q19',
        text: 'What is the perimeter of a square with sides of 5cm?',
        type: 'fill_blank',
        correctAnswer: '20cm',
        childAnswer: '25cm',
        isCorrect: false
      },
      {
        id: 'q20',
        text: 'What is the area of a rectangle with length 7m and width 4m?',
        type: 'multiple_choice',
        options: ['11m²', '22m²', '28m²', '42m²'],
        correctAnswer: '28m²',
        childAnswer: '28m²',
        isCorrect: true
      }
    ]
  },
  'subject-3': {
    id: 'subject-3',
    name: 'English',
    category: 'educational',
    totalQuestions: 10,
    correctAnswers: 6,
    wrongAnswers: 4,
    percentage: 60,
    questions: [
      {
        id: 'q-activity-5',
        text: 'Read the short story "The Fox and the Crow" and answer the comprehension questions',
        type: 'reading',
        correctAnswer: 'Reading comprehension story with moral lessons',
        childAnswer: 'Completed reading and answered questions',
        isCorrect: true,
        activityContent: 'This activity involved reading a classic Aesop\'s fable and answering questions about plot, characters, and the moral of the story.',
        relatedQuestions: ['q21', 'q22', 'q23', 'q24']
      },
      {
        id: 'q21',
        text: 'What did the crow have in its beak in the story?',
        type: 'multiple_choice',
        options: ['A worm', 'A piece of cheese', 'A nut', 'A fish'],
        correctAnswer: 'A piece of cheese',
        childAnswer: 'A piece of cheese',
        isCorrect: true
      },
      {
        id: 'q22',
        text: 'How did the fox trick the crow?',
        type: 'multiple_choice',
        options: ['He chased it', 'He climbed the tree', 'He flattered it to make it sing', 'He offered it better food'],
        correctAnswer: 'He flattered it to make it sing',
        childAnswer: 'He flattered it to make it sing',
        isCorrect: true
      },
      {
        id: 'q23',
        text: 'What is the main moral of the story?',
        type: 'multiple_choice',
        options: ['Never trust a fox', 'Be careful with strangers', 'Don\'t be fooled by flattery', 'Sharing is caring'],
        correctAnswer: 'Don\'t be fooled by flattery',
        childAnswer: 'Never trust a fox',
        isCorrect: false
      },
      {
        id: 'q24',
        text: 'Identify the noun in the sentence: "The fox saw the cheese."',
        type: 'multiple_choice',
        options: ['The', 'fox', 'saw', 'cheese'],
        correctAnswer: 'cheese',
        childAnswer: 'fox',
        isCorrect: false
      },
      {
        id: 'q-activity-6',
        text: 'Listen to the audio book excerpt and complete the listening exercise',
        type: 'reading',
        correctAnswer: 'Audio listening comprehension exercise (3:45)',
        childAnswer: 'Completed listening exercise',
        isCorrect: true,
        activityContent: 'This activity focused on listening skills by having students identify key details from an audio book excerpt.',
        relatedQuestions: ['q25', 'q26', 'q27']
      },
      {
        id: 'q25',
        text: 'Identify the verb in the sentence: "The cat sat on the mat."',
        type: 'multiple_choice',
        options: ['The', 'cat', 'sat', 'mat'],
        correctAnswer: 'sat',
        childAnswer: 'sat',
        isCorrect: true
      },
      {
        id: 'q26',
        text: 'What is the past tense of "run"?',
        type: 'fill_blank',
        correctAnswer: 'ran',
        childAnswer: 'runned',
        isCorrect: false
      },
      {
        id: 'q27',
        text: 'What is the opposite of "happy"?',
        type: 'fill_blank',
        correctAnswer: 'sad',
        childAnswer: 'sad',
        isCorrect: true
      },
      {
        id: 'q28',
        text: 'Which word is spelled correctly?',
        type: 'multiple_choice',
        options: ['recieve', 'receive', 'receeve', 'receve'],
        correctAnswer: 'receive',
        childAnswer: 'receive',
        isCorrect: true
      }
    ]
  }
};

export const getSubjectDetails = (subjectId: string): SubjectDetail | undefined => {
  return mockSubjectDetails[subjectId];
};

export const getChildById = (childId: string) => {
  return mockChildren.find(child => child.id === childId);
};

export const getSubjectById = (subjectId: string) => {
  return subjects.find(subject => subject.id === subjectId);
};
