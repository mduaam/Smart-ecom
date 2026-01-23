-- Fix relationships to allow Joins

-- 1. Ensure orders.user_id points to public.profiles(id)
-- This is necessary for .select('*, profiles:user_id(...)') to work.
alter table public.orders
drop constraint if exists orders_user_id_fkey;

alter table public.orders
add constraint orders_user_id_fkey
foreign key (user_id)
references public.profiles(id)
on delete set null;

-- 2. Ensure order_items.order_id points to public.orders(id)
alter table public.order_items
drop constraint if exists order_items_order_id_fkey;

alter table public.order_items
add constraint order_items_order_id_fkey
foreign key (order_id)
references public.orders(id)
on delete cascade;

-- 3. Refresh schema cache
NOTIFY pgrst, 'reload config';
