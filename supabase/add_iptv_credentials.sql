-- Add IPTV credentials columns to subscriptions table
alter table public.subscriptions 
add column if not exists iptv_username text,
add column if not exists iptv_password text;

-- Update trigger function to generate credentials
create or replace function public.handle_paid_order()
returns trigger as $$
declare
  order_plan_id text;
  order_interval text;
  subscription_end timestamptz;
  new_username text;
  new_password text;
  user_email text;
begin
  -- Logic: Check operation type safely
  if (TG_OP = 'INSERT' AND new.status = 'paid') OR 
     (TG_OP = 'UPDATE' AND new.status = 'paid' AND old.status IS DISTINCT FROM 'paid') THEN
    
    -- Fetch Email for username generation
    select email into user_email from public.members where id = new.user_id;
    if user_email is null then
        user_email := 'user';
    end if;

    -- Generate Credentials
    -- Username: email prefix + random 4 digits (sanitized)
    new_username := lower(regexp_replace(split_part(user_email, '@', 1), '[^a-zA-Z0-9]', '', 'g')) || '_' || floor(random() * 9000 + 1000)::text;
    
    -- Password: Random 10 char string
    new_password := substr(md5(random()::text), 0, 10);

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
    
    subscription_end := now() + interval '1 month'; -- Default to 1 month if unknown
    
    if new.user_id is not null then
        insert into public.subscriptions (
            user_id,
            plan_id,
            status,
            current_period_start,
            current_period_end,
            stripe_subscription_id,
            iptv_username,
            iptv_password,
            updated_at
        )
        values (
            new.user_id,
            order_plan_id,
            'active',
            now(),
            subscription_end,
            'manual-' || new.id,
            new_username,
            new_password,
            now()
        )
        on conflict (stripe_subscription_id) do update set
            status = 'active',
            current_period_end = excluded.current_period_end,
            updated_at = now();
            -- Do not overwrite credentials if they exist, or maybe we should? 
            -- For now, preserve existing credentials if this is just a renewal/update on same sub ID.
    end if;
      
  end if;
  return new;
end;
$$ language plpgsql security definer;
