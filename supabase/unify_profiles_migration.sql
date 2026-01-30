
-- ==========================================================
-- ARCHITECTURAL REFACTOR: UNIFIED PROFILES
-- Migrates 'members' into 'profiles' for a single source of truth
-- ==========================================================

-- 1. Add missing customer-specific columns to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS notes TEXT,
ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'inactive',
ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- 2. Migrate data from members to profiles
-- Only insert if the ID doesn't already exist in profiles
INSERT INTO public.profiles (id, email, full_name, phone, notes, subscription_status, created_at, updated_at, role)
SELECT 
    m.id, 
    m.email, 
    m.full_name, 
    m.phone, 
    m.notes, 
    m.subscription_status, 
    m.created_at, 
    m.updated_at,
    'member' as role
FROM public.members m
ON CONFLICT (id) DO UPDATE SET
    phone = EXCLUDED.phone,
    notes = EXCLUDED.notes,
    subscription_status = EXCLUDED.subscription_status;

-- 3. Update handle_new_user trigger to be UNIFIED
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_role TEXT;
BEGIN
  -- Get role from metadata (default to 'member')
  user_role := COALESCE(new.raw_user_meta_data->>'role', 'member');

  -- Consistent insert into profiles ONLY
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    new.id, 
    new.email, 
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'), 
    user_role
  );

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Final Cleanup (Uncomment once verified)
-- DROP TABLE public.members CASCADE;

-- 5. Optimized RLS for Profiles (Non-Recursive)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users view own profile" ON public.profiles;
CREATE POLICY "Users view own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins view all profiles" ON public.profiles;
CREATE POLICY "Admins view all profiles" 
ON public.profiles 
FOR SELECT 
USING (
  (auth.jwt() -> 'user_metadata' ->> 'role') IN ('admin', 'super_admin')
);
