-- admin.sql
-- ---------------------------------------------------
-- Script to create an admin user for the Supabase instance
-- This is intended for local development / testing.
-- It creates a user in the Supabase auth schema and a corresponding
-- entry in the public.profiles table with role = 'ADMIN'.
-- ---------------------------------------------------

-- Ensure the pgcrypto extension is available for password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Insert (or update) the admin user in the Supabase auth.users table.
-- The password is stored using the bcrypt algorithm via `crypt`.
-- If the user already exists (same email), we simply ensure the password
-- is set to the expected value and mark the email as confirmed.
WITH new_user AS (
  INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_app_meta_data,
    raw_user_meta_data
  )
  VALUES (
    gen_random_uuid(),
    (SELECT id FROM auth.instances LIMIT 1),
    'admin@admin.com',
    crypt('admin123', gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"full_name":"Admin"}'::jsonb
  )
  ON CONFLICT (email) DO UPDATE SET
    encrypted_password = EXCLUDED.encrypted_password,
    email_confirmed_at = EXCLUDED.email_confirmed_at,
    updated_at = now()
  RETURNING id
)
-- Ensure a corresponding profile exists with role = 'ADMIN'.
INSERT INTO public.profiles (
  id,
  role,
  full_name,
  created_at,
  updated_at
)
SELECT
  id,
  'ADMIN'::user_role,
  'Admin' AS full_name,
  now(),
  now()
FROM new_user
ON CONFLICT (id) DO UPDATE SET
  role = EXCLUDED.role,
  full_name = EXCLUDED.full_name,
  updated_at = now();

-- Optional: Grant the admin role permission explicitly if needed.
-- (Supabase policies typically reference the role column already.)

-- End of admin.sql