import React, { useState } from 'react';
import { DocumentType, NewDocumentTemplate, DocumentTemplate } from '../../types';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { X } from 'lucide-react';

interface DocumentTemplateFormProps {
  initialData?: DocumentTemplate;
  onSubmit: (data: NewDocumentTemplate) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const BUILT_IN_FIELDS = {
  contract: [
    'FIRST_NAME',
    'LAST_NAME',
    'EMAIL',
    'PHONE',
    'BIRTH_DATE',
    'PESEL',
    'STREET',
    'CITY',
    'POSTAL_CODE',
    'COUNTRY',
    'BANK_ACCOUNT',
  ],
  receipt: [
    'FIRST_NAME',
    'LAST_NAME',
    'EMAIL',
    'PHONE',
    'BIRTH_DATE',
    'PESEL',
    'STREET',
    'CITY',
    'POSTAL_CODE',
    'COUNTRY',
    'BANK_ACCOUNT',
    'CONTRACT_NUMBER',
    'CONTRACT_DATE',
    'RECEIPT_NUMBER',
    'RECEIPT_DATE',
  ],
};

export function DocumentTemplateForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: DocumentTemplateFormProps) {
  const [formData, setFormData] = useState<NewDocumentTemplate>({
    name: initialData?.name || '',
    type: initialData?.type || 'contract',
    url: initialData?.url || '',
    isActive: initialData?.isActive ?? true,
    customFields: initialData?.customFields || [],
  });

  const [fieldInput, setFieldInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleAddField = (e: React.MouseEvent) => {
    e.preventDefault();
    if (fieldInput.trim()) {
      const newField = fieldInput.trim().toUpperCase();
      if (!formData.customFields.includes(newField)) {
        setFormData(prev => ({
          ...prev,
          customFields: [...prev.customFields, newField]
        }));
      }
      setFieldInput('');
    }
  };

  const handleRemoveField = (field: string) => {
    setFormData(prev => ({
      ...prev,
      customFields: prev.customFields.filter(f => f !== field)
    }));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.url.trim()) {
      newErrors.url = 'URL is required';
    } else if (!isValidUrl(formData.url)) {
      newErrors.url = 'Please enter a valid URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Template Name"
        id="name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        error={errors.name}
        disabled={isSubmitting}
        required
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Template Type
        </label>
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          disabled={isSubmitting}
        >
          <option value="contract">Contract</option>
          <option value="receipt">Receipt</option>
        </select>
      </div>

      <Input
        label="Template URL"
        id="url"
        name="url"
        type="url"
        value={formData.url}
        onChange={handleChange}
        error={errors.url}
        disabled={isSubmitting}
        required
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Built-in Fields
        </label>
        <div className="flex flex-wrap gap-2 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          {BUILT_IN_FIELDS[formData.type].map((field) => (
            <span
              key={field}
              className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
            >
              {field}
            </span>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Custom Fields
        </label>
        <div className="mb-2 text-sm text-gray-500 dark:text-gray-400">
          Enter field names (will be automatically converted to uppercase)
        </div>
        <div className="flex gap-2 mb-4">
          <Input
            value={fieldInput}
            onChange={(e) => setFieldInput(e.target.value)}
            placeholder="e.g., PROJECT_NAME"
            disabled={isSubmitting}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddField(e as unknown as React.MouseEvent);
              }
            }}
          />
          <Button
            type="button"
            onClick={handleAddField}
            disabled={!fieldInput.trim() || isSubmitting}
          >
            Add
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {formData.customFields.map((field) => (
            <span
              key={field}
              className="inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
            >
              {field}
              <button
                type="button"
                onClick={() => handleRemoveField(field)}
                className="ml-1 p-0.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full"
                disabled={isSubmitting}
              >
                <X size={14} />
              </button>
            </span>
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          isLoading={isSubmitting}
        >
          {initialData ? 'Update' : 'Create'} Template
        </Button>
      </div>
    </form>
  );
}