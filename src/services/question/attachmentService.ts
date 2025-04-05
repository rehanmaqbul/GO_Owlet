
import { supabase } from '@/integrations/supabase/client';
import { UploadAttachmentDTO } from '../base/types';

export const attachmentService = {
  // Upload an attachment for a question
  async uploadAttachment(questionId: string, file: File) {
    try {
      // Generate a unique path for the file
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `${questionId}/${fileName}`;
      
      // Determine file type category
      let fileType = 'document';
      if (file.type.startsWith('image/')) {
        fileType = 'image';
      } else if (file.type.startsWith('audio/')) {
        fileType = 'audio';
      } else if (file.type.startsWith('video/')) {
        fileType = 'video';
      }
      
      // Upload the file to storage
      const { data: storageData, error: storageError } = await supabase
        .storage
        .from('media')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (storageError) throw storageError;
      
      // Get the public URL for the uploaded file
      const { data: { publicUrl } } = supabase
        .storage
        .from('media')
        .getPublicUrl(filePath);
      
      // Get the current user ID
      const { data: { user } } = await supabase.auth.getUser();
      const userId = user?.id;
      
      // Record the attachment in the database
      const { data: attachmentData, error: attachmentError } = await supabase
        .from('question_attachments')
        .insert({
          question_id: questionId,
          file_url: publicUrl,
          file_type: fileType,
          file_name: file.name,
          file_size: file.size,
          uploaded_by: userId // Now using the actual user ID, not a Promise
        })
        .select()
        .single();
      
      if (attachmentError) throw attachmentError;
      
      return attachmentData;
    } catch (error) {
      console.error('Error uploading attachment:', error);
      throw error;
    }
  },

  // Get all attachments for a question
  async getAttachments(questionId: string) {
    try {
      const { data, error } = await supabase
        .from('question_attachments')
        .select('*')
        .eq('question_id', questionId);
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching attachments:', error);
      throw error;
    }
  },

  // Delete an attachment
  async deleteAttachment(attachmentId: string) {
    try {
      // First get the attachment to get the file path
      const { data: attachment, error: fetchError } = await supabase
        .from('question_attachments')
        .select('*')
        .eq('id', attachmentId)
        .single();
      
      if (fetchError) throw fetchError;
      
      // Delete from storage if we have a URL
      if (attachment?.file_url) {
        // Extract the path from the URL
        const url = new URL(attachment.file_url);
        const pathMatch = url.pathname.match(/\/media\/object\/public\/(.+)/);
        if (pathMatch && pathMatch[1]) {
          const storagePath = decodeURIComponent(pathMatch[1]);
          
          // Delete from storage
          const { error: storageError } = await supabase
            .storage
            .from('media')
            .remove([storagePath]);
          
          if (storageError) {
            console.warn('Error deleting from storage:', storageError);
            // Continue anyway to delete the database record
          }
        }
      }
      
      // Delete the database record
      const { error: deleteError } = await supabase
        .from('question_attachments')
        .delete()
        .eq('id', attachmentId);
      
      if (deleteError) throw deleteError;
      
      return true;
    } catch (error) {
      console.error('Error deleting attachment:', error);
      throw error;
    }
  }
};
