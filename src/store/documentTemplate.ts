import { create } from 'zustand';
import { DocumentTemplate, NewDocumentTemplate, DocumentTemplateUpdate } from '../types';
import { supabase } from '../lib/supabase';

interface DocumentTemplateState {
  templates: DocumentTemplate[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchTemplates: () => Promise<void>;
  createTemplate: (template: NewDocumentTemplate) => Promise<DocumentTemplate>;
  updateTemplate: (id: string, update: DocumentTemplateUpdate) => Promise<DocumentTemplate>;
  toggleTemplateStatus: (id: string) => Promise<void>;
}

export const useDocumentTemplateStore = create<DocumentTemplateState>((set, get) => ({
  templates: [],
  isLoading: false,
  error: null,
  
  fetchTemplates: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('document_templates')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      const transformedData = data?.map(template => ({
        id: template.id,
        name: template.name,
        type: template.type,
        url: template.url,
        isActive: template.is_active,
        customFields: template.custom_fields || [],
        createdAt: template.created_at,
        updatedAt: template.updated_at,
      })) || [];
      
      set({ templates: transformedData, isLoading: false });
    } catch (error) {
      console.error('Error fetching templates:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch templates', 
        isLoading: false 
      });
    }
  },
  
  createTemplate: async (templateData: NewDocumentTemplate) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('document_templates')
        .insert([{
          name: templateData.name,
          type: templateData.type,
          url: templateData.url,
          is_active: templateData.isActive,
          custom_fields: templateData.customFields,
        }])
        .select()
        .single();
      
      if (error) throw error;
      if (!data) throw new Error('Failed to create template');
      
      const template: DocumentTemplate = {
        id: data.id,
        name: data.name,
        type: data.type,
        url: data.url,
        isActive: data.is_active,
        customFields: data.custom_fields || [],
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
      
      set(state => ({ 
        templates: [template, ...state.templates], 
        isLoading: false 
      }));
      
      return template;
    } catch (error) {
      console.error('Error creating template:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to create template', 
        isLoading: false 
      });
      throw error;
    }
  },
  
  updateTemplate: async (id: string, update: DocumentTemplateUpdate) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('document_templates')
        .update({
          name: update.name,
          type: update.type,
          url: update.url,
          is_active: update.isActive,
          custom_fields: update.customFields,
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      if (!data) throw new Error('Template not found');
      
      const template: DocumentTemplate = {
        id: data.id,
        name: data.name,
        type: data.type,
        url: data.url,
        isActive: data.is_active,
        customFields: data.custom_fields || [],
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
      
      set(state => ({
        templates: state.templates.map(t => t.id === id ? template : t),
        isLoading: false
      }));
      
      return template;
    } catch (error) {
      console.error('Error updating template:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update template', 
        isLoading: false 
      });
      throw error;
    }
  },
  
  toggleTemplateStatus: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const template = get().templates.find(t => t.id === id);
      if (!template) throw new Error('Template not found');
      
      const { error } = await supabase
        .from('document_templates')
        .update({ is_active: !template.isActive })
        .eq('id', id);
      
      if (error) throw error;
      
      set(state => ({
        templates: state.templates.map(t => 
          t.id === id ? { ...t, isActive: !t.isActive } : t
        ),
        isLoading: false
      }));
    } catch (error) {
      console.error('Error toggling template status:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to toggle template status', 
        isLoading: false 
      });
      throw error;
    }
  },
}));