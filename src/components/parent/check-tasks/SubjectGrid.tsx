import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Book, CheckCircle2 } from 'lucide-react';

interface SubjectItem {
  id: string;
  name: string;
  category: 'educational' | 'skills';
  icon?: string;
}

interface SubjectGridProps {
  subjects: SubjectItem[];
  selectedSubjects: SubjectItem[];
  handleSubjectClick: (subject: SubjectItem) => void;
}

const SubjectGrid = ({ subjects, selectedSubjects, handleSubjectClick }: SubjectGridProps) => {
  const isSubjectSelected = (subjectId: string) => {
    return selectedSubjects.some(s => s.id === subjectId);
  };

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.05
      }
    }
  };

  const item = {
    hidden: { y: 10, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  };

  // Get a gradient color based on category
  const getGradient = (category: 'educational' | 'skills') => {
    return category === 'educational' 
      ? 'from-blue-500 to-blue-600' 
      : 'from-purple-500 to-purple-600';
  };

  const getIconBgColor = (category: 'educational' | 'skills', isSelected: boolean) => {
    if (isSelected) return 'bg-white/20';
    return category === 'educational' ? 'bg-blue-100' : 'bg-purple-100';
  };

  const getIconColor = (category: 'educational' | 'skills', isSelected: boolean) => {
    if (isSelected) return 'text-white';
    return category === 'educational' ? 'text-blue-500' : 'text-purple-500';
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
    >
      {subjects.map((subject) => {
        const isSelected = isSubjectSelected(subject.id);
        return (
          <motion.button
            key={subject.id}
            variants={item}
            whileHover={{ scale: 1.03, y: -3 }}
            whileTap={{ scale: 0.98 }}
            className={`
              relative h-28 flex flex-col items-center justify-center text-center p-3 rounded-xl shadow-md
              transition-all duration-200 overflow-hidden border
              ${isSelected 
                ? `bg-gradient-to-br ${getGradient(subject.category)} text-white border-transparent` 
                : 'bg-white hover:bg-gray-50 text-owl-slate-dark border-gray-100'}
            `}
            onClick={() => handleSubjectClick(subject)}
          >
            {isSelected && (
              <div className="absolute top-2 right-2">
                <CheckCircle2 className="h-4 w-4 text-white" />
              </div>
            )}
            
            <div className={`
              p-2 rounded-full mb-2
              ${getIconBgColor(subject.category, isSelected)}
            `}>
              {subject.icon ? (
                <span className="text-xl">{subject.icon}</span>
              ) : (
                <Book className={`h-5 w-5 ${getIconColor(subject.category, isSelected)}`} />
              )}
            </div>
            
            <span className="font-medium">{subject.name}</span>
            
            {/* Decorative circle */}
            {isSelected && (
              <div className="absolute -bottom-3 -right-3 w-12 h-12 rounded-full bg-white/10"></div>
            )}
          </motion.button>
        );
      })}
    </motion.div>
  );
};

export default SubjectGrid;
