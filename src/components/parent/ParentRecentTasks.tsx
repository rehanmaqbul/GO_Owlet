import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { slideUp } from '@/lib/animations';

// Mock children data - would normally come from context or props
const mockChildren = [
  { id: 'child-1', name: 'Alex Smith', grade: 'Grade 5' },
  { id: 'child-2', name: 'Jamie Johnson', grade: 'Grade 3' },
  // Additional children can be added here dynamically
];

// Generate tasks for all children
const generateTasksForChildren = () => {
  const taskTypes = [
    'Math Assignment', 'Reading Assignment', 'Science Quiz', 
    'Vocabulary Practice', 'History Project', 'Art Assignment'
  ];
  
  const tasks = [];
  let taskId = 1;
  
  mockChildren.forEach(child => {
    // Generate 2 tasks per child
    for (let i = 0; i < 2; i++) {
      const taskType = taskTypes[Math.floor(Math.random() * taskTypes.length)];
      const submissions = Math.random() > 0.5 ? 1 : 0;
      
      tasks.push({
        id: `task-${taskId++}`,
        childId: child.id,
        child: child.name,
        type: taskType,
        submissions: submissions,
        total: 1,
        date: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toLocaleDateString()
      });
    }
  });
  
  // Sort by date (most recent first) - in a real app this would use actual timestamps
  return tasks.sort(() => Math.random() - 0.5);
};

export const ParentRecentTasks = () => {
  const navigate = useNavigate();
  const [recentTasks] = useState(generateTasksForChildren());

  const handleViewTask = (taskId: string) => {
    navigate(`/tasks/${taskId}`);
  };

  return (
    <div className="mb-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        {recentTasks.map((task) => (
          <motion.div key={task.id} {...slideUp} transition={{ delay: 0.05 }}>
            <Card className="shadow-sm hover:shadow-md transition-shadow border-0">
              <CardContent className="p-3 flex justify-between items-center">
                <div className="text-left">
                  <h3 className="text-sm font-medium">{task.child}</h3>
                  <p className="text-xs text-muted-foreground">{task.type}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className={`text-xs px-2 py-0.5 rounded-full text-[10px] 
                      ${task.submissions === task.total 
                        ? 'bg-owl-green-light text-owl-green-dark' 
                        : 'bg-owl-yellow-light text-owl-yellow-dark'}`
                    }>
                      {task.submissions}/{task.total} submissions
                    </div>
                    <div className="flex items-center text-[10px] text-gray-400">
                      <Clock className="h-3 w-3 mr-0.5" />
                      {task.date}
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="bg-white hover:bg-gray-50 text-xs h-7 px-2 ml-2"
                  onClick={() => handleViewTask(task.id)}
                >
                  View
                  <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
