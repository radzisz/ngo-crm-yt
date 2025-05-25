/*
  # Add status and document fields to contracts table

  1. Changes
    - Add status column using existing contract_status enum
    - Add source_document_url for storing generated document URLs
    - Add template_id reference to document_templates
    - Add custom_fields for storing template variable values
*/

-- Add columns to contracts table
ALTER TABLE contracts
ADD COLUMN IF NOT EXISTS status contract_status DEFAULT 'in_progress',
ADD COLUMN IF NOT EXISTS source_document_url text,
ADD COLUMN IF NOT EXISTS template_id uuid REFERENCES document_templates(id),
ADD COLUMN IF NOT EXISTS custom_fields jsonb DEFAULT '{}';