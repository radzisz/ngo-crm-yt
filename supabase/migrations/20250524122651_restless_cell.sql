/*
  # Fix user_roles policies recursion

  1. Changes
    - Remove recursive policies from user_roles table
    - Create new non-recursive policies for user_roles table
    
  2. Security
    - Enable RLS on user_roles table (already enabled)
    - Add policy for admins to manage all roles
    - Add policy for users to read their own roles
    - Policies are simplified to avoid recursion
*/

-- Drop existing policies to recreate them
DROP POLICY IF EXISTS "Admins can manage all roles" ON user_roles;
DROP POLICY IF EXISTS "Users can read their own role" ON user_roles;

-- Create new non-recursive policies
CREATE POLICY "Admins can manage all roles"
ON user_roles
FOR ALL
TO authenticated
USING (
  role_id = 'admin'
  AND user_id = auth.uid()
)
WITH CHECK (
  role_id = 'admin'
  AND user_id = auth.uid()
);

CREATE POLICY "Users can read their own role"
ON user_roles
FOR SELECT
TO authenticated
USING (
  user_id = auth.uid()
);