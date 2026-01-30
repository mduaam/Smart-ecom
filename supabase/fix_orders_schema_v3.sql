
-- Ensure orders table has all expected columns
DO $$ 
BEGIN 
    -- We already have customer_email, but the code was looking for guest_email.
    -- We will update the code to use customer_email, but let's add guest_email 
    -- as well if it's missing to avoid "column not found" errors during transition.
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'guest_email') THEN
        ALTER TABLE public.orders ADD COLUMN guest_email text;
    END IF;

    -- Ensure customer_name/email/phone exist (from previous migration)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'customer_name') THEN
        ALTER TABLE public.orders ADD COLUMN customer_name text;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'customer_email') THEN
        ALTER TABLE public.orders ADD COLUMN customer_email text;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'customer_phone') THEN
        ALTER TABLE public.orders ADD COLUMN customer_phone text;
    END IF;

END $$;
