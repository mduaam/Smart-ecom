-- 1. Ensure the user is DEFINITELY a super_admin
update public.profiles
set role = 'super_admin'
where email = 'ouazzanitopo@gmail.com';

-- 2. RESET RLS Policies on profiles to be 100% sure
alter table public.profiles enable row level security;

-- Drop any potential existing policies to avoid conflicts
drop policy if exists "Users view own profile" on public.profiles;
drop policy if exists "Admins view all profiles" on public.profiles;
drop policy if exists "Public profiles are viewable by everyone" on public.profiles;
drop policy if exists "Users can insert their own profile" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;

-- 3. Re-create the simple, correct policies

-- A. Users can read their own profile (Critical for getProfile)
create policy "Users view own profile" 
on public.profiles 
for select 
using (auth.uid() = id);

-- B. Admins (anyone in profiles) can view ALL profiles (for Team List)
create policy "Admins view all profiles" 
on public.profiles 
for select 
using (
  exists (
    select 1 from public.profiles
    where profiles.id = auth.uid()
  )
);

-- C. Allow Updating Own Profile (optional but good)
create policy "Users update own profile" 
on public.profiles 
for update
using (auth.uid() = id);
