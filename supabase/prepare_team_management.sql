-- 1. Promote Jason to Super Admin (Owner) and ensure he is in profiles
update public.profiles
set role = 'super_admin'
where email = 'jasonhomehome@gmail.com';

-- 2. Create Audit Logs table for tracking team changes
create table if not exists public.admin_logs (
  id uuid default gen_random_uuid() primary key,
  admin_id uuid references public.profiles(id),
  action text not null, -- 'invite', 'delete', 'update_role'
  target_email text,
  details jsonb,
  created_at timestamptz default now()
);

-- Enable RLS on logs
alter table public.admin_logs enable row level security;

-- Allow Logs to be inserted by any profile (staff action)
create policy "Staff insert logs" on public.admin_logs
  for insert with check (
    exists (select 1 from public.profiles where id = auth.uid())
  );

-- Allow Admins to view logs
create policy "Admins view logs" on public.admin_logs
  for select using (
    exists (select 1 from public.profiles where id = auth.uid())
  );
