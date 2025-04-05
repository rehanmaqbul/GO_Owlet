
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { User as User2, UserIcon, Mail, X, Plus } from 'lucide-react';
import { User } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

interface StudentsSectionProps {
  students: User[];
  setStudents: React.Dispatch<React.SetStateAction<User[]>>;
  handleContactParent: (studentId: string) => void;
}

export const StudentsSection = ({ students, setStudents, handleContactParent }: StudentsSectionProps) => {
  const [newStudentEmail, setNewStudentEmail] = useState('');
  const { toast } = useToast();

  const handleAddStudent = () => {
    if (!newStudentEmail.trim()) {
      toast({
        title: "Email required",
        description: "Please enter a student email address.",
        variant: "destructive",
      });
      return;
    }
    
    // Check if student already exists
    const studentExists = students.some(s => s.email === newStudentEmail);
    if (studentExists) {
      toast({
        title: "Student already added",
        description: "This student is already in the class.",
        variant: "destructive",
      });
      return;
    }
    
    // Create new student (mock)
    const newStudent: User = {
      id: `child-${Date.now()}`,
      email: newStudentEmail,
      name: newStudentEmail.split('@')[0],
      role: 'child',
      parentId: `parent-${Date.now()}`
    };
    
    setStudents([...students, newStudent]);
    setNewStudentEmail('');
    
    toast({
      title: "Student added",
      description: "Student has been added to the class.",
    });
  };
  
  const handleRemoveStudent = (studentId: string) => {
    const updatedStudents = students.filter(s => s.id !== studentId);
    setStudents(updatedStudents);
    
    toast({
      title: "Student removed",
      description: "Student has been removed from the class.",
    });
  };

  return (
    <Card className="shadow-subtle md:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center">
            <User2 className="h-5 w-5 mr-2 text-owl-blue" />
            Students
          </CardTitle>
          <CardDescription>
            Manage students in this class
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Add student by email"
            value={newStudentEmail}
            onChange={(e) => setNewStudentEmail(e.target.value)}
            className="max-w-[250px]"
          />
          <Button size="sm" onClick={handleAddStudent}>
            <Plus className="h-4 w-4 mr-2" />
            Add
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {students.length > 0 ? (
          <ul className="space-y-2">
            {students.map(student => (
              <motion.li 
                key={student.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-3 bg-white rounded-lg shadow-sm flex items-center justify-between"
              >
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-owl-blue-light flex items-center justify-center mr-3">
                    <UserIcon className="h-5 w-5 text-owl-blue" />
                  </div>
                  <div>
                    <p className="font-medium">{student.name}</p>
                    <p className="text-xs text-owl-slate">{student.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => handleContactParent(student.id)}
                  >
                    <Mail className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleRemoveStudent(student.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </motion.li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-8">
            <User2 className="h-12 w-12 text-owl-slate/30 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-1">No Students Yet</h3>
            <p className="text-owl-slate max-w-md mx-auto mb-4">
              Add students to this class using their email addresses.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
