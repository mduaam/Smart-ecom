
-- 1. Create Sequence
create sequence if not exists public.orders_order_number_seq
start with 10000
increment by 1;

-- 2. Add Column (initially nullable to allow backfill)
alter table public.orders 
add column if not exists order_number bigint;

-- 3. Backfill Existing Orders
-- Use a CTE to calculate row numbers based on created_at
with numbered_orders as (
  select id, row_number() over (order by created_at asc) as rn
  from public.orders
)
update public.orders o
set order_number = 9999 + n.rn
from numbered_orders n
where o.id = n.id
and o.order_number is null;

-- 4. Add Default Value and Constraints (after backfill)
alter table public.orders 
alter column order_number set default nextval('public.orders_order_number_seq');

-- Sync the sequence to the max value to prevent conflicts
select setval('public.orders_order_number_seq', (select max(order_number) from public.orders));

-- Add Unique Constraint
alter table public.orders
add constraint orders_order_number_unique unique (order_number);
