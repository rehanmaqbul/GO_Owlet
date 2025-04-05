import { useState, useCallback } from 'react';
import { FileDropZone } from './components/FileDropZone';
import { FileList } from './components/FileList';
import { Button } from '@/components/ui/button';
import { FormatGuidelines } from './FormatGuidelines';
import { UploadedFile, ContentType } from './types';
import { createFileObject, getAcceptedFileTypes } from './utils/fileUtils';
import { bulkUploadService } from '@/services/question/bulkUploadService';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';

interface FileUploaderProps {
  contentType: ContentType;
  onFilesUploaded?: (fileIds: string[]) => void;
  showUploadButton?: boolean;
}

export const FileUploader = ({ contentType, onFilesUploaded, showUploadButton = false }: FileUploaderProps) => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const { user } = useAuth();
  
  const acceptedFileTypes = getAcceptedFileTypes(contentType);
  
  const handleDrop = useCallback((newFiles: File[]) => {
    const fileObjects: UploadedFile[] = newFiles.map(createFileObject);
    setFiles(prev => [...prev, ...fileObjects]);
  }, []);
  
  const handleRemoveFile = useCallback((id: string) => {
    setFiles(prev => prev.filter(file => file.id !== id));
  }, []);
  
  const handleClearAllFiles = useCallback(() => {
    setFiles([]);
  }, []);
  
  // Update file status (e.g., progress, completion)
  const updateFileStatus = useCallback((id: string, status: 'uploading' | 'complete' | 'error', progress: number) => {
    setFiles(prev => 
      prev.map(file => 
        file.id === id 
          ? { ...file, status, progress } 
          : file
      )
    );
  }, []);
  
  const handleUpload = async () => {
    if (files.length === 0) {
      toast({
        title: "No files selected",
        description: "Please select files to upload first.",
        variant: "destructive",
      });
      return;
    }
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to upload files.",
        variant: "destructive",
      });
      return;
    }
    
    setIsUploading(true);
    
    try {
      // Process each file
      const uploadPromises = files.map(async (fileObj) => {
        // Find the original File object
        const originalFile = files.find(f => f.id === fileObj.id);
        if (!originalFile) return null;
        
        // Get the actual File object from the input (this would need to be stored differently in a real app)
        // For demo purposes, we're just using the file metadata we have
        const fileToUpload = new File([new Blob()], originalFile.name, { type: 'text/csv' });
        
        // Process the file and update its status as it progresses
        try {
          const uploadId = await bulkUploadService.processFile(
            fileToUpload, 
            updateFileStatus
          );
          
          // In a real implementation, we'd parse the file and upload the questions
          // Here we'll just simulate that with mock data
          const parsedQuestions = await bulkUploadService.parseCSVFile(fileToUpload);
          
          // Upload the questions to Supabase
          const questionCount = await bulkUploadService.uploadBulkQuestions(
            parsedQuestions,
            contentType
          );
          
          // Save metadata about this upload
          await bulkUploadService.saveUploadMetadata(
            originalFile.name,
            contentType,
            questionCount,
            user.id
          );
          
          return uploadId;
        } catch (error) {
          console.error('Error uploading file:', originalFile.name, error);
          updateFileStatus(fileObj.id, 'error', 0);
          return null;
        }
      });
      
      const uploadIds = (await Promise.all(uploadPromises)).filter(Boolean) as string[];
      
      if (uploadIds.length > 0) {
        toast({
          title: "Upload successful",
          description: `Successfully uploaded ${uploadIds.length} file(s).`,
        });
        
        if (onFilesUploaded) {
          onFilesUploaded(uploadIds);
        }
      }
    } catch (error) {
      console.error('Error in handleUpload:', error);
      toast({
        title: "Upload failed",
        description: "There was a problem uploading your files. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <FileDropZone 
        onDrop={handleDrop}
        acceptedFileTypes={acceptedFileTypes}
        maxFiles={5}
      />
      
      <FileList 
        files={files}
        onRemoveFile={handleRemoveFile}
        onClearAllFiles={handleClearAllFiles}
      />
      
      {files.length > 0 && (
        <div className="flex justify-end">
          <Button
            type="button"
            onClick={handleUpload}
            disabled={isUploading || files.length === 0}
            className={`${showUploadButton ? 'bg-gradient-to-br from-owl-blue to-owl-blue-dark text-white px-8 py-6 h-auto text-lg' : ''}`}
          >
            {isUploading ? 'Uploading...' : 'Upload Files'}
          </Button>
        </div>
      )}
      
      {!showUploadButton && (
        <FormatGuidelines contentType={contentType} />
      )}
    </div>
  );
};
