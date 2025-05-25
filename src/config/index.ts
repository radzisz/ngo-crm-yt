import { supabase } from '../lib/supabase';

interface Config {
  isDevelopment: boolean;
  bypassAuth: boolean;
  defaultUser: {
    id: string;
    email: string;
    name: string;
    role: 'admin' | 'accountant' | 'guest';
  };
}

const config: Config = {
  isDevelopment: import.meta.env.DEV,
  bypassAuth: false, // Disabled bypass auth to prevent authentication errors
  defaultUser: {
    id: '00000000-0000-0000-0000-000000000000',
    email: 'radzisz+1@gmail.com',
    name: 'Development User',
    role: 'admin'
  }
};

export async function initializeDevMode() {
  if (!config.isDevelopment || !config.bypassAuth) {
    return;
  }

  try {
    const { data: existingSession } = await supabase.auth.getSession();
    if (existingSession.session) {
      // Already authenticated, no need to sign in again
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: config.defaultUser.email,
      password: 'password'
    });
      
    if (error) {
      console.error('Development mode authentication failed:', error.message);
      console.warn(`
=== Development Mode Setup Required ===

To use development mode with bypass authentication, you need to:

1. Create a user in your Supabase project with these credentials:
   - Email: ${config.defaultUser.email}
   - Password: password

2. Or update the defaultUser configuration in src/config/index.ts to match an existing user.

3. Ensure VITE_BYPASS_AUTH=true is set in your .env file if you want to use automatic authentication.

You can disable development mode authentication by setting VITE_BYPASS_AUTH=false in your .env file.
      `);
    }
  } catch (error) {
    console.error('Failed to initialize development mode:', error);
  }
}

export default config;