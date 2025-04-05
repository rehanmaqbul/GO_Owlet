import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowRight, CheckSquare } from 'lucide-react';

interface SelectionSummaryProps {
  selectedSubjectsCount: number;
  onViewDetails: () => void;
}

const SelectionSummary = ({ selectedSubjectsCount, onViewDetails }: SelectionSummaryProps) => {
  return (
    <motion.div 
      className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-6 shadow-lg text-white relative overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* Decorative elements */}
      <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute left-1/4 bottom-0 w-16 h-16 bg-white/5 rounded-full"></div>
      
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2.5 rounded-full">
            <CheckSquare className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-2xl font-bold">
              {selectedSubjectsCount.toString().padStart(2, '0')}
              <span className="ml-2 text-lg font-medium text-white/90">
                {selectedSubjectsCount === 1 ? 'Subject' : 'Subjects'}
              </span>
            </p>
            <p className="text-sm text-white/80">Ready to review</p>
          </div>
        </div>
        
        <Button 
          onClick={onViewDetails}
          className="bg-white text-indigo-600 hover:bg-white/90 shadow-sm px-6"
        >
          View Details
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
};

export default SelectionSummary;
