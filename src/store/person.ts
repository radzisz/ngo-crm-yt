import { create } from 'zustand';
import { Person, NewPerson, PersonUpdate, SortState } from '../types';
import { supabase } from '../lib/supabase';

interface PersonState {
  persons: Person[];
  isLoading: boolean;
  error: string | null;
  selectedPerson: Person | null;
  searchQuery: string;
  sortState: SortState;
  
  // Actions
  fetchPersons: () => Promise<void>;
  getPersonById: (id: string) => Promise<Person | null>;
  createPerson: (person: NewPerson) => Promise<Person>;
  updatePerson: (id: string, update: PersonUpdate) => Promise<Person>;
  deletePerson: (id: string) => Promise<void>;
  selectPerson: (person: Person | null) => void;
  setSearchQuery: (query: string) => void;
  setSortState: (sortState: SortState) => void;
}

export const usePersonStore = create<PersonState>((set, get) => ({
  persons: [],
  isLoading: false,
  error: null,
  selectedPerson: null,
  searchQuery: '',
  sortState: { field: 'firstName', direction: 'asc' },
  
  fetchPersons: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('persons')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Transform the data to match our frontend Person type
      const transformedData = data?.map(person => ({
        id: person.id,
        firstName: person.firstname,
        lastName: person.lastname,
        email: person.email,
        phone: person.phone,
        engagement: person.engagement || [],
        birthDate: person.birth_date,
        pesel: person.pesel,
        street: person.street,
        city: person.city,
        postalCode: person.postal_code,
        country: person.country,
        bankAccount: person.bank_account,
        completenessProblems: person.completeness_problems || [],
        createdAt: person.created_at,
        updatedAt: person.updated_at
      })) || [];
      
      set({ persons: transformedData, isLoading: false });
    } catch (error) {
      console.error('Error fetching persons:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch persons', 
        isLoading: false 
      });
    }
  },
  
  getPersonById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('persons')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      if (!data) return null;
      
      // Transform the data
      const person: Person = {
        id: data.id,
        firstName: data.firstname,
        lastName: data.lastname,
        email: data.email,
        phone: data.phone,
        engagement: data.engagement || [],
        birthDate: data.birth_date,
        pesel: data.pesel,
        street: data.street,
        city: data.city,
        postalCode: data.postal_code,
        country: data.country,
        bankAccount: data.bank_account,
        completenessProblems: data.completeness_problems || [],
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };
      
      set({ isLoading: false });
      return person;
    } catch (error) {
      console.error('Error getting person:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to get person', 
        isLoading: false 
      });
      return null;
    }
  },
  
  createPerson: async (personData: NewPerson) => {
    set({ isLoading: true, error: null });
    try {
      // Transform empty date strings to null
      const dataToInsert = {
        firstname: personData.firstName,
        lastname: personData.lastName,
        email: personData.email,
        phone: personData.phone,
        engagement: personData.engagement,
        birth_date: personData.birthDate || null,
        pesel: personData.pesel,
        street: personData.street,
        city: personData.city,
        postal_code: personData.postalCode,
        country: personData.country,
        bank_account: personData.bankAccount,
        completeness_problems: personData.completenessProblems || [],
      };

      const { data, error } = await supabase
        .from('persons')
        .insert([dataToInsert])
        .select()
        .single();
      
      if (error) throw error;
      if (!data) throw new Error('Failed to create person');
      
      const person: Person = {
        id: data.id,
        firstName: data.firstname,
        lastName: data.lastname,
        email: data.email,
        phone: data.phone,
        engagement: data.engagement || [],
        birthDate: data.birth_date,
        pesel: data.pesel,
        street: data.street,
        city: data.city,
        postalCode: data.postal_code,
        country: data.country,
        bankAccount: data.bank_account,
        completenessProblems: data.completeness_problems || [],
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };
      
      set(state => ({ 
        persons: [person, ...state.persons], 
        isLoading: false 
      }));
      
      return person;
    } catch (error) {
      console.error('Error creating person:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to create person', 
        isLoading: false 
      });
      throw error;
    }
  },
  
  updatePerson: async (id: string, update: PersonUpdate) => {
    set({ isLoading: true, error: null });
    try {
      // Transform empty date strings to null
      const dataToUpdate = {
        firstname: update.firstName,
        lastname: update.lastName,
        email: update.email,
        phone: update.phone,
        engagement: update.engagement,
        birth_date: update.birthDate || null,
        pesel: update.pesel,
        street: update.street,
        city: update.city,
        postal_code: update.postalCode,
        country: update.country,
        bank_account: update.bankAccount,
        completeness_problems: update.completenessProblems || [],
      };

      const { data, error } = await supabase
        .from('persons')
        .update(dataToUpdate)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      if (!data) throw new Error('Person not found');
      
      const person: Person = {
        id: data.id,
        firstName: data.firstname,
        lastName: data.lastname,
        email: data.email,
        phone: data.phone,
        engagement: data.engagement || [],
        birthDate: data.birth_date,
        pesel: data.pesel,
        street: data.street,
        city: data.city,
        postalCode: data.postal_code,
        country: data.country,
        bankAccount: data.bank_account,
        completenessProblems: data.completeness_problems || [],
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };
      
      set(state => ({
        persons: state.persons.map(p => p.id === id ? person : p),
        selectedPerson: state.selectedPerson?.id === id ? person : state.selectedPerson,
        isLoading: false
      }));
      
      return person;
    } catch (error) {
      console.error('Error updating person:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update person', 
        isLoading: false 
      });
      throw error;
    }
  },
  
  deletePerson: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('persons')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      set(state => ({
        persons: state.persons.filter(person => person.id !== id),
        selectedPerson: state.selectedPerson?.id === id ? null : state.selectedPerson,
        isLoading: false
      }));
    } catch (error) {
      console.error('Error deleting person:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete person', 
        isLoading: false 
      });
      throw error;
    }
  },
  
  selectPerson: (person: Person | null) => {
    set({ selectedPerson: person });
  },
  
  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
  },
  
  setSortState: (sortState: SortState) => {
    set({ sortState });
  },
}));