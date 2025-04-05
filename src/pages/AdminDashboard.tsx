import { useEffect } from 'react';
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
  ChevronRight
} from 'lucide-react';
import { DashboardLayout, SidebarSection, SidebarNavItem } from '@/components/layout/DashboardLayout';
import { ActionCard } from '@/components/ui/ActionCard';
import { StatsCard } from '@/components/ui/StatsCard';

// Mock data for system stats
const statCards = [
  {
    title: 'Total Users',
    value: '2,851',
    icon: Users,
    bgColor: 'bg-amber-100'
  },
  {
    title: 'Active Schools',
    value: '48',
    icon: School,
    bgColor: 'bg-amber-100'
  },
  {
    title: 'Content Pieces',
    value: '1,204',
    icon: BookOpen,
    bgColor: 'bg-amber-100'
  }
];

const AdminDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
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

  return (
    <DashboardLayout
      sidebarContent={sidebarContent}
      headerTitle="Dashboard Overview"
      headerSubtitle="System overview and quick actions"
      logoIcon={<Shield size={18} />}
    >
      {/* System Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {statCards.map((stat) => (
          <StatsCard 
            key={stat.title}
            label={stat.title}
            value={stat.value}
            icon={stat.icon}
            bgColor={stat.bgColor}
            change="+12%"
            changeValue={12}
          />
        ))}
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
        <ul className="space-y-4">
          <li className="flex items-start gap-3">
            <div className="bg-amber-100 p-2 rounded-full mt-0.5">
              <User className="h-4 w-4 text-amber-700" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">New Teacher Registered</p>
              <p className="text-xs text-gray-600">Jane Smith registered as a new teacher</p>
              <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <div className="bg-amber-100 p-2 rounded-full mt-0.5">
              <FileText className="h-4 w-4 text-amber-700" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">New Content Added</p>
              <p className="text-xs text-gray-600">15 new math exercises were added</p>
              <p className="text-xs text-gray-400 mt-1">5 hours ago</p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <div className="bg-amber-100 p-2 rounded-full mt-0.5">
              <School className="h-4 w-4 text-amber-700" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">New School Onboarded</p>
              <p className="text-xs text-gray-600">Springfield Elementary School has been added</p>
              <p className="text-xs text-gray-400 mt-1">1 day ago</p>
            </div>
          </li>
        </ul>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
