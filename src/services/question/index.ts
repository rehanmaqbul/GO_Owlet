
import { questionCrudService } from './questionCrudService';
import { attachmentService } from './attachmentService';
import { CreateQuestionDTO, UploadAttachmentDTO, mapQuestionTypeToDbType } from '../base/types';

// Export a combined service object for backwards compatibility
export const questionService = {
  ...questionCrudService,
  ...attachmentService,
};

// Export individual services and types
export {
  questionCrudService,
  attachmentService,
};

// Correctly re-export types with 'export type' syntax
export type { CreateQuestionDTO, UploadAttachmentDTO };

// Export the mapping function (not a type)
export { mapQuestionTypeToDbType };
