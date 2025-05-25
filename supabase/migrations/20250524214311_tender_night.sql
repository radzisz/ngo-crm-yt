/*
  # Add contract template and document fields

  1. Changes
    - Add template_id column referencing document_templates
    - Add source_document_url column for storing generated document URL
    - Add custom_fields JSONB column for template variables
    - Add status column for contract workflow state
*/

-- Add status enum if it doesn't exist
DO $$ BEGIN
  CREATE TYPE contract_status AS ENUM ('in_progress', 'waiting_for_signature', 'signed');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Add new columns to contracts table
ALTER TABLE contracts
ADD COLUMN IF NOT EXISTS status contract_status DEFAULT 'in_progress',
ADD COLUMN IF NOT EXISTS source_document_url text,
ADD COLUMN IF NOT EXISTS template_id uuid REFERENCES document_templates(id),
ADD COLUMN IF NOT EXISTS custom_fields jsonb DEFAULT '{}'::jsonb;