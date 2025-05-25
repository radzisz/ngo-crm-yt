import React, { useEffect, useState } from 'react';
import { Search, Plus, Edit, ExternalLink } from 'lucide-react';
import { useDocumentTemplateStore } from '../../store/documentTemplate';
import { DocumentTemplate, DocumentType, NewDocumentTemplate } from '../../types';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Badge from '../ui/Badge';
import { DocumentTemplateForm } from './DocumentTemplateForm';
import { toast } from 'react-hot-toast';

export function DocumentsTab() {
  const { templates, isLoading, fetchTemplates, toggleTemplateStatus, createTemplate, updateTemplate } = useDocumentTemplateStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | DocumentType>('all');
  const [showInactive, setShowInactive] = useState(false);
  const [showDeactivateConfirm, setShowDeactivateConfirm] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<DocumentTemplate | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);
  
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || template.type === typeFilter;
    const matchesActive = showInactive || template.isActive;
    return matchesSearch && matchesType && matchesActive;
  });
  
  const handleStatusToggle = async (template: DocumentTemplate) => {
    if (template.isActive) {
      setShowDeactivateConfirm(template.id);
    } else {
      await toggleTemplateStatus(template.id);
    }
  };
  
  const confirmDeactivate = async (id: string) => {
    await toggleTemplateStatus(id);
    setShowDeactivateConfirm(null);
  };

  const handleCreateTemplate = async (data: NewDocumentTemplate) => {
    try {
      setIsSubmitting(true);
      await createTemplate(data);
      toast.success('Template created successfully');
      setIsCreating(false);
    } catch (error) {
      toast.error('Failed to create template');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateTemplate = async (data: NewDocumentTemplate) => {
    if (!editingTemplate) return;
    
    try {
      setIsSubmitting(true);
      await updateTemplate(editingTemplate.id, data);
      toast.success('Template updated successfully');
      setEditingTemplate(null);
    } catch (error) {
      toast.error('Failed to update template');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (template: DocumentTemplate) => {
    setEditingTemplate(template);
  };
  
  if (isCreating || editingTemplate) {
    return (
      <div className="max-w-2xl mx-auto">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          {editingTemplate ? 'Edit Template' : 'Create New Template'}
        </h2>
        <DocumentTemplateForm
          initialData={editingTemplate}
          onSubmit={editingTemplate ? handleUpdateTemplate : handleCreateTemplate}
          onCancel={() => editingTemplate ? setEditingTemplate(null) : setIsCreating(false)}
          isSubmitting={isSubmitting}
        />
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Document Templates
        </h2>
        <Button
          variant="primary"
          leftIcon={<Plus size={16} />}
          onClick={() => setIsCreating(true)}
        >
          New Template
        </Button>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search className="h-4 w-4 text-gray-400" />}
          />
        </div>
        <div className="w-full sm:w-48">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as 'all' | DocumentType)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="all">All Types</option>
            <option value="contract">Contract</option>
            <option value="receipt">Receipt</option>
          </select>
        </div>
        <div className="w-full sm:w-auto">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={showInactive}
              onChange={(e) => setShowInactive(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
            <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
              Show inactive
            </span>
          </label>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                  URL
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
              {filteredTemplates.map((template) => (
                <tr key={template.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {template.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant={template.type === 'contract' ? 'primary' : 'secondary'}>
                      {template.type.charAt(0).toUpperCase() + template.type.slice(1)}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <a
                      href={template.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      View Template
                      <ExternalLink size={14} className="ml-1" />
                    </a>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant={template.isActive ? 'success' : 'danger'}>
                      {template.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {showDeactivateConfirm === template.id ? (
                      <div className="flex justify-end space-x-2">
                        <span className="text-gray-600 dark:text-gray-400 mr-2">
                          Deactivate?
                        </span>
                        <button
                          onClick={() => confirmDeactivate(template.id)}
                          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                        >
                          Yes
                        </button>
                        <button
                          onClick={() => setShowDeactivateConfirm(null)}
                          className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300"
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="primary"
                          size="sm"
                          leftIcon={<Edit size={16} />}
                          onClick={() => handleEdit(template)}
                          className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white"
                        >
                          Edit
                        </Button>
                        <Button
                          variant={template.isActive ? 'destructive' : 'primary'}
                          size="sm"
                          onClick={() => handleStatusToggle(template)}
                        >
                          {template.isActive ? 'Deactivate' : 'Activate'}
                        </Button>
                      </div>
                    )}
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