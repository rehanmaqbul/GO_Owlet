
// Format file size helper function
export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' bytes';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

// Get accepted file types based on content type
export const getAcceptedFileTypes = (contentType: string): string => {
  switch (contentType) {
    case 'curriculum_questions':
    case 'skills_questions':
    case 'tips_info':
      return '.csv,.xlsx,.xls';
    case 'reading_materials':
    case 'learning_listening':
    case 'learning_stories':
      return '.zip';
    default:
      return '';
  }
};

// Create a file object with unique ID and initial status
export const createFileObject = (file: File) => ({
  id: crypto.randomUUID(),
  name: file.name,
  size: file.size,
  status: 'uploading' as const,
  progress: 0,
});
