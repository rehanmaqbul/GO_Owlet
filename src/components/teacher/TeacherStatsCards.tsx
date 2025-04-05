import { Users, BookOpen, ClipboardList, MessageSquare, BarChart } from 'lucide-react';
import { motion } from 'framer-motion';

export const TeacherStatsCards = () => {
  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3"
    >
      <motion.div 
        variants={item}
        className="bg-white border border-blue-300 rounded-lg p-3 text-left shadow-sm"
      >
        <div className="flex items-center gap-2 mb-2">
          <div className="bg-blue-100 p-1.5 rounded-md">
            <Users className="h-4 w-4 text-blue-600" />
          </div>
          <span className="text-xs font-medium text-slate-700">Students</span>
        </div>
        <p className="text-2xl font-bold text-blue-600">42</p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="text-xs text-slate-500">Total students</span>
          <span className="text-xs font-medium text-emerald-600">+3</span>
        </div>
      </motion.div>
      
      <motion.div 
        variants={item}
        className="bg-white border border-emerald-300 rounded-lg p-3 text-left shadow-sm"
      >
        <div className="flex items-center gap-2 mb-2">
          <div className="bg-emerald-100 p-1.5 rounded-md">
            <BookOpen className="h-4 w-4 text-emerald-600" />
          </div>
          <span className="text-xs font-medium text-slate-700">Classes</span>
        </div>
        <p className="text-2xl font-bold text-emerald-600">4</p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="text-xs text-slate-500">Active classes</span>
        </div>
      </motion.div>
      
      <motion.div 
        variants={item}
        className="bg-white border border-amber-300 rounded-lg p-3 text-left shadow-sm"
      >
        <div className="flex items-center gap-2 mb-2">
          <div className="bg-amber-100 p-1.5 rounded-md">
            <ClipboardList className="h-4 w-4 text-amber-600" />
          </div>
          <span className="text-xs font-medium text-slate-700">Tasks</span>
        </div>
        <p className="text-2xl font-bold text-amber-600">12</p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="text-xs text-slate-500">Assigned tasks</span>
          <span className="text-xs font-medium text-amber-600">3 pending</span>
        </div>
      </motion.div>
      
      <motion.div 
        variants={item}
        className="bg-white border border-purple-300 rounded-lg p-3 text-left shadow-sm"
      >
        <div className="flex items-center gap-2 mb-2">
          <div className="bg-purple-100 p-1.5 rounded-md">
            <BarChart className="h-4 w-4 text-purple-600" />
          </div>
          <span className="text-xs font-medium text-slate-700">Completion</span>
        </div>
        <p className="text-2xl font-bold text-purple-600">76%</p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="text-xs text-slate-500">Task completion</span>
          <span className="text-xs font-medium text-purple-600">+4%</span>
        </div>
      </motion.div>
      
      <motion.div 
        variants={item}
        className="bg-white border border-rose-300 rounded-lg p-3 text-left shadow-sm"
      >
        <div className="flex items-center gap-2 mb-2">
          <div className="bg-rose-100 p-1.5 rounded-md">
            <MessageSquare className="h-4 w-4 text-rose-600" />
          </div>
          <span className="text-xs font-medium text-slate-700">Messages</span>
        </div>
        <p className="text-2xl font-bold text-rose-600">5</p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="text-xs text-slate-500">Unread messages</span>
          <span className="text-xs font-medium text-rose-600">2 new</span>
        </div>
      </motion.div>
    </motion.div>
  );
};
