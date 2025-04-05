import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/auth';
import { fadeIn } from '@/lib/animations';
import Navbar from '@/components/Navbar';
import { UploadForm } from '@/components/bulk-upload/UploadForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText, Download, HelpCircle } from 'lucide-react';
import { FormatGuidelines } from '@/components/bulk-upload/FormatGuidelines';
import { createDynamicCSVTemplate } from '@/components/bulk-upload/utils/templateUtils';

const BulkUploadType = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { contentType } = useParams<{ contentType: string }>();
  const [pageTitle, setPageTitle] = useState('Content Upload');
  const [pageDescription, setPageDescription] = useState('');
  
  // Redirect if not admin
  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }
  
  if (user?.role !== 'admin') {
    navigate('/dashboard');
    return null;
  }

  useEffect(() => {
    // Set page title and description based on content type
    const typeInfo = getContentTypeInfo(contentType || '');
    setPageTitle(typeInfo.title);
    setPageDescription(typeInfo.description);
  }, [contentType]);

  // Handle template download
  const handleDownloadTemplate = () => {
    if (!contentType) return;
    
    try {
      // Create the CSV content
      const csvContent = createDynamicCSVTemplate(contentType as any);
      
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
    } catch (error) {
      console.error('Error downloading template:', error);
    }
  };

  return (
    <div className="min-h-screen bg-owl-neutral">
      <Navbar />
      <main className="pt-24 px-4 pb-16 max-w-7xl mx-auto">
        <motion.div className="space-y-6" {...fadeIn}>
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => navigate('/bulk-upload')}
                className="rounded-full mt-1"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-medium text-owl-slate-dark">{pageTitle}</h1>
                <p className="text-owl-slate mt-1">
                  {pageDescription || `Upload ${pageTitle} to the platform`}
                </p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-2 bg-owl-green-light text-owl-green-dark hover:bg-owl-green-light/80"
              onClick={handleDownloadTemplate}
            >
              <Download size={16} />
              <span>Download Template</span>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader className="border-b bg-gray-50">
                  <CardTitle className="text-xl">Upload {pageTitle}</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <UploadForm contentType={contentType as any} />
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:col-span-1">
              <Card>
                <CardHeader className="border-b bg-gray-50">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="h-5 w-5 text-blue-600" />
                    <CardTitle className="text-lg">Format Requirements</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <FormatGuidelines contentType={contentType as any} />
                </CardContent>
              </Card>
              
              <Card className="mt-6">
                <CardHeader className="border-b bg-gray-50">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-amber-600" />
                    <CardTitle className="text-lg">Documentation</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <p className="text-gray-600 mb-4">Need help with your bulk upload? Check our documentation for detailed instructions and examples.</p>
                  <Button variant="outline" className="w-full">
                    View Documentation
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

// Helper function to get content type information
function getContentTypeInfo(type: string) {
  const typeMap: Record<string, { title: string; description: string }> = {
    'curriculum_questions': {
      title: 'Multiple-Choice Questions',
      description: 'Upload MCQs, True/False, Fill in the blank, and Yes/No questions'
    },
    'practice_questions': {
      title: 'Practice Questions',
      description: 'Upload mixed practice questions with various answer formats'
    },
    'reading_materials': {
      title: 'Reading Materials',
      description: 'Upload reading passages with comprehension questions'
    },
    'audio_activities': {
      title: 'Audio Activities',
      description: 'Upload listening exercises and audio-based questions'
    },
    'story_activities': {
      title: 'Story Activities',
      description: 'Upload stories with lesson plans and questions'
    },
    'video_resources': {
      title: 'Video Resources',
      description: 'Upload video links with descriptions and categories'
    },
    'image_resources': {
      title: 'Image Resources',
      description: 'Upload images for use in activities and questions'
    },
    'document_resources': {
      title: 'Document Resources',
      description: 'Upload PDFs, worksheets, and printable resources'
    }
  };
  
  return typeMap[type] || { 
    title: 'Content Upload', 
    description: 'Upload educational content to the platform' 
  };
}

export default BulkUploadType; 