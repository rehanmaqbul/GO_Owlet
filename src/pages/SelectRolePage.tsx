
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fadeIn } from '@/lib/animations';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth';
import { UserRole } from '@/lib/types';
import { School, GraduationCap, Users, Baby } from 'lucide-react';
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
      description: 'Manage curriculum & resources',
      icon: <GraduationCap className="h-8 w-8" />,
      color: 'from-blue-500 to-blue-700',
      dashboardPath: '/admin-dashboard'
    },
    {
      id: 'teacher',
      title: 'Teacher',
      role: 'teacher',
      description: 'Assign tasks & track progress',
      icon: <School className="h-8 w-8" />,
      color: 'from-green-500 to-green-700',
      dashboardPath: '/teacher-dashboard'
    },
    {
      id: 'parent',
      title: 'Parent',
      role: 'parent',
      description: 'Monitor & support your child',
      icon: <Users className="h-8 w-8" />,
      color: 'from-purple-500 to-purple-700',
      dashboardPath: '/parent-dashboard'
    },
    {
      id: 'child',
      title: 'Child',
      role: 'child',
      description: 'Complete assigned tasks',
      icon: <Baby className="h-8 w-8" />,
      color: 'from-amber-500 to-amber-700',
      dashboardPath: '/child-dashboard'
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
    <div className="min-h-screen bg-owl-neutral flex flex-col">
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <motion.div 
          className="w-full max-w-4xl space-y-8"
          {...fadeIn}
        >
          <div className="text-center space-y-3">
            <h1 className="text-3xl font-bold text-owl-slate-dark">Select Your Role</h1>
            <p className="text-owl-slate">
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
                  className={`w-full h-auto py-8 flex flex-col items-center justify-center gap-4 bg-gradient-to-br ${roleOption.color} hover:shadow-lg`}
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
            <Button variant="outline" onClick={() => navigate('/')} className="px-6">
              Back to Home
            </Button>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default SelectRolePage;
