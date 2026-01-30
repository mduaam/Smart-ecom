
-- SECURE RBAC POLICIES (Fixing "Customers seeing Admin Data" vulnerability)
-- This script replaces loose policies with strict Role-Based Access Control.

-- 0. HELPER FUNCTIONS
create or replace function public.is_admin()
returns boolean
language plpgsql
security definer
as $$
begin
  return exists (
    select 1
    from public.profiles
    where id = auth.uid()
    and role in ('admin', 'super_admin')
  );
end;
$$;

-- 1. PROFILES
alter table public.profiles enable row level security;

drop policy if exists "Users view own profile" on public.profiles;
create policy "Users view own profile" 
on public.profiles for select 
using (auth.uid() = id);

drop policy if exists "Admins view all profiles" on public.profiles;
create policy "Admins view all profiles" 
on public.profiles for select 
using (is_admin());

drop policy if exists "Admins update all profiles" on public.profiles;
create policy "Admins update all profiles" 
on public.profiles for update
using (is_admin());


-- 2. ORDERS
alter table public.orders enable row level security;

drop policy if exists "Admins view all orders" on public.orders;
create policy "Admins view all orders"
on public.orders for select
using (is_admin());

drop policy if exists "Users view own orders" on public.orders;
create policy "Users view own orders"
on public.orders for select
using (
  auth.uid() = user_id
);


-- 3. ORDER ITEMS
alter table public.order_items enable row level security;

drop policy if exists "Admins view all order items" on public.order_items;
create policy "Admins view all order items"
on public.order_items for select
using (is_admin());

drop policy if exists "Users view own order items" on public.order_items;
create policy "Users view own order items"
on public.order_items for select
using (
  exists (
    select 1 from public.orders
    where orders.id = order_items.order_id
    and orders.user_id = auth.uid()
  )
);


-- 4. SUBSCRIPTIONS
alter table public.subscriptions enable row level security;

drop policy if exists "Enable all for admins" on public.subscriptions;
drop policy if exists "Admins view all subscriptions" on public.subscriptions;
create policy "Admins view all subscriptions"
on public.subscriptions for select
using (is_admin());

drop policy if exists "Users view own subscriptions" on public.subscriptions;
create policy "Users view own subscriptions"
on public.subscriptions for select
using (
  auth.uid() = user_id
);


-- 5. NOTIFICATIONS (If exists)
-- Assuming notifications table has 'user_id'
do $$
begin
  if exists (select from pg_tables where schemaname = 'public' and tablename = 'notifications') then
    alter table public.notifications enable row level security;

    drop policy if exists "Users view own notifications" on public.notifications;
    execute 'create policy "Users view own notifications" on public.notifications for select using (auth.uid() = user_id)';

    drop policy if exists "Admins view all notifications" on public.notifications;
    execute 'create policy "Admins view all notifications" on public.notifications for select using (is_admin())';
  end if;
end
$$;
