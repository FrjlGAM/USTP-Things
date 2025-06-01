import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthContext } from './AuthProvider';
import { routes } from '@/config/app';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireVerification?: boolean;
  redirectTo?: string;
}

/**
 * A protected route that requires authentication and optionally email verification
 * If the user is not authenticated, they will be redirected to the login page
 * If requireVerification is true and the user is not verified, they will be redirected to the verification page
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireVerification = false,
  redirectTo = routes.login,
}) => {
  const { isAuthenticated, isVerified, loading } = useAuthContext();
  const location = useLocation();

  if (loading) {
    // Show a loading indicator while checking auth state
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  if (requireVerification && !isVerified) {
    // Redirect to verification page if verification is required but not verified
    return (
      <Navigate
        to={routes.verify}
        state={{ from: location, requireVerification: true }}
        replace
      />
    );
  }

  // User is authenticated and meets all requirements
  return <>{children}</>;
};

export default ProtectedRoute;
