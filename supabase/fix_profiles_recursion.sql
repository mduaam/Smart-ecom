-- Fix for Infinite Recursion in Profiles RLS Policies
-- Execute this in the Supabase SQL Editor

-- 1. Ensure the secure helper function exists
create or replace function public.get_my_role()
returns text
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Safe lookup that bypasses RLS because of 'security definer'
  return (select role from public.profiles where id = auth.uid());
end;
$$;

-- Grant execute to authenticated users
grant execute on function public.get_my_role to authenticated;

-- 2. Fix Policies on 'profiles' table
alter table public.profiles enable row level security;

-- Drop potentially recursive policies
drop policy if exists "Public profiles are viewable by everyone." on public.profiles;
drop policy if exists "Admins can see all profiles" on public.profiles;
drop policy if exists "Users can insert their own profile." on public.profiles;
drop policy if exists "Users can update own profile." on public.profiles;

-- Create Safe Policies

-- A. View Policies
-- Users can see their own profile
create policy "Users can see own profile" on public.profiles
  for select using (auth.uid() = id);

-- Admins can see all profiles (uses get_my_role to avoid recursion)
create policy "Admins can see all profiles" on public.profiles
  for select using (
    get_my_role() in ('admin', 'super_admin')
  );

-- B. Insert/Update Policies
-- Users can insert their own profile (e.g. during signup)
create policy "Users can insert own profile" on public.profiles
  for insert with check (auth.uid() = id);

-- Users can update own profile
create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

-- Admins can update any profile (e.g. change roles)
create policy "Admins can update any profile" on public.profiles
  for update using (
    get_my_role() in ('admin', 'super_admin')
  );
