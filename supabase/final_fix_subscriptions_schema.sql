
-- EMERGENCY SCHEMA FIX: Ensure subscriptions table has the expected columns
-- This script fixes the "column subscriptions.current_period_end does not exist" error.

ALTER TABLE public.subscriptions 
ADD COLUMN IF NOT EXISTS current_period_start timestamp with time zone,
ADD COLUMN IF NOT EXISTS current_period_end timestamp with time zone,
ADD COLUMN IF NOT EXISTS max_connections int DEFAULT 1,
ADD COLUMN IF NOT EXISTS iptv_username text,
ADD COLUMN IF NOT EXISTS iptv_password text,
ADD COLUMN IF NOT EXISTS iptv_url text,
ADD COLUMN IF NOT EXISTS m3u_link text;

-- Also ensure the updated_at column exists as it is used in the actions
ALTER TABLE public.subscriptions
ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT timezone('utc'::text, now());

-- Subscriptions table schema has been synchronized.
