
-- Add missing columns to subscriptions table to match the UI form
ALTER TABLE public.subscriptions
ADD COLUMN IF NOT EXISTS activation_code TEXT,
ADD COLUMN IF NOT EXISTS alternative_urls TEXT[]; -- Array of text

-- Notify schema reload
NOTIFY pgrst, 'reload config';
