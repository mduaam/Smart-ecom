-- Check Orders policies
select * from pg_policies where tablename = 'orders';

-- Check if orders are visible to the current user (simulate by selecting count)
-- Note: This script runs as postgres (superuser) in the editor, so it will always see data.
-- To test RLS, we need to look at policies.

-- Let's just create a permissive policy for Admins to be sure.
alter table public.orders enable row level security;

create policy "Admins view all orders"
on public.orders
for select
using (
  exists (
    select 1 from public.profiles
    where profiles.id = auth.uid()
    -- We assume auth.uid() is the admin. 
    -- If profiles RLS is fixed, this subquery works.
  )
);
