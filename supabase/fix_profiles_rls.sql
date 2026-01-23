-- Enable RLS on profiles (if not already)
alter table public.profiles enable row level security;

-- 1. Allow users to read their OWN profile
drop policy if exists "Users view own profile" on public.profiles;
create policy "Users view own profile" 
on public.profiles 
for select 
using (auth.uid() = id);

-- 2. Allow Admins (via Service Role or recursive check) to view all profiles
-- Note: Service Role bypasses RLS, so this is for logged-in admin users reading via client
drop policy if exists "Admins view all profiles" on public.profiles;
create policy "Admins view all profiles" 
on public.profiles 
for select 
using (
  exists (
    select 1 from public.profiles
    where profiles.id = auth.uid() 
    and profiles.role in ('admin', 'super_admin')
  )
);
