import React, { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Mail, Lock } from 'lucide-react';
import { toast } from 'react-hot-toast';
import GoogleLoginButton from '../components/auth/GoogleLoginButton';
import { supabase } from '../lib/supabase';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const LoginPage: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const location = useLocation();
  
  React.useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
    } catch (error) {
      console.error('Login error:', error);
      setError(error instanceof Error ? error.message : 'Failed to sign in');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      toast.success('Password reset instructions have been sent to your email');
      setIsResettingPassword(false);
    } catch (error) {
      console.error('Password reset error:', error);
      setError(error instanceof Error ? error.message : 'Failed to send reset instructions');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (session) {
    const from = (location.state as { from?: string })?.from || '/';
    return <Navigate to={from} replace />;
  }
  
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
        <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
          <div className="text-center">
            <div className="mx-auto h-16 w-16 flex items-center justify-center">
              <img 
                src="https://youngtree.org/wp-content/uploads/2022/03/LOGO11-150x150.png" 
                alt="Young Tree Logo" 
                className="h-16 w-16 object-contain"
              />
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
              <span className="text-blue-600 dark:text-blue-400">NGO</span>CRM
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {isResettingPassword ? 'Reset your password' : 'Sign in to access your NGO contacts'}
            </p>
          </div>
          
          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 p-4 rounded-md">
              <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
            </div>
          )}
          
          <div className="mt-8 space-y-6">
            {isResettingPassword ? (
              <form onSubmit={handlePasswordReset} className="space-y-4">
                <Input
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  icon={<Mail size={18} className="text-gray-400" />}
                  required
                  disabled={isSubmitting}
                />
                
                <div className="flex flex-col space-y-3">
                  <Button
                    type="submit"
                    className="w-full"
                    isLoading={isSubmitting}
                  >
                    Send Reset Instructions
                  </Button>
                  
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setIsResettingPassword(false)}
                    disabled={isSubmitting}
                  >
                    Back to Login
                  </Button>
                </div>
              </form>
            ) : (
              <>
                <form onSubmit={handleEmailLogin} className="space-y-4">
                  <Input
                    label="Email Address"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    icon={<Mail size={18} className="text-gray-400" />}
                    required
                    disabled={isSubmitting}
                  />
                  
                  <div>
                    <Input
                      label="Password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      icon={<Lock size={18} className="text-gray-400" />}
                      required
                      disabled={isSubmitting}
                    />
                    <div className="mt-1 text-right">
                      <button
                        type="button"
                        onClick={() => setIsResettingPassword(true)}
                        className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        Forgot password?
                      </button>
                    </div>
                  </div>
                  
                  <Button
                    type="submit"
                    className="w-full"
                    isLoading={isSubmitting}
                  >
                    Sign in with Email
                  </Button>
                </form>
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                      Or continue with
                    </span>
                  </div>
                </div>
                
                <GoogleLoginButton className="w-full" />
              </>
            )}
            
            <div className="mt-4 text-center">
              <p className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 p-2 rounded">
                Note: Only logins from @youngtree.org domain are accepted
              </p>
            </div>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default LoginPage;