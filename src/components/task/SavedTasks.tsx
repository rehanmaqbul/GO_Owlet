
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Save, Users, UserPlus } from 'lucide-react';
import { Task, TaskRecipientType } from '@/lib/types';

interface SavedTasksProps {
  savedTasks: Task[];
  onSelectSavedTask: (taskId: string) => void;
  onSendSavedTask: (taskId: string, recipientType: TaskRecipientType) => void;
}

const SavedTasks = ({ savedTasks, onSelectSavedTask, onSendSavedTask }: SavedTasksProps) => {
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [showSendOptions, setShowSendOptions] = useState(false);

  const handleSelectTask = (taskId: string) => {
    setSelectedTaskId(taskId);
    setShowSendOptions(true);
    onSelectSavedTask(taskId);
  };

  const handleSendTask = (recipientType: TaskRecipientType) => {
    if (selectedTaskId) {
      onSendSavedTask(selectedTaskId, recipientType);
      setShowSendOptions(false);
    }
  };

  return (
    <Card className="border-gray-200 shadow-md">
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <Save className="h-5 w-5 mr-2 text-blue-600" />
          <h2 className="text-lg font-medium text-gray-800">Saved Tasks</h2>
        </div>

        {savedTasks.length > 0 ? (
          <div className="space-y-3">
            {savedTasks.map((task) => (
              <Button 
                key={task.id}
                variant="outline" 
                className={`w-full justify-start text-left border-gray-200 ${
                  selectedTaskId === task.id ? 'bg-blue-50 border-blue-200' : ''
                }`}
                onClick={() => handleSelectTask(task.id)}
              >
                <div className="truncate">
                  <span className="font-medium text-gray-800">{task.name}</span>
                  <div className="flex mt-1 text-xs text-gray-500">
                    <span className="mr-2">{task.curriculum}</span>
                    <span>{task.subject}</span>
                    {task.grade && <span className="ml-2">{task.grade}</span>}
                  </div>
                </div>
              </Button>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No saved tasks found.</p>
        )}
        
        {showSendOptions && (
          <div className="mt-4 space-y-2 border-t pt-4 border-gray-200">
            <p className="text-sm text-gray-700 mb-2">Send this task to:</p>
            <Button
              variant="outline"
              className="w-full justify-start text-gray-800 border-gray-200"
              onClick={() => handleSendTask('whole_class')}
            >
              <Users className="h-4 w-4 mr-2 text-blue-600" />
              Send to Whole Class
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start text-gray-800 border-gray-200"
              onClick={() => handleSendTask('specific_students')}
            >
              <UserPlus className="h-4 w-4 mr-2 text-blue-600" />
              Send to Specific Students
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SavedTasks;
