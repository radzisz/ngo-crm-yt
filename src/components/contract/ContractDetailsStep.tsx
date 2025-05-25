import React from 'react';
import Input from '../ui/Input';
import { Calendar } from 'lucide-react';

interface ContractDetailsStepProps {
  formData: {
    templateId: string;
    startDate: string;
    endDate: string;
    customFields: Record<string, string>;
  };
  onFieldChange: (field: string, value: string) => void;
}

export function ContractDetailsStep({ formData, onFieldChange }: ContractDetailsStepProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Start Date"
          type="date"
          value={formData.startDate}
          onChange={(e) => onFieldChange('startDate', e.target.value)}
          icon={<Calendar size={18} className="text-gray-400" />}
          required
        />
        
        <Input
          label="End Date"
          type="date"
          value={formData.endDate}
          onChange={(e) => onFieldChange('endDate', e.target.value)}
          icon={<Calendar size={18} className="text-gray-400" />}
        />
      </div>
    </div>
  );
}