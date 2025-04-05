// This file is read-only, but I'm examining its content to understand the issue
// The PrivateRoute component likely handles authentication requirements for protected routes

// The issue might be that the PrivateRoute is redirecting users to login or 404 because:
// 1. There might be incomplete authentication after selecting a role
// 2. The allowedRoles check might be failing

// Since we can't modify this file, we need to ensure proper authentication before navigation
// Let's make the SelectRolePage properly set up authentication before navigation

// Choose ONLY ONE of these export styles:

import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { UserRole } from '@/lib/types';

interface PrivateRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const PrivateRoute = ({ children, allowedRoles }: PrivateRouteProps) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // If no user or no role, redirect to role selection
  if (!user || !user.role) {
    return <Navigate to="/select-role" state={{ from: location }} replace />;
  }

  // If role is specified but not allowed, redirect to 404
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/404" replace />;
  }

  // If all checks pass, render the protected content
  return <>{children}</>;
};
