-- admin.sql
-- ---------------------------------------------------
-- Script to create (or upsert) the admin user and profile for Supabase.
-- Safe to run repeatedly.
-- ---------------------------------------------------

-- Enable pgcrypto for bcrypt password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1️⃣ Upsert the auth user (email is unique in auth.users)
WITH upsert_user AS (
  INSERT INTO auth.users (
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
    updated_at        = now()
  RETURNING id
)
-- 2️⃣ Upsert the profile row with role = 'ADMIN'
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
FROM upsert_user
ON CONFLICT (id) DO UPDATE SET
  role       = EXCLUDED.role,
  full_name  = EXCLUDED.full_name,
  updated_at = now();

-- End of admin.sql