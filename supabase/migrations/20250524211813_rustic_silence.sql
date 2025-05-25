/*
  # Add contract status and source document URL

  1. Changes
    - Add status enum type for contracts
    - Add status column to contracts table
    - Add source_document_url column to contracts table
*/

-- Create contract status enum
CREATE TYPE contract_status AS ENUM (
  'in_preparation',
  'waiting_for_signature',
  'signed'
);

-- Add columns to contracts table
ALTER TABLE contracts
ADD COLUMN IF NOT EXISTS status contract_status DEFAULT 'in_preparation',
ADD COLUMN IF NOT EXISTS source_document_url text,
ADD COLUMN IF NOT EXISTS template_id uuid REFERENCES document_templates(id),
ADD COLUMN IF NOT EXISTS custom_fields jsonb DEFAULT '{}';