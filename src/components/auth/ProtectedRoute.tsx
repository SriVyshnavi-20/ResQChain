import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

export const homeForRole = (role: UserRole): string => {
  switch (role) {
    case 'Volunteer':
      return '/volunteer/dashboard';
    case 'NGO':
      return '/ngo/dashboard';
    case 'Government Official':
      return '/government/dashboard';
    default:
      return '/victim/dashboard';
  }
};

/** Only renders children for a signed-in user of the given role; everyone else is redirected. */
export const ProtectedRoute: React.FC<{ role: UserRole; children: React.ReactNode }> = ({ role, children }) => {
  const { user, authLoading } = useAuth();
  const location = useLocation();

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm font-medium text-slate-500">
        Loading ResQChain...
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (user.role !== role) return <Navigate to={homeForRole(user.role)} replace />;
  return <>{children}</>;
};
