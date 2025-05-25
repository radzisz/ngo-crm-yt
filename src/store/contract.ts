import { create } from 'zustand';
import { Contract, NewContract, ContractUpdate } from '../types';
import { supabase } from '../lib/supabase';

interface ContractState {
  contracts: Contract[];
  isLoading: boolean;
  error: string | null;
  selectedContract: Contract | null;
  
  // Actions
  fetchContracts: () => Promise<void>;
  getContractById: (id: string) => Promise<Contract | null>;
  createContract: (contract: NewContract) => Promise<Contract>;
  updateContract: (id: string, update: ContractUpdate) => Promise<Contract>;
  deleteContract: (id: string) => Promise<void>;
  selectContract: (contract: Contract | null) => void;
}

export const useContractStore = create<ContractState>((set, get) => ({
  contracts: [],
  isLoading: false,
  error: null,
  selectedContract: null,
  
  fetchContracts: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('contracts')
        .select(`
          *,
          person:persons (*)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      const transformedData = data?.map(contract => ({
        id: contract.id,
        personId: contract.person_id,
        startDate: contract.start_date,
        endDate: contract.end_date,
        description: contract.description,
        status: contract.status,
        templateId: contract.template_id,
        customFields: contract.custom_fields || {},
        sourceDocumentUrl: contract.source_document_url,
        createdAt: contract.created_at,
        updatedAt: contract.updated_at,
        person: contract.person ? {
          id: contract.person.id,
          firstName: contract.person.firstname,
          lastName: contract.person.lastname,
          email: contract.person.email,
          phone: contract.person.phone,
          createdAt: contract.person.created_at,
          updatedAt: contract.person.updated_at,
        } : undefined,
      })) || [];
      
      set({ contracts: transformedData, isLoading: false });
    } catch (error) {
      console.error('Error fetching contracts:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch contracts', 
        isLoading: false 
      });
    }
  },
  
  getContractById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('contracts')
        .select(`
          *,
          person:persons (*)
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      if (!data) return null;
      
      const contract: Contract = {
        id: data.id,
        personId: data.person_id,
        startDate: data.start_date,
        endDate: data.end_date,
        description: data.description,
        status: data.status,
        templateId: data.template_id,
        customFields: data.custom_fields || {},
        sourceDocumentUrl: data.source_document_url,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        person: data.person ? {
          id: data.person.id,
          firstName: data.person.firstname,
          lastName: data.person.lastname,
          email: data.person.email,
          phone: data.person.phone,
          createdAt: data.person.created_at,
          updatedAt: data.person.updated_at,
        } : undefined,
      };
      
      set({ isLoading: false });
      return contract;
    } catch (error) {
      console.error('Error getting contract:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to get contract', 
        isLoading: false 
      });
      return null;
    }
  },
  
  createContract: async (contractData: NewContract) => {
    set({ isLoading: true, error: null });
    try {
      // Validate start date
      if (!contractData.startDate) {
        throw new Error('Start date is required');
      }

      const { data, error } = await supabase
        .from('contracts')
        .insert([{
          person_id: contractData.personId,
          start_date: contractData.startDate,
          end_date: contractData.endDate || null,
          description: contractData.description,
          status: contractData.status,
          template_id: contractData.templateId,
          custom_fields: contractData.customFields,
          source_document_url: contractData.sourceDocumentUrl,
        }])
        .select(`
          *,
          person:persons (*)
        `)
        .single();
      
      if (error) throw error;
      if (!data) throw new Error('Failed to create contract');
      
      const contract: Contract = {
        id: data.id,
        personId: data.person_id,
        startDate: data.start_date,
        endDate: data.end_date,
        description: data.description,
        status: data.status,
        templateId: data.template_id,
        customFields: data.custom_fields || {},
        sourceDocumentUrl: data.source_document_url,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        person: data.person ? {
          id: data.person.id,
          firstName: data.person.firstname,
          lastName: data.person.lastname,
          email: data.person.email,
          phone: data.person.phone,
          createdAt: data.person.created_at,
          updatedAt: data.person.updated_at,
        } : undefined,
      };
      
      set(state => ({ 
        contracts: [contract, ...state.contracts], 
        isLoading: false 
      }));
      
      return contract;
    } catch (error) {
      console.error('Error creating contract:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to create contract', 
        isLoading: false 
      });
      throw error;
    }
  },
  
  updateContract: async (id: string, update: ContractUpdate) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('contracts')
        .update({
          person_id: update.personId,
          start_date: update.startDate,
          end_date: update.endDate || null,
          description: update.description,
          status: update.status,
          template_id: update.templateId,
          custom_fields: update.customFields,
          source_document_url: update.sourceDocumentUrl,
        })
        .eq('id', id)
        .select(`
          *,
          person:persons (*)
        `)
        .single();
      
      if (error) throw error;
      if (!data) throw new Error('Contract not found');
      
      const contract: Contract = {
        id: data.id,
        personId: data.person_id,
        startDate: data.start_date,
        endDate: data.end_date,
        description: data.description,
        status: data.status,
        templateId: data.template_id,
        customFields: data.custom_fields || {},
        sourceDocumentUrl: data.source_document_url,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        person: data.person ? {
          id: data.person.id,
          firstName: data.person.firstname,
          lastName: data.person.lastname,
          email: data.person.email,
          phone: data.person.phone,
          createdAt: data.person.created_at,
          updatedAt: data.person.updated_at,
        } : undefined,
      };
      
      set(state => ({
        contracts: state.contracts.map(c => c.id === id ? contract : c),
        selectedContract: state.selectedContract?.id === id ? contract : state.selectedContract,
        isLoading: false
      }));
      
      return contract;
    } catch (error) {
      console.error('Error updating contract:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update contract', 
        isLoading: false 
      });
      throw error;
    }
  },
  
  deleteContract: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('contracts')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      set(state => ({
        contracts: state.contracts.filter(contract => contract.id !== id),
        selectedContract: state.selectedContract?.id === id ? null : state.selectedContract,
        isLoading: false
      }));
    } catch (error) {
      console.error('Error deleting contract:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete contract', 
        isLoading: false 
      });
      throw error;
    }
  },
  
  selectContract: (contract: Contract | null) => {
    set({ selectedContract: contract });
  },
}));