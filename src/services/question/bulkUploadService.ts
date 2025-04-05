
import { supabase } from '@/integrations/supabase/client';
import { UploadedFile } from '@/components/bulk-upload/types';
import { toast } from '@/components/ui/use-toast';
import { mapQuestionTypeToDbType } from '../base/types';
import type { Database } from '@/integrations/supabase/types';

// Helper function to normalize curriculum, subject, etc. values
const normalizeValue = (value: string): string => {
  return value.toLowerCase().replace(/ /g, '_');
};

export const bulkUploadService = {
  // Process uploaded file and update its status
  async processFile(file: File, updateFileStatus: (id: string, status: 'uploading' | 'complete' | 'error', progress: number) => void): Promise<string> {
    try {
      // Generate a unique ID for this upload
      const uploadId = crypto.randomUUID();
      
      // Parse file content based on its type (would integrate with CSV/Excel parser in a real implementation)
      console.log('Processing file:', file.name, 'of type:', file.type);
      
      // For demo purposes, simulate upload with a delay
      setTimeout(() => {
        // Simulate progress updates
        updateFileStatus(uploadId, 'uploading', 50);
        
        setTimeout(() => {
          // Mark as complete after "processing"
          updateFileStatus(uploadId, 'complete', 100);
        }, 1500);
      }, 1000);
      
      return uploadId;
    } catch (error) {
      console.error('Error processing file:', error);
      toast({
        title: 'Error processing file',
        description: 'There was a problem processing your file. Please try again.',
        variant: 'destructive',
      });
      throw error;
    }
  },

  // Function to upload multiple questions at once from a parsed file
  async uploadBulkQuestions(questions: any[], contentType: string): Promise<number> {
    try {
      // Map the content type to the expected format in the database
      const mappedContentType = contentType.toLowerCase().replace(/ /g, '_');
      
      // Prepare questions for insertion
      const formattedQuestions = questions.map(q => ({
        question_text: q.questionText || q.question || '',
        question_type: mapQuestionTypeToDbType(q.questionType || q.type || 'multiple_choice') as Database['public']['Enums']['question_type'],
        creator_role: q.creatorRole || 'teacher',
        curriculum_id: q.curriculumId ? normalizeValue(q.curriculumId) : null,
        subject: normalizeValue(q.subject || ''),
        topic: q.topic || null,
        difficulty: q.difficulty || 'medium',
        answers: q.options || q.answers || null,
        correct_answer: q.correctAnswer || q.answer || '',
        explanation: q.explanation || null,
        tags: q.tags ? (Array.isArray(q.tags) ? q.tags : [q.tags]) : null,
      }));
      
      console.log('Uploading bulk questions:', formattedQuestions);
      
      // Insert the questions into the database
      const { data, error } = await supabase
        .from('questions')
        .insert(formattedQuestions);

      if (error) {
        console.error('Error uploading bulk questions:', error);
        throw error;
      }
      
      console.log('Successfully uploaded questions:', data);
      return formattedQuestions.length; // Return the number of questions uploaded
    } catch (error) {
      console.error('Error in uploadBulkQuestions:', error);
      toast({
        title: 'Error uploading questions',
        description: 'There was a problem uploading your questions. Please check your file format and try again.',
        variant: 'destructive',
      });
      throw error;
    }
  },

  // Parse CSV file
  async parseCSVFile(file: File): Promise<any[]> {
    // In a real implementation, this would use a library like papaparse to parse CSV files
    console.log('Parsing CSV file:', file.name);
    
    // For demo, return mock parsed data
    return [
      {
        questionText: 'What is the capital of France?',
        type: 'multiple_choice',
        subject: 'geography',
        options: ['London', 'Paris', 'Berlin', 'Madrid'],
        correctAnswer: 'Paris',
      },
      {
        questionText: 'Is the Earth round?',
        type: 'true_false',
        subject: 'science',
        correctAnswer: 'true',
      }
    ];
  },

  // Save upload metadata to track upload history
  async saveUploadMetadata(fileName: string, contentType: string, questionCount: number, userId: string): Promise<void> {
    try {
      // Now we're using the question_uploads table we created
      const { error } = await supabase
        .from('question_uploads')
        .insert({
          file_name: fileName,
          content_type: contentType,
          question_count: questionCount,
          uploaded_by: userId,
        });

      if (error) {
        console.error('Error saving upload metadata:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in saveUploadMetadata:', error);
      // Non-critical error, just log it
    }
  }
};
