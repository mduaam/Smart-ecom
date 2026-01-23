-- Add metadata column to orders table
-- This fixes the error: Could not find the 'metadata' column of 'orders' in the schema cache

ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS metadata jsonb DEFAULT '{}'::jsonb;
