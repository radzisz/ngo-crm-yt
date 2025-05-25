import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Users, Settings, HelpCircle, Home, Receipt, Heart, FileText } from 'lucide-react';
import { cn } from '../../lib/utils';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavigationItem {
  name: string;
  to: string;
  icon: React.ReactNode;
}

const navigation: NavigationItem[] = [
  { name: 'Dashboard', to: '/dashboard', icon: <Home size={20} /> },
  { name: 'Persons', to: '/persons', icon: <Users size={20} /> },
  { name: 'Contracts', to: '/contracts', icon: <FileText size={20} /> },
  { name: 'Receipts', to: '/receipts', icon: <Receipt size={20} /> },
  { name: 'Donations', to: '/donations', icon: <Heart size={20} /> },
  { name: 'Settings', to: '/settings', icon: <Settings size={20} /> },
  { name: 'Help', to: '/help', icon: <HelpCircle size={20} /> },
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavigation = (to: string) => {
    navigate(to);
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 transition-opacity lg:hidden"
          onClick={onClose}
        ></div>
      )}
      
      {/* Sidebar */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-gray-900 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:w-64 border-r border-gray-200 dark:border-gray-800',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-800">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              <span className="text-blue-600 dark:text-blue-400">NGO</span>CRM
            </h2>
          </div>
          
          <div className="flex-1 overflow-auto py-4">
            <nav className="px-3 space-y-1">
              {navigation.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.to)}
                  className={cn(
                    'flex items-center w-full px-3 py-2 text-sm font-medium rounded-md transition-colors',
                    location.pathname === item.to
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800'
                  )}
                >
                  <span className="mr-3 text-gray-500 dark:text-gray-400">{item.icon}</span>
                  {item.name}
                </button>
              ))}
            </nav>
          </div>
          
          <div className="p-4 border-t border-gray-200 dark:border-gray-800">
            <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg">
              <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">Need help?</h3>
              <p className="mt-1 text-xs text-blue-700 dark:text-blue-400">
                Check our documentation or contact support for assistance.
              </p>
              <button
                className="mt-2 text-xs font-medium text-blue-700 hover:text-blue-900 dark:text-blue-300 dark:hover:text-blue-100"
              >
                View Documentation →
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;