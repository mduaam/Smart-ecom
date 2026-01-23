
-- Create order_notes table
create table if not exists public.order_notes (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete cascade not null,
  admin_id uuid references public.members(id) on delete set null,
  content text not null,
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.order_notes enable row level security;

-- Policies
create policy "Admins can view all notes"
on public.order_notes for select
using (
  auth.jwt() ->> 'role' = 'service_role' 
  or 
  exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'super_admin'))
);

create policy "Admins can insert notes"
on public.order_notes for insert
with check (
  auth.jwt() ->> 'role' = 'service_role' 
  or 
  exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'super_admin'))
);

create policy "Admins can delete notes"
on public.order_notes for delete
using (
  auth.jwt() ->> 'role' = 'service_role' 
  or 
  exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'super_admin'))
);
