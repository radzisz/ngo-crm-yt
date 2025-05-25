import React from 'react';
import { useContractStore } from '../../store/contract';

export function DocumentGenerationStep() {
  const { contract } = useContractStore();

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Document Generation</h2>
      <div className="space-y-4">
        {/* Basic placeholder content */}
        <p>Contract ID: {contract?.id}</p>
      </div>
    </div>
  );
}