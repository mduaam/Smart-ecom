
-- Enable RLS
alter table public.order_notes enable row level security;

-- Drop insecure/broken policies
drop policy if exists "Admins can view all notes" on public.order_notes;
drop policy if exists "Admins can insert notes" on public.order_notes;
drop policy if exists "Admins can delete notes" on public.order_notes;

-- Create robust policies using the security definer function
create policy "Admins can view all notes"
on public.order_notes for select
using (
  auth.jwt() ->> 'role' = 'service_role' 
  or 
  public.is_admin()
);

create policy "Admins can insert notes"
on public.order_notes for insert
with check (
  auth.jwt() ->> 'role' = 'service_role' 
  or 
  public.is_admin()
);

create policy "Admins can delete notes"
on public.order_notes for delete
using (
  auth.jwt() ->> 'role' = 'service_role' 
  or 
  public.is_admin()
);
