
import { UserRole } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export const getRoleRedirectPath = (role: UserRole): string => {
  switch (role) {
    case 'admin':
      return '/admin-dashboard';
    case 'teacher':
      return '/teacher-dashboard';
    case 'parent':
      return '/parent-dashboard';
    case 'child':
      return '/child-dashboard';
    default:
      return '/';
  }
};

export const logoutUser = async (): Promise<void> => {
  try {
    // Sign out from Supabase
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    
    // Clear local storage
    localStorage.removeItem('guardianOwletUser');
    
    // Redirect to home
    window.location.href = '/';
  } catch (error) {
    console.error('Error signing out:', error);
    toast({
      title: 'Error signing out',
      description: 'There was a problem signing out. Please try again.',
      variant: 'destructive',
    });
    throw error;
  }
};

export const loginUser = async (email: string, password: string): Promise<void> => {
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    
    toast({
      title: 'Welcome back!',
      description: 'You have successfully logged in.',
    });
  } catch (error: any) {
    console.error('Error logging in:', error);
    toast({
      title: 'Login failed',
      description: error.message || 'There was a problem logging in. Please check your credentials and try again.',
      variant: 'destructive',
    });
    throw error;
  }
};

export const registerUser = async (email: string, password: string, name: string, role: UserRole): Promise<void> => {
  try {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role,
        },
      },
    });
    
    if (error) throw error;
    
    // Store the email for this role for future logins
    localStorage.setItem(`${role}Email`, email);
    
    toast({
      title: 'Account created',
      description: 'Your account has been created successfully. You can now log in.',
    });
  } catch (error: any) {
    console.error('Error registering:', error);
    toast({
      title: 'Registration failed',
      description: error.message || 'There was a problem creating your account. Please try again.',
      variant: 'destructive',
    });
    throw error;
  }
};
