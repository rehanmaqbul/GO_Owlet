import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Book } from 'lucide-react';
import TaskDetailsView from '@/components/parent/check-tasks/TaskDetailsView';
import { getChildById, getSubjectById } from '@/components/parent/check-tasks/mockData';

const TaskDetailsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [childId, setChildId] = useState<string>('');
  const [subjectId, setSubjectId] = useState<string>('');
  
  useEffect(() => {
    // Parse query parameters
    const params = new URLSearchParams(location.search);
    const childParam = params.get('childId');
    const subjectParam = params.get('subject');
    
    if (childParam) setChildId(childParam);
    if (subjectParam) setSubjectId(subjectParam);
  }, [location.search]);
  
  const handleBackToTasks = () => {
    navigate('/parent-check-tasks');
  };
  
  // Get child and subject info for the header
  const child = getChildById(childId);
  const subject = getSubjectById(subjectId);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
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
            className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 p-6 mb-8 shadow-lg"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative z-10 flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <Button 
                    onClick={handleBackToTasks}
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full bg-white/20 text-white hover:bg-white/30 hover:text-white"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <div>
                    <h1 className="text-3xl font-bold text-white">Task Details</h1>
                    {child && subject && (
                      <p className="text-white/90 mt-1">
                        {child.name} - {subject.name} ({subject.category})
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute right-6 top-6 w-24 h-24 bg-white/10 rounded-full"></div>
            <div className="absolute right-16 bottom-0 w-16 h-16 bg-white/5 rounded-full"></div>
            <div className="absolute left-1/2 top-1/3 w-8 h-8 bg-white/10 rounded-full"></div>
          </motion.div>
          
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            <motion.div variants={itemVariants}>
              {childId && subjectId ? (
                <TaskDetailsView 
                  childId={childId}
                  subjectId={subjectId}
                  onBack={handleBackToTasks}
                />
              ) : (
                <div className="bg-white rounded-xl p-8 shadow-md text-center">
                  <div className="bg-amber-50 p-4 rounded-full inline-block mb-4">
                    <Book className="h-8 w-8 text-amber-500" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Missing Information</h3>
                  <p className="text-gray-600 mb-6">
                    Child or subject information is missing. Please go back to the tasks page and select a task.
                  </p>
                  <Button onClick={handleBackToTasks}>Go Back to Tasks</Button>
                </div>
              )}
            </motion.div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default TaskDetailsPage;
