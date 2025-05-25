import React from 'react';
import { Menu, Bell, Search, ChevronDown, LogOut, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useThemeStore } from '../../store/theme';
import { ThemeMode } from '../../types';
import Button from '../ui/Button';
import Avatar from '../ui/Avatar';

interface TopBarProps {
  toggleSidebar: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const { mode, setMode } = useThemeStore();
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);
  const [user, setUser] = React.useState<any>(null);
  
  React.useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser({
          name: user.user_metadata.full_name || user.email?.split('@')[0] || 'User',
          email: user.email,
          picture: user.user_metadata.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.email || 'User')}`,
        });
      }
    };
    getUser();
  }, []);
  
  const handleThemeChange = (newMode: ThemeMode) => {
    setMode(newMode);
    setIsProfileOpen(false);
  };
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };
  
  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 h-16 fixed top-0 left-0 right-0 z-30">
      <div className="flex items-center justify-between h-full px-4">
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 lg:hidden dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800"
            aria-label="Toggle sidebar"
          >
            <Menu size={20} />
          </button>
          
          <div className="ml-4 lg:ml-0">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              <span className="text-blue-600 dark:text-blue-400">NGO</span>CRM
            </h1>
          </div>
        </div>
        
        <div className="flex-1 max-w-md mx-8 hidden md:block">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="search"
              placeholder="Search..."
              className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition dark:bg-gray-800 dark:border-gray-700 dark:placeholder-gray-500 dark:text-gray-300"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            className="p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800"
            aria-label="Notifications"
          >
            <Bell size={20} />
          </button>
          
          {user && (
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2 focus:outline-none"
                aria-expanded={isProfileOpen}
                aria-haspopup="true"
              >
                <Avatar
                  src={user.picture}
                  alt={user.name}
                  size="sm"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:block">
                  {user.name}
                </span>
                <ChevronDown size={16} className="text-gray-500 dark:text-gray-400" />
              </button>
              
              {isProfileOpen && (
                <div
                  className="absolute right-0 mt-2 w-48 py-2 bg-white rounded-md shadow-lg z-50 border border-gray-200 dark:bg-gray-800 dark:border-gray-700"
                  onBlur={() => setIsProfileOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {user.email}
                    </p>
                  </div>
                  
                  <div className="py-1">
                    <button
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                      onClick={() => handleThemeChange('light')}
                    >
                      <span className="w-4 h-4 mr-2 inline-block rounded-full bg-gray-200 border border-gray-300">
                        {mode === 'light' && (
                          <span className="flex h-full w-full items-center justify-center text-xs">✓</span>
                        )}
                      </span>
                      Light Mode
                    </button>
                    
                    <button
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                      onClick={() => handleThemeChange('dark')}
                    >
                      <span className="w-4 h-4 mr-2 inline-block rounded-full bg-gray-800 border border-gray-700">
                        {mode === 'dark' && (
                          <span className="flex h-full w-full items-center justify-center text-xs text-white">✓</span>
                        )}
                      </span>
                      Dark Mode
                    </button>
                    
                    <button
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                      onClick={() => handleThemeChange('system')}
                    >
                      <span className="w-4 h-4 mr-2 inline-block rounded-full bg-gradient-to-r from-gray-200 to-gray-800 border border-gray-400">
                        {mode === 'system' && (
                          <span className="flex h-full w-full items-center justify-center text-xs">✓</span>
                        )}
                      </span>
                      System
                    </button>
                  </div>
                  
                  <div className="py-1 border-t border-gray-100 dark:border-gray-700">
                    <button
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                      onClick={() => {/* Profile action */}}
                    >
                      <User size={16} className="mr-2" />
                      Profile
                    </button>
                    
                    <button
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:text-red-400 dark:hover:bg-gray-700"
                      onClick={handleLogout}
                    >
                      <LogOut size={16} className="mr-2" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopBar;