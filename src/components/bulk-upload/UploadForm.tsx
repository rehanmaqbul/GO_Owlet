import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { FileUploader } from './FileUploader';
import { ContentType } from './types';
import { getCSVTemplateURL } from './utils/templateUtils';
import { createDynamicCSVTemplate } from './utils/templateUtils';

export const UploadForm = () => {
  const { toast } = useToast();
  const location = useLocation();
  const [uploadedFileIds, setUploadedFileIds] = useState<string[]>([]);
  
  // Get content type from location state or default to curriculum_questions
  const contentType = (location.state?.contentType as ContentType) || 'curriculum_questions';
  
  const handleFilesUploaded = (fileIds: string[]) => {
    setUploadedFileIds(fileIds);
    
    if (fileIds.length > 0) {
      toast({
        title: "Upload successful",
        description: `${fileIds.length} files uploaded successfully.`,
      });
    }
  };
  
  const handleDownloadTemplate = () => {
    try {
      // Try to get the template URL first
      const templateURL = getCSVTemplateURL(contentType);
      
      // If we're using dynamic templates, create one on the fly
      if (templateURL.startsWith('/templates')) {
        // Create the CSV content
        const csvContent = createDynamicCSVTemplate(contentType);
        
        // Create a Blob with the CSV content
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        
        // Create a download link
        const link = document.createElement('a');
        link.href = url;
        link.download = `${contentType}_template.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Clean up the URL object
        setTimeout(() => {
          URL.revokeObjectURL(url);
        }, 100);
      } else {
        // If we have a direct URL, use it
        const link = document.createElement('a');
        link.href = templateURL;
        link.download = `${contentType}_template.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      
      toast({
        title: "Template downloaded",
        description: `${getContentTypeName(contentType)} format template has been downloaded.`,
      });
    } catch (error) {
      console.error('Error downloading template:', error);
      toast({
        title: "Download failed",
        description: "There was a problem downloading the template. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Upload {getContentTypeName(contentType)}</CardTitle>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-2 bg-owl-green-light text-owl-green-dark hover:bg-owl-green-light/80"
          onClick={handleDownloadTemplate}
        >
          <Download size={16} />
          <span>Download Format</span>
        </Button>
      </CardHeader>
      <CardContent>
        <FileUploader 
          contentType={contentType}
          onFilesUploaded={handleFilesUploaded}
          showUploadButton={true}
        />
      </CardContent>
    </Card>
  );
};

// Helper function to get a friendly name for the content type
function getContentTypeName(type: ContentType): string {
  const typeMap: Record<ContentType, string> = {
    'curriculum_questions': 'Multiple-Choice Questions',
    'skills_questions': 'Skills Questions',
    'reading_materials': 'Reading Materials',
    'learning_listening': 'Audio Content',
    'learning_stories': 'Stories',
    'tips_info': 'Articles & Videos'
  };
  
  return typeMap[type] || 'Content';
}
