/*
  # Fix RLS policies for user roles and document templates

  1. Changes
    - Add policy for users to read their own role
    - Add policy for admins to read all user roles
    - Add policy for admins to manage document templates
    - Add policy for authenticated users to read document templates

  2. Security
    - Ensures users can only read their own role
    - Ensures admins can manage all roles and templates
    - Ensures all authenticated users can read templates
*/

-- Drop existing policies that might conflict
DROP POLICY IF EXISTS "Only admins can modify user roles" ON user_roles;
DROP POLICY IF EXISTS "Only admins can modify document templates" ON document_templates;
DROP POLICY IF EXISTS "Document templates are viewable by authenticated users" ON document_templates;

-- Add policies for user_roles table
CREATE POLICY "Users can read their own role"
  ON user_roles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
  ON user_roles
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role_id = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role_id = 'admin'
    )
  );

-- Add policies for document_templates table
CREATE POLICY "Admins can manage templates"
  ON document_templates
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role_id = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role_id = 'admin'
    )
  );

CREATE POLICY "Templates are viewable by authenticated users"
  ON document_templates
  FOR SELECT
  TO authenticated
  USING (true);