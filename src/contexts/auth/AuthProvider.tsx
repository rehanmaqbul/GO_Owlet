import React, { createContext, useState, useEffect, useContext } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { UserRole } from '@/lib/types';
import { toast } from '@/components/ui/use-toast';
import { getRoleRedirectPath } from './authUtils';

interface AuthContextProps {
  session: Session | null;
  user: UserWithProfile | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string, role: UserRole) => Promise<void>;
  signOut: () => Promise<void>;
  isLoading: boolean;
  error: Error | null;
  // Legacy compatibility properties
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  setUserRole: (role: UserRole) => Promise<void>;
}

export interface UserWithProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string | null;
  childId?: string | null;
  parentId?: string | null;
}

export const AuthContext = createContext<AuthContextProps>({
  session: null,
  user: null,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  isLoading: true,
  error: null,
  // Legacy compatibility properties
  isAuthenticated: false,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  setUserRole: async () => {}
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<UserWithProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const fetchProfile = async (userId: string) => {
      try {
        const { data, error } = await supabase
          .rpc('get_profile_by_id', { user_id: userId });

        if (error) {
          console.error('Error fetching profile:', error);
          return null;
        }

        if (!data || data.length === 0) {
          console.warn('No profile found for user:', userId);
          return null;
        }

        const profile = data[0];
        return {
          id: profile.id as string,
          email: profile.email as string,
          name: profile.name as string,
          role: profile.role as UserRole,
          avatar: profile.avatar,
          childId: profile.childid,
          parentId: profile.parentid
        };
      } catch (err) {
        console.error('Error in fetchProfile:', err);
        return null;
      }
    };

    const setupAuthListener = () => {
      // Listen for auth changes
      const { data: authListener } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          setSession(session);
          
          if (event === 'SIGNED_IN' && session) {
            const { user } = session;
            
            if (user) {
              const profile = await fetchProfile(user.id);
              
              if (profile) {
                setUser(profile);
              } else {
                // If profile doesn't exist, create a basic one from auth data
                setUser({
                  id: user.id,
                  email: user.email || '',
                  name: user.user_metadata?.name || '',
                  role: (user.user_metadata?.role || 'user') as UserRole,
                  avatar: user.user_metadata?.avatar_url || null
                });
              }
            }
          } else if (event === 'SIGNED_OUT') {
            setUser(null);
          }
          
          setIsLoading(false);
        }
      );

      // Initialize from current session
      supabase.auth.getSession().then(async ({ data: { session } }) => {
        setSession(session);
        
        if (session?.user) {
          const profile = await fetchProfile(session.user.id);
          
          if (profile) {
            setUser(profile);
          } else {
            // If profile doesn't exist, create a basic one from auth data
            setUser({
              id: session.user.id,
              email: session.user.email || '',
              name: session.user.user_metadata?.name || '',
              role: (session.user.user_metadata?.role || 'user') as UserRole,
              avatar: session.user.user_metadata?.avatar_url || null
            });
          }
        }
        
        setIsLoading(false);
      });

      return authListener.subscription;
    };

    const authSubscription = setupAuthListener();

    return () => {
      // Clean up listener on unmount
      if (authSubscription) {
        authSubscription.unsubscribe();
      }
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
    } catch (error: any) {
      console.error('Error signing in:', error);
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string, role: UserRole) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role
          }
        }
      });
      
      if (error) throw error;
      
      // Profile record is created by the trigger we've set up
      if (data.user) {
        toast({
          title: 'Account created successfully',
          description: 'You can now sign in with your credentials',
        });
      }
    } catch (error: any) {
      console.error('Error signing up:', error);
      setError(error);
      toast({
        title: 'Error creating account',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error: any) {
      console.error('Error signing out:', error);
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const setUserRole = async (role: UserRole): Promise<void> => {
    try {
      setIsLoading(true);
      console.log(`Setting user role to: ${role}`);
      
      // For demo purposes, create a mock user with the selected role if no user exists
      if (!user) {
        console.log("Creating mock user for demo purposes");
        const mockUser: UserWithProfile = {
          id: `mock-${Date.now()}`,
          email: `mock-${role}@example.com`,
          name: `Mock ${role.charAt(0).toUpperCase() + role.slice(1)}`,
          role: role,
          avatar: null
        };
        setUser(mockUser);
        
        // Store mock user in localStorage for persistence
        localStorage.setItem('guardianOwletUser', JSON.stringify(mockUser));
      } else {
        // Update existing user's role
        const updatedUser = { ...user, role };
        setUser(updatedUser);
        localStorage.setItem('guardianOwletUser', JSON.stringify(updatedUser));
      }
      
      // Set isAuthenticated to true after role is set
      setIsAuthenticated(true);
      
      console.log(`User role set to: ${role}`);
    } catch (error: any) {
      console.error('Error setting user role:', error);
      toast({
        title: 'Error updating role',
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('guardianOwletUser');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (err) {
        console.error('Error parsing stored user:', err);
        localStorage.removeItem('guardianOwletUser');
      }
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        signIn,
        signUp,
        signOut,
        isLoading,
        error,
        // Legacy compatibility properties
        isAuthenticated,
        login: signIn,
        register: signUp,
        logout: signOut,
        setUserRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
