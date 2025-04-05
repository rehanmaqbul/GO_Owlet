import { UserPlus, ClipboardList, MessageSquare, BarChart, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export const ParentStatsCards = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      <motion.div 
        className="bg-white border border-owl-blue-light rounded-lg p-3 text-left shadow-sm"
      >
        <div className="flex items-center gap-2 mb-2">
          <div className="bg-owl-blue-light p-1.5 rounded-md">
            <UserPlus className="h-4 w-4 text-owl-blue-dark" />
          </div>
          <span className="text-xs font-medium text-owl-slate-dark">Children</span>
        </div>
        <p className="text-2xl font-bold text-owl-blue-dark">2</p>
        <p className="text-xs text-gray-500 mt-0.5">Total registered</p>
      </motion.div>
      
      <motion.div 
        className="bg-white border border-owl-green-light rounded-lg p-3 text-left shadow-sm"
      >
        <div className="flex items-center gap-2 mb-2">
          <div className="bg-owl-green-light p-1.5 rounded-md">
            <ClipboardList className="h-4 w-4 text-owl-green-dark" />
          </div>
          <span className="text-xs font-medium text-owl-slate-dark">Tasks</span>
        </div>
        <p className="text-2xl font-bold text-owl-green-dark">8</p>
        <p className="text-xs text-gray-500 mt-0.5">Current tasks</p>
      </motion.div>
      
      <motion.div 
        className="bg-white border border-owl-yellow-light rounded-lg p-3 text-left shadow-sm"
      >
        <div className="flex items-center gap-2 mb-2">
          <div className="bg-owl-yellow-light p-1.5 rounded-md">
            <CheckCircle className="h-4 w-4 text-owl-yellow-dark" />
          </div>
          <span className="text-xs font-medium text-owl-slate-dark">Completed</span>
        </div>
        <p className="text-2xl font-bold text-owl-yellow-dark">5</p>
        <p className="text-xs text-gray-500 mt-0.5">Tasks completed</p>
      </motion.div>
      
      <motion.div 
        className="bg-white border border-owl-purple-light rounded-lg p-3 text-left shadow-sm"
      >
        <div className="flex items-center gap-2 mb-2">
          <div className="bg-owl-purple-light p-1.5 rounded-md">
            <BarChart className="h-4 w-4 text-owl-purple-dark" />
          </div>
          <span className="text-xs font-medium text-owl-slate-dark">Progress</span>
        </div>
        <p className="text-2xl font-bold text-owl-purple-dark">63%</p>
        <p className="text-xs text-gray-500 mt-0.5">Overall completion</p>
      </motion.div>
      
      <motion.div 
        className="bg-white border border-owl-red-light rounded-lg p-3 text-left shadow-sm"
      >
        <div className="flex items-center gap-2 mb-2">
          <div className="bg-owl-red-light p-1.5 rounded-md">
            <MessageSquare className="h-4 w-4 text-owl-red-dark" />
          </div>
          <span className="text-xs font-medium text-owl-slate-dark">Messages</span>
        </div>
        <p className="text-2xl font-bold text-owl-red-dark">3</p>
        <p className="text-xs text-gray-500 mt-0.5">Unread messages</p>
      </motion.div>
    </div>
  );
};
