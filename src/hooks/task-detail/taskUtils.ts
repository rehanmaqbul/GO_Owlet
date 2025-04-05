
import { QuestionType } from '@/lib/types';

export const isAnswerCorrect = (userAnswer: string, correctAnswer: string, questionType: QuestionType): boolean => {
  if (questionType === 'fill_blank') {
    // Case-insensitive comparison for fill in the blank questions
    return userAnswer.toLowerCase() === correctAnswer.toLowerCase();
  } else {
    // For other question types, exact match is required
    return userAnswer === correctAnswer;
  }
};
