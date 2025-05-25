import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useContractStore } from '../store/contract';
import { Card, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { ContractDetailsStep } from '../components/contract/ContractDetailsStep';

const EditContractPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getContractById, updateContract } = useContractStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contract, setContract] = useState<any>(null);
  const [formData, setFormData] = useState({
    templateId: '',
    startDate: '',
    endDate: '',
    customFields: {} as Record<string, string>,
  });

  useEffect(() => {
    const fetchContract = async () => {
      if (!id) {
        navigate('/contracts');
        return;
      }

      try {
        const contractData = await getContractById(id);
        if (!contractData) {
          toast.error('Contract not found');
          navigate('/contracts');
          return;
        }

        setContract(contractData);
        setFormData({
          templateId: contractData.templateId || '',
          startDate: contractData.startDate || '',
          endDate: contractData.endDate || '',
          customFields: contractData.customFields || {},
        });
      } catch (error) {
        console.error('Error fetching contract:', error);
        toast.error('Failed to load contract');
        navigate('/contracts');
      } finally {
        setIsLoading(false);
      }
    };

    fetchContract();
  }, [id, navigate, getContractById]);

  const handleFieldChange = (field: string, value: string) => {
    if (field.startsWith('customFields.')) {
      const fieldName = field.split('.')[1];
      setFormData(prev => ({
        ...prev,
        customFields: {
          ...prev.customFields,
          [fieldName]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSubmit = async () => {
    if (!contract) return;

    try {
      setIsSubmitting(true);

      await updateContract(contract.id, {
        ...contract,
        ...formData,
      });

      toast.success('Contract updated successfully');
      navigate('/contracts');
    } catch (error) {
      console.error('Error updating contract:', error);
      toast.error('Failed to update contract');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Edit Contract
          </h1>
        </div>

        <Card>
          <CardContent className="p-6">
            <ContractDetailsStep
              formData={formData}
              onFieldChange={handleFieldChange}
            />

            <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <Button
                variant="outline"
                onClick={() => navigate('/contracts')}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleSubmit}
                isLoading={isSubmitting}
              >
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditContractPage;