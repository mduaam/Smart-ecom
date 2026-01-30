
-- 1. Reset RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 2. Drop the problematic recursive policies
DROP POLICY IF EXISTS "Users view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins view all profiles" ON public.profiles;

-- 3. Create non-recursive policies

-- Non-recursive: Users can always see their own row
CREATE POLICY "Users view own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

-- Non-recursive: Admins can view ALL profiles 
-- (We use the user_metadata in the JWT to check role without querying the profile table itself)
CREATE POLICY "Admins view all profiles" 
ON public.profiles 
FOR SELECT 
USING (
  (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin' OR 
  (auth.jwt() -> 'user_metadata' ->> 'role') = 'super_admin'
);

-- 4. Ensure existing admins have the role in their metadata for the JWT check to work
-- (This happens automatically on next login if the signup trigger is correct)
-- For the super admin, let's make sure:
UPDATE public.profiles SET role = 'super_admin' WHERE email = 'ouazzanitopo@gmail.com';
