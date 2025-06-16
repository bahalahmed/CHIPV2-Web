import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import SecureStorage from '@/utils/secureStorage';
import { useRefreshTokenMutation } from '@/features/auth/authApiSlice';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

interface RootState {
  auth: {
    isAuthenticated: boolean;
    token: string | null;
    user: any;
  };
}

const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  requireAuth = true, 
  redirectTo = '/login' 
}) => {
  const { isAuthenticated, token } = useSelector((state: RootState) => state.auth);
  const [refreshToken] = useRefreshTokenMutation();
  const [isValidating, setIsValidating] = useState(true);
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    validateAuthentication();
  }, []);

  const validateAuthentication = async () => {
    try {
      // Check if we have stored tokens
      const tokenData = SecureStorage.getTokens();
      
      if (!tokenData) {
        setIsValidating(false);
        return;
      }

      // Validate token format
      if (!SecureStorage.isValidTokenFormat(tokenData.token)) {
        SecureStorage.clearTokens();
        dispatch({ type: 'auth/logout' });
        setIsValidating(false);
        return;
      }

      // Check if token is about to expire (refresh if < 5 minutes left)
      const tokenExpiry = SecureStorage.getTokenExpiry(tokenData.token);
      const fiveMinutesFromNow = Date.now() + (5 * 60 * 1000);
      
      if (tokenExpiry && tokenExpiry < fiveMinutesFromNow) {
        try {
          await refreshToken({ refreshToken: tokenData.refreshToken }).unwrap();
          console.log('Token refreshed successfully');
        } catch (error) {
          console.error('Token refresh failed:', error);
          SecureStorage.clearTokens();
          dispatch({ type: 'auth/logout' });
        }
      }

      setIsValidating(false);
    } catch (error) {
      console.error('Auth validation error:', error);
      SecureStorage.clearTokens();
      dispatch({ type: 'auth/logout' });
      setIsValidating(false);
    }
  };

  // Show loading while validating
  if (isValidating) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Validating session...</span>
      </div>
    );
  }

  // Handle authentication requirements
  if (requireAuth && !isAuthenticated) {
    // Redirect to login, preserving the intended destination
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // If already authenticated and trying to access login/register, redirect to dashboard
  if (!requireAuth && isAuthenticated && 
      (location.pathname === '/login' || location.pathname === '/register')) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default AuthGuard;

// Higher-order component for easier usage
export const withAuthGuard = (
  Component: React.ComponentType<any>, 
  options?: { requireAuth?: boolean; redirectTo?: string }
) => {
  return (props: any) => (
    <AuthGuard {...options}>
      <Component {...props} />
    </AuthGuard>
  );
};

// Hook for checking auth status
export const useAuthStatus = () => {
  const { isAuthenticated, user, token } = useSelector((state: RootState) => state.auth);
  
  return {
    isAuthenticated,
    user,
    token,
    isTokenValid: token ? SecureStorage.isValidTokenFormat(token) : false,
    tokenExpiry: token ? SecureStorage.getTokenExpiry(token) : null,
  };
};