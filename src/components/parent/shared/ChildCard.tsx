import { motion } from 'framer-motion';
import { Check, User } from 'lucide-react';

interface Child {
  id: string;
  name: string;
  age?: number;
  grade?: string;
}

interface ChildCardProps {
  child: Child;
  isSelected: boolean;
  onClick: (childId: string) => void;
}

const ChildCard = ({ child, isSelected, onClick }: ChildCardProps) => {
  return (
    <motion.div
      onClick={() => onClick(child.id)}
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className={`
        relative cursor-pointer p-5 rounded-xl shadow-md transition-all duration-200
        ${isSelected 
          ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-transparent' 
          : 'bg-white hover:bg-gray-50 text-owl-slate-dark border border-gray-100'}
      `}
    >
      {/* Selected indicator */}
      {isSelected && (
        <motion.div 
          initial={{ scale: 0 }} 
          animate={{ scale: 1 }}
          className="absolute top-3 right-3 bg-white rounded-full p-0.5"
        >
          <Check className="h-4 w-4 text-indigo-600" />
        </motion.div>
      )}
      
      {/* Child avatar */}
      <div className={`
        w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center
        ${isSelected ? 'bg-white/20' : 'bg-indigo-100'}
      `}>
        <User className={`h-8 w-8 ${isSelected ? 'text-white' : 'text-indigo-500'}`} />
      </div>
      
      {/* Child info */}
      <div className="text-center">
        <h3 className="font-bold text-lg mb-1">{child.name}</h3>
        {child.grade && (
          <p className={`text-sm ${isSelected ? 'text-white/80' : 'text-gray-500'}`}>
            {child.grade}
          </p>
        )}
        {child.age && (
          <p className={`text-sm ${isSelected ? 'text-white/80' : 'text-gray-500'}`}>
            Age: {child.age}
          </p>
        )}
      </div>
      
      {/* Decorative elements */}
      {isSelected && (
        <>
          <div className="absolute -bottom-3 -right-3 w-12 h-12 rounded-full bg-white/10"></div>
          <div className="absolute top-1/2 -left-2 w-8 h-8 rounded-full bg-white/10"></div>
        </>
      )}
    </motion.div>
  );
};

export default ChildCard; 