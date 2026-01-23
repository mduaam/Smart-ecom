
-- Create a secure function to check admin status
-- SECURITY DEFINER ensures it runs with owner privileges, bypassing RLS on profiles table
create or replace function public.is_admin()
returns boolean
language plpgsql
security definer
as $$
begin
  return exists (
    select 1 from public.profiles
    where id = auth.uid() 
    and role in ('admin', 'super_admin')
  );
end;
$$;

-- Enable RLS
alter table public.subscriptions enable row level security;

-- Drop old policies to be clean
drop policy if exists "Enable all for admins" on public.subscriptions;
drop policy if exists "Allow admins" on public.subscriptions;

-- Create the new robust policy
create policy "Enable all for admins"
on public.subscriptions
for all
using (
  auth.jwt() ->> 'role' = 'service_role' 
  or 
  public.is_admin()
)
with check (
  auth.jwt() ->> 'role' = 'service_role' 
  or 
  public.is_admin()
);
