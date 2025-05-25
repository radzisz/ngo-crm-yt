import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import config from '../../config';
import type { User } from '../../types';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const location = useLocation();
  
  useEffect(() => {
    if (config.isDevelopment && config.bypassAuth) {
      // In development mode with bypass enabled, use the default user
      setUser({
        id: config.defaultUser.id,
        email: config.defaultUser.email,
        name: config.defaultUser.name,
        picture: `https://ui-avatars.com/api/?name=${encodeURIComponent(config.defaultUser.name)}`,
        role: config.defaultUser.role,
      });
      setIsLoading(false);
      return;
    }

    // Normal authentication flow
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata.full_name || session.user.email?.split('@')[0] || 'User',
          picture: session.user.user_metadata.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(session.user.email || 'User')}`,
          role: 'guest', // Default role, will be updated by role check
        });
      }
      setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata.full_name || session.user.email?.split('@')[0] || 'User',
          picture: session.user.user_metadata.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(session.user.email || 'User')}`,
          role: 'guest', // Default role, will be updated by role check
        });
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  // Fetch user role when user changes (only in production)
  useEffect(() => {
    if (!config.bypassAuth && user?.id) {
      supabase
        .from('user_roles')
        .select('role_id')
        .eq('user_id', user.id)
        .single()
        .then(({ data }) => {
          if (data) {
            setUser(prev => prev ? { ...prev, role: data.role_id } : null);
          }
        });
    }
  }, [user?.id]);
  
  // Don't protect the reset-password route
  if (location.pathname === '/reset-password') {
    return <>{children}</>;
  }
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  
  return <>{children}</>;
};

export default AuthGuard;