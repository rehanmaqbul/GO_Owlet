import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, BookOpen, PieChart, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface RecentActivity {
  id: string;
  type: string;
  description: string;
  timestamp: string;
  link: string;
}

interface RecentQuestion {
  id: string;
  subject: string;
  question_text: string;
  created_at: string;
}

interface StatsOverview {
  totalUsers: number;
  questionsCreated: number;
  completionRate: number;
}

export const ActivityCards = () => {
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [recentQuestions, setRecentQuestions] = useState<RecentQuestion[]>([]);
  const [statsOverview, setStatsOverview] = useState<StatsOverview>({
    totalUsers: 0,
    questionsCreated: 0,
    completionRate: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch recent activity (combining user registrations and task completions)
        const { data: recentUsers } = await supabase
          .from('profiles')
          .select('id, created_at')
          .order('created_at', { ascending: false })
          .limit(5);

        const { data: recentSubmissions } = await supabase
          .from('child_submissions')
          .select('id, submitted_at, child_id')
          .order('submitted_at', { ascending: false })
          .limit(5);

        // Combine and format recent activity
        const activity = [
          ...(recentUsers?.map(user => ({
            id: user.id.toString(),
            type: 'user',
            description: 'New user registered',
            timestamp: new Date(user.created_at).toLocaleString(),
            link: `/users/${user.id}`
          })) || []),
          ...(recentSubmissions?.map(submission => ({
            id: submission.id.toString(),
            type: 'submission',
            description: 'Task completed',
            timestamp: new Date(submission.submitted_at).toLocaleString(),
            link: `/submissions/${submission.id}`
          })) || [])
        ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
         .slice(0, 3);

        setRecentActivity(activity);

        // Fetch recent questions
        const { data: questions } = await supabase
          .from('questions')
          .select('id, subject, question_text, created_at')
          .order('created_at', { ascending: false })
          .limit(3);

        setRecentQuestions(questions || []);

        // Fetch stats overview
        const { count: totalUsers } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });

        const { count: questionsCreated } = await supabase
          .from('questions')
          .select('*', { count: 'exact', head: true });

        // Calculate completion rate
        const { count: completedTasks } = await supabase
          .from('child_submissions')
          .select('*', { count: 'exact', head: true });

        const { count: totalTasks } = await supabase
          .from('tasks')
          .select('*', { count: 'exact', head: true });

        const completionRate = totalTasks ? Math.round((completedTasks || 0) / totalTasks * 100) : 0;

        setStatsOverview({
          totalUsers: totalUsers || 0,
          questionsCreated: questionsCreated || 0,
          completionRate
        });
      } catch (error) {
        console.error('Error fetching activity data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-medium">Recent Activity</CardTitle>
            <Button variant="ghost" size="sm" className="text-owl-blue">View all</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-owl-blue-light rounded-full flex items-center justify-center">
                    <Users size={18} className="text-owl-blue-dark" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{activity.description}</p>
                    <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ChevronRight size={16} />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-medium">Recent Questions</CardTitle>
            <Button variant="ghost" size="sm" className="text-owl-blue">View all</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentQuestions.map((question) => (
              <div key={question.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-owl-green-light rounded-full flex items-center justify-center">
                    <BookOpen size={18} className="text-owl-green-dark" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Question added to {question.subject}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(question.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ChevronRight size={16} />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-medium">Stats Overview</CardTitle>
            <Button variant="ghost" size="sm" className="text-owl-blue">Export</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { 
                label: "Total Users", 
                value: statsOverview.totalUsers.toLocaleString(), 
                icon: <Users size={18} /> 
              },
              { 
                label: "Questions Created", 
                value: statsOverview.questionsCreated.toLocaleString(), 
                icon: <BookOpen size={18} /> 
              },
              { 
                label: "Task Completion Rate", 
                value: `${statsOverview.completionRate}%`, 
                icon: <PieChart size={18} /> 
              }
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-owl-neutral rounded-full flex items-center justify-center">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-sm font-bold">{item.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
