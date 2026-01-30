
-- FIX INFINITE RECURSION IN PROFILES RLS
-- The error "infinite recursion detected in policy" occurs when the "Admins view all profiles" policy
-- tries to query the 'profiles' table to check if the user is an admin.
-- We fix this by checking the JWT metadata instead, which avoids querying the table itself.

-- 1. Drop the problematic recursive policies
DROP POLICY IF EXISTS "Admins view all profiles" ON public.profiles;

-- 2. Create the Non-Recursive Policy
-- This checks 'role' directly from the auth token's user_metadata, breaking the loop.
CREATE POLICY "Admins view all profiles" 
ON public.profiles 
FOR SELECT 
USING (
  (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin' OR 
  (auth.jwt() -> 'user_metadata' ->> 'role') = 'super_admin' OR
  auth.role() = 'service_role'
);

-- 3. Also ensure users can view their own profile (this was likely fine, but good to be safe)
DROP POLICY IF EXISTS "Users view own profile" ON public.profiles;
CREATE POLICY "Users view own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

-- 4. Notify to reload the schema cache
NOTIFY pgrst, 'reload config';
