export type Engagement = 'volunteer' | 'contractor' | 'donator';

export interface Person {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  engagement: Engagement[];
  birthDate?: string;
  pesel?: string;
  street?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  bankAccount?: string;
  taxDeclarationFile?: File | null;
  volunteerStartDate?: string;
  volunteerEndDate?: string;
  volunteerContractFile?: File | null;
  donatorBankAccounts?: string[];
  donatorEmails?: string[];
  createdAt: string;
  updatedAt: string;
  completenessProblems?: string[];
}

export type NewPerson = Omit<Person, 'id' | 'createdAt' | 'updatedAt'>;
export type PersonUpdate = Partial<NewPerson>;

export type Role = 'admin' | 'accountant' | 'guest';

export interface User {
  id: string;
  email: string;
  name: string;
  picture: string;
  role: Role;
}

export type ThemeMode = 'light' | 'dark' | 'system';

export type DocumentType = 'contract' | 'receipt';

export interface DocumentTemplate {
  id: string;
  name: string;
  type: DocumentType;
  url: string;
  isActive: boolean;
  customFields: string[];
  createdAt: string;
  updatedAt: string;
}

export type NewDocumentTemplate = Omit<DocumentTemplate, 'id' | 'createdAt' | 'updatedAt'>;
export type DocumentTemplateUpdate = Partial<NewDocumentTemplate>;

export type SortDirection = 'asc' | 'desc';

export interface SortState {
  field: keyof Person;
  direction: SortDirection;
}

export type ContractStatus = 'in_progress' | 'waiting_for_signature' | 'signed';

export interface Contract {
  id: string;
  personId: string;
  startDate: string;
  endDate?: string;
  description?: string;
  status: ContractStatus;
  templateId: string;
  customFields: Record<string, string>;
  createdAt: string;
  updatedAt: string;
  person?: Person;
}

export type NewContract = Omit<Contract, 'id' | 'createdAt' | 'updatedAt'>;
export type ContractUpdate = Partial<NewContract>;