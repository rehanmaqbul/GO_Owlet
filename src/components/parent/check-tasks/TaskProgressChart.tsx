import { CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface TaskProgressChartProps {
  completed: number;
  inProgress: number;
  notStarted: number;
  total: number;
}

const TaskProgressChart = ({ completed, inProgress, notStarted, total }: TaskProgressChartProps) => {
  // Calculate percentages
  const completedPercent = total > 0 ? Math.round((completed / total) * 100) : 0;
  const inProgressPercent = total > 0 ? Math.round((inProgress / total) * 100) : 0;
  const notStartedPercent = total > 0 ? Math.round((notStarted / total) * 100) : 0;
  
  // Calculate stroke dash offsets for the circle graphs
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  
  const completedOffset = circumference * (1 - completedPercent / 100);
  const inProgressOffset = circumference * (1 - inProgressPercent / 100);
  const notStartedOffset = circumference * (1 - notStartedPercent / 100);
  
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-40 h-40">
        {/* Background circle */}
        <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="#f3f4f6"
            strokeWidth="10"
          />
          
          {/* Completed circle */}
          <motion.circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="#22c55e"
            strokeWidth="10"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: completedOffset }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </svg>
        
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-amber-600">{completedPercent}%</span>
          <span className="text-sm text-gray-500">Complete</span>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4 mt-4 w-full">
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1 text-green-600">
            <CheckCircle2 className="h-4 w-4" />
            <span className="font-medium">{completed}</span>
          </div>
          <span className="text-xs text-gray-500">Completed</span>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1 text-amber-600">
            <Clock className="h-4 w-4" />
            <span className="font-medium">{inProgress}</span>
          </div>
          <span className="text-xs text-gray-500">In Progress</span>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1 text-gray-500">
            <AlertCircle className="h-4 w-4" />
            <span className="font-medium">{notStarted}</span>
          </div>
          <span className="text-xs text-gray-500">Not Started</span>
        </div>
      </div>
    </div>
  );
};

export default TaskProgressChart; 