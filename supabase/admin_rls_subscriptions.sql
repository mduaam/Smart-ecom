
-- Enable RLS on the table if not already enabled
alter table public.subscriptions enable row level security;

-- Drop existing admin policy if it exists to avoid conflicts
drop policy if exists "Enable all for admins" on public.subscriptions;

-- Create full access policy for admins (checking profiles table)
create policy "Enable all for admins"
on public.subscriptions
for all
using (
  -- Allow if service_role (server-side)
  auth.jwt() ->> 'role' = 'service_role' 
  or 
  -- Allow if user is admin in profiles table
  exists (
    select 1 from public.profiles 
    where id = auth.uid() 
    and role = 'admin'
  )
)
with check (
  -- Allow if service_role (server-side)
  auth.jwt() ->> 'role' = 'service_role' 
  or 
  -- Allow if user is admin in profiles table
  exists (
    select 1 from public.profiles 
    where id = auth.uid() 
    and role = 'admin'
  )
);
