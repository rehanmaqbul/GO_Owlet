
import { useState } from 'react';
import { Upload } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface FileDropZoneProps {
  acceptedFileTypes: string;
  onDrop: (files: File[]) => void;
  maxFiles?: number;
}

export const FileDropZone = ({ acceptedFileTypes, onDrop, maxFiles = 5 }: FileDropZoneProps) => {
  const [isDragging, setIsDragging] = useState(false);
  
  // Handle file drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (maxFiles && files.length > maxFiles) {
      // Could add a toast notification here
      console.warn(`Maximum ${maxFiles} files allowed`);
      onDrop(files.slice(0, maxFiles));
    } else {
      onDrop(files);
    }
  };
  
  // Handle file selection via input
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    
    const files = Array.from(e.target.files);
    if (maxFiles && files.length > maxFiles) {
      console.warn(`Maximum ${maxFiles} files allowed`);
      onDrop(files.slice(0, maxFiles));
    } else {
      onDrop(files);
    }
    
    // Reset the input
    e.target.value = '';
  };
  
  // Extract file type description from acceptedFileTypes
  const getFileTypeDescription = () => {
    return acceptedFileTypes.includes('.csv') || 
           acceptedFileTypes.includes('.xlsx') || 
           acceptedFileTypes.includes('.xls')
      ? 'Accepts Excel/CSV files'
      : 'Accepts ZIP files';
  };
  
  return (
    <div 
      className={`border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center ${
        isDragging ? 'border-primary bg-primary/5' : 'border-input'
      }`}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
    >
      <Input
        type="file"
        id="file-upload"
        className="hidden"
        multiple
        accept={acceptedFileTypes}
        onChange={handleFileSelect}
      />
      <label
        htmlFor="file-upload"
        className="flex flex-col items-center justify-center cursor-pointer"
      >
        <Upload className="h-10 w-10 text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground">
          Drag files here or click to upload
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {getFileTypeDescription()}
        </p>
      </label>
    </div>
  );
};
