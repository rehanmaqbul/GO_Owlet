
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { formatFileSize } from '../utils/fileUtils';
import { UploadedFile } from '../types';

interface FileItemProps {
  file: UploadedFile;
  onRemove: (id: string) => void;
}

export const FileItem = ({ file, onRemove }: FileItemProps) => {
  return (
    <div 
      key={file.id} 
      className="flex items-center justify-between p-3 bg-[#e8d5c4]/20 rounded-md"
    >
      <div className="flex-1 mr-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium truncate">{file.name}</p>
          <div className="flex items-center">
            <span className={`text-xs px-2 py-1 rounded-full ${
              file.status === 'complete' ? 'bg-green-100 text-green-800' :
              file.status === 'error' ? 'bg-red-100 text-red-800' :
              'bg-blue-100 text-blue-800'
            }`}>
              {file.status === 'complete' ? 'Complete' :
                file.status === 'error' ? 'Error' :
                'Uploading'}
            </span>
            <span className="text-xs text-muted-foreground ml-2">
              {formatFileSize(file.size)}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 ml-2"
              onClick={() => onRemove(file.id)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <Progress value={file.progress} className="h-2 mt-2" />
      </div>
    </div>
  );
};
