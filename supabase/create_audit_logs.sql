
-- ==========================================================
-- AUDIT LOGGING SYSTEM
-- Tracks all sensitive admin operations
-- ==========================================================

create table if not exists public.admin_activity_logs (
    id uuid primary key default gen_random_uuid(),
    admin_id uuid references auth.users(id),
    action text not null, -- e.g., 'UPDATE_SUBSCRIPTION', 'DELETE_CUSTOMER'
    entity_type text not null, -- e.g., 'subscription', 'order'
    entity_id text,
    metadata jsonb default '{}'::jsonb,
    ip_address text,
    created_at timestamptz default now()
);

-- Enable RLS
alter table public.admin_activity_logs enable row level security;

-- Only Admins can view logs
create policy "Admins can view all logs"
on public.admin_activity_logs
for select
to authenticated
using (
    exists (
        select 1 from public.profiles
        where id = auth.uid()
        and role in ('admin', 'super_admin')
    )
);

-- Internal function to log actions
create or replace function public.log_admin_action(
    p_admin_id uuid,
    p_action text,
    p_entity_type text,
    p_entity_id text,
    p_metadata jsonb default '{}'::jsonb
)
returns void as $$
begin
    insert into public.admin_activity_logs (admin_id, action, entity_type, entity_id, metadata)
    values (p_admin_id, p_action, p_entity_type, p_entity_id, p_metadata);
end;
$$ language plpgsql security definer;
