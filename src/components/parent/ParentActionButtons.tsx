import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ClipboardList, BookMarked, UserPlus, BookOpen, MessageSquare } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';

export const ParentActionButtons = () => {
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

  const actions = [
    { 
      label: 'Check Tasks', 
      icon: ClipboardList, 
      path: '/parent-check-tasks',
      gradient: 'from-blue-500 to-blue-600',
      hoverGradient: 'from-blue-600 to-blue-700',
      shadow: 'shadow-blue-300'
    },
    { 
      label: 'Assign Task', 
      icon: BookMarked, 
      path: '/parent-assign-task',
      gradient: 'from-green-500 to-green-600',
      hoverGradient: 'from-green-600 to-green-700',
      shadow: 'shadow-green-300'
    },
    { 
      label: 'Children', 
      icon: UserPlus, 
      path: '/child-management',
      gradient: 'from-purple-500 to-purple-600',
      hoverGradient: 'from-purple-600 to-purple-700',
      shadow: 'shadow-purple-300'
    },
    { 
      label: 'Resources', 
      icon: BookOpen, 
      path: '/parent-resources',
      gradient: 'from-yellow-500 to-yellow-600',
      hoverGradient: 'from-yellow-600 to-yellow-700',
      shadow: 'shadow-yellow-300'
    },
    { 
      label: 'Messages', 
      icon: MessageSquare, 
      path: '/parent-messages',
      gradient: 'from-cyan-500 to-cyan-600',
      hoverGradient: 'from-cyan-600 to-cyan-700',
      shadow: 'shadow-cyan-300'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {actions.map((action, index) => (
        <motion.div
          key={action.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all ${action.shadow}`}
        >
          <button
            onClick={() => handleButtonClick(action.path, action.label)}
            className={`w-full h-full p-4 flex flex-col items-center justify-center gap-3 bg-gradient-to-br ${action.gradient} hover:bg-gradient-to-br hover:${action.hoverGradient} text-white transition-all duration-300`}
          >
            <div className="bg-white/20 p-3 rounded-full shadow-inner">
              <action.icon className="h-6 w-6" />
            </div>
            <span className="font-medium text-sm">{action.label}</span>
          </button>
        </motion.div>
      ))}
    </div>
  );
};
