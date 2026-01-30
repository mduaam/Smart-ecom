-- Add tracking columns to email_campaigns
ALTER TABLE public.email_campaigns 
ADD COLUMN IF NOT EXISTS open_count int DEFAULT 0,
ADD COLUMN IF NOT EXISTS click_count int DEFAULT 0;
