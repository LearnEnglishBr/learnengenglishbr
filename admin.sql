-- admin.sql
-- ---------------------------------------------------
-- Script to create (or upsert) the admin user and profile
-- for Supabase.  It works even if the email column is not a
-- unique constraint (as is the case in Supabase's auth.users).
-- ---------------------------------------------------

-- Enable pgcrypto for password hashing (bcrypt via crypt)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

/*
  1️⃣ Upsert the auth user.
     We look for an existing user by email, fetch its id (if any),
     then INSERT a new row using that id (or a fresh UUID).  The
     ON CONFLICT clause works on the primary‑key column `id`.
*/
WITH existing_user AS (
  SELECT id FROM auth.users WHERE email = 'admin@admin.com'
), upsert_user AS (
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
  SELECT
    COALESCE((SELECT id FROM existing_user), gen_random_uuid()) AS id,
    (SELECT id FROM auth.instances LIMIT 1)                AS instance_id,
    'admin@admin.com'                                      AS email,
    crypt('admin123', gen_salt('bf'))                      AS encrypted_password,
    now()                                                 AS email_confirmed_at,
    now()                                                 AS created_at,
    now()                                                 AS updated_at,
    '{"provider":"email","providers":["email"]}'::jsonb AS raw_app_meta_data,
    '{"full_name":"Admin"}'::jsonb                     AS raw_user_meta_data
  ON CONFLICT (id) DO UPDATE SET
    encrypted_password = EXCLUDED.encrypted_password,
    email_confirmed_at = EXCLUDED.email_confirmed_at,
    updated_at        = now()
  RETURNING id
)
/*
  2️⃣ Ensure a profile row exists with role = 'ADMIN'.
     The primary key of profiles is also `id`, so we can upsert
     using the same id returned from the previous CTE.
*/
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
  now()   AS created_at,
  now()   AS updated_at
FROM upsert_user
ON CONFLICT (id) DO UPDATE SET
  role       = EXCLUDED.role,
  full_name  = EXCLUDED.full_name,
  updated_at = now();

-- End of admin.sql