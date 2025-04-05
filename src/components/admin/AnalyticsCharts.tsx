import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart } from '@/components/ui/chart';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface WeeklyActivity {
  day: string;
  tasks: number;
  questions: number;
}

interface SubjectData {
  name: string;
  questions: number;
}

export const AnalyticsCharts = () => {
  const [weeklyActivity, setWeeklyActivity] = useState<WeeklyActivity[]>([]);
  const [subjectData, setSubjectData] = useState<SubjectData[]>([]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // Fetch weekly activity
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        // Get tasks completed per day
        const { data: tasksData } = await supabase
          .from('child_submissions')
          .select('submitted_at')
          .gte('submitted_at', oneWeekAgo.toISOString());

        // Get questions answered per day
        const { data: questionsData } = await supabase
          .from('questions')
          .select('created_at')
          .gte('created_at', oneWeekAgo.toISOString());

        // Process tasks data
        const tasksByDay = tasksData?.reduce((acc: { [key: string]: number }, task) => {
          const day = new Date(task.submitted_at).toLocaleDateString('en-US', { weekday: 'short' });
          acc[day] = (acc[day] || 0) + 1;
          return acc;
        }, {});

        // Process questions data
        const questionsByDay = questionsData?.reduce((acc: { [key: string]: number }, question) => {
          const day = new Date(question.created_at).toLocaleDateString('en-US', { weekday: 'short' });
          acc[day] = (acc[day] || 0) + 1;
          return acc;
        }, {});

        // Combine data for all days of the week
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const weeklyData = days.map(day => ({
          day,
          tasks: tasksByDay?.[day] || 0,
          questions: questionsByDay?.[day] || 0
        }));

        setWeeklyActivity(weeklyData);

        // Fetch questions by subject
        const { data: subjectQuestions } = await supabase
          .from('questions')
          .select('subject')
          .not('subject', 'is', null);

        // Process subject data
        const questionsBySubject = subjectQuestions?.reduce((acc: { [key: string]: number }, question) => {
          acc[question.subject] = (acc[question.subject] || 0) + 1;
          return acc;
        }, {});

        // Convert to array format
        const subjectDataArray = Object.entries(questionsBySubject || {}).map(([name, questions]) => ({
          name,
          questions
        }));

        setSubjectData(subjectDataArray);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      }
    };

    fetchAnalytics();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Weekly Activity</CardTitle>
          <CardDescription>
            Tasks completed and questions answered
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BarChart 
            data={weeklyActivity}
            index="day"
            categories={["tasks", "questions"]}
            colors={["#3b82f6", "#10b981"]}
            valueFormatter={(value) => `${value}`}
          />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Questions by Subject</CardTitle>
          <CardDescription>
            Distribution across main subjects
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BarChart 
            data={subjectData}
            index="name"
            categories={["questions"]}
            colors={["#8b5cf6"]}
            valueFormatter={(value) => `${value} questions`}
          />
        </CardContent>
      </Card>
    </div>
  );
};
