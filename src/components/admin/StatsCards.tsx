import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Users, BookOpen, CheckCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface StatCardProps {
  title: string;
  value: string;
  subtext: string;
  icon: JSX.Element;
  color: string;
}

const StatCard = ({ title, value, subtext, icon, color }: StatCardProps) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <div className={`p-2 rounded-full ${color}`}>
        {icon}
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">{subtext}</p>
    </CardContent>
  </Card>
);

export const StatsCards = () => {
  const [stats, setStats] = useState({
    totalQuestions: { value: '0', change: '+0' },
    activeUsers: { value: '0', change: '+0' },
    resources: { value: '0', change: 'Articles & Videos' },
    completedTasks: { value: '0', change: '+0' }
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch total questions
        const { count: questionsCount } = await supabase
          .from('questions')
          .select('*', { count: 'exact', head: true });

        // Fetch active users (users who have completed tasks in the last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const { count: activeUsersCount } = await supabase
          .from('child_submissions')
          .select('child_id', { count: 'exact', head: true })
          .gte('submitted_at', thirtyDaysAgo.toISOString());

        // Fetch resources (articles and videos)
        const { count: resourcesCount } = await supabase
          .from('questions')
          .select('*', { count: 'exact', head: true })
          .in('question_type', ['ArticleURL', 'VideoURL']);

        // Fetch completed tasks
        const { count: completedTasksCount } = await supabase
          .from('child_submissions')
          .select('*', { count: 'exact', head: true });

        // Calculate weekly changes
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        const { count: weeklyQuestions } = await supabase
          .from('questions')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', oneWeekAgo.toISOString());

        const { count: weeklyTasks } = await supabase
          .from('child_submissions')
          .select('*', { count: 'exact', head: true })
          .gte('submitted_at', oneWeekAgo.toISOString());

        setStats({
          totalQuestions: { 
            value: questionsCount?.toString() || '0',
            change: `+${weeklyQuestions || 0} from last week`
          },
          activeUsers: { 
            value: activeUsersCount?.toString() || '0',
            change: 'Active in last 30 days'
          },
          resources: { 
            value: resourcesCount?.toString() || '0',
            change: 'Articles & Videos'
          },
          completedTasks: { 
            value: completedTasksCount?.toString() || '0',
            change: `+${weeklyTasks || 0} this week`
          }
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard 
        title="Total Questions" 
        value={stats.totalQuestions.value}
        subtext={stats.totalQuestions.change}
        icon={<FileText className="h-4 w-4 text-blue-500" />}
        color="bg-blue-100"
      />
      <StatCard 
        title="Active Users" 
        value={stats.activeUsers.value}
        subtext={stats.activeUsers.change}
        icon={<Users className="h-4 w-4 text-green-500" />}
        color="bg-green-100"
      />
      <StatCard 
        title="Resources" 
        value={stats.resources.value}
        subtext={stats.resources.change}
        icon={<BookOpen className="h-4 w-4 text-purple-500" />}
        color="bg-purple-100"
      />
      <StatCard 
        title="Completed Tasks" 
        value={stats.completedTasks.value}
        subtext={stats.completedTasks.change}
        icon={<CheckCircle className="h-4 w-4 text-amber-500" />}
        color="bg-amber-100"
      />
    </div>
  );
};
