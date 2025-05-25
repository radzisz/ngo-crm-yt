import React, { useState } from 'react';
import { Edit, Trash2, ChevronUp, ChevronDown, Plus, Search, CheckCircle, AlertCircle, Phone } from 'lucide-react';
import { Person, SortDirection, SortState } from '../../types';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { formatDate } from '../../lib/utils';

type PersonFilter = 'all' | 'incomplete' | 'volunteer' | 'donator' | 'contractor';

interface PersonTableProps {
  persons: Person[];
  sortState: SortState;
  onSort: (sortState: SortState) => void;
  onEdit: (person: Person) => void;
  onDelete: (person: Person) => void;
  onAdd: () => void;
  onView?: (person: Person) => void;
  searchQuery: string;
  onSearch: (query: string) => void;
  personFilter: PersonFilter;
  onFilterChange: (filter: PersonFilter) => void;
}

const PersonTable: React.FC<PersonTableProps> = ({
  persons,
  sortState,
  onSort,
  onEdit,
  onDelete,
  onAdd,
  onView,
  searchQuery,
  onSearch,
  personFilter,
  onFilterChange,
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  
  const handleSort = (field: keyof Person) => {
    const direction: SortDirection = 
      sortState.field === field && sortState.direction === 'asc' ? 'desc' : 'asc';
    onSort({ field, direction });
  };
  
  const getSortIcon = (field: keyof Person) => {
    if (sortState.field !== field) {
      return null;
    }
    
    return sortState.direction === 'asc' ? (
      <ChevronUp size={16} className="ml-1" />
    ) : (
      <ChevronDown size={16} className="ml-1" />
    );
  };
  
  const confirmDelete = (e: React.MouseEvent, person: Person) => {
    e.stopPropagation();
    setShowDeleteConfirm(person.id);
  };
  
  const handleDeleteConfirm = (e: React.MouseEvent, person: Person) => {
    e.stopPropagation();
    onDelete(person);
    setShowDeleteConfirm(null);
  };

  const handleEditClick = (e: React.MouseEvent, person: Person) => {
    e.stopPropagation();
    onEdit(person);
  };

  const handleRowClick = (person: Person) => {
    if (onView) {
      onView(person);
    }
  };

  const handlePhoneClick = (e: React.MouseEvent, phone: string) => {
    e.stopPropagation();
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <select
              value={personFilter}
              onChange={(e) => onFilterChange(e.target.value as PersonFilter)}
              className="block w-48 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="all">All Persons</option>
              <option value="incomplete">Incomplete</option>
              <option value="volunteer">Volunteers</option>
              <option value="donator">Donators</option>
              <option value="contractor">Contractors</option>
            </select>
          </div>
          
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="search"
                placeholder="Search persons..."
                className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                value={searchQuery}
                onChange={(e) => onSearch(e.target.value)}
              />
            </div>
            
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus size={16} />}
              onClick={onAdd}
            >
              Add Person
            </Button>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400 cursor-pointer"
                onClick={() => handleSort('firstName')}
              >
                <div className="flex items-center">
                  Name
                  {getSortIcon('firstName')}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400 cursor-pointer"
                onClick={() => handleSort('email')}
              >
                <div className="flex items-center">
                  Email
                  {getSortIcon('email')}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400 cursor-pointer"
                onClick={() => handleSort('phone')}
              >
                <div className="flex items-center">
                  Phone
                  {getSortIcon('phone')}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400 cursor-pointer"
                onClick={() => handleSort('updatedAt')}
              >
                <div className="flex items-center">
                  Last Updated
                  {getSortIcon('updatedAt')}
                </div>
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
            {persons.length > 0 ? (
              persons.map((person) => (
                <tr 
                  key={person.id}
                  onClick={() => handleRowClick(person)}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150 cursor-pointer"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-sm font-medium text-gray-900 dark:text-white flex items-center">
                        {person.firstName} {person.lastName}
                        <div className="ml-2 relative group">
                          {person.completenessProblems?.length ? (
                            <div className="cursor-help">
                              <AlertCircle size={16} className="text-red-500 dark:text-red-400" />
                              <div className="absolute left-0 bottom-full mb-2 w-64 bg-white dark:bg-gray-800 p-2 rounded shadow-lg border border-gray-200 dark:border-gray-700 hidden group-hover:block z-10">
                                <div className="text-xs font-normal text-gray-600 dark:text-gray-400">
                                  <div className="font-medium mb-1">Incomplete Profile:</div>
                                  <ul className="list-disc list-inside">
                                    {person.completenessProblems.map((problem, index) => (
                                      <li key={index}>{problem}</li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <CheckCircle size={16} className="text-green-500 dark:text-green-400" />
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600 dark:text-gray-300">{person.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <a
                      href={`tel:${person.phone}`}
                      onClick={(e) => handlePhoneClick(e, person.phone)}
                      className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center"
                    >
                      <Phone size={16} className="mr-1" />
                      {person.phone}
                    </a>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant="info" className="text-xs">
                      {formatDate(person.updatedAt)}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {showDeleteConfirm === person.id ? (
                      <div className="flex justify-end space-x-2">
                        <span className="text-gray-600 dark:text-gray-400 mr-2">Confirm?</span>
                        <button
                          onClick={(e) => handleDeleteConfirm(e, person)}
                          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                        >
                          Yes
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowDeleteConfirm(null);
                          }}
                          className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300"
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={(e) => handleEditClick(e, person)}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 p-1"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={(e) => confirmDelete(e, person)}
                          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 p-1"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                  No persons found. {searchQuery ? 'Try a different search term.' : 'Add some persons to get started.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PersonTable;