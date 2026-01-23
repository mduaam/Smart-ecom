-- Fix RLS Recursion by using a Security Definer function

-- 1. Create a secure function to check if user is an admin/staff
create or replace function public.is_staff()
returns boolean as $$
begin
  -- 'security definer' allows this function to bypass RLS when reading the table
  return exists (
    select 1 from public.profiles
    where id = auth.uid()
  );
end;
$$ language plpgsql security definer;

-- 2. Reset Policies on profiles
alter table public.profiles enable row level security;

-- Drop old potential policies
drop policy if exists "Users view own profile" on public.profiles;
drop policy if exists "Admins view all profiles" on public.profiles;
drop policy if exists "Users update own profile" on public.profiles;

-- 3. Create Clean Policies

-- A. Users can view their own profile (Simple, non-recursive)
create policy "Users view own profile" 
on public.profiles 
for select 
using (auth.uid() = id);

-- B. Staff (anyone in profiles) can view ALL profiles
-- Uses the security definer function to avoid recursion loop
create policy "Staff view all profiles" 
on public.profiles 
for select 
using (public.is_staff());

-- C. Allow Updating Own Profile
create policy "Users update own profile" 
on public.profiles 
for update
using (auth.uid() = id);
