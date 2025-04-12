import { supabase } from '@/lib/supabase';

export interface DashboardStats {
  totalUsers: number;
  totalSchools: number;
  totalContent: number;
  recentActivities: Array<{
    id: string;
    type: string;
    description: string;
    created_at: string;
    user_name?: string;
  }>;
}

export const dashboardService = {
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      // Simple user count approach - fetch and count locally
      const { data: users, error: usersError } = await supabase
        .from('users')
        .select('id');
      
      if (usersError) throw usersError;
      console.log('Raw user count:', users?.length || 0);
      
      // Get total schools count
      const { data: schools, error: schoolsError } = await supabase
        .from('schools')
        .select('id');

      if (schoolsError) throw schoolsError;

      // Get total content count
      const { data: content, error: contentError } = await supabase
        .from('content_items')
        .select('id');

      if (contentError) throw contentError;

      // Get recent activities
      const { data: activities, error: activitiesError } = await supabase
        .from('activity_logs')
        .select('id, action_type, description, created_at')
        .order('created_at', { ascending: false })
        .limit(5);

      if (activitiesError) throw activitiesError;

      // Format activities without user names for now (we can add this back later when types are fixed)
      const formattedActivities = (activities || []).map(activity => ({
        id: String(activity.id),
        type: String(activity.action_type),
        description: String(activity.description),
        created_at: String(activity.created_at),
        user_name: undefined
      }));

      return {
        totalUsers: users?.length || 0,
        totalSchools: schools?.length || 0, 
        totalContent: content?.length || 0,
        recentActivities: formattedActivities
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  }
}; 