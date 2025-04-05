
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { TaskRecipientType } from '@/lib/types';
import { UserPlus, Users } from 'lucide-react';

interface Student {
  id: string;
  name: string;
}

interface TaskRecipientsProps {
  recipientType: TaskRecipientType;
  setRecipientType: (type: TaskRecipientType) => void;
  selectedStudents: string[];
  setSelectedStudents: (students: string[]) => void;
  students: Student[];
  onSendTask: () => void;
  isTaskCreationDisabled: boolean;
}

const TaskRecipients = ({
  recipientType,
  setRecipientType,
  selectedStudents,
  setSelectedStudents,
  students,
  onSendTask,
  isTaskCreationDisabled
}: TaskRecipientsProps) => {
  
  const handleStudentToggle = (studentId: string) => {
    setSelectedStudents(
      selectedStudents.includes(studentId)
        ? selectedStudents.filter(id => id !== studentId)
        : [...selectedStudents, studentId]
    );
  };

  return (
    <Card className="border-gray-200 shadow-md">
      <CardContent className="p-6">
        <h2 className="text-lg font-medium mb-4 text-gray-800">Send Task To</h2>
        
        <RadioGroup value={recipientType} onValueChange={(value) => setRecipientType(value as TaskRecipientType)} className="mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <RadioGroupItem value="whole_class" id="whole_class" />
            <Label htmlFor="whole_class" className="text-gray-800">Whole Class</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="specific_students" id="specific_students" />
            <Label htmlFor="specific_students" className="text-gray-800">Specific Students Only</Label>
          </div>
        </RadioGroup>
        
        {recipientType === 'specific_students' && (
          <div className="space-y-4 mt-4 border-t pt-4 border-gray-200">
            <p className="text-gray-700 text-sm">Select students from the list below:</p>
            
            <div className="max-h-60 overflow-y-auto pr-2 space-y-2">
              {students.length > 0 ? (
                students.map(student => (
                  <div key={student.id} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded-md">
                    <Checkbox 
                      id={`student-${student.id}`} 
                      checked={selectedStudents.includes(student.id)}
                      onCheckedChange={() => handleStudentToggle(student.id)}
                    />
                    <Label htmlFor={`student-${student.id}`} className="text-gray-700 cursor-pointer">
                      {student.name}
                    </Label>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm italic">No students available in this class.</p>
              )}
            </div>
            
            <div className="border-t pt-4 border-gray-200">
              <p className="text-sm text-gray-700 mb-2">
                {selectedStudents.length} student{selectedStudents.length !== 1 ? 's' : ''} selected
              </p>
            </div>
          </div>
        )}
        
        <div className="mt-6">
          <Button
            onClick={onSendTask}
            disabled={isTaskCreationDisabled || (recipientType === 'specific_students' && selectedStudents.length === 0)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            {recipientType === 'whole_class' ? (
              <>
                <Users className="h-4 w-4 mr-2" />
                Send to Whole Class
              </>
            ) : (
              <>
                <UserPlus className="h-4 w-4 mr-2" />
                Send to Selected Students
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskRecipients;
