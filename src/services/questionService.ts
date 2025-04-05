
import { questionService, mapQuestionTypeToDbType } from './question';
import type { CreateQuestionDTO, UploadAttachmentDTO } from './question';

// Re-export everything for backwards compatibility
export { questionService, mapQuestionTypeToDbType };
export type { CreateQuestionDTO, UploadAttachmentDTO };
