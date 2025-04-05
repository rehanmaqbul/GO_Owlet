
import { supabase } from '@/integrations/supabase/client';
import { CreateQuestionDTO, mapQuestionTypeToDbType } from '../base/types';

// Helper function to normalize curriculum, subject, etc. values
const normalizeValue = (value: string): string => {
  return value.toLowerCase().replace(/ /g, '_');
};

export const questionCrudService = {
  // Create a new question
  async createQuestion(questionData: CreateQuestionDTO, creatorRole: string) {
    try {
      console.log('Creating question with data:', {
        ...questionData,
        creator_role: creatorRole,
        question_type: mapQuestionTypeToDbType(questionData.question_type),
        subject: normalizeValue(questionData.subject),
      });
      
      const { data, error } = await supabase
        .from('questions')
        .insert({
          creator_role: creatorRole,
          question_type: mapQuestionTypeToDbType(questionData.question_type) as any,
          curriculum_id: questionData.curriculum_id ? normalizeValue(questionData.curriculum_id) : null,
          subject: normalizeValue(questionData.subject),
          topic: questionData.topic,
          difficulty: questionData.difficulty,
          question_text: questionData.question_text,
          answers: questionData.answers,
          correct_answer: questionData.correct_answer,
          explanation: questionData.explanation,
          tags: questionData.tags,
        })
        .select()
        .single();

      if (error) {
        console.error('Supabase error creating question:', error);
        throw error;
      }
      
      console.log('Question created successfully:', data);
      return data;
    } catch (error) {
      console.error('Error creating question:', error);
      throw error;
    }
  },

  // Get all questions
  async getQuestions() {
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching questions:', error);
      throw error;
    }
  },

  // Get questions by subject
  async getQuestionsBySubject(subject: string) {
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('subject', subject)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching questions by subject:', error);
      throw error;
    }
  },

  // Get questions by creator role
  async getQuestionsByCreatorRole(role: string) {
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('creator_role', role)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching questions by creator role:', error);
      throw error;
    }
  },

  // Get a specific question by ID
  async getQuestionById(id: string) {
    try {
      const { data, error } = await supabase
        .from('questions')
        .select(`
          *,
          question_attachments(*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching question:', error);
      throw error;
    }
  },

  // Update a question
  async updateQuestion(id: string, questionData: Partial<CreateQuestionDTO>) {
    try {
      // Convert Date to ISO string if needed
      const updatedData: any = {
        ...questionData,
        updated_at: new Date().toISOString(),
      };
      
      // If question_type is being updated, map it to DB type
      if (questionData.question_type) {
        updatedData.question_type = mapQuestionTypeToDbType(questionData.question_type);
      }

      const { data, error } = await supabase
        .from('questions')
        .update(updatedData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating question:', error);
      throw error;
    }
  },

  // Delete a question
  async deleteQuestion(id: string) {
    try {
      const { error } = await supabase
        .from('questions')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting question:', error);
      throw error;
    }
  },

  // Search questions
  async searchQuestions(query: string) {
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .or(`question_text.ilike.%${query}%, subject.ilike.%${query}%, topic.ilike.%${query}%`);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error searching questions:', error);
      throw error;
    }
  }
};
