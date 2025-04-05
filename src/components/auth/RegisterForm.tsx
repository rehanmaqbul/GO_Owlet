import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/auth';
import { UserRole } from '@/lib/types';

const registerSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters long' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
  role: z.enum(['admin', 'teacher', 'parent', 'child']),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;

interface RegisterFormProps {
  selectedRole?: UserRole;
  onRegisterSuccess: (email: string) => void;
  onSwitchToLogin: () => void;
}

export function RegisterForm({ selectedRole, onRegisterSuccess, onSwitchToLogin }: RegisterFormProps) {
  const { register } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If we have a role-specific saved email, use it as default
  const getRoleDefaultEmail = (role?: UserRole): string => {
    if (!role) return '';
    return localStorage.getItem(`${role}Email`) || '';
  };

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: selectedRole ? getRoleDefaultEmail(selectedRole) : '',
      password: '',
      role: selectedRole || 'parent',
    },
  });

  // Update email when role changes
  const onRoleChange = (role: UserRole) => {
    const savedEmail = getRoleDefaultEmail(role);
    if (savedEmail) {
      form.setValue('email', savedEmail);
    }
  };

  const onSubmit = async (data: RegisterFormValues) => {
    setIsSubmitting(true);
    try {
      await register(data.email, data.password, data.name, data.role as UserRole);
      
      // Store the email for this role
      localStorage.setItem(`${data.role}Email`, data.email);
      
      onRegisterSuccess(data.email);
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your full name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <Select 
                  onValueChange={(value) => {
                    field.onChange(value);
                    onRoleChange(value as UserRole);
                  }} 
                  defaultValue={field.value}
                  disabled={!!selectedRole}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="teacher">Teacher</SelectItem>
                    <SelectItem value="parent">Parent</SelectItem>
                    <SelectItem value="child">Child</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Creating account...' : 'Register'}
          </Button>
        </form>
      </Form>
      
      <div className="text-sm text-center text-owl-slate mt-4">
        Already have an account?{" "}
        <button
          onClick={onSwitchToLogin}
          className="text-owl-blue hover:underline"
        >
          Login
        </button>
      </div>
    </>
  );
}
