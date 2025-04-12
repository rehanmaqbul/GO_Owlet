import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { Tables } from '@/lib/supabase/database.types';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import {
  Users,
  BarChart,
  Server,
  BookOpen,
  GraduationCap,
  Settings,
  AlertCircle,
  Shield,
  School,
  Building2,
  User,
  FileText,
  ChevronRight,
  Upload,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { DashboardLayout, SidebarSection, SidebarNavItem } from '@/components/layout/DashboardLayout';
import { ActionCard } from '@/components/ui/ActionCard';
import { StatsCard } from '@/components/ui/StatsCard';
import { BulkUploadDialog } from '@/components/admin/BulkUploadDialog';
import Navbar from '@/components/Navbar';
import { dashboardService, DashboardStats } from '@/services/dashboard/dashboardService';
import { format, formatDistanceToNow } from 'date-fns';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface Student extends Tables<'users'> {
  grade?: string;
  parent_email?: string;
  school?: {
    name: string;
  };
}

export default function AdminDashboard() {
  const { toast } = useToast();
  const [schools, setSchools] = useState<Tables<'schools'>[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [studentData, setStudentData] = useState({
    name: '',
    email: '',
    role: 'child' as const,
    status: 'pending' as const,
    school_id: '',
    grade: '',
    parent_email: ''
  });
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (user?.role !== 'admin') {
      navigate('/dashboard');
      return;
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    fetchSchools();
    fetchAllStudents();
  }, []);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const stats = await dashboardService.getDashboardStats();
        console.log("Initial dashboard stats:", stats);
        setDashboardStats(stats);
      } catch (err) {
        setError('Failed to load dashboard data. Please try again later.');
        console.error('Dashboard stats error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  const fetchSchools = async () => {
    const { data, error } = await supabase
      .from('schools')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Error fetching schools:', error);
      return;
    }
    setSchools(data || []);
  };

  const fetchAllStudents = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select(`
          *,
          school_users!inner(school_id),
          schools:school_users(schools(*))
        `)
        .eq('role', 'child');

      if (error) {
        console.error('Error fetching students:', error);
        toast({
          title: "Error",
          description: "Failed to fetch students",
          variant: "destructive"
        });
        return;
      }

      // Transform the data to match our Student interface
      const transformedData = data.map(student => ({
        ...student,
        school: student.schools?.[0]?.schools
      }));

      setStudents(transformedData);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (!studentData.name || !studentData.email || !studentData.school_id) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields",
          variant: "destructive"
        });
        return;
      }

      // First create the user
      const { data: userData, error: userError } = await supabase
        .from('users')
        .insert([{
          name: studentData.name,
          email: studentData.email,
          role: studentData.role,
          status: studentData.status
        }])
        .select()
        .single();

      if (userError) throw userError;

      // Then create the school association
      const { error: associationError } = await supabase
        .from('school_users')
        .insert([{
          school_id: studentData.school_id,
          user_id: userData.id
        }]);

      if (associationError) throw associationError;

      toast({
        title: "Success",
        description: "Student added successfully",
      });

      // Reset form
      setStudentData({
        name: '',
        email: '',
        role: 'child',
        status: 'pending',
        school_id: '',
        grade: '',
        parent_email: ''
      });

      // Refresh students list
      await fetchAllStudents();

    } catch (error: any) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add student",
        variant: "destructive"
      });
    }
  };

  const handleRefreshStats = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const stats = await dashboardService.getDashboardStats();
      setDashboardStats(stats);
      console.log("Refreshed dashboard stats:", stats);
    } catch (err) {
      setError('Failed to refresh dashboard data. Please try again later.');
      console.error('Dashboard refresh error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const navigateTo = (path: string) => {
    navigate(path);
  };

  // Create sidebar content
  const sidebarContent = (
    <>
      <SidebarSection title="MAIN">
        <SidebarNavItem 
          icon={<BarChart size={18} className="mr-2" />}
          label="Dashboard"
          onClick={() => navigateTo('/admin-dashboard')}
          active={true}
        />
        <SidebarNavItem 
          icon={<Users size={18} className="mr-2" />}
          label="Users"
          onClick={() => navigateTo('/admin/users')}
        />
        <SidebarNavItem 
          icon={<GraduationCap size={18} className="mr-2" />}
          label="Teachers"
          onClick={() => navigateTo('/admin/teachers')}
        />
        <SidebarNavItem 
          icon={<School size={18} className="mr-2" />}
          label="Schools"
          onClick={() => navigateTo('/admin/schools')}
        />
        <SidebarNavItem 
          icon={<BookOpen size={18} className="mr-2" />}
          label="Content"
          onClick={() => navigateTo('/admin/content')}
        />
      </SidebarSection>
      
      <SidebarSection title="SYSTEM">
        <SidebarNavItem 
          icon={<BarChart size={18} className="mr-2" />}
          label="Analytics"
          onClick={() => navigateTo('/admin/analytics')}
        />
        <SidebarNavItem 
          icon={<AlertCircle size={18} className="mr-2" />}
          label="System Logs"
          onClick={() => navigateTo('/admin/logs')}
        />
        <SidebarNavItem 
          icon={<Shield size={18} className="mr-2" />}
          label="Security"
          onClick={() => navigateTo('/admin/security')}
        />
        <SidebarNavItem 
          icon={<Settings size={18} className="mr-2" />}
          label="Settings"
          onClick={() => navigateTo('/admin/settings')}
        />
      </SidebarSection>
    </>
  );

  const statCards = [
    {
      title: 'Total Users',
      value: dashboardStats?.totalUsers.toString() || '0',
      icon: Users,
      bgColor: 'bg-amber-100'
    },
    {
      title: 'Active Schools',
      value: dashboardStats?.totalSchools.toString() || '0',
      icon: School,
      bgColor: 'bg-amber-100'
    },
    {
      title: 'Content Pieces',
      value: dashboardStats?.totalContent.toString() || '0',
      icon: BookOpen,
      bgColor: 'bg-amber-100'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-owl-neutral-lighter to-white">
      <Navbar />
      
      <main className="pt-24 px-4 pb-12 max-w-7xl mx-auto">
        {/* Header with Bulk Upload */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-owl-slate-dark">Admin Dashboard</h1>
            <p className="text-sm text-owl-slate">Manage and monitor the learning platform</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefreshStats}
              disabled={isLoading}
              className="border-amber-200 text-amber-700 hover:bg-amber-50"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Refresh Stats
            </Button>
            <Button
              onClick={() => setShowBulkUpload(true)}
              className="bg-amber-600 text-white hover:bg-amber-700"
            >
              <Upload className="mr-2 h-4 w-4" />
              Bulk Upload
            </Button>
          </div>
        </div>

        <DashboardLayout
          sidebarContent={sidebarContent}
          headerTitle="Dashboard Overview"
          headerSubtitle="System overview and quick actions"
          logoIcon={<Shield size={18} />}
        >
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {debugInfo && (
            <Alert variant="default" className="mb-6 bg-blue-50 border-blue-200">
              <AlertTitle className="text-blue-700">Debug Info</AlertTitle>
              <AlertDescription className="text-blue-600">{debugInfo}</AlertDescription>
            </Alert>
          )}

          {/* System Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {isLoading ? (
              Array(3).fill(0).map((_, index) => (
                <div key={index} className="h-32 bg-gray-100 rounded-lg animate-pulse" />
              ))
            ) : (
              statCards.map((stat) => (
                <StatsCard 
                  key={stat.title}
                  label={stat.title}
                  value={stat.value}
                  icon={stat.icon}
                  bgColor={stat.bgColor}
                />
              ))
            )}
          </div>
          
          {/* Quick Actions */}
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            <ActionCard
              title="User Management"
              description="Manage users, roles and permissions"
              icon={User}
              buttonText="Manage Users"
              buttonIcon={<ChevronRight className="h-4 w-4 ml-2" />}
              onClick={() => navigateTo('/admin/users')}
            />
            
            <ActionCard
              title="Content Management"
              description="Manage educational content and resources"
              icon={BookOpen}
              buttonText="Manage Content"
              buttonIcon={<ChevronRight className="h-4 w-4 ml-2" />}
              onClick={() => navigateTo('/admin/content')}
            />
            
            <ActionCard
              title="School Management"
              description="Manage schools and institutions"
              icon={Building2}
              buttonText="Manage Schools"
              buttonIcon={<ChevronRight className="h-4 w-4 ml-2" />}
              onClick={() => navigateTo('/admin/schools')}
            />
            
            <ActionCard
              title="System Analytics"
              description="View detailed system usage analytics"
              icon={BarChart}
              buttonText="View Analytics"
              buttonIcon={<ChevronRight className="h-4 w-4 ml-2" />}
              onClick={() => navigateTo('/admin/analytics')}
            />
            
            <ActionCard
              title="System Logs"
              description="View system logs and activities"
              icon={Server}
              buttonText="View Logs"
              buttonIcon={<ChevronRight className="h-4 w-4 ml-2" />}
              onClick={() => navigateTo('/admin/logs')}
            />
            
            <ActionCard
              title="System Security"
              description="Manage security and authentication settings"
              icon={Shield}
              buttonText="Security Settings"
              buttonIcon={<ChevronRight className="h-4 w-4 ml-2" />}
              onClick={() => navigateTo('/admin/security')}
            />
          </div>
          
          {/* Recent Activity */}
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Recent Activity</h2>
          <div className="border border-stone-200 rounded-lg bg-stone-50 p-4 overflow-hidden">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
              </div>
            ) : dashboardStats?.recentActivities && dashboardStats.recentActivities.length > 0 ? (
              <div className="space-y-4">
                {dashboardStats.recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start gap-4 p-2 rounded-lg hover:bg-stone-100">
                    <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                      <User className="h-4 w-4 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">{activity.description}</p>
                      <p className="text-xs text-gray-400">
                        {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">No recent activity</p>
            )}
          </div>
        </DashboardLayout>
      </main>

      <BulkUploadDialog
        open={showBulkUpload}
        onOpenChange={setShowBulkUpload}
      />
    </div>
  );
} 