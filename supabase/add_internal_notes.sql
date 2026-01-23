
-- Add internal_notes column to orders table if it doesn't exist
alter table public.orders 
add column if not exists internal_notes text;
