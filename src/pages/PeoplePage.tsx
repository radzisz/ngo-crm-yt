import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { usePersonStore } from '../store/person';
import { Card, CardContent } from '../components/ui/Card';
import PersonTable from '../components/person/PersonTable';
import PersonForm from '../components/person/PersonForm';
import PersonDetail from '../components/person/PersonDetail';
import { NewPerson, Person, PersonUpdate, Engagement } from '../types';

enum PersonViewMode {
  LIST,
  CREATE,
  EDIT,
  DETAILS,
}

type PersonFilter = 'all' | 'incomplete' | 'volunteer' | 'donator' | 'contractor';

const PersonsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    persons,
    isLoading,
    error,
    fetchPersons,
    createPerson,
    updatePerson,
    deletePerson,
    searchQuery,
    setSearchQuery,
    sortState,
    setSortState,
    selectedPerson,
    selectPerson,
  } = usePersonStore();
  
  const [viewMode, setViewMode] = useState<PersonViewMode>(PersonViewMode.LIST);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [personFilter, setPersonFilter] = useState<PersonFilter>(
    (searchParams.get('filter') as PersonFilter) || 'all'
  );
  
  useEffect(() => {
    fetchPersons();
  }, [fetchPersons]);
  
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  useEffect(() => {
    // Update URL when filter changes
    setSearchParams({ filter: personFilter });
  }, [personFilter, setSearchParams]);
  
  const filteredPersons = useMemo(() => {
    let filtered = persons;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (person) =>
          person.firstName.toLowerCase().includes(query) ||
          person.lastName.toLowerCase().includes(query) ||
          person.email.toLowerCase().includes(query) ||
          person.phone.toLowerCase().includes(query)
      );
    }

    // Apply person type filter
    switch (personFilter) {
      case 'incomplete':
        filtered = filtered.filter(person => person.completenessProblems?.length > 0);
        break;
      case 'volunteer':
        filtered = filtered.filter(person => person.engagement?.includes('volunteer'));
        break;
      case 'donator':
        filtered = filtered.filter(person => person.engagement?.includes('donator'));
        break;
      case 'contractor':
        filtered = filtered.filter(person => person.engagement?.includes('contractor'));
        break;
      default:
        break;
    }

    return filtered;
  }, [persons, searchQuery, personFilter]);
  
  const sortedPersons = useMemo(() => {
    return [...filteredPersons].sort((a, b) => {
      const { field, direction } = sortState;
      
      if (typeof a[field] === 'string' && typeof b[field] === 'string') {
        const aValue = (a[field] as string).toLowerCase();
        const bValue = (b[field] as string).toLowerCase();
        
        return direction === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      return direction === 'asc'
        ? a[field] > b[field] ? 1 : -1
        : a[field] < b[field] ? 1 : -1;
    });
  }, [filteredPersons, sortState]);
  
  const handleAddPerson = () => {
    selectPerson(null);
    setViewMode(PersonViewMode.CREATE);
  };
  
  const handleEditPerson = (person: Person) => {
    selectPerson(person);
    setViewMode(PersonViewMode.EDIT);
  };
  
  const handleViewPerson = (person: Person) => {
    selectPerson(person);
    setViewMode(PersonViewMode.DETAILS);
  };
  
  const handleCreatePerson = async (personData: NewPerson) => {
    setIsSubmitting(true);
    try {
      await createPerson(personData);
      toast.success('Person created successfully');
      setViewMode(PersonViewMode.LIST);
    } catch (error) {
      toast.error('Failed to create person');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleUpdatePerson = async (personData: PersonUpdate) => {
    if (!selectedPerson) return;
    
    setIsSubmitting(true);
    try {
      await updatePerson(selectedPerson.id, personData);
      toast.success('Person updated successfully');
      setViewMode(PersonViewMode.LIST);
    } catch (error) {
      toast.error('Failed to update person');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDeletePerson = async (person: Person) => {
    try {
      await deletePerson(person.id);
      toast.success('Person deleted successfully');
      if (viewMode === PersonViewMode.DETAILS) {
        setViewMode(PersonViewMode.LIST);
      }
    } catch (error) {
      toast.error('Failed to delete person');
    }
  };

  const handleFilterChange = (filter: PersonFilter) => {
    setPersonFilter(filter);
    setSearchParams({ filter });
  };
  
  const renderContent = () => {
    switch (viewMode) {
      case PersonViewMode.CREATE:
      case PersonViewMode.EDIT:
        return (
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                {viewMode === PersonViewMode.CREATE ? 'Create Person' : 'Edit Person'}
              </h2>
              <PersonForm
                key={selectedPerson?.id || 'create'}
                initialData={selectedPerson}
                onSubmit={viewMode === PersonViewMode.CREATE ? handleCreatePerson : handleUpdatePerson}
                onCancel={() => setViewMode(PersonViewMode.LIST)}
                isSubmitting={isSubmitting}
              />
            </CardContent>
          </Card>
        );
        
      case PersonViewMode.DETAILS:
        if (!selectedPerson) return null;
        return (
          <PersonDetail
            person={selectedPerson}
            onEdit={() => setViewMode(PersonViewMode.EDIT)}
            onClose={() => setViewMode(PersonViewMode.LIST)}
            onDelete={() => handleDeletePerson(selectedPerson)}
          />
        );
        
      case PersonViewMode.LIST:
      default:
        return (
          <PersonTable
            persons={sortedPersons}
            sortState={sortState}
            onSort={setSortState}
            onEdit={handleEditPerson}
            onDelete={handleDeletePerson}
            onAdd={handleAddPerson}
            onView={handleViewPerson}
            searchQuery={searchQuery}
            onSearch={setSearchQuery}
            personFilter={personFilter}
            onFilterChange={handleFilterChange}
          />
        );
    }
  };
  
  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {isLoading && viewMode === PersonViewMode.LIST ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          renderContent()
        )}
      </div>
    </div>
  );
};

export default PersonsPage;