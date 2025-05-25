import React, { useEffect } from 'react';
import { Users, Mail, Phone, UserCheck } from 'lucide-react';
import { usePersonStore } from '../store/person';
import { Card, CardContent } from '../components/ui/Card';
import { formatDate } from '../lib/utils';

const DashboardPage: React.FC = () => {
  const { persons, fetchPersons, isLoading } = usePersonStore();
  
  useEffect(() => {
    fetchPersons();
  }, [fetchPersons]);
  
  // Calculate some basic stats
  const totalPersons = persons.length;
  const recentPersons = [...persons]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);
  
  const stats = [
    { 
      title: 'Total People', 
      value: totalPersons, 
      icon: <Users className="h-6 w-6 text-blue-500" />,
      change: '+12% from last month',
      color: 'bg-blue-50 dark:bg-blue-900/30',
      textColor: 'text-blue-700 dark:text-blue-300',
    },
    { 
      title: 'With Email', 
      value: persons.filter(p => p.email).length, 
      icon: <Mail className="h-6 w-6 text-purple-500" />,
      change: '+5% from last month',
      color: 'bg-purple-50 dark:bg-purple-900/30',
      textColor: 'text-purple-700 dark:text-purple-300',
    },
    { 
      title: 'With Phone', 
      value: persons.filter(p => p.phone).length, 
      icon: <Phone className="h-6 w-6 text-teal-500" />,
      change: '+8% from last month',
      color: 'bg-teal-50 dark:bg-teal-900/30',
      textColor: 'text-teal-700 dark:text-teal-300',
    },
    { 
      title: 'Active Users', 
      value: totalPersons, 
      icon: <UserCheck className="h-6 w-6 text-green-500" />,
      change: '+15% from last month',
      color: 'bg-green-50 dark:bg-green-900/30',
      textColor: 'text-green-700 dark:text-green-300',
    },
  ];
  
  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Dashboard
        </h1>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat) => (
                <div 
                  key={stat.title}
                  className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg"
                >
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className={`flex-shrink-0 rounded-md p-3 ${stat.color}`}>
                        {stat.icon}
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                            {stat.title}
                          </dt>
                          <dd>
                            <div className="text-lg font-medium text-gray-900 dark:text-white">
                              {stat.value}
                            </div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                  <div className={`bg-gray-50 dark:bg-gray-800 px-5 py-3 border-t border-gray-200 dark:border-gray-700`}>
                    <div className={`text-sm ${stat.textColor}`}>
                      {stat.change}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Recently Added People
                  </h2>
                  
                  {recentPersons.length > 0 ? (
                    <div className="overflow-hidden">
                      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                        {recentPersons.map((person) => (
                          <li key={person.id} className="py-4">
                            <div className="flex items-center space-x-4">
                              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300">
                                <span className="font-medium">
                                  {person.firstName.charAt(0)}{person.lastName.charAt(0)}
                                </span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                  {person.firstName} {person.lastName}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                  {person.email}
                                </p>
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                Added {formatDate(person.createdAt)}
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400">No people added yet.</p>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Quick Stats
                  </h2>
                  
                  <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-6">
                    <h3 className="text-lg font-medium text-blue-800 dark:text-blue-300 mb-2">
                      Welcome to PersonManager
                    </h3>
                    <p className="text-blue-700 dark:text-blue-400">
                      Your personal CRM for managing contacts. Get started by adding people to your database.
                    </p>
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                        <div className="text-3xl font-bold text-gray-900 dark:text-white">
                          {totalPersons}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Total People
                        </div>
                      </div>
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                        <div className="text-3xl font-bold text-gray-900 dark:text-white">
                          {persons.filter(p => new Date(p.updatedAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Updated this week
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;