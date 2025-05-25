import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, User, ArrowLeft, ArrowRight, Calendar, CreditCard, MapPin, Mail, Phone } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { usePersonStore } from '../store/person';
import { useContractStore } from '../store/contract';
import { Person } from '../types';
import { Card, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { ContractDetailsStep } from '../components/contract/ContractDetailsStep';

interface Step {
  title: string;
  description: string;
}

const STEPS: Step[] = [
  {
    title: 'Select Person',
    description: 'Choose a person for the contract',
  },
  {
    title: 'Person Details',
    description: 'Review and update person details',
  },
  {
    title: 'Contract Details',
    description: 'Enter contract details',
  },
];

interface ContractPersonDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthDate: string;
  pesel: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  bankAccount: string;
}

function CreateContractPage() {
  const navigate = useNavigate();
  const { persons, fetchPersons, updatePerson } = usePersonStore();
  const { createContract } = useContractStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [personDetails, setPersonDetails] = useState<ContractPersonDetails>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    birthDate: '',
    pesel: '',
    street: '',
    city: '',
    postalCode: '',
    country: 'PL',
    bankAccount: '',
  });
  const [showUpdateConfirm, setShowUpdateConfirm] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contractData, setContractData] = useState({
    templateId: '',
    startDate: '',
    endDate: '',
    customFields: {} as Record<string, string>,
  });

  useEffect(() => {
    fetchPersons();
  }, [fetchPersons]);

  useEffect(() => {
    if (selectedPerson) {
      setPersonDetails({
        firstName: selectedPerson.firstName,
        lastName: selectedPerson.lastName,
        email: selectedPerson.email,
        phone: selectedPerson.phone,
        birthDate: selectedPerson.birthDate || '',
        pesel: selectedPerson.pesel || '',
        street: selectedPerson.street || '',
        city: selectedPerson.city || '',
        postalCode: selectedPerson.postalCode || '',
        country: selectedPerson.country || 'PL',
        bankAccount: selectedPerson.bankAccount || '',
      });
    }
  }, [selectedPerson]);

  const filteredPersons = persons
    .filter(person => {
      if (!searchQuery.trim()) return false;
      
      const query = searchQuery.toLowerCase();
      return (
        person.firstName.toLowerCase().includes(query) ||
        person.lastName.toLowerCase().includes(query) ||
        person.email.toLowerCase().includes(query)
      );
    })
    .slice(0, 10);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowResults(value.length > 0);
  };

  const handleSelectPerson = (person: Person) => {
    setSelectedPerson(person);
    setSearchQuery(`${person.firstName} ${person.lastName}`);
    setShowResults(false);
  };

  const handlePersonDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPersonDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleContractFieldChange = (field: string, value: string) => {
    if (field.startsWith('customFields.')) {
      const fieldName = field.split('.')[1];
      setContractData(prev => ({
        ...prev,
        customFields: {
          ...prev.customFields,
          [fieldName]: value
        }
      }));
    } else {
      setContractData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleUpdatePerson = async () => {
    if (!selectedPerson) return;

    try {
      setIsUpdating(true);
      
      const shouldEngageAsContractor = !selectedPerson.engagement?.includes('contractor');
      const engagement = shouldEngageAsContractor 
        ? [...(selectedPerson.engagement || []), 'contractor']
        : selectedPerson.engagement;

      await updatePerson(selectedPerson.id, {
        ...personDetails,
        engagement: engagement || [],
      });

      toast.success('Person details updated successfully');
      setShowUpdateConfirm(false);
      setCurrentStep(prev => prev + 1);
    } catch (error) {
      toast.error('Failed to update person details');
    } finally {
      setIsUpdating(false);
    }
  };

  const validateContractData = () => {
    if (!contractData.startDate.trim()) {
      toast.error('Start date is required');
      return false;
    }
    return true;
  };

  const handleCreateContract = async () => {
    if (!selectedPerson) return;

    try {
      setIsSubmitting(true);

      if (!validateContractData()) {
        setIsSubmitting(false);
        return;
      }

      await createContract({
        personId: selectedPerson.id,
        startDate: contractData.startDate.trim(),
        endDate: contractData.endDate.trim() || null,
        status: 'in_progress',
        templateId: contractData.templateId,
        customFields: contractData.customFields,
      });

      toast.success('Contract created successfully');
      navigate('/contracts');
    } catch (error) {
      console.error('Error creating contract:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create contract');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    if (currentStep === 1) {
      const hasChanges = Object.entries(personDetails).some(([key, value]) => {
        const personValue = selectedPerson?.[key as keyof Person];
        return value !== (personValue || '');
      });

      const isNotContractor = !selectedPerson?.engagement?.includes('contractor');

      if (hasChanges || isNotContractor) {
        setShowUpdateConfirm(true);
        return;
      }
    }

    if (currentStep === STEPS.length - 1) {
      if (!validateContractData()) {
        return;
      }
      handleCreateContract();
      return;
    }

    setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    } else {
      navigate('/contracts');
    }
  };

  const handleSkip = () => {
    setShowUpdateConfirm(false);
    setCurrentStep(prev => prev + 1);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="relative">
              <Input
                placeholder="Start typing to search by name or email..."
                value={searchQuery}
                onChange={handleSearchChange}
                icon={<Search className="h-4 w-4 text-gray-400" />}
              />
              
              {showResults && (
                <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700">
                  {filteredPersons.length > 0 ? (
                    <ul className="py-1 max-h-[400px] overflow-auto">
                      {filteredPersons.map(person => (
                        <li key={person.id}>
                          <button
                            onClick={() => handleSelectPerson(person)}
                            className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <div className="flex items-center">
                              <div className="flex-shrink-0">
                                <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300">
                                  <span className="text-sm font-medium">
                                    {person.firstName.charAt(0)}{person.lastName.charAt(0)}
                                  </span>
                                </div>
                              </div>
                              <div className="ml-4">
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                  {person.firstName} {person.lastName}
                                </p>
                                <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                                  <span>{person.email}</span>
                                  <span>•</span>
                                  <span>{person.phone}</span>
                                </div>
                              </div>
                            </div>
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                      No persons found
                    </div>
                  )}
                </div>
              )}
            </div>

            {selectedPerson && (
              <div className="mt-6 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">
                  Selected Person
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Name
                    </p>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">
                      {selectedPerson.firstName} {selectedPerson.lastName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Email
                    </p>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">
                      {selectedPerson.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Phone
                    </p>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">
                      {selectedPerson.phone}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Engagement
                    </p>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {selectedPerson.engagement?.map((type) => (
                        <span
                          key={type}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                        >
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      case 1:
        return renderPersonDetailsStep();
      case 2:
        return (
          <ContractDetailsStep
            formData={contractData}
            onFieldChange={handleContractFieldChange}
          />
        );
      default:
        return null;
    }
  };

  const renderPersonDetailsStep = () => (
    <div className="space-y-6">
      <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
        <div className="mb-6">
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
            {selectedPerson?.firstName} {selectedPerson?.lastName}
          </h3>
          <div className="mt-3 flex flex-wrap gap-4">
            <div className="flex items-center text-gray-600 dark:text-gray-300">
              <Mail className="h-4 w-4 mr-2" />
              <span>{selectedPerson?.email}</span>
            </div>
            <div className="flex items-center text-gray-600 dark:text-gray-300">
              <Phone className="h-4 w-4 mr-2" />
              <span>{selectedPerson?.phone}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Birth Date"
          name="birthDate"
          type="date"
          value={personDetails.birthDate}
          onChange={handlePersonDetailsChange}
          icon={<Calendar size={18} className="text-gray-400" />}
          required
        />
        
        <Input
          label="PESEL"
          name="pesel"
          value={personDetails.pesel}
          onChange={handlePersonDetailsChange}
          icon={<User size={18} className="text-gray-400" />}
          required
        />
      </div>

      <Input
        label="Street Address"
        name="street"
        value={personDetails.street}
        onChange={handlePersonDetailsChange}
        icon={<MapPin size={18} className="text-gray-400" />}
        required
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          label="City"
          name="city"
          value={personDetails.city}
          onChange={handlePersonDetailsChange}
          required
        />
        
        <Input
          label="Postal Code"
          name="postalCode"
          value={personDetails.postalCode}
          onChange={handlePersonDetailsChange}
          required
        />
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Country
          </label>
          <select
            name="country"
            value={personDetails.country}
            onChange={handlePersonDetailsChange}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="PL">Poland</option>
            <option value="DE">Germany</option>
            <option value="UK">United Kingdom</option>
          </select>
        </div>
      </div>

      <Input
        label="Bank Account Number"
        name="bankAccount"
        value={personDetails.bankAccount}
        onChange={handlePersonDetailsChange}
        icon={<CreditCard size={18} className="text-gray-400" />}
        required
      />
    </div>
  );

  return (
    <div className="py-6">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav aria-label="Progress">
          <ol className="flex items-center">
            {STEPS.map((step, index) => (
              <li
                key={step.title}
                className={`relative ${
                  index !== STEPS.length - 1 ? 'pr-8 sm:pr-20' : ''
                } ${index !== 0 ? 'pl-8 sm:pl-20' : ''} flex-1`}
              >
                <div className="flex items-center">
                  <div
                    className={`relative flex h-8 w-8 items-center justify-center rounded-full ${
                      index < currentStep
                        ? 'bg-blue-600 dark:bg-blue-500'
                        : index === currentStep
                        ? 'border-2 border-blue-600 dark:border-blue-500'
                        : 'border-2 border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${
                        index <= currentStep
                          ? 'bg-blue-600 dark:bg-blue-500'
                          : 'bg-transparent'
                      }`}
                    />
                  </div>
                  {index !== STEPS.length - 1 && (
                    <div
                      className={`absolute top-4 left-8 -ml-px h-0.5 w-full sm:w-20 ${
                        index < currentStep
                          ? 'bg-blue-600 dark:bg-blue-500'
                          : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    />
                  )}
                </div>
                <div className="mt-3">
                  <p
                    className={`text-xs font-semibold uppercase ${
                      index <= currentStep
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    Step {index + 1}
                  </p>
                  <p
                    className={`mt-1 text-sm font-medium ${
                      index <= currentStep
                        ? 'text-gray-900 dark:text-white'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    {step.title}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </nav>

        <Card className="mt-8 min-h-[600px]">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {STEPS[currentStep].title}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              {STEPS[currentStep].description}
            </p>

            {renderStepContent()}
          </CardContent>
        </Card>

        {showUpdateConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Update Person Details?
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                {selectedPerson?.engagement?.includes('contractor')
                  ? 'The person details have been modified. Would you like to update their profile with these changes?'
                  : 'This person is not currently engaged as a contractor. Would you like to update their profile and add the contractor role?'}
              </p>
              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={handleSkip}
                  disabled={isUpdating}
                >
                  Skip
                </Button>
                <Button
                  variant="primary"
                  onClick={handleUpdatePerson}
                  isLoading={isUpdating}
                >
                  Update Profile
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 flex justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            leftIcon={<ArrowLeft size={16} />}
          >
            {currentStep === 0 ? 'Cancel' : 'Back'}
          </Button>
          
          <Button
            variant="primary"
            onClick={handleNext}
            disabled={currentStep === 0 && !selectedPerson}
            isLoading={isSubmitting}
            rightIcon={<ArrowRight size={16} />}
          >
            {currentStep === STEPS.length - 1 ? 'Create Contract' : 'Next'}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default CreateContractPage;