/*
  # Add contracts table
  
  1. New Tables
    - `contracts`
      - `id` (uuid, primary key)
      - `person_id` (uuid, foreign key to persons)
      - `start_date` (date, defaults to current date)
      - `end_date` (date)
      - `description` (text)
      - `status` (text, enum of contract statuses)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
  
  2. Security
    - Enable RLS on contracts table
    - Add policies for authenticated users
*/

-- Create enum for contract status
CREATE TYPE contract_status AS ENUM (
  'in_progress',
  'waiting_for_signature',
  'signed'
);

-- Create contracts table
CREATE TABLE IF NOT EXISTS contracts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  person_id uuid REFERENCES persons(id) ON DELETE CASCADE,
  start_date date DEFAULT CURRENT_DATE,
  end_date date,
  description text,
  status contract_status DEFAULT 'in_progress',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Contracts are viewable by authenticated users"
  ON contracts
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only admins and accountants can modify contracts"
  ON contracts
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role_id IN ('admin', 'accountant')
    )
  );

-- Create updated_at trigger
CREATE TRIGGER update_contracts_updated_at
  BEFORE UPDATE ON contracts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();