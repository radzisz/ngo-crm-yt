import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const ResetPasswordPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleRecoveryToken = async () => {
      const hash = location.hash;
      
      // Extract the access token from the URL
      const accessToken = new URLSearchParams(hash.substring(1)).get('access_token');
      const type = new URLSearchParams(hash.substring(1)).get('type');
      
      if (!accessToken || type !== 'recovery') {
        setError('Invalid or expired recovery link');
        return;
      }

      try {
        const { data: { user }, error: sessionError } = await supabase.auth.getUser(accessToken);
        
        if (sessionError || !user) {
          throw new Error('Invalid recovery token');
        }
      } catch (error) {
        console.error('Error validating recovery token:', error);
        setError('Invalid or expired recovery link');
      }
    };

    handleRecoveryToken();
  }, [location, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) throw error;

      toast.success('Password updated successfully. Please sign in with your new password.');
      navigate('/login');
    } catch (error) {
      console.error('Error updating password:', error);
      setError(error instanceof Error ? error.message : 'Failed to update password');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
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
            Reset Your Password
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Please enter your new password
          </p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 p-4 rounded-md">
            <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <Input
            label="New Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={<Lock size={18} className="text-gray-400" />}
            required
            disabled={isSubmitting}
            minLength={6}
          />

          <Input
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            icon={<Lock size={18} className="text-gray-400" />}
            required
            disabled={isSubmitting}
            minLength={6}
          />

          <Button
            type="submit"
            className="w-full"
            isLoading={isSubmitting}
          >
            Reset Password
          </Button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Back to Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;