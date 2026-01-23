-- Fix: Drop and Recreate Customers table to ensure all columns exist
drop trigger if exists on_order_paid on orders;
drop function if exists public.handle_paid_order;
drop table if exists public.customers;

-- Re-create table
create table public.customers (
  id uuid references public.members(id) on delete cascade primary key,
  email text,
  full_name text,
  total_spent numeric default 0,
  orders_count int default 0,
  last_order_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Re-enable RLS
alter table public.customers enable row level security;
create policy "Admins view all customers" on public.customers for select using (exists (select 1 from profiles where id = auth.uid() and role in ('admin', 'super_admin')));

-- Re-create Trigger Function
create or replace function public.handle_paid_order()
returns trigger as $$
declare
  order_plan_id text;
  order_interval text;
  subscription_end timestamptz;
begin
  -- Logic: Check operation type safely
  if (TG_OP = 'INSERT' AND new.status = 'paid') OR 
     (TG_OP = 'UPDATE' AND new.status = 'paid' AND old.status IS DISTINCT FROM 'paid') THEN
    
    -- 1. Upsert into customers
    insert into public.customers (id, email, full_name, last_order_at, total_spent, orders_count)
    select 
      new.user_id,
      m.email,
      m.full_name,
      new.created_at,
      new.total_amount, 
      1
    from public.members m
    where m.id = new.user_id
    on conflict (id) do update set
      last_order_at = excluded.last_order_at,
      total_spent = customers.total_spent + excluded.total_spent,
      orders_count = customers.orders_count + 1,
      full_name = excluded.full_name,
      email = excluded.email;

    -- 2. Upsert into Subscriptions
    select product_id into order_plan_id 
    from public.order_items 
    where order_id = new.id 
    limit 1;

    if order_plan_id is null then
      order_plan_id := 'manual-plan';
    end if;
    
    subscription_end := now() + interval '1 month'; 
    
    if new.user_id is not null then
        insert into public.subscriptions (
            user_id,
            plan_id,
            status,
            current_period_start,
            current_period_end,
            stripe_subscription_id,
            updated_at
        )
        values (
            new.user_id,
            order_plan_id,
            'active',
            now(),
            subscription_end,
            'manual-' || new.id, 
            now()
        )
        on conflict (stripe_subscription_id) do nothing; 
    end if;
      
  end if;
  return new;
end;
$$ language plpgsql security definer;

-- Re-create Trigger
create trigger on_order_paid
  after insert or update on orders
  for each row 
  execute procedure public.handle_paid_order();
