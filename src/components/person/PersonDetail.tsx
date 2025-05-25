import React from 'react';
import { User, Mail, Phone, Calendar, X, AlertCircle } from 'lucide-react';
import { Person } from '../../types';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../ui/Card';
import Button from '../ui/Button';
import { Tabs } from '../ui/Tabs';
import { formatDate } from '../../lib/utils';

interface PersonDetailProps {
  person: Person;
  onEdit: () => void;
  onClose: () => void;
  onDelete: () => void;
}

const PersonDetail: React.FC<PersonDetailProps> = ({
  person,
  onEdit,
  onClose,
}) => {
  const mainTab = (
    <div className="space-y-6">
      <div className="flex flex-col items-center space-y-4 pb-4 border-b border-gray-200 dark:border-gray-700">
        <div className="h-20 w-20 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300">
          <span className="text-2xl font-medium">
            {person.firstName.charAt(0)}{person.lastName.charAt(0)}
          </span>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          {person.firstName} {person.lastName}
        </h3>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-start">
          <Mail className="w-5 h-5 mt-0.5 text-gray-400 dark:text-gray-500 mr-3" />
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</p>
            <p className="text-gray-900 dark:text-white">{person.email}</p>
          </div>
        </div>
        
        <div className="flex items-start">
          <Phone className="w-5 h-5 mt-0.5 text-gray-400 dark:text-gray-500 mr-3" />
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone</p>
            <a
              href={`tel:${person.phone}`}
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center"
            >
              {person.phone}
            </a>
          </div>
        </div>
        
        <div className="flex items-start">
          <Calendar className="w-5 h-5 mt-0.5 text-gray-400 dark:text-gray-500 mr-3" />
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Created</p>
            <p className="text-gray-900 dark:text-white">{formatDate(person.createdAt)}</p>
          </div>
        </div>
        
        <div className="flex items-start">
          <Calendar className="w-5 h-5 mt-0.5 text-gray-400 dark:text-gray-500 mr-3" />
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Updated</p>
            <p className="text-gray-900 dark:text-white">{formatDate(person.updatedAt)}</p>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Engagement</p>
          <div className="flex flex-wrap gap-2">
            {person.engagement?.map((type) => (
              <span
                key={type}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </span>
            ))}
          </div>
        </div>

        {/* Profile Completeness Status */}
        {person.completenessProblems?.length > 0 && (
          <div className="mt-6 bg-yellow-50 dark:bg-yellow-900/30 p-4 rounded-lg">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-yellow-400 dark:text-yellow-300 mt-0.5" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                  Profile Incomplete
                </h3>
                <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-200">
                  <ul className="list-disc pl-5 space-y-1">
                    {person.completenessProblems.map((problem, index) => (
                      <li key={index}>{problem}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const contractorTab = (
    <div className="space-y-6">
      {person.engagement?.includes('contractor') ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Birth Date</p>
              <p className="text-gray-900 dark:text-white">{person.birthDate || '-'}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">PESEL</p>
              <p className="text-gray-900 dark:text-white">{person.pesel || '-'}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Street Address</p>
              <p className="text-gray-900 dark:text-white">{person.street || '-'}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">City</p>
                <p className="text-gray-900 dark:text-white">{person.city || '-'}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Postal Code</p>
                <p className="text-gray-900 dark:text-white">{person.postalCode || '-'}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Country</p>
                <p className="text-gray-900 dark:text-white">{person.country || '-'}</p>
              </div>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Bank Account</p>
            <p className="text-gray-900 dark:text-white">{person.bankAccount || '-'}</p>
          </div>
        </>
      ) : (
        <div className="text-center text-gray-500 dark:text-gray-400 py-8">
          This person is not a contractor
        </div>
      )}
    </div>
  );

  const volunteerTab = (
    <div className="space-y-6">
      {person.engagement?.includes('volunteer') ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Start Date</p>
              <p className="text-gray-900 dark:text-white">{person.volunteerStartDate || '-'}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">End Date</p>
              <p className="text-gray-900 dark:text-white">{person.volunteerEndDate || '-'}</p>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Contract Status</p>
            <p className="text-gray-900 dark:text-white">
              {person.volunteerContractFile ? 'Signed' : 'Not signed'}
            </p>
          </div>
        </>
      ) : (
        <div className="text-center text-gray-500 dark:text-gray-400 py-8">
          This person is not a volunteer
        </div>
      )}
    </div>
  );

  const donatorTab = (
    <div className="space-y-6">
      {person.engagement?.includes('donator') ? (
        <>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Bank Accounts</p>
            {person.donatorBankAccounts?.length ? (
              <ul className="mt-2 space-y-2">
                {person.donatorBankAccounts.map((account, index) => (
                  <li
                    key={index}
                    className="p-2 bg-gray-50 dark:bg-gray-800 rounded-md text-gray-900 dark:text-white"
                  >
                    {account}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No bank accounts added</p>
            )}
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Alternative Emails</p>
            {person.donatorEmails?.length ? (
              <ul className="mt-2 space-y-2">
                {person.donatorEmails.map((email, index) => (
                  <li
                    key={index}
                    className="p-2 bg-gray-50 dark:bg-gray-800 rounded-md text-gray-900 dark:text-white"
                  >
                    {email}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No alternative emails added</p>
            )}
          </div>
        </>
      ) : (
        <div className="text-center text-gray-500 dark:text-gray-400 py-8">
          This person is not a donator
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
    <Card className="max-w-3xl mx-auto">
      <CardHeader className="relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-500 dark:hover:text-gray-300 dark:hover:bg-gray-700"
        >
          <X size={18} />
        </button>
        <CardTitle>Person Details</CardTitle>
      </CardHeader>
      
      <CardContent className="p-0">
        <Tabs tabs={tabs} />
      </CardContent>
      
      <CardFooter className="flex justify-end">
        <Button
          variant="primary"
          onClick={onEdit}
          leftIcon={<User size={16} />}
          className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white"
        >
          Edit
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PersonDetail;