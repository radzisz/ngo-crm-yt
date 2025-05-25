/*
  # Add demo user as admin

  1. Changes
    - Insert demo user into auth.users if not exists
    - Add admin role for demo user in user_roles table
*/

-- First ensure the demo user exists in auth.users
INSERT INTO auth.users (id, email, raw_user_meta_data)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  'demo@example.com',
  jsonb_build_object(
    'name', 'Demo User',
    'picture', 'https://i.pravatar.cc/150?u=demo'
  )
)
ON CONFLICT (id) DO NOTHING;

-- Then assign admin role to demo user
INSERT INTO user_roles (user_id, role_id)
VALUES ('00000000-0000-0000-0000-000000000000', 'admin')
ON CONFLICT (user_id, role_id) DO NOTHING;