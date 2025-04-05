
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BellRing } from 'lucide-react';

// Notifications mock data
const notifications = [
  { id: 1, message: "Alex completed the Math assignment", time: "2 hours ago" },
  { id: 2, message: "New resources available for Grade 5", time: "Yesterday" },
  { id: 3, message: "Jamie has 2 pending assignments", time: "2 days ago" }
];

export const ParentNotifications = () => {
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
