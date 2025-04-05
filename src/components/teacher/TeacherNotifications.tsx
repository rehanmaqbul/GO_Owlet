
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BellRing } from 'lucide-react';

// New notifications mock data
const notifications = [
  { id: 1, message: "New submission in Grade 5 Science", time: "2 hours ago" },
  { id: 2, message: "Parent meeting scheduled for tomorrow", time: "5 hours ago" },
  { id: 3, message: "3 students haven't submitted Math homework", time: "Yesterday" }
];

export const TeacherNotifications = () => {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg text-left flex items-center gap-2">
          <BellRing className="h-4 w-4" />
          Notifications
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {notifications.map(notification => (
            <div key={notification.id} className="bg-white/30 rounded-lg p-3 text-left">
              <p className="text-sm">{notification.message}</p>
              <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
