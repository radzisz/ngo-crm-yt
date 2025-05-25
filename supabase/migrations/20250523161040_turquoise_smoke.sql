/*
  # Create users and roles tables

  1. New Tables
    - `roles`
      - `id` (text, primary key)
      - `description` (text)
      - `created_at` (timestamp)
    - `user_roles`
      - `user_id` (uuid, foreign key to auth.users)
      - `role_id` (text, foreign key to roles)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for role-based access
*/

-- Create roles table
CREATE TABLE IF NOT EXISTS roles (
  id text PRIMARY KEY,
  description text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create user_roles table
CREATE TABLE IF NOT EXISTS user_roles (
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  role_id text REFERENCES roles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (user_id, role_id)
);

-- Enable RLS
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Roles are viewable by authenticated users"
  ON roles
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "User roles are viewable by authenticated users"
  ON user_roles
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only admins can modify roles"
  ON roles
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role_id = 'admin'
    )
  );

CREATE POLICY "Only admins can modify user roles"
  ON user_roles
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role_id = 'admin'
    )
  );

-- Insert default roles
INSERT INTO roles (id, description) VALUES
  ('admin', 'Full system access'),
  ('accountant', 'Access to financial features'),
  ('guest', 'Limited read-only access')
ON CONFLICT (id) DO NOTHING;