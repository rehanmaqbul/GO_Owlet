import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import Navbar from '@/components/Navbar';

interface TaskLoadingScreenProps {
  taskId?: string | null;
}

const LoadingMessages = [
  "Gathering all your questions...",
  "Preparing your learning adventure...",
  "Setting up your mission...",
  "Almost ready for takeoff!",
  "Sorting out the challenges ahead..."
];

const TaskTitles: Record<string, string> = {
  '1': 'Math Quiz',
  '2': 'Geography and Science'
};

const TaskLoadingScreen = ({ taskId }: TaskLoadingScreenProps = {}) => {
  // Pick a random loading message
  const randomMessage = LoadingMessages[Math.floor(Math.random() * LoadingMessages.length)];
  
  // Get task-specific title if available
  const taskTitle = taskId && TaskTitles[taskId] 
    ? TaskTitles[taskId] 
    : null;
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <Navbar />
      <div className="h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-4">
        <div className="max-w-md mx-auto bg-[#e8d5c4]/30 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-amber-200 text-center">
          <div className="relative mx-auto mb-8 w-24 h-24">
            {/* Pulsing background circle */}
            <motion.div 
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.7, 0.3, 0.7]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut" 
              }}
              className="absolute inset-0 bg-amber-200 rounded-full"
            />
            
            {/* Spinner */}
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity, 
                ease: "linear" 
              }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Loader2 className="w-16 h-16 text-amber-600" />
            </motion.div>
          </div>
          
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-bold text-gray-800 mb-2"
          >
            Loading Task...
          </motion.h1>
          
          {taskTitle && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mb-4 bg-amber-100/50 text-amber-800 py-1 px-3 rounded-full text-sm inline-block"
            >
              {taskTitle}
            </motion.div>
          )}
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-gray-600 text-lg mb-4"
          >
            Please wait while we prepare your mission.
          </motion.p>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-amber-600 text-sm italic"
          >
            {randomMessage}
          </motion.p>
        </div>
      </div>
    </div>
  );
};

export default TaskLoadingScreen; 