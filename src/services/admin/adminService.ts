import { supabase } from '@/lib/supabase';
import type { Database } from '@/lib/supabase/database.types';
import type { 
  Tables, 
  TablesInsert 
} from '@/lib/supabase/database.types';

export type User = Tables<'users'>;
export type School = Tables<'schools'>;
export type Subject = Tables<'subjects'>;
export type ContentItem = Tables<'content_items'>;
export type Task = Tables<'tasks'>;
export type ActivityLog = Tables<'activity_logs'>;
export type SystemLog = Tables<'system_logs'>;
export type Analytics = Tables<'analytics'>;

// Admin Users Service
export const adminUsersService = {
  async getUsers(): Promise<User[]> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data || [];
  },

  async getUserById(id: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async createUser(user: TablesInsert<'users'>): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .insert(user)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteUser(id: string): Promise<void> {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// Admin Schools Service
export const adminSchoolsService = {
  async getSchools(): Promise<School[]> {
    const { data, error } = await supabase
      .from('schools')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data || [];
  },

  async getSchoolById(id: string): Promise<School | null> {
    const { data, error } = await supabase
      .from('schools')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async createSchool(school: TablesInsert<'schools'>): Promise<School> {
    const { data, error } = await supabase
      .from('schools')
      .insert(school)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateSchool(id: string, updates: Partial<School>): Promise<School> {
    const { data, error } = await supabase
      .from('schools')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteSchool(id: string): Promise<void> {
    const { error } = await supabase
      .from('schools')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  async getSchoolUsers(schoolId: string): Promise<User[]> {
    const { data, error } = await supabase
      .from('school_users')
      .select(`
        user_id,
        users (*)
      `)
      .eq('school_id', schoolId);
    
    if (error) throw error;
    
    // Transform the result to extract user data
    return (data || []).map(item => (item.users as any) as User);
  },

  async addUserToSchool(schoolId: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('school_users')
      .insert({ school_id: schoolId, user_id: userId });
    
    if (error) throw error;
  },

  async removeUserFromSchool(schoolId: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('school_users')
      .delete()
      .eq('school_id', schoolId)
      .eq('user_id', userId);
    
    if (error) throw error;
  }
};

// Admin Content Service
export const adminContentService = {
  async getSubjects(): Promise<Subject[]> {
    const { data, error } = await supabase
      .from('subjects')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data || [];
  },

  async createSubject(subject: TablesInsert<'subjects'>): Promise<Subject> {
    const { data, error } = await supabase
      .from('subjects')
      .insert(subject)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getContentItems(): Promise<ContentItem[]> {
    const { data, error } = await supabase
      .from('content_items')
      .select(`
        *,
        subjects (*),
        created_by:users (name)
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async getContentItemById(id: string): Promise<ContentItem | null> {
    const { data, error } = await supabase
      .from('content_items')
      .select(`
        *,
        subjects (*),
        created_by:users (name)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async createContentItem(item: TablesInsert<'content_items'>): Promise<ContentItem> {
    const { data, error } = await supabase
      .from('content_items')
      .insert(item)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateContentItem(id: string, updates: Partial<ContentItem>): Promise<ContentItem> {
    const { data, error } = await supabase
      .from('content_items')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteContentItem(id: string): Promise<void> {
    const { error } = await supabase
      .from('content_items')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// Admin Analytics Service
export const adminAnalyticsService = {
  async getAnalytics(days: number = 30): Promise<Analytics[]> {
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - days);
    
    const { data, error } = await supabase
      .from('analytics')
      .select('*')
      .gte('date', fromDate.toISOString().split('T')[0])
      .order('date');
    
    if (error) throw error;
    return data || [];
  },

  async getActivityLogs(limit: number = 20): Promise<ActivityLog[]> {
    const { data, error } = await supabase
      .from('activity_logs')
      .select(`
        *,
        users (name)
      `)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data || [];
  },

  async getSystemLogs(level: string = 'all', limit: number = 50): Promise<SystemLog[]> {
    let query = supabase
      .from('system_logs')
      .select(`
        *,
        users (name)
      `)
      .order('timestamp', { ascending: false })
      .limit(limit);
    
    if (level !== 'all') {
      query = query.eq('level', level);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return data || [];
  },

  async getDashboardStats() {
    // Get total users count
    const { count: usersCount, error: usersError } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });

    if (usersError) throw usersError;

    // Get total schools count
    const { count: schoolsCount, error: schoolsError } = await supabase
      .from('schools')
      .select('*', { count: 'exact', head: true });

    if (schoolsError) throw schoolsError;

    // Get total content count (combining subjects, tasks, etc.)
    const [subjectsResult, contentResult] = await Promise.all([
      supabase.from('subjects').select('*', { count: 'exact', head: true }),
      supabase.from('content_items').select('*', { count: 'exact', head: true })
    ]);

    if (subjectsResult.error) throw subjectsResult.error;
    if (contentResult.error) throw contentResult.error;

    const totalContent = (subjectsResult.count || 0) + (contentResult.count || 0);

    // Get recent activities
    const { data: activities, error: activitiesError } = await supabase
      .from('activity_logs')
      .select(`
        id,
        action_type,
        description,
        created_at,
        users (name)
      `)
      .order('created_at', { ascending: false })
      .limit(5);

    if (activitiesError) throw activitiesError;

    return {
      totalUsers: usersCount || 0,
      totalSchools: schoolsCount || 0,
      totalContent,
      recentActivities: (activities || []).map(activity => ({
        id: activity.id,
        type: activity.action_type,
        description: activity.description,
        created_at: activity.created_at,
        user_name: (activity.users as any)?.name
      }))
    };
  }
};

// Log activity
export const logActivity = async (
  userId: string | null,
  actionType: string,
  description: string,
  entityType?: string,
  entityId?: string,
  metadata?: any
): Promise<void> => {
  const { error } = await supabase
    .from('activity_logs')
    .insert({
      user_id: userId,
      action_type: actionType,
      description,
      entity_type: entityType,
      entity_id: entityId,
      metadata: metadata ? JSON.stringify(metadata) : null
    });
  
  if (error) {
    console.error('Error logging activity:', error);
  }
}; 