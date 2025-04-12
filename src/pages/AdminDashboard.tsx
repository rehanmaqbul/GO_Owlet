import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
  RefreshCw,
  FileEdit
} from 'lucide-react';
import { DashboardLayout, SidebarSection, SidebarNavItem } from '@/components/layout/DashboardLayout';
import { ActionCard } from '@/components/ui/ActionCard';
import { StatsCard } from '@/components/ui/StatsCard';
import { BulkUploadDialog } from '@/components/admin/BulkUploadDialog';
import Navbar from '@/components/Navbar';
import { dashboardService, DashboardStats } from '@/services/dashboard/dashboardService';
import { format, formatDistanceToNow } from 'date-fns';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { supabase } from '@/lib/supabase';

const AdminDashboard = () => {
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
  
  // Force refresh dashboard stats
  const handleRefreshStats = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setDebugInfo(null);
      
      // Direct way to get user count
      const { data: users, error: userError } = await supabase.from('users').select('id');
      
      if (userError) {
        throw new Error(`User query error: ${userError.message}`);
      }
      
      const directUserCount = users?.length || 0;
      console.log("Direct user count:", directUserCount);
      
      // Get stats through service
      const stats = await dashboardService.getDashboardStats();
      console.log("Dashboard stats refreshed:", stats);
      
      setDashboardStats({
        ...stats,
        totalUsers: directUserCount // Override with direct count
      });
      
      setDebugInfo(`Direct count: ${directUserCount}, Service count: ${stats.totalUsers}`);
    } catch (err: any) {
      console.error('Debug refresh error:', err);
      setError(`Failed to refresh data: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user || user.role !== 'admin') return null;

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
              onClick={() => navigate('/admin/online-forms')}
              className="bg-amber-600 text-white hover:bg-amber-700"
            >
              <FileEdit className="mr-2 h-4 w-4" />
              Online Forms
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
              <ul className="space-y-4">
                {dashboardStats.recentActivities.map((activity) => (
                  <li key={activity.id} className="flex items-start gap-3">
                    <div className="bg-amber-100 p-2 rounded-full mt-0.5">
                      {activity.type === 'user' ? (
                        <User className="h-4 w-4 text-amber-700" />
                      ) : (
                        <FileText className="h-4 w-4 text-amber-700" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{activity.description}</p>
                      {activity.user_name && (
                        <p className="text-xs text-gray-600">by {activity.user_name}</p>
                      )}
                      <p className="text-xs text-gray-400 mt-1">
                        {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                <p>No recent activities found</p>
                <p className="text-sm">Activities will appear here as users interact with the system</p>
              </div>
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
};

export default AdminDashboard;
