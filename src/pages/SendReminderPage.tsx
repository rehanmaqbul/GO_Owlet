import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Clock, Send, User, Users } from 'lucide-react';

// Mock data
const mockTask = {
  id: 'task-1',
  title: 'Mathematics Assignment',
  deadline: '2024-04-15',
  description: 'Complete the following problems from Chapter 5',
  grade: 'Grade 1',
  students: [
    { id: '1', name: 'John Doe', status: 'submitted' },
    { id: '2', name: 'Jane Smith', status: 'late' },
    { id: '3', name: 'Mike Johnson', status: 'pending' },
    { id: '4', name: 'Sarah Williams', status: 'pending' },
    { id: '5', name: 'David Brown', status: 'submitted' },
  ]
};

const SendReminderPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [reminderMessage, setReminderMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [selectAll, setSelectAll] = useState(false);

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    if (checked) {
      setSelectedStudents(mockTask.students.map(student => student.id));
    } else {
      setSelectedStudents([]);
    }
  };

  const handleStudentSelect = (studentId: string, checked: boolean) => {
    if (checked) {
      setSelectedStudents([...selectedStudents, studentId]);
    } else {
      setSelectedStudents(selectedStudents.filter(id => id !== studentId));
    }
  };

  const handleSendReminder = async () => {
    if (selectedStudents.length === 0) {
      toast({
        title: "No Students Selected",
        description: "Please select at least one student to send the reminder.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSending(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Reminder Sent",
        description: `Reminder has been sent to ${selectedStudents.length} student(s).`,
      });

      navigate(-1);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send reminder. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Send Reminder</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Task Information */}
            <div className="space-y-2">
              <h3 className="font-medium">{mockTask.title}</h3>
              <p className="text-sm text-gray-500">{mockTask.description}</p>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>{mockTask.grade}</span>
                <span>•</span>
                <span>Deadline: {new Date(mockTask.deadline).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Reminder Message */}
            <div className="space-y-2">
              <Label>Reminder Message</Label>
              <Textarea
                placeholder="Write your reminder message here..."
                value={reminderMessage}
                onChange={(e) => setReminderMessage(e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            {/* Students List */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Select Students</Label>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="select-all"
                    checked={selectAll}
                    onCheckedChange={handleSelectAll}
                  />
                  <Label htmlFor="select-all" className="text-sm">
                    Select All
                  </Label>
                </div>
              </div>
              <ScrollArea className="h-[300px] border rounded-md">
                <div className="p-4 space-y-2">
                  {mockTask.students.map((student) => (
                    <div
                      key={student.id}
                      className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md"
                    >
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={student.id}
                          checked={selectedStudents.includes(student.id)}
                          onCheckedChange={(checked) => handleStudentSelect(student.id, checked as boolean)}
                        />
                        <Label htmlFor={student.id} className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          {student.name}
                        </Label>
                      </div>
                      <Badge
                        variant={
                          student.status === 'submitted'
                            ? 'default'
                            : student.status === 'late'
                            ? 'destructive'
                            : 'outline'
                        }
                      >
                        {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                      </Badge>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button
              onClick={handleSendReminder}
              disabled={isSending || selectedStudents.length === 0}
            >
              {isSending ? "Sending..." : "Send Reminder"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default SendReminderPage; 