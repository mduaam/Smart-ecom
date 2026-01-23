-- Add max_connections column
alter table public.subscriptions 
add column if not exists max_connections int default 1;

-- Update Trigger Function to parse plan details
create or replace function public.handle_paid_order()
returns trigger as $$
declare
  order_plan_id text;
  plan_name_lower text;
  subscription_duration interval;
  subscription_end timestamptz;
  new_username text;
  new_password text;
  user_email text;
  connections int := 1;
  base_url text := 'http://vod4k.cc';
  m3u_base text := 'http://n1.smartvpluseu.com/downloadfile';
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
    new_username := lower(regexp_replace(split_part(user_email, '@', 1), '[^a-zA-Z0-9]', '', 'g')) || '_' || floor(random() * 9000 + 1000)::text;
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

    -- 2. Determine Plan Details
    select product_id, lower(name) into order_plan_id, plan_name_lower
    from public.order_items 
    where order_id = new.id 
    limit 1;

    if order_plan_id is null then
      order_plan_id := 'manual-plan';
      plan_name_lower := 'manual plan';
    end if;
    
    -- Parse Duration
    if plan_name_lower like '%12 month%' or plan_name_lower like '%year%' then
        subscription_duration := interval '1 year';
    elsif plan_name_lower like '%6 month%' then
         subscription_duration := interval '6 months';
    elsif plan_name_lower like '%3 month%' then
         subscription_duration := interval '3 months';
    else
         subscription_duration := interval '1 month'; -- Default
    end if;

    -- Parse Connections (Simple heuristic, extend as needed)
    if plan_name_lower like '%2 device%' or plan_name_lower like '%2 connection%' then
        connections := 2;
    elsif plan_name_lower like '%3 device%' or plan_name_lower like '%3 connection%' then
        connections := 3;
    elsif plan_name_lower like '%4 device%' or plan_name_lower like '%4 connection%' then
        connections := 4;
    end if;
    
    subscription_end := now() + subscription_duration;
    
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
            iptv_url,
            m3u_link,
            max_connections,
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
            base_url,
            m3u_base || '?code=' || new_username || '&type=m3u',
            connections,
            now()
        )
        on conflict (stripe_subscription_id) do update set
            status = 'active',
            current_period_end = excluded.current_period_end,
            max_connections = excluded.max_connections,
            -- Ensure credentials are present
            iptv_username = coalesce(subscriptions.iptv_username, excluded.iptv_username),
            iptv_password = coalesce(subscriptions.iptv_password, excluded.iptv_password),
            iptv_url = coalesce(subscriptions.iptv_url, excluded.iptv_url),
            m3u_link = coalesce(subscriptions.m3u_link, excluded.m3u_link),
            updated_at = now();
    end if;
      
  end if;
  return new;
end;
$$ language plpgsql security definer;

-- Reload cache
NOTIFY pgrst, 'reload config';
