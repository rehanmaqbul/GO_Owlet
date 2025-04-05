import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Book, 
  Upload, 
  CheckCircle, 
  XCircle, 
  ToggleLeft, 
  Type, 
  Image, 
  BookOpen, 
  Headphones, 
  Bookmark, 
  Link, 
  PlayCircle 
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

export const ActionButtons = () => {
  const navigate = useNavigate();
  
  const handleUpload = (type: string) => {
    navigate('/bulk-upload', { state: { contentType: type } });
  };

  const uploadButtons = [
    {
      id: 'mcq',
      title: 'Insert MCQs',
      description: 'Upload multiple-choice questions with four options',
      icon: <FileText size={48} />,
      color: 'from-blue-500 to-blue-700',
      type: 'MCQ'
    },
    {
      id: 'yesno',
      title: 'Insert Yes/No',
      description: 'Upload Yes/No questions with two options',
      icon: <CheckCircle size={48} />,
      color: 'from-green-500 to-green-700',
      type: 'YesNo'
    },
    {
      id: 'truefalse',
      title: 'Insert True/False',
      description: 'Upload True/False questions with two options',
      icon: <ToggleLeft size={48} />,
      color: 'from-purple-500 to-purple-700',
      type: 'TrueFalse'
    },
    {
      id: 'fillblank',
      title: 'Insert Fill in the Blank',
      description: 'Upload questions with blanks and correct answers',
      icon: <Type size={48} />,
      color: 'from-amber-500 to-amber-700',
      type: 'FillInBlank'
    },
    {
      id: 'textquestion',
      title: 'Insert Question in Text',
      description: 'Upload text questions with image upload support',
      icon: <Image size={48} />,
      color: 'from-pink-500 to-pink-700',
      type: 'QuestionInText'
    },
    {
      id: 'readingtext',
      title: 'Insert Text for Reading',
      description: 'Upload reading passages with related questions',
      icon: <BookOpen size={48} />,
      color: 'from-indigo-500 to-indigo-700',
      type: 'TextForReading'
    },
    {
      id: 'audiolistening',
      title: 'Insert Audio for Listening',
      description: 'Upload audio files with related questions',
      icon: <Headphones size={48} />,
      color: 'from-red-500 to-red-700',
      type: 'AudioForListening'
    },
    {
      id: 'storytext',
      title: 'Insert Text for Story',
      description: 'Upload story texts with related questions',
      icon: <Bookmark size={48} />,
      color: 'from-emerald-500 to-emerald-700',
      type: 'TextForStory'
    },
    {
      id: 'articleurls',
      title: 'Insert Articles URLs',
      description: 'Upload links to external articles',
      icon: <Link size={48} />,
      color: 'from-cyan-500 to-cyan-700',
      type: 'ArticleURL'
    },
    {
      id: 'videourls',
      title: 'Insert Video URLs',
      description: 'Upload links to external videos',
      icon: <PlayCircle size={48} />,
      color: 'from-orange-500 to-orange-700',
      type: 'VideoURL'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
      {uploadButtons.map((button) => (
        <motion.div
          key={button.id}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <Card className="overflow-hidden border-none shadow-md group">
        <Button 
              onClick={() => handleUpload(button.type)}
              className={`w-full h-auto min-h-[12rem] py-8 px-4 flex flex-col items-center justify-center gap-4 rounded-lg bg-gradient-to-br ${button.color} hover:shadow-xl transition-all duration-300 text-white border-0`}
        >
              <div className="bg-white/25 p-4 rounded-full transform group-hover:scale-110 transition-transform duration-300">
                {button.icon}
          </div>
              <div className="space-y-3 text-center w-[85%] mx-auto">
                <h3 className="text-base font-semibold tracking-wide leading-tight min-h-[2.5rem] flex items-center justify-center">
                  {button.id === 'audiolistening' ? (
                    <>
                      <span className="block">Insert Audio for</span>
                      <span className="block">Listening</span>
                    </>
                  ) : (
                    button.title
                  )}
                </h3>
                <div className="mt-3 bg-white/20 backdrop-blur-sm text-white text-xs py-1.5 px-5 rounded-full mx-auto w-fit group-hover:bg-white/30 transition-all duration-300">
                  Click to upload
          </div>
          </div>
        </Button>
      </Card>
        </motion.div>
      ))}
    </div>
  );
};
