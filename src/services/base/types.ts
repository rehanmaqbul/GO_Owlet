
import { QuestionType } from '@/lib/types';

// Type for creating a new question
export interface CreateQuestionDTO {
  question_type: QuestionType;
  curriculum_id?: string;
  subject: string;
  topic?: string;
  difficulty?: string;
  question_text: string;
  answers?: any;
  correct_answer: any;
  explanation?: string;
  tags?: string[];
}

// Type for uploading attachments
export interface UploadAttachmentDTO {
  questionId: string;
  file: File;
}

// Helper function to map our QuestionType to the database enum type
export const mapQuestionTypeToDbType = (type: QuestionType): string => {
  // Map custom question types to database supported types
  switch(type) {
    case 'learning_from_story':
      return 'story'; // Map to the 'story' type in the database
    default:
      return type; // For other types that match directly
  }
};
