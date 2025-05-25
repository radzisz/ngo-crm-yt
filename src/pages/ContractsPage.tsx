import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useContractStore } from '../store/contract';
import { usePersonStore } from '../store/person';
import { Card, CardContent } from '../components/ui/Card';
import { ContractStatus } from '../types';
import { formatDate } from '../lib/utils';
import { FileText, Calendar, User, Edit, Trash2, Plus, Search, FileIcon, FileCheck } from 'lucide-react';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';

type ContractFilter = 'all' | 'archive';

const ContractsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { contracts, isLoading, fetchContracts } = useContractStore();
  const { persons, fetchPersons } = usePersonStore();
  
  const [statusFilter, setStatusFilter] = useState<ContractStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [contractFilter, setContractFilter] = useState<ContractFilter>(
    (searchParams.get('filter') as ContractFilter) || 'all'
  );
  
  useEffect(() => {
    fetchContracts();
    fetchPersons();
  }, [fetchContracts, fetchPersons]);

  useEffect(() => {
    // Update URL when filter changes
    setSearchParams({ filter: contractFilter });
  }, [contractFilter, setSearchParams]);
  
  const isContractActive = (contract: typeof contracts[0]) => {
    if (!contract.endDate) return true;
    const endDate = new Date(contract.endDate);
    const today = new Date();
    return endDate >= today;
  };
  
  const filteredContracts = contracts.filter(contract => {
    // Active/Archive filter
    const isActive = isContractActive(contract);
    if (contractFilter === 'all') return true;
    if (contractFilter === 'archive') return !isActive;
    
    // Status filter
    if (statusFilter !== 'all' && contract.status !== statusFilter) {
      return false;
    }
    
    // Search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      return (
        contract.person?.firstName.toLowerCase().includes(query) ||
        contract.person?.lastName.toLowerCase().includes(query) ||
        contract.person?.email.toLowerCase().includes(query) ||
        contract.description?.toLowerCase().includes(query)
      );
    }
    
    return true;
  });
  
  const getStatusBadgeVariant = (status: ContractStatus) => {
    switch (status) {
      case 'in_progress':
        return 'warning';
      case 'waiting_for_signature':
        return 'info';
      case 'signed':
        return 'success';
      default:
        return 'default';
    }
  };
  
  const getStatusLabel = (status: ContractStatus) => {
    return status.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const handleCreateContract = () => {
    navigate('/contracts/new');
  };

  const handleEditContract = (contractId: string) => {
    navigate(`/contracts/${contractId}/edit`);
  };

  const handleFilterChange = (value: ContractFilter) => {
    setContractFilter(value);
    setSearchParams({ filter: value });
  };

  const getPdfUrl = (sourceDocumentUrl: string | undefined) => {
    if (!sourceDocumentUrl) return null;
    return sourceDocumentUrl.replace(/\/edit.*$/, '/export?format=pdf');
  };
  
  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
              <div className="flex items-center space-x-4">
                <select
                  value={contractFilter}
                  onChange={(e) => handleFilterChange(e.target.value as ContractFilter)}
                  className="block w-48 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="all">All Contracts</option>
                  <option value="archive">Archived</option>
                </select>
              </div>
              
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="search"
                    placeholder="Search contracts..."
                    className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<Plus size={16} />}
                  onClick={handleCreateContract}
                >
                  Add Contract
                </Button>
              </div>
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                      Person
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                      Start Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                      Description
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                  {filteredContracts.length > 0 ? (
                    filteredContracts.map((contract) => (
                      <tr key={contract.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                              <User className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {contract.person?.firstName} {contract.person?.lastName}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {contract.person?.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant={getStatusBadgeVariant(contract.status)}>
                            {getStatusLabel(contract.status)}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(contract.startDate)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                          <div className="max-w-xs truncate">
                            {contract.description || '-'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            {contract.sourceDocumentUrl && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => window.open(contract.sourceDocumentUrl, '_blank')}
                                  className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                                  title="Open Google Doc"
                                >
                                  <FileText size={16} />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => window.open(getPdfUrl(contract.sourceDocumentUrl), '_blank')}
                                  className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                                  title="Open PDF"
                                >
                                  <FileCheck size={16} />
                                </Button>
                              </>
                            )}
                            <Button
                              variant="primary"
                              size="sm"
                              leftIcon={<Edit size={16} />}
                              onClick={() => handleEditContract(contract.id)}
                              className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white"
                            >
                              Edit
                            </Button>
                            <Button
                              variant={contract.status === 'signed' ? 'destructive' : 'primary'}
                              size="sm"
                              onClick={() => {/* TODO: Implement status toggle */}}
                            >
                              {contract.status === 'signed' ? 'Archive' : 'Send'}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                        No contracts found. {searchQuery ? 'Try a different search term.' : 'Add some contracts to get started.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContractsPage;