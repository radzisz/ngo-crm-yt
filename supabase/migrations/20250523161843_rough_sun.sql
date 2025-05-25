/*
  # Create persons table

  1. New Tables
    - `persons`
      - `id` (uuid, primary key)
      - `firstName` (text)
      - `lastName` (text)
      - `email` (text)
      - `phone` (text)
      - `created_at` (timestamp with time zone)
      - `updated_at` (timestamp with time zone)

  2. Security
    - Enable RLS on `persons` table
    - Add policies for authenticated users to:
      - Read all persons
      - Create/update/delete persons if they have admin or accountant role
*/

-- Create persons table
CREATE TABLE IF NOT EXISTS persons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  firstName text NOT NULL,
  lastName text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE persons ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Persons are viewable by authenticated users"
  ON persons
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only admins and accountants can modify persons"
  ON persons
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
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_persons_updated_at
  BEFORE UPDATE ON persons
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();