-- ==============================================================================
-- Database Restructuring & Reviews System Migration
-- ==============================================================================

-- 1. Helper Function for Role Checks (Safe from Recursion)
-- Re-defining to ensure it exists and is correct for the new structure.
create or replace function public.get_my_role()
returns text
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Look in profiles (Team) first
  return (select role from public.profiles where id = auth.uid());
end;
$$;
grant execute on function public.get_my_role to authenticated;


-- ==========================================
-- 2. User Tables Restructuring
-- ==========================================

-- A. MEMBERS (Registered Users)
create table if not exists public.members (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  full_name text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.members enable row level security;

create policy "Users manage own member profile" on public.members
  for all using (auth.uid() = id);

create policy "Admins manage all members" on public.members
  for all using (get_my_role() in ('admin', 'super_admin', 'support'));


-- B. CUSTOMERS (Buyers - Extension of Members)
create table if not exists public.customers (
  id uuid references public.members(id) on delete cascade primary key,
  total_spend numeric default 0,
  last_purchase_at timestamp with time zone,
  status text default 'active', -- active, banned, etc.
  created_at timestamp with time zone default now()
);

alter table public.customers enable row level security;

create policy "Customers read own data" on public.customers
  for select using (auth.uid() = id);

create policy "Admins manage all customers" on public.customers
  for all using (get_my_role() in ('admin', 'super_admin', 'support'));


-- C. SUBSCRIBERS (Newsletter)
create table if not exists public.subscribers (
  email text primary key,
  is_active boolean default true,
  subscribed_at timestamp with time zone default now()
);

alter table public.subscribers enable row level security;

create policy "Anyone can subscribe" on public.subscribers
  for insert with check (true);

create policy "Admins manage subscribers" on public.subscribers
  for all using (get_my_role() in ('admin', 'super_admin', 'manager'));


-- ==========================================
-- 3. Migration Logic (If data exists)
-- ==========================================
-- Move existing 'customers' from profiles to members
DO $$ 
BEGIN
  -- Insert into members from profiles if not already there
  INSERT INTO public.members (id, email, full_name, created_at)
  SELECT id, email, full_name, created_at 
  FROM public.profiles 
  WHERE role = 'user' OR role = 'customer' OR role IS NULL
  ON CONFLICT (id) DO NOTHING;
  
  -- Create entry in customers for those who were 'customer' role? 
  -- (Assuming 'customer' role implied purchase history, if not, skip)
  
  -- Delete non-team users from profiles
  DELETE FROM public.profiles 
  WHERE role = 'user' OR role = 'customer' OR role IS NULL;
END $$;


-- ==========================================
-- 4. Reviews System
-- ==========================================

create type review_status as enum ('pending', 'published', 'rejected');

create table if not exists public.reviews (
  id uuid default gen_random_uuid() primary key,
  product_id text not null, -- Sanity ID or internal ID
  user_id uuid references public.customers(id) not null, -- Only customers can review
  rating integer check (rating >= 1 and rating <= 5) not null,
  title text,
  content text,
  status review_status default 'pending',
  admin_reply text,
  reply_at timestamp with time zone,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.reviews enable row level security;

-- Policies

-- A. Public (Read Published)
create policy "Public read published reviews" on public.reviews
  for select using (status = 'published');

-- B. Customers (Create & Read Own)
create policy "Customers create reviews" on public.reviews
  for insert with check (
    auth.uid() = user_id AND
    exists (select 1 from public.customers where id = auth.uid()) -- Double check
  );

create policy "Customers read own reviews" on public.reviews
  for select using (auth.uid() = user_id);

-- C. Admins (Manage All)
create policy "Admins manage reviews" on public.reviews
  for all using (get_my_role() in ('admin', 'super_admin', 'support'));

