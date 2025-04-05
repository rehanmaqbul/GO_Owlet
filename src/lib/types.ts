
export type UserRole = 'admin' | 'teacher' | 'parent' | 'child';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string | null;
  childId?: string | null; // For parent users, reference to their child
  parentId?: string | null; // For child users, reference to their parent
}

export type QuestionType = 
  | 'multiple_choice' 
  | 'fill_blank' 
  | 'true_false' 
  | 'yes_no'
  | 'reading'      // Upload audio for reading task
  | 'listening'    // Child listens to audio and answers questions
  | 'learning_from_story' // Child reads a story and answers questions
  | 'story';       // Database type equivalent to learning_from_story

export type TaskType = 'curriculum' | 'skills';

export type Curriculum = 
  | 'american' 
  | 'england' 
  | 'scotland' 
  | 'australia' 
  | 'new_zealand' 
  | 'canada' 
  | 'uae';

export type Subject =
  | 'math'
  | 'french'
  | 'science'
  | 'english'
  | 'social_studies'
  | 'critical_thinking'
  | 'mindset'
  | 'arts'
  | 'decision_making_skills'
  | 'general_skills'
  | 'open_book_test'
  | 'learning_from_reading'
  | ''; // Adding empty string to allow for initial empty state

export interface Question {
  id: string;
  curriculum: Curriculum;
  subject: Subject;
  text: string;
  type: QuestionType;
  options?: string[];
  correctAnswer: string;
  audioUrl?: string; // For listening or reading questions
  storyText?: string; // For learning from story questions
  imageUrl?: string; // For visual questions
  videoUrl?: string; // For video-based questions
  createdAt: Date;
  updatedAt: Date;
}

export interface QuestionAttachment {
  id: string;
  question_id: string;
  file_url: string;
  file_type: 'image' | 'audio' | 'video' | 'document';
  file_name?: string;
  file_size?: number;
  uploaded_by?: string;
  created_at: Date;
}

export type TaskRecipientType = 'whole_class' | 'specific_students';

export interface Task {
  id: string;
  name: string; // New field for task name
  childId: string;
  assignedById: string;
  assignedByRole: 'teacher' | 'parent';
  subject: Subject;
  curriculum: Curriculum; // New field to store curriculum
  grade?: string; // New field for grade
  questions: string[];
  recipientType?: TaskRecipientType; // New field for recipient type
  studentIds?: string[]; // IDs of specific students if not whole class
  status: 'pending' | 'completed' | 'saved';
  results?: {
    score: number;
    total: number;
    answers: Record<string, string>;
  };
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  mediaUrl?: string;
  read: boolean;
  createdAt: Date;
}

export interface Class {
  id: string;
  name: string;
  teacherId: string;
  curriculum: Curriculum;
  studentIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Report {
  id: string;
  userId: string;
  title: string;
  description?: string;
  taskIds: string[];
  dateRange: {
    from: Date;
    to: Date;
  };
  generatedAt: Date;
  url?: string;
}

export interface Resource {
  id: string;
  type: 'article' | 'video';
  title: string;
  description: string;
  url: string;
  thumbnailUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}
