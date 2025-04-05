
import { User, UserRole } from '@/lib/types';

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  setUserRole: (role: UserRole) => void;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, role: UserRole) => Promise<void>;
}
