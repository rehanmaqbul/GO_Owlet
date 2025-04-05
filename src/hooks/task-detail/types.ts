import { Task, Question, QuestionType } from '@/lib/types';

export interface TaskDetailState {
  task: Task | null;
  taskQuestions: Question[];
  answers: Record<string, string>;
  currentQuestionIndex: number;
  isSubmitting: boolean;
}

export interface UseTaskDetailReturn {
  user: any;
  task: Task | null;
  taskQuestions: Question[];
  answers: Record<string, string>;
  currentQuestionIndex: number;
  isSubmitting: boolean;
  isLoading: boolean;
  loadingError: string | null;
  handleAnswerChange: (questionId: string, answer: string) => void;
  handleNextQuestion: () => void;
  handlePreviousQuestion: () => void;
  isAnswerCorrect: (userAnswer: string, correctAnswer: string, questionType: QuestionType) => boolean;
  handleSubmitTask: () => void;
  handleAudioRecording: (questionId: string) => Promise<void>;
}
