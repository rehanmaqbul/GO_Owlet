
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface FileUploadProps {
  onUpload: (file: File) => Promise<void>;
  accept?: string;
  maxSize?: number; // in MB
  label?: string;
}

export const FileUpload = ({ 
  onUpload, 
  accept = '*', 
  maxSize = 5, 
  label = 'Upload file' 
}: FileUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    
    // Check file size (convert MB to bytes)
    if (file.size > maxSize * 1024 * 1024) {
      toast({
        title: "File too large",
        description: `File size should not exceed ${maxSize}MB`,
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsUploading(true);
      await onUpload(file);
      toast({
        title: "Upload successful",
        description: `${file.name} has been uploaded.`
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "There was a problem uploading your file.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
      // Reset the file input
      e.target.value = '';
    }
  };

  return (
    <div className="w-full">
      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-md border-gray-300 cursor-pointer bg-white/30 hover:bg-gray-50/50 transition-colors">
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          {isUploading ? (
            <>
              <Loader2 className="w-8 h-8 text-[#EB6B47] animate-spin mb-2" />
              <p className="text-sm text-gray-500">Uploading...</p>
            </>
          ) : (
            <>
              <Upload className="w-8 h-8 text-[#EB6B47] mb-2" />
              <p className="text-sm text-gray-500">{label}</p>
              <p className="text-xs text-gray-400 mt-1">Max size: {maxSize}MB</p>
            </>
          )}
        </div>
        <input 
          type="file" 
          className="hidden" 
          onChange={handleFileChange}
          accept={accept}
          disabled={isUploading}
        />
      </label>
    </div>
  );
};
