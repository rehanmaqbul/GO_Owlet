
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import ParentTaskView from '@/components/task/ParentTaskView';
import ChildTaskView from '@/components/task/ChildTaskView';
import TeacherTaskView from '@/components/task/TeacherTaskView';
import { subjects } from '@/components/task/subjectsData';
import { mockTasks } from '@/components/task/mockTasksData';
import { Task } from '@/lib/types';

const Tasks = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
  }, [isAuthenticated, navigate]);

  const handleCreateTask = () => {
    navigate('/create-task');
  };

  const handleViewTask = (taskId: string) => {
    navigate(`/tasks/${taskId}`);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-owl-neutral">
      <Navbar />
      
      <main className="pt-24 px-4 pb-16 max-w-7xl mx-auto">
        {user.role === 'parent' && (
          <ParentTaskView 
            tasks={tasks}
            subjects={subjects}
            handleCreateTask={handleCreateTask}
            handleViewTask={handleViewTask}
          />
        )}
        
        {user.role === 'child' && (
          <ChildTaskView 
            tasks={tasks}
            subjects={subjects}
            handleViewTask={handleViewTask}
          />
        )}
        
        {user.role === 'teacher' && (
          <TeacherTaskView 
            tasks={tasks}
            subjects={subjects}
            handleCreateTask={handleCreateTask}
            handleViewTask={handleViewTask}
          />
        )}
      </main>
    </div>
  );
};

export default Tasks;
