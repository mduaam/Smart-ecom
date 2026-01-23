-- Fix Orders RLS (Drop first to avoid error)
alter table public.orders enable row level security;

drop policy if exists "Admins view all orders" on public.orders;

create policy "Admins view all orders"
on public.orders
for select
using (
  exists (
    select 1 from public.profiles
    where profiles.id = auth.uid()
  )
);

-- Fix Order Items RLS (Critical for viewing details/plan name)
alter table public.order_items enable row level security;

drop policy if exists "Admins view all order items" on public.order_items;

create policy "Admins view all order items"
on public.order_items
for select
using (
  exists (
    select 1 from public.profiles
    where profiles.id = auth.uid()
  )
);
