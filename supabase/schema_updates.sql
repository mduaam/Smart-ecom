-- ==========================================
-- 1. Marketing & Coupons System
-- ==========================================

DO $$ BEGIN
    CREATE TYPE discount_type AS ENUM ('percentage', 'fixed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

create table if not exists public.coupons (
  id uuid default gen_random_uuid() primary key,
  code text not null unique,
  description text,
  discount_type discount_type not null,
  discount_value numeric not null,
  min_purchase_amount numeric default 0,
  max_uses integer default null,
  used_count integer default 0,
  starts_at timestamp with time zone default now(),
  expires_at timestamp with time zone default null,
  is_active boolean default true,
  created_by uuid references auth.users(id),
  created_at timestamp with time zone default now()
);

-- RLS for Coupons
alter table public.coupons enable row level security;
-- Drop policies to avoid duplicates before recreating
drop policy if exists "Admins can manage coupons" on public.coupons;
create policy "Admins can manage coupons" on public.coupons
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'super_admin'))
  );

drop policy if exists "Users can read valid coupons" on public.coupons;
create policy "Users can read valid coupons" on public.coupons
  for select using (is_active = true);


-- ==========================================
-- 2. CRM & Support Ticket System (Offline)
-- ==========================================
DO $$ BEGIN
    CREATE TYPE ticket_status AS ENUM ('open', 'in_progress', 'resolved', 'closed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE ticket_priority AS ENUM ('low', 'medium', 'high', 'urgent');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

create table if not exists public.tickets (
  id uuid default gen_random_uuid() primary key,
  subject text not null,
  description text,
  user_id uuid references auth.users(id) not null,
  assigned_to uuid references auth.users(id),
  status ticket_status default 'open',
  priority ticket_priority default 'medium',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create table if not exists public.ticket_messages (
  id uuid default gen_random_uuid() primary key,
  ticket_id uuid references public.tickets(id) on delete cascade not null,
  sender_id uuid references auth.users(id) not null,
  message text not null,
  is_internal boolean default false,
  created_at timestamp with time zone default now(),
  attachments text[]
);

-- RLS for Tickets
alter table public.tickets enable row level security;
alter table public.ticket_messages enable row level security;

drop policy if exists "Users manage own tickets" on public.tickets;
create policy "Users manage own tickets" on public.tickets
  for all using (auth.uid() = user_id);

drop policy if exists "Admins manage all tickets" on public.tickets;
create policy "Admins manage all tickets" on public.tickets
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'support', 'super_admin'))
  );

drop policy if exists "Users read own ticket messages" on public.ticket_messages;
create policy "Users read own ticket messages" on public.ticket_messages
  for select using (
    exists (select 1 from public.tickets where id = ticket_id and user_id = auth.uid()) 
    and is_internal = false
  );
  
drop policy if exists "Users send messages to own tickets" on public.ticket_messages;
create policy "Users send messages to own tickets" on public.ticket_messages
  for insert with check (
    exists (select 1 from public.tickets where id = ticket_id and user_id = auth.uid())
  );

drop policy if exists "Admins manage messages" on public.ticket_messages;
create policy "Admins manage messages" on public.ticket_messages
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'support', 'super_admin'))
  );


-- ==========================================
-- 3. Live Chat System (Realtime)
-- ==========================================
create table if not exists public.chat_conversations (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) not null,
  status text default 'active',
  last_message_at timestamp with time zone default now(),
  created_at timestamp with time zone default now()
);

create table if not exists public.chat_messages (
  id uuid default gen_random_uuid() primary key,
  conversation_id uuid references public.chat_conversations(id) on delete cascade not null,
  sender_id uuid references auth.users(id),
  content text not null,
  is_admin_reply boolean default false,
  read_at timestamp with time zone,
  created_at timestamp with time zone default now()
);

-- RLS for Chat
alter table public.chat_conversations enable row level security;
alter table public.chat_messages enable row level security;


-- ==========================================
-- 4. Order Audit Logs (Security & Activity)
-- ==========================================
create table if not exists public.order_audit_logs (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references public.orders(id) on delete cascade,
  action text not null,
  performed_by uuid references auth.users(id),
  metadata jsonb,
  created_at timestamp with time zone default now()
);

alter table public.order_audit_logs enable row level security;
drop policy if exists "Admins view audit logs" on public.order_audit_logs;
create policy "Admins view audit logs" on public.order_audit_logs
  for select using (
     exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'super_admin'))
  );
