/*
  # Add contract status and document fields
  
  1. Changes
    - Create contract_status enum type
    - Add status column with contract_status type
    - Add source_document_url column
    - Add template_id column with foreign key reference
    - Add custom_fields column for template variables
*/

-- Create contract status enum if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'contract_status') THEN
    CREATE TYPE contract_status AS ENUM (
      'in_progress',
      'waiting_for_signature',
      'signed'
    );
  END IF;
END $$;

-- Add columns to contracts table
ALTER TABLE contracts
ADD COLUMN IF NOT EXISTS status contract_status DEFAULT 'in_progress'::contract_status,
ADD COLUMN IF NOT EXISTS source_document_url text,
ADD COLUMN IF NOT EXISTS template_id uuid REFERENCES document_templates(id),
ADD COLUMN IF NOT EXISTS custom_fields jsonb DEFAULT '{}'::jsonb;