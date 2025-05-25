/*
  # Add development user with admin role

  1. Changes
    - Add development user to auth.users
    - Grant admin role to development user
    - Set development user password
*/

-- Insert development user into auth.users if not exists
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_user_meta_data
)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  'dev@example.com',
  -- Password is 'development'
  crypt('development', gen_salt('bf')),
  now(),
  jsonb_build_object(
    'full_name', 'Development User',
    'avatar_url', 'https://ui-avatars.com/api/?name=Development+User'
  )
)
ON CONFLICT (id) DO UPDATE
SET
  email = EXCLUDED.email,
  encrypted_password = EXCLUDED.encrypted_password,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  raw_user_meta_data = EXCLUDED.raw_user_meta_data;

-- Assign admin role to development user
INSERT INTO user_roles (user_id, role_id)
VALUES ('00000000-0000-0000-0000-000000000000', 'admin')
ON CONFLICT (user_id, role_id) DO NOTHING;