/*
  # Mark development user as authenticated

  1. Changes
    - Update development user authentication status
    - Ensure admin role is assigned
*/

-- Update development user in auth.users
UPDATE auth.users
SET
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