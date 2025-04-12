import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fadeIn } from '@/lib/animations';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth';
import { UserRole } from '@/lib/types';
import { School, GraduationCap, Users, Baby, UserCog } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const SelectRolePage = () => {
  const navigate = useNavigate();
  const { setUserRole } = useAuth();
  const [loading, setLoading] = useState(false);
  
  const roles: { 
    id: string; 
    title: string; 
    role: UserRole; 
    description: string; 
    icon: JSX.Element; 
    color: string;
    dashboardPath: string;
  }[] = [
    {
      id: 'admin',
      title: 'Admin',
      role: 'admin',
      description: 'Manage the entire platform',
      icon: <UserCog className="h-6 w-6" />,
      color: 'from-[#8B7355] to-[#6B4423]',
      dashboardPath: '/admin'
    },
    {
      id: 'school_admin',
      title: 'School Admin',
      role: 'school_admin',
      description: 'Manage your school',
      icon: <School className="h-6 w-6" />,
      color: 'from-[#8B7355] to-[#6B4423]',
      dashboardPath: '/school'
    },
    {
      id: 'teacher',
      title: 'Teacher',
      role: 'teacher',
      description: 'Manage your classroom',
      icon: <GraduationCap className="h-6 w-6" />,
      color: 'from-[#8B7355] to-[#6B4423]',
      dashboardPath: '/teacher'
    },
    {
      id: 'parent',
      title: 'Parent',
      role: 'parent',
      description: 'Monitor your child\'s progress',
      icon: <Users className="h-6 w-6" />,
      color: 'from-[#8B7355] to-[#6B4423]',
      dashboardPath: '/parent'
    },
    {
      id: 'child',
      title: 'Student',
      role: 'child',
      description: 'Learn and play',
      icon: <GraduationCap className="h-6 w-6" />,
      color: 'from-[#8B7355] to-[#6B4423]',
      dashboardPath: '/student'
    }
  ];

  const handleRoleSelect = async (role: UserRole, dashboardPath: string) => {
    setLoading(true);
    try {
      // Set the user role in the auth context
      await setUserRole(role);
      
      // Show success toast
      toast({
        title: "Role selected",
        description: `You are now using the application as a ${role}.`,
      });
      
      // Log navigation attempt for debugging
      console.log(`Navigating to: ${dashboardPath}`);
      
      // Navigate to the corresponding dashboard
      navigate(dashboardPath);
    } catch (error) {
      console.error('Error setting user role:', error);
      
      // Show error toast
      toast({
        title: "Error",
        description: "There was a problem selecting your role. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5DC] flex flex-col">
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <motion.div 
          className="w-full max-w-4xl space-y-8"
          {...fadeIn}
        >
          <div className="text-center space-y-3">
            <h1 className="text-3xl font-bold text-[#6B4423]">Select Your Role</h1>
            <p className="text-[#8B7355]">
              Choose which dashboard you want to test
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {roles.map((roleOption) => (
              <motion.div
                key={roleOption.id}
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.2 }}
              >
                <Button
                  onClick={() => handleRoleSelect(roleOption.role, roleOption.dashboardPath)}
                  disabled={loading}
                  className={`w-full h-auto py-8 flex flex-col items-center justify-center gap-4 bg-gradient-to-br ${roleOption.color} hover:shadow-lg border border-[#DEB887]`}
                >
                  <div className="bg-white/25 p-3 rounded-full">
                    {roleOption.icon}
                  </div>
                  <div className="space-y-1 text-white">
                    <h3 className="text-lg font-semibold">{roleOption.title}</h3>
                    <p className="text-xs font-light opacity-90 px-2">
                      {roleOption.description}
                    </p>
                  </div>
                </Button>
              </motion.div>
            ))}
          </div>
          
          <div className="text-center mt-6">
            <Button 
              variant="outline" 
              onClick={() => navigate('/')} 
              className="px-6 border-[#8B7355] text-[#6B4423] hover:bg-[#DEB887]/10"
            >
              Back to Home
            </Button>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default SelectRolePage;
