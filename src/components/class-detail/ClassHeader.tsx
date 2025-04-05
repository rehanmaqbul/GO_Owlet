
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Edit, ArrowLeft } from 'lucide-react';
import { Class } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

interface ClassHeaderProps {
  classData: Class;
  setClassData: React.Dispatch<React.SetStateAction<Class | null>>;
  students: any[];
  handleGoBack: () => void;
}

export const ClassHeader = ({ classData, setClassData, students, handleGoBack }: ClassHeaderProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [className, setClassName] = useState(classData.name);
  const { toast } = useToast();

  const handleUpdateClass = () => {
    if (!className.trim()) {
      toast({
        title: "Class name required",
        description: "Please enter a name for the class.",
        variant: "destructive",
      });
      return;
    }
    
    // Update class name
    const updatedClass = { ...classData, name: className };
    setClassData(updatedClass);
    setIsEditing(false);
    
    toast({
      title: "Class updated",
      description: "Class details have been updated successfully.",
    });
  };

  return (
    <>
      <Button 
        variant="ghost" 
        className="flex items-center text-owl-slate hover:text-owl-slate-dark"
        onClick={handleGoBack}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Dashboard
      </Button>
    
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {isEditing ? (
          <div className="flex items-center gap-2">
            <Input
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              className="text-2xl font-medium max-w-md"
              placeholder="Class Name"
            />
            <Button onClick={handleUpdateClass}>Save</Button>
            <Button variant="ghost" onClick={() => {
              setIsEditing(false);
              setClassName(classData.name);
            }}>
              Cancel
            </Button>
          </div>
        ) : (
          <div className="flex items-center">
            <h1 className="text-2xl font-medium text-owl-slate-dark">{classData.name}</h1>
            <Button 
              variant="ghost" 
              size="icon" 
              className="ml-2"
              onClick={() => setIsEditing(true)}
            >
              <Edit className="h-4 w-4" />
            </Button>
          </div>
        )}
        
        <div className="flex items-center gap-2">
          <Badge className="bg-owl-blue px-3 py-1">
            {classData.curriculum.charAt(0).toUpperCase() + classData.curriculum.slice(1)} Curriculum
          </Badge>
          <Badge variant="outline" className="px-3 py-1">
            {students.length} Students
          </Badge>
        </div>
      </div>
    </>
  );
};
