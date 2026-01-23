-- ==========================================
-- 1. MISSING TABLES (Idempotent Script)
-- ==========================================

-- TICKETS
create table if not exists tickets (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  subject text not null,
  description text not null,
  priority text default 'normal', -- low, normal, high
  status text default 'open', -- open, in_progress, closed
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table tickets enable row level security;

drop policy if exists "Users can view own tickets" on tickets;
create policy "Users can view own tickets" on tickets for select using (auth.uid() = user_id);

drop policy if exists "Users can insert own tickets" on tickets;
create policy "Users can insert own tickets" on tickets for insert with check (auth.uid() = user_id);

drop policy if exists "Admins can view all tickets" on tickets;
create policy "Admins can view all tickets" on tickets for select using (exists (select 1 from profiles where profiles.id = auth.uid() and profiles.role = 'admin'));

drop policy if exists "Admins can update tickets" on tickets;
create policy "Admins can update tickets" on tickets for update using (exists (select 1 from profiles where profiles.id = auth.uid() and profiles.role = 'admin'));

-- TICKET MESSAGES
create table if not exists ticket_messages (
  id uuid default gen_random_uuid() primary key,
  ticket_id uuid references tickets on delete cascade not null,
  sender_id uuid references auth.users not null,
  message text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table ticket_messages enable row level security;

drop policy if exists "Users can view messages for own tickets" on ticket_messages;
create policy "Users can view messages for own tickets" on ticket_messages for select using (exists (select 1 from tickets where tickets.id = ticket_messages.ticket_id and tickets.user_id = auth.uid()));

drop policy if exists "Admins can view all ticket messages" on ticket_messages;
create policy "Admins can view all ticket messages" on ticket_messages for select using (exists (select 1 from profiles where profiles.id = auth.uid() and profiles.role = 'admin'));

drop policy if exists "Users can insert messages to own tickets" on ticket_messages;
create policy "Users can insert messages to own tickets" on ticket_messages for insert with check (exists (select 1 from tickets where tickets.id = ticket_messages.ticket_id and tickets.user_id = auth.uid()));

drop policy if exists "Admins can insert ticket messages" on ticket_messages;
create policy "Admins can insert ticket messages" on ticket_messages for insert with check (exists (select 1 from profiles where profiles.id = auth.uid() and profiles.role = 'admin'));

-- COUPONS
create table if not exists coupons (
  id uuid default gen_random_uuid() primary key,
  code text unique not null,
  discount_value numeric not null,
  discount_type text not null, -- 'fixed' or 'percentage'
  max_uses int,
  times_used int default 0,
  expires_at timestamp with time zone,
  is_active boolean default true,
  created_by uuid references auth.users,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table coupons enable row level security;

drop policy if exists "Public can view active coupons" on coupons;
create policy "Public can view active coupons" on coupons for select using (true);

drop policy if exists "Admins can manage coupons" on coupons;
create policy "Admins can manage coupons" on coupons for all using (exists (select 1 from profiles where profiles.id = auth.uid() and profiles.role = 'admin'));

-- REVIEWS
create table if not exists reviews (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  product_id text not null, -- Sanity ID
  rating int check (rating >= 1 and rating <= 5),
  title text,
  content text,
  status text default 'pending', -- pending, published, rejected
  admin_reply text,
  reply_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table reviews enable row level security;

drop policy if exists "Public can view published reviews" on reviews;
create policy "Public can view published reviews" on reviews for select using (status = 'published');

drop policy if exists "Users can insert own reviews" on reviews;
create policy "Users can insert own reviews" on reviews for insert with check (auth.uid() = user_id);

drop policy if exists "Admins can manage reviews" on reviews;
create policy "Admins can manage reviews" on reviews for all using (exists (select 1 from profiles where profiles.id = auth.uid() and profiles.role = 'admin'));

-- ORDER AUDIT LOGS
create table if not exists order_audit_logs (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references orders on delete cascade not null,
  action text not null,
  performed_by uuid references auth.users,
  metadata jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table order_audit_logs enable row level security;

drop policy if exists "Admins can view audit logs" on order_audit_logs;
create policy "Admins can view audit logs" on order_audit_logs for select using (exists (select 1 from profiles where profiles.id = auth.uid() and profiles.role = 'admin'));

drop policy if exists "System/Admins can insert audit logs" on order_audit_logs;
create policy "System/Admins can insert audit logs" on order_audit_logs for insert with check (true);


-- ==========================================
-- 2. NEW ENHANCED TABLES
-- ==========================================

-- SUBSCRIPTIONS
create table if not exists subscriptions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  stripe_subscription_id text unique,
  plan_id text not null, -- Sanity ID of the plan
  status text not null, -- active, trialing, past_due, canceled, incomplete, incomplete_expired, unpaid
  current_period_start timestamp with time zone,
  current_period_end timestamp with time zone,
  cancel_at_period_end boolean default false,
  canceled_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table subscriptions enable row level security;

drop policy if exists "Users can view own subscriptions" on subscriptions;
create policy "Users can view own subscriptions" on subscriptions for select using (auth.uid() = user_id);

drop policy if exists "Admins can view all subscriptions" on subscriptions;
create policy "Admins can view all subscriptions" on subscriptions for select using (exists (select 1 from profiles where profiles.id = auth.uid() and profiles.role = 'admin'));

-- ORDER ITEMS
create table if not exists order_items (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references orders on delete cascade not null,
  product_type text not null, -- 'plan' or 'product'
  product_id text not null, -- Sanity Document ID
  name text not null, -- Snapshot: Product Name at time of purchase
  quantity int default 1 not null,
  price numeric not null, -- Snapshot: Unit Price at time of purchase
  total numeric not null, -- quantity * price (verified by server)
  metadata jsonb, -- { "color": "red", "period": "12-months" } etc
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table order_items enable row level security;

drop policy if exists "Users can view own order items" on order_items;
create policy "Users can view own order items" on order_items for select using (exists (select 1 from orders where orders.id = order_items.order_id and orders.user_id = auth.uid()));

drop policy if exists "Admins can view all order items" on order_items;
create policy "Admins can view all order items" on order_items for select using (exists (select 1 from profiles where profiles.id = auth.uid() and profiles.role = 'admin'));

drop policy if exists "Admins/System can insert order items" on order_items;
create policy "Admins/System can insert order items" on order_items for insert with check (true);

