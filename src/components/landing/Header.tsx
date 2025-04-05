
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { Button } from '@/components/ui/button';
import { LogOut, School } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  
  // Determine dashboard link based on user role
  const getDashboardLink = () => {
    if (!isAuthenticated || !user) return '/select-role';
    
    switch (user.role) {
      case 'admin':
        return '/admin-dashboard';
      case 'teacher':
        return '/teacher-dashboard';
      case 'parent':
        return '/parent-dashboard';
      case 'child':
        return '/child-dashboard';
      default:
        return '/select-role';
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      // After logout, make sure to clear local storage
      localStorage.removeItem('guardianOwletUser');
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleLoginTest = () => {
    navigate('/select-role');
  };

  return (
    <header className="py-6 px-4 flex justify-between items-center max-w-7xl mx-auto">
      <div className="flex items-center gap-2">
        <Link to="/" className="flex items-center gap-2">
          <School className="h-8 w-8 text-owl-blue" />
          <span className="text-2xl font-bold text-owl-slate-dark">Guardian Owlet</span>
        </Link>
      </div>
      
      <div className="flex items-center gap-3">
        {isAuthenticated && user ? (
          <>
            <span className="text-owl-slate hidden sm:inline">Logged in as: <strong>{user.role}</strong></span>
            <Button asChild size="sm">
              <Link to={getDashboardLink()} className="flex items-center gap-2">
                Dashboard
              </Link>
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </>
        ) : (
          <Button size="sm" onClick={handleLoginTest}>
            Login to test
          </Button>
        )}
      </div>
    </header>
  );
};

export default Header;
