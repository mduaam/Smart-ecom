-- ==========================================
-- SUPER ADMIN / CLEAN SLATE SCHEMA
-- WARNING: THIS WILL DELETE ALL EXISTING DATA
-- ==========================================

-- 1. DROP EXISTING TABLES (Cleanup)
drop table if exists ticket_messages cascade;
drop table if exists tickets cascade;
drop table if exists order_audit_logs cascade;
drop table if exists order_items cascade;
drop table if exists orders cascade;
drop table if exists coupons cascade;
drop table if exists reviews cascade;
drop table if exists subscriptions cascade;
-- profiles is linked to auth.users, careful dropping it might leave auth.users 'orphaned' regarding profile data
-- but we need to recreate it to ensure constraints.
drop table if exists profiles cascade;

-- 2. CORE: USERS & ROLES
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text not null,
  full_name text,
  role text default 'user' check (role in ('user', 'admin', 'super_admin')),
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table profiles enable row level security;
-- Public profiles (read-only for basic info, strict for PII)
create policy "Public profiles are viewable by everyone" on profiles for select using (true);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

-- Trigger to create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', 'user');
  return new;
end;
$$ language plpgsql security definer;

-- Drop trigger if exists to avoid duplication error on re-run
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- 3. COMMERCE: SUBSCRIPTIONS (Stripe Sync)
create table subscriptions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  stripe_subscription_id text unique,
  plan_id text not null, -- Sanity ID
  status text not null, -- 'active', 'trialing', 'canceled', etc.
  current_period_end timestamp with time zone,
  cancel_at_period_end boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table subscriptions enable row level security;
create policy "Users view own subs" on subscriptions for select using (auth.uid() = user_id);
create policy "Admins view all subs" on subscriptions for select using (exists (select 1 from profiles where id = auth.uid() and role in ('admin', 'super_admin')));


-- 4. COMMERCE: ORDERS & ITEMS
create table orders (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete set null, -- Keep order even if user deleted? Or cascade? Set null safer for audits.
  guest_email text, -- For guest checkout if enabled
  total_amount numeric not null,
  currency text default 'USD',
  status text default 'pending', -- 'pending', 'paid', 'failed', 'refunded'
  fulfillment_status text default 'unfulfilled', -- 'unfulfilled', 'fulfilled', 'cancelled'
  payment_intent_id text,
  coupon_code text,
  metadata jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table orders enable row level security;
create policy "Users view own orders" on orders for select using (auth.uid() = user_id);
create policy "Admins view all orders" on orders for select using (exists (select 1 from profiles where id = auth.uid() and role in ('admin', 'super_admin')));
create policy "Admins insert/update orders" on orders for all using (exists (select 1 from profiles where id = auth.uid() and role in ('admin', 'super_admin')));

create table order_items (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references orders(id) on delete cascade not null,
  product_id text not null, -- Sanity ID or Custom
  product_name text not null, -- Snapshot
  quantity int default 1,
  unit_price numeric not null, -- Snapshot
  total_price numeric not null,
  metadata jsonb
);
alter table order_items enable row level security;
create policy "Users view own items" on order_items for select using (exists (select 1 from orders where orders.id = order_items.order_id and orders.user_id = auth.uid()));
create policy "Admins view all items" on order_items for select using (exists (select 1 from profiles where id = auth.uid() and role in ('admin', 'super_admin')));


-- 5. SUPPORT: TICKETS
create table tickets (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  subject text not null,
  description text,
  status text default 'open',
  priority text default 'normal',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table tickets enable row level security;
create policy "Users view/create own tickets" on tickets for all using (auth.uid() = user_id);
create policy "Admins manage tickets" on tickets for all using (exists (select 1 from profiles where id = auth.uid() and role in ('admin', 'super_admin')));

create table ticket_messages (
  id uuid default gen_random_uuid() primary key,
  ticket_id uuid references tickets(id) on delete cascade not null,
  sender_id uuid references profiles(id) not null,
  message text not null,
  is_internal boolean default false, -- For admin-only notes
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table ticket_messages enable row level security;
create policy "Users view own messages" on ticket_messages for select using (exists (select 1 from tickets where tickets.id = ticket_messages.ticket_id and tickets.user_id = auth.uid()) and is_internal = false);
create policy "Users send messages" on ticket_messages for insert with check (exists (select 1 from tickets where tickets.id = ticket_messages.ticket_id and tickets.user_id = auth.uid()));
create policy "Admins manage messages" on ticket_messages for all using (exists (select 1 from profiles where id = auth.uid() and role in ('admin', 'super_admin')));


-- 6. MARKETING: COUPONS
create table coupons (
  id uuid default gen_random_uuid() primary key,
  code text unique not null,
  discount_type text not null, -- 'percent', 'fixed'
  discount_value numeric not null,
  max_uses int,
  uses_count int default 0,
  expires_at timestamp with time zone,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table coupons enable row level security;
create policy "Admins manage coupons" on coupons for all using (exists (select 1 from profiles where id = auth.uid() and role in ('admin', 'super_admin')));
create policy "Public view active coupons" on coupons for select using (is_active = true);


-- 7. SOCIAL: REVIEWS
create table reviews (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  product_id text not null,
  rating int not null check (rating between 1 and 5),
  text text,
  status text default 'pending', -- 'pending', 'approved', 'rejected'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table reviews enable row level security;
create policy "Users create reviews" on reviews for insert with check (auth.uid() = user_id);
create policy "Public view approved" on reviews for select using (status = 'approved');
create policy "Users view own" on reviews for select using (auth.uid() = user_id);
create policy "Admins manage reviews" on reviews for all using (exists (select 1 from profiles where id = auth.uid() and role in ('admin', 'super_admin')));


-- 8. SYSTEM: AUDIT LOGS
create table order_audit_logs (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references orders(id) on delete cascade not null,
  action text not null,
  actor_id uuid references profiles(id),
  details jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table order_audit_logs enable row level security;
create policy "Admins view logs" on order_audit_logs for select using (exists (select 1 from profiles where id = auth.uid() and role in ('admin', 'super_admin')));
create policy "System logs" on order_audit_logs for insert with check (true);
