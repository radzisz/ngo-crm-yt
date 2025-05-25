import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import Avatar from '../ui/Avatar';
import Input from '../ui/Input';
import Badge from '../ui/Badge';
import { useAuthStore } from '../../store/auth';

interface User {
  id: string;
  email: string;
  name: string;
  avatar_url: string;
  role: string;
}

export function UsersTab() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const currentUser = useAuthStore(state => state.user);

  useEffect(() => {
    if (currentUser?.role === 'admin') {
      fetchUsers();
    } else {
      // If not admin, just show the current user
      if (currentUser) {
        setUsers([{
          id: currentUser.id,
          email: currentUser.email,
          name: currentUser.name || currentUser.email.split('@')[0],
          avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.email)}`,
          role: currentUser.role
        }]);
      }
      setLoading(false);
    }
  }, [currentUser]);

  async function fetchUsers() {
    try {
      setLoading(true);
      
      // Fetch all user roles
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select(`
          user_id,
          role_id,
          users:user_id (
            email,
            raw_user_meta_data
          )
        `);

      if (rolesError) throw rolesError;

      const mappedUsers = (userRoles || []).map(record => ({
        id: record.user_id,
        email: record.users.email,
        name: record.users.raw_user_meta_data?.full_name || record.users.email?.split('@')[0] || 'User',
        avatar_url: record.users.raw_user_meta_data?.avatar_url || 
          `https://ui-avatars.com/api/?name=${encodeURIComponent(record.users.email || 'User')}`,
        role: record.role_id
      }));

      setUsers(mappedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = searchQuery.toLowerCase() === '' ||
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = roleFilter === 'all' || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return 'primary';
      case 'accountant':
        return 'success';
      default:
        return 'secondary';
    }
  };

  if (currentUser?.role !== 'admin') {
    return (
      <div className="p-4 text-center text-gray-600 dark:text-gray-400">
        You need admin privileges to view all users.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search className="h-4 w-4 text-gray-400" />}
          />
        </div>
        <div className="w-full sm:w-48">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="accountant">Accountant</option>
            <option value="guest">Guest</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                  Role
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Avatar
                        src={user.avatar_url}
                        alt={user.name}
                        size="sm"
                      />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {user.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {user.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant={getRoleBadgeVariant(user.role)}>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}