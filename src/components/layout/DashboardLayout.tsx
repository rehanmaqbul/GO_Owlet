import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SidebarNavItemProps {
  icon: ReactNode;
  label: string;
  onClick: () => void;
  variant?: 'default' | 'ghost' | 'secondary';
  active?: boolean;
}

const SidebarNavItem = ({ 
  icon, 
  label, 
  onClick, 
  variant = 'ghost',
  active = false 
}: SidebarNavItemProps) => {
  const baseClasses = "w-full justify-start text-gray-800";
  let activeClasses = "";
  
  if (active) {
    activeClasses = variant === 'ghost' ? 'bg-amber-100' : '';
  } else {
    activeClasses = 'hover:bg-stone-300';
  }
  
  return (
    <Button 
      variant={variant} 
      className={`${baseClasses} ${activeClasses}`}
      onClick={onClick}
    >
      {icon}
      {label}
    </Button>
  );
};

interface SidebarSectionProps {
  title: string;
  children: ReactNode;
}

const SidebarSection = ({ title, children }: SidebarSectionProps) => {
  return (
    <div className="px-4 mb-6">
      <h2 className="text-xs font-semibold text-gray-600 mb-3 uppercase tracking-wider">{title}</h2>
      <div className="space-y-1">
        {children}
      </div>
    </div>
  );
};

interface DashboardLayoutProps {
  children: ReactNode;
  sidebarContent: ReactNode;
  headerTitle?: string;
  headerSubtitle?: string;
  headerContent?: ReactNode;
  logoIcon: ReactNode;
}

const DashboardLayout = ({ 
  children, 
  sidebarContent, 
  headerTitle,
  headerSubtitle,
  headerContent,
  logoIcon 
}: DashboardLayoutProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    localStorage.removeItem('guardianOwletUser');
    navigate('/');
  };

  return (
    <div className="flex min-h-screen bg-stone-100">
      {/* Sidebar */}
      <div className="w-64 min-h-screen bg-stone-200 text-gray-800 flex flex-col shadow-md">
        {/* Logo */}
        <div className="p-4 flex items-center gap-2 border-b border-stone-300">
          <div className="bg-amber-100 rounded-md p-1">
            <div className="text-amber-700 font-bold">
              {logoIcon}
            </div>
          </div>
          <h1 className="text-xl font-bold text-gray-900">Owlet</h1>
        </div>
        
        {/* Sidebar Content */}
        <div className="py-8 flex-1">
          {sidebarContent}
        </div>
        
        {/* User info */}
        <div className="p-4 border-t border-stone-300 flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-bold">
              {user?.name ? user.name.charAt(0).toUpperCase() : user?.role?.charAt(0).toUpperCase()}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">{user?.name || user?.role}</p>
              <p className="text-xs text-gray-600">{user?.role} Account</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 bg-stone-100">
        <div className="p-8">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            {(headerTitle || headerContent) && (
              <div className="mb-8">
                {headerContent ? (
                  headerContent
                ) : (
                  <div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-1">{headerTitle}</h1>
                    {headerSubtitle && <p className="text-gray-600">{headerSubtitle}</p>}
                  </div>
                )}
              </div>
            )}
            
            {/* Main Content */}
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export { DashboardLayout, SidebarSection, SidebarNavItem }; 