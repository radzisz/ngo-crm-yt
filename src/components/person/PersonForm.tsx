import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Calendar, CreditCard, MapPin, Plus, X, AlertCircle } from 'lucide-react';
import { NewPerson, Person, PersonUpdate, Engagement } from '../../types';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { Tabs } from '../ui/Tabs';

interface PersonFormProps {
  initialData?: Person;
  onSubmit: (data: NewPerson | PersonUpdate) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const COUNTRIES = [
  { value: 'PL', label: 'Polska' },
  { value: 'DE', label: 'Niemcy' },
  { value: 'UK', label: 'Wielka Brytania' },
  { value: 'US', label: 'Stany Zjednoczone' },
];

export function PersonForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: PersonFormProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState<NewPerson>({
    firstName: initialData?.firstName || '',
    lastName: initialData?.lastName || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    engagement: initialData?.engagement || [],
    birthDate: initialData?.birthDate || '',
    pesel: initialData?.pesel || '',
    street: initialData?.street || '',
    city: initialData?.city || '',
    postalCode: initialData?.postalCode || '',
    country: initialData?.country || 'PL',
    bankAccount: initialData?.bankAccount || '',
    taxDeclarationFile: initialData?.taxDeclarationFile || null,
    volunteerStartDate: initialData?.volunteerStartDate || '',
    volunteerEndDate: initialData?.volunteerEndDate || '',
    volunteerContractFile: initialData?.volunteerContractFile || null,
    donatorBankAccounts: initialData?.donatorBankAccounts || [],
    donatorEmails: initialData?.donatorEmails || [],
    isComplete: false,
    completenessProblems: [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newBankAccount, setNewBankAccount] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [completenessStatus, setCompletenessStatus] = useState<{
    isComplete: boolean;
    problems: string[];
  }>({ isComplete: true, problems: [] });

  // Update completeness status whenever form data changes
  useEffect(() => {
    const { isComplete, completenessProblems } = validateCompleteness();
    setCompletenessStatus({ isComplete, problems: completenessProblems });
  }, [formData]);

  const validateCompleteness = () => {
    const problems: string[] = [];
    let isComplete = true;

    // Main tab validation
    const requiredMainFields = {
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'Email',
      phone: 'Phone Number'
    };

    const missingMainFields = Object.entries(requiredMainFields)
      .filter(([key]) => !formData[key as keyof typeof requiredMainFields])
      .map(([, label]) => label);

    if (missingMainFields.length > 0) {
      problems.push(`Missing required fields: ${missingMainFields.join(', ')}`);
      isComplete = false;
    }

    // Contractor validation
    if (formData.engagement.includes('contractor')) {
      const requiredContractorFields = {
        birthDate: 'Birth Date',
        pesel: 'PESEL',
        street: 'Street Address',
        city: 'City',
        postalCode: 'Postal Code',
        bankAccount: 'Bank Account'
      };

      const missingContractorFields = Object.entries(requiredContractorFields)
        .filter(([key]) => !formData[key as keyof typeof requiredContractorFields])
        .map(([, label]) => label);

      if (missingContractorFields.length > 0) {
        problems.push(`Missing contractor fields: ${missingContractorFields.join(', ')}`);
        isComplete = false;
      }

      if (!formData.taxDeclarationFile) {
        problems.push('Tax declaration file not uploaded');
        isComplete = false;
      }
    }

    // Volunteer validation
    if (formData.engagement.includes('volunteer')) {
      const requiredVolunteerFields = {
        volunteerStartDate: 'Volunteer Start Date',
        volunteerEndDate: 'Volunteer End Date'
      };

      const missingVolunteerFields = Object.entries(requiredVolunteerFields)
        .filter(([key]) => !formData[key as keyof typeof requiredVolunteerFields])
        .map(([, label]) => label);

      if (missingVolunteerFields.length > 0) {
        problems.push(`Missing volunteer fields: ${missingVolunteerFields.join(', ')}`);
        isComplete = false;
      }

      if (!formData.volunteerContractFile) {
        problems.push('Volunteer contract not uploaded');
        isComplete = false;
      }
    }

    return { isComplete, completenessProblems: problems };
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleEngagementToggle = (value: Engagement) => {
    setFormData((prev) => ({
      ...prev,
      engagement: prev.engagement.includes(value)
        ? prev.engagement.filter((e) => e !== value)
        : [...prev.engagement, value],
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'taxDeclarationFile' | 'volunteerContractFile') => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        [field]: file,
      }));
    }
  };

  const handleAddBankAccount = (e: React.MouseEvent) => {
    e.preventDefault();
    if (newBankAccount.trim()) {
      setFormData(prev => ({
        ...prev,
        donatorBankAccounts: [...(prev.donatorBankAccounts || []), newBankAccount.trim()]
      }));
      setNewBankAccount('');
    }
  };

  const handleRemoveBankAccount = (index: number) => {
    setFormData(prev => ({
      ...prev,
      donatorBankAccounts: prev.donatorBankAccounts?.filter((_, i) => i !== index) || []
    }));
  };

  const handleAddEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    if (newEmail.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
      setFormData(prev => ({
        ...prev,
        donatorEmails: [...(prev.donatorEmails || []), newEmail.trim()]
      }));
      setNewEmail('');
    }
  };

