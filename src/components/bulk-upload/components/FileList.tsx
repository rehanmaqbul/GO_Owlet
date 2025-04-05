
import { Button } from '@/components/ui/button';
import { FileItem } from './FileItem';
import { UploadedFile } from '../types';

interface FileListProps {
  files: UploadedFile[];
  onRemoveFile: (id: string) => void;
  onClearAllFiles: () => void;
}

export const FileList = ({ files, onRemoveFile, onClearAllFiles }: FileListProps) => {
  if (files.length === 0) {
    return null;
  }
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Uploaded Files</h3>
        <Button 
          type="button" 
          variant="outline" 
          size="sm"
          onClick={onClearAllFiles}
        >
          Clear All
        </Button>
      </div>
      
      <div className="space-y-2">
        {files.map(file => (
          <FileItem 
            key={file.id} 
            file={file} 
            onRemove={onRemoveFile} 
          />
        ))}
      </div>
    </div>
  );
};
