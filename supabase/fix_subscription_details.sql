
-- 1. Add plan_name column if it doesn't exist
alter table public.subscriptions 
add column if not exists plan_name text;

-- 2. Update logic to use metadata for plan name and duration
do $$
declare
    order_record record;
    metadata_plan_name text;
    subscription_duration interval;
    subscription_end timestamptz;
    connections int;
    generated_sub_id text;
begin
    for order_record in 
        select * from public.orders 
        where payment_status = 'paid' 
        and user_id is not null
    loop
        generated_sub_id := 'manual-' || order_record.id;
        
        -- Extract plan name from metadata
        metadata_plan_name := order_record.metadata->>'plan_name';
        if metadata_plan_name is null then
            metadata_plan_name := 'Standard Plan';
        end if;

        -- Parse Duration from metadata plan name
        if lower(metadata_plan_name) like '%12 month%' or lower(metadata_plan_name) like '%year%' then
            subscription_duration := interval '1 year';
        elsif lower(metadata_plan_name) like '%6 month%' then
            subscription_duration := interval '6 months';
        elsif lower(metadata_plan_name) like '%3 month%' then
            subscription_duration := interval '3 months';
        else
            subscription_duration := interval '1 month';
        end if;

        -- Parse Connections
        connections := 1;
        if lower(metadata_plan_name) like '%2 device%' or lower(metadata_plan_name) like '%2 connection%' then
            connections := 2;
        elsif lower(metadata_plan_name) like '%3 device%' or lower(metadata_plan_name) like '%3 connection%' then
            connections := 3;
        elsif lower(metadata_plan_name) like '%4 device%' or lower(metadata_plan_name) like '%4 connection%' then
            connections := 4;
        end if;

        subscription_end := order_record.created_at + subscription_duration;

        -- Update existing subscriptions (fix the ones we just backfilled)
        update public.subscriptions
        set 
            plan_name = metadata_plan_name,
            current_period_end = subscription_end,
            max_connections = connections,
            updated_at = now()
        where stripe_subscription_id = generated_sub_id;
        
        raise notice 'Updated subscription for order %', order_record.id;
    end loop;
end;
$$;
