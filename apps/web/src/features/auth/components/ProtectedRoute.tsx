import * as React from 'react';
import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { UserRole } from '../../../shared/types/global.types';

export interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute = ({
  children,
  allowedRoles,
}: ProtectedRouteProps) => {
  const { isAuthenticated, user, checkTokenValidity, isInitialized, isLoading, initializeAuth } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    if (!isInitialized) {
      initializeAuth();
    }
  }, [isInitialized, initializeAuth]);

  if (isLoading || !isInitialized) {
    return (
      <div className="min-h-screen bg-[#FAFAF9] dark:bg-[#0F0F0F] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">Verifying session...</span>
        </div>
      </div>
    );
  }

  const isValid = checkTokenValidity();

  if (!isAuthenticated || !user || !isValid) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Developer, Principal, and Admin have universal access across all routes
  const isSuperUser = user.role === 'developer' || user.role === 'principal' || user.role === 'admin';

  if (allowedRoles && !isSuperUser && !allowedRoles.includes(user.role)) {
    return <Navigate to="/forbidden" replace />;
  }

  return <>{children}</>;
};
