-- Rebuild Orders Schema
-- This script drops existing orders/items tables and recreates them with a cleaner schema.

-- 1. Drop existing tables
drop table if exists public.order_items cascade;
drop table if exists public.orders cascade;
-- function handle_paid_order should exist from previous steps, but we can recreate to be safe if needed.
-- We will assume it's there or just recreate the trigger.

-- 2. Create Orders Table
create table public.orders (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete set null, -- Nullable for guest checkout
  guest_email text,
  total_amount numeric not null default 0,
  currency text default 'USD',
  status text default 'pending', -- General status
  payment_status text default 'unpaid' check (payment_status in ('paid', 'unpaid', 'refunded')),
  fulfillment_status text default 'pending' check (fulfillment_status in ('pending', 'active', 'shipped', 'cancelled')),
  coupon_code text,
  internal_notes text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Create Order Items Table
create table public.order_items (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references public.orders(id) on delete cascade not null,
  product_id text not null,
  name text not null,
  price numeric not null,
  quantity int default 1,
  total numeric not null -- stored total for line item
);

-- 4. Enable RLS
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- Policies for Orders
create policy "Admins view all orders" on public.orders for select using (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'super_admin'))
);
create policy "Admins manage orders" on public.orders for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'super_admin'))
);
create policy "Users view own orders" on public.orders for select using (
  auth.uid() = user_id
);

-- Policies for Items
create policy "Admins view all items" on public.order_items for select using (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'super_admin'))
);
create policy "Admins manage items" on public.order_items for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'super_admin'))
);
create policy "Users view own items" on public.order_items for select using (
  exists (select 1 from public.orders where public.orders.id = public.order_items.order_id and public.orders.user_id = auth.uid())
);

-- 5. Re-attach Trigger for Customers Table
-- Ensure the function exists (it should from fix_customers_schema.sql)
-- If it doesn't, this creation of trigger might fail if function is missing?
-- Let's be safe and re-define the trigger just in case, but usually we don't need to re-define function.
-- But wait, if we are assuming "Clean Slate" mentally, maybe we should Ensure function exists?
-- The previous step fixed it. Let's just create trigger.

drop trigger if exists on_order_paid on public.orders;
create trigger on_order_paid
  after insert or update on public.orders
  for each row
  execute procedure public.handle_paid_order();