  const handleRemoveEmail = (index: number) => {
    setFormData(prev => ({
      ...prev,
      donatorEmails: prev.donatorEmails?.filter((_, i) => i !== index) || []
    }));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      setActiveTab(0); // Switch to main tab if there are validation errors
      return;
    }

    // Check completeness before submitting
    const { isComplete, completenessProblems } = validateCompleteness();
    
    // Transform empty date strings to null
    const transformedData = {
      ...formData,
      birthDate: formData.birthDate || null,
      volunteerStartDate: formData.volunteerStartDate || null,
      volunteerEndDate: formData.volunteerEndDate || null,
      isComplete,
      completenessProblems
    };

    await onSubmit(transformedData);
  };

  const mainTab = (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="First Name"
          id="firstName"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          placeholder="John"
          icon={<User size={18} className="text-gray-400" />}
          error={errors.firstName}
          disabled={isSubmitting}
          required
        />
        
        <Input
          label="Last Name"
          id="lastName"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          placeholder="Doe"
          icon={<User size={18} className="text-gray-400" />}
          error={errors.lastName}
          disabled={isSubmitting}
          required
        />
      </div>
      
      <Input
        label="Email"
        id="email"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="john.doe@example.com"
        icon={<Mail size={18} className="text-gray-400" />}
        error={errors.email}
        disabled={isSubmitting}
        required
        fullWidth
      />
      
      <Input
        label="Phone Number"
        id="phone"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        placeholder="555-123-4567"
        icon={<Phone size={18} className="text-gray-400" />}
        error={errors.phone}
        disabled={isSubmitting}
        required
        fullWidth
      />

      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Engagement
        </label>
        <div className="space-y-4">
          {/* Contractor Toggle */}
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => handleEngagementToggle('contractor')}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                formData.engagement.includes('contractor') ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              <span className="sr-only">Enable contractor mode</span>
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  formData.engagement.includes('contractor') ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
            <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">
              Contractor
            </span>
          </div>

          {/* Volunteer Toggle */}
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => handleEngagementToggle('volunteer')}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                formData.engagement.includes('volunteer') ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              <span className="sr-only">Enable volunteer mode</span>
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  formData.engagement.includes('volunteer') ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
            <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">
              Volunteer
            </span>
          </div>

          {/* Donator Toggle */}
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => handleEngagementToggle('donator')}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                formData.engagement.includes('donator') ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              <span className="sr-only">Enable donator mode</span>
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  formData.engagement.includes('donator') ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
            <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">
              Donator
            </span>
          </div>
        </div>
      </div>

      {/* Completeness Status */}
      {!completenessStatus.isComplete && completenessStatus.problems.length > 0 && (
        <div className="mt-6 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg p-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-yellow-400 dark:text-yellow-300 mt-0.5" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                Profile Incomplete
              </h3>
              <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-200">
                <ul className="list-disc pl-5 space-y-1">
                  {completenessStatus.problems.map((problem, index) => (
                    <li key={index}>{problem}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const contractorTab = (
    <div className="space-y-6">
      {formData.engagement.includes('contractor') ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Birth Date"
              id="birthDate"
              name="birthDate"
              type="date"
              value={formData.birthDate}
              onChange={handleChange}
              icon={<Calendar size={18} className="text-gray-400" />}
              disabled={isSubmitting}
            />
            
            <Input
              label="PESEL"
              id="pesel"
              name="pesel"
              value={formData.pesel}
              onChange={handleChange}
              icon={<User size={18} className="text-gray-400" />}
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-4">
            <Input
              label="Street Address"
              id="street"
              name="street"
              value={formData.street}
              onChange={handleChange}
              icon={<MapPin size={18} className="text-gray-400" />}
              disabled={isSubmitting}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="City"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              
              <Input
                label="Postal Code"
                id="postalCode"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Country
                </label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  disabled={isSubmitting}
                >
                  {COUNTRIES.map((country) => (
                    <option key={country.value} value={country.value}>
                      {country.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <Input
            label="Bank Account Number"
            id="bankAccount"
            name="bankAccount"
            value={formData.bankAccount}
            onChange={handleChange}
            icon={<CreditCard size={18} className="text-gray-400" />}
            disabled={isSubmitting}
          />

          <div className="space-y-2">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Tax Declaration
            </h3>
            
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Please upload your tax declaration form or find the template{' '}
                <a
                  href="https://drive.google.com/file/d/15OdqNSt5_3q1mc_dQ86fFU4pUGlxRwBO/view?usp=drive_link"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  here
                </a>
              </p>
              
              <input
                type="file"
                onChange={(e) => handleFileChange(e, 'taxDeclarationFile')}
                accept=".pdf,.doc,.docx"
                className="block w-full text-sm text-gray-500 dark:text-gray-400
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-medium
                  file:bg-blue-50 file:text-blue-700
                  dark:file:bg-blue-900/30 dark:file:text-blue-400
                  hover:file:bg-blue-100 dark:hover:file:bg-blue-900/40"
              />
              {formData.taxDeclarationFile && (
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Selected file: {formData.taxDeclarationFile.name}
                </p>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="text-center text-gray-500 dark:text-gray-400 py-8">
          Enable contractor mode in the main tab to access contractor settings
        </div>
      )}
    </div>
  );

  const volunteerTab = (
    <div className="space-y-6">
      {formData.engagement.includes('volunteer') ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Start Date"
              id="volunteerStartDate"
              name="volunteerStartDate"
              type="date"
              value={formData.volunteerStartDate}
              onChange={handleChange}
              icon={<Calendar size={18} className="text-gray-400" />}
              disabled={isSubmitting}
            />
            
            <Input
              label="End Date"
              id="volunteerEndDate"
              name="volunteerEndDate"
              type="date"
              value={formData.volunteerEndDate}
              onChange={handleChange}
              icon={<Calendar size={18} className="text-gray-400" />}
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Volunteer Contract
            </h3>
            
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Please upload the signed volunteer contract or fill in the form{' '}
                <a
                  href="https://docs.google.com/forms/d/e/1FAIpQLSeX0rt46tUlWBvJ6lVNlsK8YDRXfZCkGZkiXADg1rsLCrIXkQ/viewform"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  here
                </a>
              </p>
              
              <input
                type="file"
                onChange={(e) => handleFileChange(e, 'volunteerContractFile')}
                accept=".pdf,.doc,.docx"
                className="block w-full text-sm text-gray-500 dark:text-gray-400
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-medium
                  file:bg-blue-50 file:text-blue-700
                  dark:file:bg-blue-900/30 dark:file:text-blue-400
                  hover:file:bg-blue-100 dark:hover:file:bg-blue-900/40"
              />
              {formData.volunteerContractFile && (
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Selected file: {formData.volunteerContractFile.name}
                </p>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="text-center text-gray-500 dark:text-gray-400 py-8">
          Enable volunteer mode in the main tab to access volunteer settings
        </div>
      )}
    </div>
  );

  const donatorTab = (
    <div className="space-y-6">
      {formData.engagement.includes('donator') ? (
        <>
          {/* Bank Accounts Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Bank Accounts
            </h3>
            
            <div className="flex gap-2">
              <Input
                placeholder="Enter bank account number"
                value={newBankAccount}
                onChange={(e) => setNewBankAccount(e.target.value)}
                icon={<CreditCard size={18} className="text-gray-400" />}
                disabled={isSubmitting}
              />
              <Button
                type="button"
                onClick={handleAddBankAccount}
                disabled={!newBankAccount.trim() || isSubmitting}
                leftIcon={<Plus size={16} />}
              >
                Add
              </Button>
            </div>

            <div className="space-y-2">
              {formData.donatorBankAccounts?.map((account, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-md"
                >
                  <span className="text-sm text-gray-700 dark:text-gray-300">{account}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveBankAccount(index)}
                    className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Alternative Emails Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Alternative Email Addresses
            </h3>
            
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Enter email address"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                icon={<Mail size={18} className="text-gray-400" />}
                disabled={isSubmitting}
              />
              <Button
                type="button"
                onClick={handleAddEmail}
                disabled={!newEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail) || isSubmitting}
                leftIcon={<Plus size={16} />}
              >
                Add
              </Button>
            </div>

            <div className="space-y-2">
              {formData.donatorEmails?.map((email, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-md"
                >
                  <span className="text-sm text-gray-700 dark:text-gray-300">{email}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveEmail(index)}
                    className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="text-center text-gray-500 dark:text-gray-400 py-8">
          Enable donator mode in the main tab to access donator settings
        </div>
      )}
    </div>
  );

  const tabs = [
    {
      label: 'Main',
      content: mainTab,
    },
    {
      label: 'Contractor',
      content: contractorTab,
    },
    {
      label: 'Volunteer',
      content: volunteerTab,
    },
    {
      label: 'Donator',
      content: donatorTab,
    },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-6">
        <Tabs 
          tabs={tabs} 
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>
      
      <div className="flex justify-end space-x-3 pt-4 mt-6 border-t border-gray-200 dark:border-gray-700">
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
          {initialData ? 'Update' : 'Create'} Person
        </Button>
      </div>
    </form>
  );
}

export default PersonForm;