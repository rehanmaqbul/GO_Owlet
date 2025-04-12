import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ClipboardList, BookMarked, Users, BookOpen, MessageSquare } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

export const TeacherActionButtons = () => {
  const navigate = useNavigate();
  
  const handleButtonClick = (path: string, label: string) => {
    try {
      navigate(path);
    } catch (error) {
      console.error(`Error navigating to ${label}:`, error);
      toast({
        title: "Navigation Error",
        description: `Could not navigate to ${label}. Please try again.`,
        variant: "destructive"
      });
    }
  };

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const item = {
    hidden: { y: 10, opacity: 0 },
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

  const actions = [
    {
      id: 1,
      label: 'Check Tasks',
      path: '/check-tasks',
      icon: ClipboardList,
      color: 'from-blue-500 to-blue-700',
      description: 'Review student submissions'
    },
    {
      id: 2,
      label: 'Assign Task',
      path: '/create-task',
      icon: BookMarked,
      color: 'from-green-500 to-green-700',
      description: 'Create new assignments'
    },
    {
      id: 3,
      label: 'Management',
      path: '/create-class',
      icon: Users,
      color: 'from-purple-500 to-purple-700',
      description: 'Manage classes & students'
    },
    {
      id: 4,
      label: 'Resources',
      path: '/parent-resources',
      icon: BookOpen,
      color: 'from-amber-500 to-amber-700',
      description: 'Educational materials'
    },
    {
      id: 5,
      label: 'Messages',
      path: '/teacher-messages',
      icon: MessageSquare,
      color: 'from-cyan-500 to-cyan-700',
      description: 'Communicate with parents'
    }
  ];

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-2 md:grid-cols-5 gap-4"
    >
      {actions.map((action) => (
        <motion.div 
          key={action.id}
          variants={item}
          whileHover={{ 
            scale: 1.03,
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)"
          }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          className="cursor-pointer"
          onClick={() => handleButtonClick(action.path, action.label)}
        >
          <Card className="overflow-hidden border-none shadow-md h-full group">
            <div className="flex flex-col h-full">
              <div 
                className={`w-full py-4 px-3 flex flex-col items-center justify-center gap-2 rounded-t-lg bg-gradient-to-br ${action.color} text-white`}
              >
                <div className="bg-white/25 p-2.5 rounded-full">
                  <action.icon className="h-5 w-5" />
                </div>
                <span className="text-sm font-medium">{action.label}</span>
              </div>
              
              <div className="p-3 text-center">
                <p className="text-xs text-gray-500">{action.description}</p>
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
};
