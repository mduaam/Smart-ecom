
-- 1. Add order_id column
alter table public.subscriptions 
add column if not exists order_id uuid references public.orders(id);

-- 2. Backfill order_id from stripe_subscription_id (manual-ORDER_ID pattern)
-- SAFE UPDATE: Only update if the suffix is a valid UUID
update public.subscriptions
set order_id = split_part(stripe_subscription_id, 'manual-', 2)::uuid
where stripe_subscription_id like 'manual-%'
  and stripe_subscription_id not like 'manual-test-%'
  and split_part(stripe_subscription_id, 'manual-', 2) ~ '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$';

-- 3. Update the handle_paid_order function to store order_id
create or replace function public.handle_paid_order()
returns trigger
language plpgsql
security definer
as $$
declare
  order_item record;
  plan_duration interval;
  sub_end_date timestamptz;
  plan_name_lower text;
  connections int;
  metadata_plan_name text;
  generated_sub_id text;
  new_username text;
  new_password text;
  user_email text;
  base_url text := 'http://vod4k.cc';
  m3u_base text := 'http://n1.smartvpluseu.com/downloadfile';
begin
  -- Only proceed if payment_status is paid
  if new.payment_status = 'paid' and (old.payment_status is null or old.payment_status != 'paid') then
    
    -- Verify user email
    select email into user_email from public.members where id = new.user_id;
    if user_email is null then user_email := 'user'; end if;

    -- Generate Credentials
    new_username := lower(regexp_replace(split_part(user_email, '@', 1), '[^a-zA-Z0-9]', '', 'g')) || '_' || floor(random() * 9000 + 1000)::text;
    new_password := substr(md5(random()::text), 0, 10);

    -- Get Plan Info from Metadata
    metadata_plan_name := new.metadata->>'plan_name';
    if metadata_plan_name is null then metadata_plan_name := 'Standard Plan'; end if;
    
    -- Parse Duration
    if lower(metadata_plan_name) like '%12 month%' or lower(metadata_plan_name) like '%year%' then
        plan_duration := interval '1 year';
    elsif lower(metadata_plan_name) like '%6 month%' then
        plan_duration := interval '6 months';
    elsif lower(metadata_plan_name) like '%3 month%' then
        plan_duration := interval '3 months';
    else
        plan_duration := interval '1 month';
    end if;

    -- Parse Connections
    connections := 1;
    if lower(metadata_plan_name) like '%2 device%' or lower(metadata_plan_name) like '%2 connections%' then
        connections := 2;
    elsif lower(metadata_plan_name) like '%3 device%' or lower(metadata_plan_name) like '%3 connections%' then
        connections := 3;
    elsif lower(metadata_plan_name) like '%4 device%' or lower(metadata_plan_name) like '%4 connections%' then
        connections := 4;
    end if;

    sub_end_date := now() + plan_duration;
    generated_sub_id := 'manual-' || new.id;

    -- Insert Subscription with order_id
    insert into public.subscriptions (
      user_id,
      order_id,
      stripe_subscription_id,
      plan_id,
      plan_name,
      status,
      current_period_start,
      current_period_end,
      iptv_username,
      iptv_password,
      iptv_url,
      m3u_link,
      max_connections,
      created_at,
      updated_at
    )
    values (
      new.user_id,
      new.id, -- Storing order_id
      generated_sub_id,
      'manual-plan',
      metadata_plan_name,
      'active',
      now(),
      sub_end_date,
      new_username,
      new_password,
      base_url,
      m3u_base || '?code=' || new_username || '&type=m3u',
      connections,
      now(),
      now()
    )
    on conflict (stripe_subscription_id) do update set
        status = 'active',
        current_period_end = excluded.current_period_end,
        max_connections = excluded.max_connections,
        -- Ensure credentials are present or updated if manual intervention happened before? 
        -- Actually for manual edits we want to preserve them, but if re-running automation, keep existing or overwrite?
        -- Let's keep existing credentials if they exist to avoid overwriting manual edits
        iptv_username = coalesce(subscriptions.iptv_username, excluded.iptv_username),
        iptv_password = coalesce(subscriptions.iptv_password, excluded.iptv_password),
        iptv_url = coalesce(subscriptions.iptv_url, excluded.iptv_url),
        m3u_link = coalesce(subscriptions.m3u_link, excluded.m3u_link),
        updated_at = now();
  end if;
  return new;
end;
$$;
