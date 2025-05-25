/*
  # Update development user authentication details

  1. Changes
    - Set aud claim to 'authenticated' for development user
    - Update role to 'authenticated' in auth.users
*/

-- Update development user in auth.users
UPDATE auth.users
SET
  aud = 'authenticated',
  role = 'authenticated',
  email_confirmed_at = now(),
  last_sign_in_at = now(),
  is_sso_user = false,
  email_change_confirm_status = 0,
  email = 'radzisz+1@gmail.com',
  raw_user_meta_data = jsonb_build_object(
    'name', 'Development User',
    'picture', 'https://i.pravatar.cc/150?u=dev'
  )
WHERE id = '00000000-0000-0000-0000-000000000000';

-- Ensure admin role is assigned
INSERT INTO user_roles (user_id, role_id)
VALUES ('00000000-0000-0000-0000-000000000000', 'admin')
ON CONFLICT (user_id, role_id) DO NOTHING;