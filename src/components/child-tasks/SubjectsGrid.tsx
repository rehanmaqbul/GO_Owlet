import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Calculator, 
  Atom, 
  Globe, 
  Palette, 
  Music, 
  Dumbbell, 
  Clock,
  ChevronRight,
  Star
} from 'lucide-react';

interface Subject {
  id: string;
  name: string;
  icon: JSX.Element;
  color: string;
  bgColor: string;
  tasksCount: number;
  completedCount: number;
}

export default function SubjectsGrid() {
  const navigate = useNavigate();
  const [hoveredSubject, setHoveredSubject] = useState<string | null>(null);
  
  const subjects: Subject[] = [
    {
      id: 'math',
      name: 'Math',
      icon: <Calculator className="h-10 w-10" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      tasksCount: 5,
      completedCount: 3
    },
    {
      id: 'science',
      name: 'Science',
      icon: <Atom className="h-10 w-10" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      tasksCount: 4,
      completedCount: 2
    },
    {
      id: 'reading',
      name: 'Reading',
      icon: <BookOpen className="h-10 w-10" />,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      tasksCount: 3,
      completedCount: 3
    },
    {
      id: 'social',
      name: 'Social Studies',
      icon: <Globe className="h-10 w-10" />,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      tasksCount: 2,
      completedCount: 1
    },
    {
      id: 'art',
      name: 'Art',
      icon: <Palette className="h-10 w-10" />,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      tasksCount: 3,
      completedCount: 2
    },
    {
      id: 'music',
      name: 'Music',
      icon: <Music className="h-10 w-10" />,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
      tasksCount: 2,
      completedCount: 0
    },
    {
      id: 'pe',
      name: 'Physical Ed',
      icon: <Dumbbell className="h-10 w-10" />,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      tasksCount: 1,
      completedCount: 1
    },
    {
      id: 'extracurricular',
      name: 'Extra Activities',
      icon: <Clock className="h-10 w-10" />,
      color: 'text-teal-600',
      bgColor: 'bg-teal-100',
      tasksCount: 2,
      completedCount: 0
    }
  ];

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
    show: { y: 0, opacity: 1 }
  };

  return (
    <motion.div 
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {subjects.map((subject) => {
        const progress = subject.tasksCount > 0 
          ? Math.round((subject.completedCount / subject.tasksCount) * 100) 
          : 0;
        
        return (
          <motion.div 
          key={subject.id} 
            variants={item}
            whileHover={{ 
              scale: 1.03,
              transition: { duration: 0.2 }
            }}
            onHoverStart={() => setHoveredSubject(subject.id)}
            onHoverEnd={() => setHoveredSubject(null)}
            onClick={() => navigate(`/child-tasks/${subject.id}`)}
            className="cursor-pointer"
          >
            <Card className="overflow-hidden h-full border-none shadow-md hover:shadow-lg transition-shadow">
              <div className={`h-1 ${subject.color.replace('text', 'bg')}`}></div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`relative p-3 rounded-xl ${subject.bgColor}`}>
                    <motion.div 
                      className={subject.color}
                      animate={{ 
                        rotate: hoveredSubject === subject.id ? [0, -10, 10, -5, 5, 0] : 0 
                      }}
                      transition={{ 
                        duration: 0.5,
                        ease: "easeInOut" 
                      }}
                    >
                      {subject.icon}
                    </motion.div>
                    
                    {/* Show stars for completed tasks */}
                    {subject.completedCount > 0 && (
                      <div className="absolute -top-2 -right-2 flex">
                        {[...Array(Math.min(subject.completedCount, 3))].map((_, i) => (
                          <motion.div 
                            key={i}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2 + (i * 0.1) }}
                          >
                            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                          </motion.div>
      ))}
    </div>
                    )}
                  </div>
                  
                  <motion.div 
                    animate={{ 
                      x: hoveredSubject === subject.id ? [0, 5] : 0 
                    }}
                    transition={{ repeat: hoveredSubject === subject.id ? Infinity : 0, repeatType: "reverse", duration: 0.3 }}
                  >
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </motion.div>
                </div>
                
                <h3 className="text-lg font-bold mb-2">{subject.name}</h3>
                
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="outline" className={`${subject.color.replace('text', 'border')} ${subject.color}`}>
                    {subject.tasksCount} {subject.tasksCount === 1 ? 'task' : 'tasks'}
                  </Badge>
                  
                  {progress === 100 ? (
                    <Badge className="bg-green-100 text-green-700 border-none">
                      Completed
                    </Badge>
                  ) : subject.completedCount > 0 ? (
                    <span className="text-xs text-gray-500">
                      {subject.completedCount}/{subject.tasksCount} done
                    </span>
                  ) : subject.tasksCount > 0 ? (
                    <Badge className="bg-blue-100 text-blue-600 border-none">
                      New
                    </Badge>
                  ) : null}
                </div>
                
                {/* Progress bar */}
                {subject.tasksCount > 0 && (
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div 
                      className={`h-full ${subject.color.replace('text', 'bg')}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                    />
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
