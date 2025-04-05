
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import { fadeIn } from '@/lib/animations';
import { useToast } from '@/hooks/use-toast';
import { Class, Task, User } from '@/lib/types';
import { ClassHeader } from '@/components/class-detail/ClassHeader';
import { StudentsSection } from '@/components/class-detail/StudentsSection';
import { TasksSection } from '@/components/class-detail/TasksSection';
import { mockClass, mockStudents, mockTasks } from '@/components/class-detail/mockData';

const ClassDetail = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { classId } = useParams<{ classId: string }>();
  
  const [classData, setClassData] = useState<Class | null>(null);
  const [students, setStudents] = useState<User[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    // Only teachers should access this page
    if (user?.role !== 'teacher') {
      navigate('/dashboard');
      return;
    }
    
    // Load class data
    if (classId === mockClass.id) {
      setClassData(mockClass);
      setStudents(mockStudents);
      setTasks(mockTasks);
    } else {
      // In a real app, fetch class data from API
      toast({
        title: "Class not found",
        description: "The class you're looking for doesn't exist.",
        variant: "destructive",
      });
      navigate('/teacher-dashboard');
    }
  }, [isAuthenticated, user, navigate, classId, toast]);

  const handleAssignTask = () => {
    navigate('/create-task', { 
      state: { 
        role: 'teacher',
        classId: classData?.id
      } 
    });
  };
  
  const handleViewTask = (taskId: string) => {
    navigate(`/tasks/${taskId}`);
  };
  
  const handleContactParent = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    if (student && student.parentId) {
      navigate('/teacher-messages', { 
        state: { recipientId: student.parentId } 
      });
    }
  };
  
  const handleGoBack = () => {
    navigate('/teacher-dashboard');
  };

  if (!user || user.role !== 'teacher' || !classData) return null;

  return (
    <div className="min-h-screen bg-owl-neutral">
      <Navbar />
      
      <main className="pt-24 px-4 pb-16 max-w-7xl mx-auto">
        <motion.div className="space-y-6" {...fadeIn}>
          <ClassHeader 
            classData={classData} 
            setClassData={setClassData}
            students={students}
            handleGoBack={handleGoBack}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StudentsSection 
              students={students}
              setStudents={setStudents}
              handleContactParent={handleContactParent}
            />
            
            <TasksSection 
              tasks={tasks}
              handleAssignTask={handleAssignTask}
              handleViewTask={handleViewTask}
            />
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default ClassDetail;
