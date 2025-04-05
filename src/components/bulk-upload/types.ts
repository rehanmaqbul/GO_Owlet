export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  status: 'uploading' | 'complete' | 'error';
  progress: number;
  error?: string;
}

export type ContentType = 
  | 'curriculum_questions'
  | 'practice_questions'
  | 'reading_materials'
  | 'audio_activities'
  | 'story_activities'
  | 'video_resources'
  | 'image_resources'
  | 'document_resources';

export interface BulkUploadFormValues {
  contentType: ContentType;
  gradeLevel: string;
  subject: string;
  curriculum: string;
  makePublic: boolean;
}

export const contentTypes = [
  { id: 'curriculum_questions', name: 'Multiple-Choice Questions' },
  { id: 'practice_questions', name: 'Practice Questions' },
  { id: 'reading_materials', name: 'Reading Materials' },
  { id: 'audio_activities', name: 'Audio Activities' },
  { id: 'story_activities', name: 'Story Activities' },
  { id: 'video_resources', name: 'Video Resources' },
  { id: 'image_resources', name: 'Image Resources' },
  { id: 'document_resources', name: 'Document Resources' },
];

export const gradeLevels = [
  'Kindergarten',
  '1st Grade',
  '2nd Grade',
  '3rd Grade',
  '4th Grade',
  '5th Grade',
];

export const subjects = [
  'Mathematics',
  'Science',
  'English',
  'Social Studies',
  'Art',
  'Music',
  'Physical Education',
  'Foreign Language',
];

export const curriculums = [
  'National Standard',
  'Common Core',
  'International Baccalaureate',
  'Montessori',
  'Waldorf',
];
