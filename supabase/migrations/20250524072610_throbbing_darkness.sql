/*
  # Add document templates table

  1. New Tables
    - `document_templates`
      - `id` (uuid, primary key)
      - `name` (text)
      - `type` (enum: contract, receipt)
      - `url` (text)
      - `is_active` (boolean)
      - `required_variables` (text array)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS
    - Add policies for authenticated users
*/

-- Create document type enum
CREATE TYPE document_type AS ENUM ('contract', 'receipt');

-- Create document_templates table
CREATE TABLE IF NOT EXISTS document_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type document_type NOT NULL,
  url text NOT NULL,
  is_active boolean DEFAULT true,
  required_variables text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE document_templates ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Document templates are viewable by authenticated users"
  ON document_templates
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only admins can modify document templates"
  ON document_templates
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role_id = 'admin'
    )
  );

-- Create updated_at trigger
CREATE TRIGGER update_document_templates_updated_at
  BEFORE UPDATE ON document_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();