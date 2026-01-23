-- Create a specific table for tracking customers (People who spent money)
create table if not exists public.customers (
  id uuid references public.members(id) on delete cascade primary key,
  email text,
  full_name text,
  total_spent numeric default 0,
  orders_count int default 0,
  last_order_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.customers enable row level security;
create policy "Admins view all customers" on public.customers for select using (exists (select 1 from profiles where id = auth.uid() and role in ('admin', 'super_admin')));

-- Trigger Function to auto-populate customers on PAID order
create or replace function public.handle_paid_order()
returns trigger as $$
begin
  -- Logic: Check operation type safely
  if (TG_OP = 'INSERT' AND new.status = 'paid') OR 
     (TG_OP = 'UPDATE' AND new.status = 'paid' AND old.status IS DISTINCT FROM 'paid') THEN
    
    -- Upsert into customers
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
      -- Update name/email in case they changed in members table
      full_name = excluded.full_name,
      email = excluded.email;
      
  end if;
  return new;
end;
$$ language plpgsql security definer;

-- Trigger Definition
drop trigger if exists on_order_paid on orders;
create trigger on_order_paid
  after insert or update on orders
  for each row 
  execute procedure public.handle_paid_order();
