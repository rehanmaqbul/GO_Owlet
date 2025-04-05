
// This file is kept for backward compatibility
// It re-exports the useAuth hook from the AuthProvider
import { useAuth as useAuthFromProvider } from './AuthProvider';

export const useAuth = useAuthFromProvider;
