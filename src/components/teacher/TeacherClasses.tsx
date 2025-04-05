import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Users, CalendarDays } from 'lucide-react';
import { Class } from '@/lib/types';
import { motion } from 'framer-motion';
import { slideUp } from '@/lib/animations';

const mockClasses: Class[] = [
  {
    id: 'class-1',
    name: 'Grade 5 Science',
    teacherId: 'teacher-1',
    curriculum: 'american',
    studentIds: ['child-1', 'child-2', 'child-3'],
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
  },
  {
    id: 'class-2',
    name: 'Grade 2 Math',
    teacherId: 'teacher-1',
    curriculum: 'american',
    studentIds: ['child-4', 'child-5', 'child-6', 'child-7'],
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
  },
  {
    id: 'class-3',
    name: 'Grade 2 English',
    teacherId: 'teacher-1',
    curriculum: 'american',
    studentIds: ['child-8', 'child-9', 'child-10'],
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
  },
  {
    id: 'class-4',
    name: 'Grade 7 French',
    teacherId: 'teacher-1',
    curriculum: 'american',
    studentIds: ['child-11', 'child-12', 'child-13'],
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
  }
];

export const TeacherClasses = () => {
  const navigate = useNavigate();

  return (
    <>
      {mockClasses.map((classItem) => (
        <motion.div key={classItem.id} {...slideUp} transition={{ delay: 0.05 }}>
          <Card className="shadow-sm hover:shadow-md transition-shadow border-0">
            <CardContent className="p-3 flex justify-between items-center">
              <div className="text-left">
                <h3 className="text-sm font-medium">{classItem.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center text-[10px] text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                    <Users className="h-3 w-3 mr-0.5" />
                    {classItem.studentIds.length} students
                  </div>
                  <div className="flex items-center text-[10px] text-gray-400">
                    <CalendarDays className="h-3 w-3 mr-0.5" />
                    {new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(classItem.updatedAt)}
                  </div>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="bg-white hover:bg-gray-50 text-xs h-7 px-2"
                onClick={() => navigate(`/class/${classItem.id}`)}
              >
                View
                <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </>
  );
};
