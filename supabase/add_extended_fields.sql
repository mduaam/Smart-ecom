
-- Add activation_code column if it doesn't exist
alter table public.subscriptions 
add column if not exists activation_code text;

-- Add alternative_urls column if it doesn't exist (JSONB array)
alter table public.subscriptions 
add column if not exists alternative_urls jsonb default '[]'::jsonb;
