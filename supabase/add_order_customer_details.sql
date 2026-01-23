-- Add Customer Details Columns to Orders Table
ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS customer_name text,
ADD COLUMN IF NOT EXISTS customer_email text,
ADD COLUMN IF NOT EXISTS customer_phone text,
ADD COLUMN IF NOT EXISTS billing_address text,
ADD COLUMN IF NOT EXISTS shipping_address text;

-- Optional: Backfill email from guest_email or profiles if needed (not strictly required if we start fresh or rely on app logic)
-- UPDATE public.orders SET customer_email = guest_email WHERE customer_email IS NULL AND guest_email IS NOT NULL;
