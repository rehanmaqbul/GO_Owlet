import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  CheckCircle, 
  XCircle,
  User,
  BookOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import { getChildById, getSubjectDetails } from '@/components/parent/check-tasks/mockData';

const SubjectAnswers = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [childInfo, setChildInfo] = useState<any>(null);
  const [subjectDetails, setSubjectDetails] = useState<any>(null);
  
  useEffect(() => {
    // Parse URL parameters
    const searchParams = new URLSearchParams(location.search);
    const childId = searchParams.get('childId');
    const subjectId = searchParams.get('subjectId');
    
    // Get child info
    if (childId) {
      const child = getChildById(childId);
      setChildInfo(child);
    }
    
    // Get subject details
    if (subjectId) {
      const details = getSubjectDetails(subjectId);
      setSubjectDetails(details);
    }
  }, [location.search]);
  
  const handleGoBack = () => {
    navigate(-1);
  };
  
  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };
  
  // Helper function to render question based on type
  const renderQuestion = (question: any) => {
    switch (question.type) {
      case 'multiple_choice':
        return (
          <div className="mt-3 space-y-2">
            {question.options?.map((option: string, index: number) => (
              <div 
                key={index}
                className={`
                  p-3 rounded-lg border flex items-center
                  ${question.childAnswer === option && question.correctAnswer === option
                    ? 'border-green-500 bg-green-50'
                    : question.childAnswer === option && question.correctAnswer !== option
                    ? 'border-red-500 bg-red-50'
                    : question.correctAnswer === option
                    ? 'border-green-500 border-dashed bg-white'
                    : 'border-gray-200 bg-white'}
                `}
              >
                <div className="mr-3">
                  {question.childAnswer === option && question.correctAnswer === option && (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                  {question.childAnswer === option && question.correctAnswer !== option && (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                  {question.childAnswer !== option && question.correctAnswer === option && (
                    <CheckCircle className="h-5 w-5 text-green-500 opacity-50" />
                  )}
                </div>
                <span>{option}</span>
              </div>
            ))}
          </div>
        );
      
      case 'fill_blank':
        return (
          <div className="mt-3">
            <div className={`
              p-3 rounded-lg border 
              ${question.isCorrect 
                ? 'border-green-500 bg-green-50' 
                : 'border-red-500 bg-red-50'}
            `}>
              <div className="flex justify-between">
                <span>Answer: {question.childAnswer}</span>
                {question.isCorrect 
                  ? <CheckCircle className="h-5 w-5 text-green-500" />
                  : <XCircle className="h-5 w-5 text-red-500" />
                }
              </div>
              
              {!question.isCorrect && (
                <div className="mt-2 pt-2 border-t border-red-200">
                  <span className="text-sm text-gray-600">
                    Correct answer: <span className="font-medium text-green-600">{question.correctAnswer}</span>
                  </span>
                </div>
              )}
            </div>
          </div>
        );
      
      case 'true_false':
        return (
          <div className="mt-3 space-y-2">
            {['True', 'False'].map((option) => (
              <div 
                key={option}
                className={`
                  p-3 rounded-lg border flex items-center
                  ${question.childAnswer === option && question.correctAnswer === option
                    ? 'border-green-500 bg-green-50'
                    : question.childAnswer === option && question.correctAnswer !== option
                    ? 'border-red-500 bg-red-50'
                    : question.correctAnswer === option
                    ? 'border-green-500 border-dashed bg-white'
                    : 'border-gray-200 bg-white'}
                `}
              >
                <div className="mr-3">
                  {question.childAnswer === option && question.correctAnswer === option && (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                  {question.childAnswer === option && question.correctAnswer !== option && (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                  {question.childAnswer !== option && question.correctAnswer === option && (
                    <CheckCircle className="h-5 w-5 text-green-500 opacity-50" />
                  )}
                </div>
                <span>{option}</span>
              </div>
            ))}
          </div>
        );
      
      case 'reading':
        return (
          <div className="mt-3">
            <div className={`
              p-3 rounded-lg border 
              ${question.isCorrect 
                ? 'border-green-500 bg-green-50' 
                : 'border-red-500 bg-red-50'}
            `}>
              <div className="flex justify-between">
                <span>Submission: {question.childAnswer}</span>
                {question.isCorrect 
                  ? <CheckCircle className="h-5 w-5 text-green-500" />
                  : <XCircle className="h-5 w-5 text-red-500" />
                }
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-owl-neutral-lighter to-white">
      <Navbar />
      
      <main className="pt-24 px-4 pb-16">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div 
            className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 p-6 mb-8 shadow-lg"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative z-10 flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <Button 
                    onClick={handleGoBack}
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full bg-white/20 text-white hover:bg-white/30 hover:text-white"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <h1 className="text-3xl font-bold text-white">
                    {subjectDetails?.name || 'Subject'} Answers
                  </h1>
                </div>
                <p className="text-white/90 mt-2 ml-10">
                  Reviewing {childInfo?.name || 'your child'}'s responses
                </p>
              </div>
              
              {childInfo && (
                <div className="flex items-center gap-3 bg-white/10 py-2 px-4 rounded-full">
                  <div className="bg-white/20 p-1.5 rounded-full">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-white font-medium">{childInfo.name}</span>
                </div>
              )}
            </div>
            
            {/* Decorative elements */}
            <div className="absolute right-6 top-6 w-24 h-24 bg-white/10 rounded-full"></div>
            <div className="absolute right-16 bottom-0 w-16 h-16 bg-white/5 rounded-full"></div>
            <div className="absolute left-1/2 top-1/3 w-8 h-8 bg-white/10 rounded-full"></div>
          </motion.div>
          
          {/* Performance Summary */}
          {subjectDetails && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-xl p-6 shadow-md border border-gray-100 mb-8"
            >
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg">
                  <BookOpen className="h-5 w-5 text-indigo-600" />
                  <span className="font-medium">{subjectDetails.name}</span>
                </div>
                
                <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg">
                  <span className="text-gray-500">Total Questions:</span>
                  <span className="font-medium">{subjectDetails.totalQuestions}</span>
                </div>
                
                <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-lg">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-gray-500">Correct:</span>
                  <span className="font-medium text-green-600">{subjectDetails.correctAnswers}</span>
                </div>
                
                <div className="flex items-center gap-2 bg-red-50 px-4 py-2 rounded-lg">
                  <XCircle className="h-4 w-4 text-red-600" />
                  <span className="text-gray-500">Wrong:</span>
                  <span className="font-medium text-red-600">{subjectDetails.wrongAnswers}</span>
                </div>
                
                <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg">
                  <span className="text-gray-500">Score:</span>
                  <span className="font-medium text-blue-600">{subjectDetails.percentage}%</span>
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Questions and Answers */}
          {subjectDetails && subjectDetails.questions && (
            <motion.div
              variants={container}
              initial="hidden"
              animate="visible"
              className="space-y-8"
            >
              {subjectDetails.questions.map((question: any, index: number) => (
                <motion.div 
                  key={question.id}
                  variants={item}
                  className={`bg-white rounded-xl shadow-md border p-6 
                    ${question.isCorrect ? 'border-green-100' : 'border-red-100'}`}
                >
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-medium text-owl-slate-dark flex items-center gap-2">
                      <span className="text-sm bg-gray-100 text-gray-800 px-2 py-1 rounded">
                        Question {index + 1}
                      </span>
                      {question.text}
                    </h3>
                    
                    <div className={`
                      flex items-center justify-center w-8 h-8 rounded-full 
                      ${question.isCorrect ? 'bg-green-100' : 'bg-red-100'}
                    `}>
                      {question.isCorrect 
                        ? <CheckCircle className="h-5 w-5 text-green-600" />
                        : <XCircle className="h-5 w-5 text-red-600" />
                      }
                    </div>
                  </div>
                  
                  {renderQuestion(question)}
                </motion.div>
              ))}
            </motion.div>
          )}
          
          {(!subjectDetails || !subjectDetails.questions) && (
            <div className="text-center p-8 bg-white rounded-xl shadow">
              <p className="text-gray-500">No questions available for this subject.</p>
            </div>
          )}
          
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 flex justify-center"
          >
            <Button
              onClick={handleGoBack}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Subject Overview
            </Button>
          </motion.div>
        </div>
      </main>
      
      <footer className="py-6 text-center text-owl-slate">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          © {new Date().getFullYear()} Guardian Owlet. All rights reserved.
        </motion.p>
      </footer>
    </div>
  );
};

export default SubjectAnswers; 