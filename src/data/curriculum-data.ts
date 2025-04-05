
import { Curriculum, QuestionType, Subject } from '@/lib/types';

export const subjects: { id: Subject; name: string }[] = [
  { id: 'math', name: 'Math' },
  { id: 'french', name: 'French' },
  { id: 'science', name: 'Science' },
  { id: 'english', name: 'English' },
  { id: 'social_studies', name: 'Social Studies' },
  { id: 'open_book_test', name: 'Open Book Test' },
  { id: 'learning_from_reading', name: 'Learning from Reading' },
  { id: 'arts', name: 'Arts' },
  { id: 'decision_making_skills', name: 'Decision Making Skills' },
  { id: 'general_skills', name: 'General Skills' },
  { id: 'critical_thinking', name: 'Critical Thinking' },
  { id: 'mindset', name: 'Mindset' },
];

export const curriculums: { id: Curriculum; name: string }[] = [
  { id: 'american', name: 'American' },
  { id: 'england', name: 'England' },
  { id: 'scotland', name: 'Scotland' },
  { id: 'australia', name: 'Australia' },
  { id: 'new_zealand', name: 'New Zealand' },
  { id: 'canada', name: 'Canada' },
  { id: 'uae', name: 'UAE' },
];

export const grades = ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'];
export const ageGroups = ['5-6 years', '7-8 years', '9-10 years', '11-12 years', '13-14 years', '15-16 years', '17-18 years'];

export const questionTypes: { id: QuestionType; name: string }[] = [
  { id: 'multiple_choice', name: 'MCQs' },
  { id: 'fill_blank', name: 'Fill in the Blank' },
  { id: 'true_false', name: 'True/False' },
  { id: 'yes_no', name: 'Yes/No' },
];

export interface QuestionFormValues {
  id?: string;  // Adding optional id for temporary identification
  text: string;
  type: QuestionType;
  options: string[];
  correctAnswer: string;
  imageUrl?: string; // Adding optional imageUrl
  audioUrl?: string; // Adding optional audioUrl
  videoUrl?: string; // Adding optional videoUrl for completeness
}

export const initialQuestionForm: QuestionFormValues = {
  text: '',
  type: 'multiple_choice',
  options: ['', '', '', ''],
  correctAnswer: '',
};
