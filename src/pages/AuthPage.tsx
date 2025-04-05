import { useState, useEffect } from 'react';
import { useNavigate, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { UserRole } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AuthHeader } from '@/components/auth/AuthHeader';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';

export default function AuthPage() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the selected role from location state (if available)
  const selectedRole = location.state?.selectedRole as UserRole | undefined;
  const initialAction = location.state?.action as string | undefined;
  
  const [activeTab, setActiveTab] = useState(initialAction === 'login' ? 'login' : 'register');
  const [loginEmail, setLoginEmail] = useState('');

  // Check for role-specific email
  useEffect(() => {
    if (selectedRole) {
      const savedEmail = localStorage.getItem(`${selectedRole}Email`);
      if (savedEmail) {
        setLoginEmail(savedEmail);
      }
    }
  }, [selectedRole]);

  // Redirect if already authenticated
  if (isAuthenticated && user) {
    // Get the appropriate dashboard for the user's role
    let redirectPath = '/';
    switch (user.role) {
      case 'admin':
        redirectPath = '/admin-dashboard';
        break;
      case 'teacher':
        redirectPath = '/teacher-dashboard';
        break;
      case 'parent':
        redirectPath = '/parent-dashboard';
        break;
      case 'child':
        redirectPath = '/child-dashboard';
        break;
    }
    return <Navigate to={redirectPath} replace />;
  }

  const handleRegisterSuccess = (email: string) => {
    setLoginEmail(email);
    setActiveTab('login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-owl-neutral p-4">
      <div className="w-full max-w-md">
        <AuthHeader />

        <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
          
          <Card>
            <TabsContent value="login" className="mt-0">
              <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>
                  Enter your credentials to access your account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <LoginForm 
                  defaultEmail={loginEmail}
                  onSwitchToRegister={() => setActiveTab('register')}
                />
              </CardContent>
            </TabsContent>
            
            <TabsContent value="register" className="mt-0">
              <CardHeader>
                <CardTitle>Create an Account</CardTitle>
                <CardDescription>
                  Join Guardian Owlet to enhance your educational journey
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RegisterForm 
                  selectedRole={selectedRole}
                  onRegisterSuccess={handleRegisterSuccess}
                  onSwitchToLogin={() => setActiveTab('login')}
                />
              </CardContent>
            </TabsContent>
          </Card>
        </Tabs>
        
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/')}
            className="text-owl-blue hover:underline text-sm"
          >
            Back to role selection
          </button>
        </div>
      </div>
    </div>
  );
}
