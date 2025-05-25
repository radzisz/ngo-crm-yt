/*
  # Update development user credentials

  1. Changes
    - Update development user email and password
*/

-- Update development user in auth.users
UPDATE auth.users
SET
  email = 'radzisz+1@gmail.com',
  encrypted_password = crypt('password', gen_salt('bf')),
  email_confirmed_at = now(),
  raw_user_meta_data = jsonb_build_object(
    'full_name', 'Development User',
    'avatar_url', 'https://ui-avatars.com/api/?name=Development+User'
  )
WHERE id = '00000000-0000-0000-0000-000000000000';

-- Ensure admin role is assigned
INSERT INTO user_roles (user_id, role_id)
VALUES ('00000000-0000-0000-0000-000000000000', 'admin')
ON CONFLICT (user_id, role_id) DO NOTHING;