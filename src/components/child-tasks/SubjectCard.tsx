
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface SubjectCardProps {
  id: string;
  name: string;
  taskCount: number;
  color: string;
}

const SubjectCard = ({ id, name, taskCount, color }: SubjectCardProps) => {
  const navigate = useNavigate();

  const handleSubjectClick = () => {
    // If there are tasks, navigate to the subject tasks page
    if (taskCount > 0) {
      navigate(`/child-subject-tasks/${id}`);
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.2 }}
    >
      <Button
        onClick={handleSubjectClick}
        className={`w-full h-24 relative bg-gradient-to-br ${color} hover:shadow-lg text-white flex flex-col items-center justify-center p-4`}
        disabled={taskCount === 0}
      >
        <span className="text-lg font-medium">{name}</span>
        
        {taskCount > 0 ? (
          <Badge className="absolute top-2 right-2 bg-white text-gray-800">
            {taskCount} task{taskCount !== 1 ? 's' : ''}
          </Badge>
        ) : (
          <span className="text-xs mt-1 opacity-80">No tasks</span>
        )}
      </Button>
    </motion.div>
  );
};

export default SubjectCard;
