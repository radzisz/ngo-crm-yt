/*
  # Add insert policy for persons table

  1. Security Changes
    - Add RLS policy to allow admins and accountants to insert new persons
    - This aligns with existing policies that allow these roles to modify persons
*/

CREATE POLICY "Only admins and accountants can insert persons"
ON public.persons
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role_id = ANY (ARRAY['admin'::text, 'accountant'::text])
  )
);