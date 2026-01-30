
-- 1. FORCE CLEANUP of Policies
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;
DROP POLICY IF EXISTS "Users view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins view all profiles" ON public.profiles;

-- 2. CREATE NON-RECURSIVE POLICIES
-- Users can see their own profile
CREATE POLICY "Users view own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

-- Admins can view ALL profiles (Check JWT Metadata OR Service Role)
CREATE POLICY "Admins view all profiles" 
ON public.profiles 
FOR SELECT 
USING (
  (auth.jwt() -> 'user_metadata' ->> 'role') IN ('admin', 'super_admin') OR
  auth.role() = 'service_role'
);

-- 3. SYNC ROLES TO USER METADATA
-- This ensures the role is available in the JWT, allowing middleware to skip DB calls.
UPDATE auth.users
SET raw_user_meta_data = 
  COALESCE(raw_user_meta_data, '{}'::jsonb) || 
  jsonb_build_object('role', profiles.role)
FROM public.profiles
WHERE auth.users.id = profiles.id
AND (auth.users.raw_user_meta_data->>'role') IS DISTINCT FROM (profiles.role::text);

-- 4. Reload Schema
NOTIFY pgrst, 'reload config';
