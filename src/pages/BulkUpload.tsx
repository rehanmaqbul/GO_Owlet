import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/auth';
import { fadeIn } from '@/lib/animations';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { 
  FileText, Download, FileQuestion, BookOpen, 
  Headphones, BookMarked, Video, FileImage, 
  FilePlus, FileSpreadsheet, Info
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const BulkUpload = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // Redirect if not admin
  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }
  
  if (user?.role !== 'admin') {
    navigate('/dashboard');
    return null;
  }

  // Handle navigation to specific content type upload page
  const handleNavigateToUpload = (contentType: string) => {
    navigate(`/bulk-upload/${contentType}`, { state: { contentType } });
  };

  // Content type definitions with icons, titles, and descriptions
  const contentTypes = [
    {
      id: 'curriculum_questions',
      title: 'Multiple-Choice Questions',
      description: 'Upload MCQs, True/False, Fill in the blank, and Yes/No questions',
      icon: FileQuestion,
      color: 'bg-blue-100 text-blue-700 hover:bg-blue-200'
    },
    {
      id: 'practice_questions',
      title: 'Practice Questions',
      description: 'Upload mixed practice questions with various answer formats',
      icon: FileSpreadsheet,
      color: 'bg-green-100 text-green-700 hover:bg-green-200'
    },
    {
      id: 'reading_materials',
      title: 'Reading Materials',
      description: 'Upload reading passages with comprehension questions',
      icon: BookOpen,
      color: 'bg-amber-100 text-amber-700 hover:bg-amber-200'
    },
    {
      id: 'audio_activities',
      title: 'Audio Activities',
      description: 'Upload listening exercises and audio-based questions',
      icon: Headphones,
      color: 'bg-purple-100 text-purple-700 hover:bg-purple-200'
    },
    {
      id: 'story_activities',
      title: 'Story Activities',
      description: 'Upload stories with lesson plans and questions',
      icon: BookMarked,
      color: 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
    },
    {
      id: 'video_resources',
      title: 'Video Resources',
      description: 'Upload video links with descriptions and categories',
      icon: Video,
      color: 'bg-red-100 text-red-700 hover:bg-red-200'
    },
    {
      id: 'image_resources',
      title: 'Image Resources',
      description: 'Upload images for use in activities and questions',
      icon: FileImage,
      color: 'bg-pink-100 text-pink-700 hover:bg-pink-200'
    },
    {
      id: 'document_resources',
      title: 'Document Resources',
      description: 'Upload PDFs, worksheets, and printable resources',
      icon: FileText,
      color: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
    }
  ];

  return (
    <div className="min-h-screen bg-owl-neutral">
      <Navbar />
      <main className="pt-24 px-4 pb-16 max-w-7xl mx-auto">
        <motion.div className="space-y-6" {...fadeIn}>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-medium text-owl-slate-dark">Bulk Upload</h1>
              <p className="text-owl-slate mt-1">
                Choose a content type to upload in bulk
              </p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => navigate('/admin/content')}
              className="flex items-center gap-2"
            >
              <Info size={16} />
              <span>Back to Content Management</span>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contentTypes.map((type) => (
              <Card key={type.id} className="overflow-hidden transition-all hover:shadow-md">
                <CardHeader className={`${type.color} flex flex-row items-center gap-4 p-4`}>
                  <type.icon className="h-8 w-8" />
                  <div>
                    <CardTitle className="text-lg">{type.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <CardDescription className="mb-4 text-gray-600">
                    {type.description}
                  </CardDescription>
                  <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                    <Button 
                      variant="default" 
                      className="flex-1 bg-owl-green-light text-owl-green-dark hover:bg-owl-green-light/80"
                      onClick={() => handleNavigateToUpload(type.id)}
                    >
                      <FilePlus className="h-4 w-4 mr-2" />
                      Upload
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => {
                        // Download template for the content type
                        // This would trigger the template download function
                        const downloadEvent = new CustomEvent('download-template', {
                          detail: { contentType: type.id }
                        });
                        window.dispatchEvent(downloadEvent);
                      }}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Template
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <Card className="p-6 bg-gray-50 border border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <Info className="h-6 w-6 text-blue-700" />
              </div>
              <div>
                <h3 className="font-medium text-lg mb-1">Need Help with Bulk Uploads?</h3>
                <p className="text-gray-600 mb-2">
                  Our comprehensive guide explains the process and formatting requirements.
                </p>
                <Button variant="link" className="p-0 h-auto text-blue-600 hover:text-blue-800">
                  View Upload Documentation
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};

export default BulkUpload;
