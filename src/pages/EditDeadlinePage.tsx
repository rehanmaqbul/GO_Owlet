import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

// Mock task data
const mockTask = {
  id: 'task-1',
  title: 'Mathematics Assignment',
  currentDeadline: '2024-04-15',
  description: 'Complete the following problems from Chapter 5',
  grade: 'Grade 1',
  totalStudents: 25,
  submittedCount: 15,
  lateSubmissions: 3
};

const EditDeadlinePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [newDeadline, setNewDeadline] = useState<Date | undefined>(new Date(mockTask.currentDeadline));
  const [notificationMessage, setNotificationMessage] = useState('');
  const [sendNotification, setSendNotification] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Deadline Updated",
        description: "The task deadline has been updated successfully.",
      });

      if (sendNotification) {
        toast({
          title: "Notification Sent",
          description: "Students have been notified about the deadline change.",
        });
      }

      navigate(-1);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update deadline. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Edit Deadline</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Task Information */}
            <div className="space-y-2">
              <h3 className="font-medium">{mockTask.title}</h3>
              <p className="text-sm text-gray-500">{mockTask.description}</p>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>{mockTask.grade}</span>
                <span>•</span>
                <span>{mockTask.totalStudents} students</span>
                <span>•</span>
                <span>{mockTask.submittedCount} submitted</span>
                {mockTask.lateSubmissions > 0 && (
                  <>
                    <span>•</span>
                    <span className="text-amber-600">{mockTask.lateSubmissions} late</span>
                  </>
                )}
              </div>
            </div>

            {/* Current Deadline */}
            <div className="space-y-2">
              <Label>Current Deadline</Label>
              <div className="flex items-center gap-2 text-gray-500">
                <Clock className="w-4 h-4" />
                <span>{format(new Date(mockTask.currentDeadline), "PPP")}</span>
              </div>
            </div>

            {/* New Deadline */}
            <div className="space-y-2">
              <Label>New Deadline</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {newDeadline ? format(newDeadline, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={newDeadline}
                    onSelect={setNewDeadline}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Notification Settings */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Send Notification</Label>
                  <p className="text-sm text-gray-500">
                    Notify students about the deadline change
                  </p>
                </div>
                <Switch
                  checked={sendNotification}
                  onCheckedChange={setSendNotification}
                />
              </div>

              {sendNotification && (
                <div className="space-y-2">
                  <Label>Notification Message</Label>
                  <Textarea
                    placeholder="Add a custom message for the notification..."
                    value={notificationMessage}
                    onChange={(e) => setNotificationMessage(e.target.value)}
                  />
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              disabled={isSaving || !newDeadline}
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default EditDeadlinePage; 