import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/auth';
import { UserRole } from '@/lib/types';
import { toast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

const loginFormSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
});

export type LoginFormValues = z.infer<typeof loginFormSchema>;

interface LoginFormProps {
  defaultEmail?: string;
  onLoginSuccess?: () => void;
  onSwitchToRegister: () => void;
}

export function LoginForm({ defaultEmail = '', onLoginSuccess, onSwitchToRegister }: LoginFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { login, setUserRole } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: defaultEmail,
      password: ''
    }
  });
  
  async function onSubmit(values: LoginFormValues) {
    setIsLoading(true);
    
    try {
      // For testing purposes, handle test accounts directly
      if (values.email === 'parent@example.com' && values.password === 'testpassword') {
        await setUserRole('parent');
        navigate('/parent-dashboard');
        return;
      } else if (values.email === 'child@example.com' && values.password === 'testpassword') {
        await setUserRole('child');
        navigate('/child-dashboard');
        return;
      }
      
      // For regular accounts, use the login function
      await login(values.email, values.password);
      
      toast({
        title: "Login successful",
        description: "You have been logged in successfully."
      });
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "There was a problem logging in. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }

  if (defaultEmail && form.getValues('email') !== defaultEmail) {
    form.setValue('email', defaultEmail);
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="your.email@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
      </Form>
      
      <div className="text-sm text-center text-owl-slate mt-4">
        Don't have an account?{" "}
        <button
          onClick={onSwitchToRegister}
          className="text-owl-blue hover:underline"
        >
          Register
        </button>
      </div>
    </>
  );
}
