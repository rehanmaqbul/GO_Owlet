import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  CheckCircle, 
  XCircle, 
  BarChart3, 
  Eye,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import { getChildById, getSubjectById, getSubjectDetails } from '@/components/parent/check-tasks/mockData';

const TaskDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedSubjects, setSelectedSubjects] = useState<any[]>([]);
  const [childInfo, setChildInfo] = useState<any>(null);
  
  useEffect(() => {
    // Parse URL parameters
    const searchParams = new URLSearchParams(location.search);
    const childId = searchParams.get('childId');
    const subjectIds = searchParams.get('subjects')?.split(',') || [];
    
    // Get child info
    if (childId) {
      const child = getChildById(childId);
      setChildInfo(child);
    }
    
    // Get subject details
    const subjectDetails = subjectIds.map(id => {
      const subject = getSubjectById(id);
      const details = getSubjectDetails(id);
      return { ...subject, ...details };
    }).filter(Boolean);
    
    setSelectedSubjects(subjectDetails);
  }, [location.search]);
  
  const handleViewAnswers = (subjectId: string) => {
    navigate(`/subject-answers?childId=${childInfo?.id}&subjectId=${subjectId}`);
  };
  
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
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-owl-neutral-lighter to-white">
      <Navbar />
      
      <main className="pt-24 px-4 pb-16">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div 
            className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 p-6 mb-8 shadow-lg"
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
                  <h1 className="text-3xl font-bold text-white">Task Details</h1>
                </div>
                <p className="text-white/90 mt-2 ml-10">
                  Performance overview for {childInfo?.name || 'your child'}
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
          
          {/* Subjects */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            {selectedSubjects.map((subject) => (
              <motion.div 
                key={subject.id} 
                variants={item}
                className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden"
              >
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 text-white">
                  <h2 className="text-xl font-bold">{subject.name}</h2>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Stats */}
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h3 className="text-sm font-medium text-gray-500">Total Questions</h3>
                          <p className="text-2xl font-bold text-owl-slate-dark mt-1">{subject.totalQuestions}</p>
                        </div>
                        
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h3 className="text-sm font-medium text-gray-500">Correct Answers</h3>
                          <p className="text-2xl font-bold text-green-600 mt-1">{subject.correctAnswers}</p>
                        </div>
                        
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h3 className="text-sm font-medium text-gray-500">Wrong Answers</h3>
                          <p className="text-2xl font-bold text-red-500 mt-1">{subject.wrongAnswers}</p>
                        </div>
                        
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h3 className="text-sm font-medium text-gray-500">Score</h3>
                          <p className="text-2xl font-bold text-blue-600 mt-1">{subject.percentage}%</p>
                        </div>
                      </div>
                      
                      <Button 
                        onClick={() => handleViewAnswers(subject.id)}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        Check the answers
                      </Button>
                    </div>
                    
                    {/* Graph */}
                    <div className="bg-gray-50 rounded-lg p-4 flex flex-col">
                      <h3 className="text-sm font-medium text-gray-500 mb-4 flex items-center gap-2">
                        <BarChart3 className="h-4 w-4 text-indigo-600" />
                        Performance Graph
                      </h3>
                      
                      <div className="flex-1 flex items-end space-x-2">
                        {/* Correct answers bar */}
                        <div className="flex flex-col items-center flex-1">
                          <div className="w-full bg-green-100 rounded-t-md" style={{ 
                            height: `${(subject.correctAnswers / subject.totalQuestions) * 100}%`,
                            minHeight: '20px'
                          }}>
                            <div className="w-full bg-green-500 rounded-t-md h-full flex items-center justify-center text-white font-bold">
                              {subject.correctAnswers}
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">Correct</p>
                        </div>
                        
                        {/* Wrong answers bar */}
                        <div className="flex flex-col items-center flex-1">
                          <div className="w-full bg-red-100 rounded-t-md" style={{ 
                            height: `${(subject.wrongAnswers / subject.totalQuestions) * 100}%`,
                            minHeight: '20px'
                          }}>
                            <div className="w-full bg-red-500 rounded-t-md h-full flex items-center justify-center text-white font-bold">
                              {subject.wrongAnswers}
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">Wrong</p>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm text-gray-700">{subject.correctAnswers} correct</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <XCircle className="h-4 w-4 text-red-500" />
                            <span className="text-sm text-gray-700">{subject.wrongAnswers} wrong</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
            
            {selectedSubjects.length === 0 && (
              <div className="text-center p-8 bg-white rounded-xl shadow">
                <p className="text-gray-500">No subjects selected or data available.</p>
              </div>
            )}
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

export default TaskDetails; 