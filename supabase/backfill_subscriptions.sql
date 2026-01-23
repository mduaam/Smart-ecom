
-- Backfill subscriptions for existing paid orders that don't have a subscription
do $$
declare
    order_record record;
    order_plan_id text;
    plan_name_lower text;
    subscription_duration interval;
    subscription_end timestamptz;
    new_username text;
    new_password text;
    user_email text;
    connections int;
    base_url text := 'http://vod4k.cc';
    m3u_base text := 'http://n1.smartvpluseu.com/downloadfile';
    generated_sub_id text;
begin
    for order_record in 
        select * from public.orders 
        where payment_status = 'paid' 
        and user_id is not null
    loop
        generated_sub_id := 'manual-' || order_record.id;
        
        -- Check if subscription exists
        if not exists (select 1 from public.subscriptions where stripe_subscription_id = generated_sub_id) then
            
            -- Fetch Email
            select email into user_email from public.members where id = order_record.user_id;
            if user_email is null then user_email := 'user'; end if;

            -- Generate Credentials
            new_username := lower(regexp_replace(split_part(user_email, '@', 1), '[^a-zA-Z0-9]', '', 'g')) || '_' || floor(random() * 9000 + 1000)::text;
            new_password := substr(md5(random()::text), 0, 10);

            -- Determine Plan Details
            select product_id, lower(name) into order_plan_id, plan_name_lower
            from public.order_items 
            where order_id = order_record.id 
            limit 1;

            if order_plan_id is null then
                order_plan_id := 'manual-backfill';
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
                subscription_duration := interval '1 month';
            end if;

            -- Parse Connections
            connections := 1;
            if plan_name_lower like '%2 device%' or plan_name_lower like '%2 connection%' then
                connections := 2;
            elsif plan_name_lower like '%3 device%' or plan_name_lower like '%3 connection%' then
                connections := 3;
            elsif plan_name_lower like '%4 device%' or plan_name_lower like '%4 connection%' then
                connections := 4;
            end if;

            subscription_end := now() + subscription_duration;

            -- Insert
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
                created_at,
                updated_at
            )
            values (
                order_record.user_id,
                order_plan_id,
                'active',
                now(),
                subscription_end,
                generated_sub_id,
                new_username,
                new_password,
                base_url,
                m3u_base || '?code=' || new_username || '&type=m3u',
                connections,
                now(),
                now()
            );
            
            raise notice 'Backfilled subscription for order %', order_record.id;
        end if;
    end loop;
end;
$$;
