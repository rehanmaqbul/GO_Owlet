
import { useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { fadeIn } from '@/lib/animations';
import { formatSubjectName } from '@/utils/subjectTasksData';
import SubjectTasksHeader from '@/components/subject-tasks/SubjectTasksHeader';
import TasksList from '@/components/subject-tasks/TasksList';

const ChildSubjectTasks = () => {
  const { user } = useAuth();
  const { subject } = useParams<{ subject: string }>();
  const subjectName = subject ? formatSubjectName(subject) : '';

  return (
    <div className="min-h-screen bg-owl-neutral flex flex-col">
      <SubjectTasksHeader 
        subjectName={subjectName} 
        taskCount={0} // This will be determined by the TasksList component
      />

      <main className="flex-1 p-6">
        <motion.div 
          className="w-full max-w-4xl mx-auto space-y-6"
          {...fadeIn}
        >
          {subject && <TasksList subject={subject} />}
        </motion.div>
      </main>
      
      <footer className="py-6 text-center text-owl-slate">
        <p>© {new Date().getFullYear()} Guardian Owlet. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default ChildSubjectTasks;
