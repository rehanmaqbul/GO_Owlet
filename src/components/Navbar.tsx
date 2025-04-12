import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { LogOut, Menu, X } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from '@/components/ui/use-toast';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Redirect to appropriate dashboard
  useEffect(() => {
    if (isAuthenticated && location.pathname === '/dashboard') {
      if (user?.role === 'admin') {
        navigate('/admin-dashboard', { replace: true });
      } else if (user?.role === 'teacher') {
        navigate('/teacher-dashboard', { replace: true });
      } else if (user?.role === 'parent') {
        navigate('/parent-dashboard', { replace: true });
      } else if (user?.role === 'child') {
        navigate('/student', { replace: true });
      }
    }
  }, [isAuthenticated, location.pathname, user?.role, navigate]);

  // Close mobile menu when changing routes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/', { replace: true });
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account."
      });
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Logout failed",
        description: "There was a problem logging out. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (!isAuthenticated) return null;

  // Get the correct navlinks based on user role
  const getNavLinks = () => {
    const defaultLinks = [
      { name: 'Dashboard', path: user?.role === 'admin' ? '/admin-dashboard' : 
                                user?.role === 'teacher' ? '/teacher-dashboard' :
                                user?.role === 'parent' ? '/parent-dashboard' :
                                user?.role === 'child' ? '/student' : '/dashboard' },
    ];
    
    const roleSpecificLinks = {
      admin: [
        { name: 'Question Bank', path: '/questions' },
        { name: 'Resources', path: '/resources' },
      ],
      teacher: [
        { name: 'Students', path: '/students' },
        { name: 'Tasks', path: '/tasks' },
      ],
      parent: [
        { name: 'My Child', path: '/child-management' },
        { name: 'Tasks', path: '/parent-check-tasks' },
        { name: 'Resources', path: '/parent-resources' },
      ],
      child: [
        { name: 'My Tasks', path: '/student/tasks' },
        { name: 'Messages', path: '/student/messages' },
      ]
    };
    
    return [...defaultLinks, ...(user?.role ? roleSpecificLinks[user.role as keyof typeof roleSpecificLinks] || [] : [])];
  };

  const navLinks = getNavLinks();

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-200 py-4 px-6",
        isScrolled ? 
          "bg-white/80 backdrop-blur-sm border-b border-slate-200/50 shadow-sm" : 
          "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <Link to={user?.role === 'child' ? '/student' : (user?.role ? `/${user.role}-dashboard` : '/dashboard')} className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-owl-blue to-owl-blue-dark flex items-center justify-center">
              <span className="text-white text-xl font-bold">G</span>
            </div>
            <span className="font-semibold text-lg hidden sm:block text-owl-slate-dark">
              Guardian Owlet
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1">
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                to={link.path}
                className={cn(
                  "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                  location.pathname === link.path ? 
                    "text-owl-blue-dark bg-owl-blue-light" : 
                    "text-owl-slate hover:text-owl-slate-dark hover:bg-owl-neutral"
                )}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* User menu */}
          <div className="flex items-center space-x-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-owl-slate-dark">{user?.name}</p>
              <p className="text-xs text-owl-slate capitalize">{user?.role}</p>
            </div>
            <Avatar className="h-9 w-9 border-2 border-white shadow-sm">
              <AvatarImage src={user?.avatar} alt={user?.name} />
              <AvatarFallback className="bg-owl-blue-light text-owl-blue-dark">
                {user?.name ? getInitials(user.name) : '??'}
              </AvatarFallback>
            </Avatar>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleLogout}
              className="h-9 w-9 rounded-full text-owl-slate hover:text-owl-slate-dark hover:bg-owl-neutral"
            >
              <LogOut size={18} />
              <span className="sr-only">Log out</span>
            </Button>
          </div>
          
          {/* Mobile menu button */}
          <Button 
            variant="ghost" 
            size="icon"
            className="md:hidden h-9 w-9 rounded-full"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>
      </div>
      
      {/* Mobile navigation */}
      {mobileMenuOpen && (
        <nav className="md:hidden pt-4 pb-6 px-6 mt-4 bg-white border-t border-slate-100 animate-slide-down">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                to={link.path}
                className={cn(
                  "px-4 py-3 rounded-md text-sm font-medium",
                  location.pathname === link.path ? 
                    "text-owl-blue-dark bg-owl-blue-light" : 
                    "text-owl-slate hover:text-owl-slate-dark hover:bg-owl-neutral"
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
};

export default Navbar;
