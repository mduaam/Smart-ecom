
-- Setup Admin Notification System

-- 1. Create notification_configs table
CREATE TABLE IF NOT EXISTS public.notification_configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    notify_on_orders BOOLEAN DEFAULT true,
    notify_on_tickets BOOLEAN DEFAULT true,
    notify_on_reviews BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable RLS
ALTER TABLE public.notification_configs ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies (Super Admin Only)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Super Admins can manage notification configs') THEN
        CREATE POLICY "Super Admins can manage notification configs" 
        ON public.notification_configs
        FOR ALL 
        TO authenticated
        USING (
            EXISTS (
                SELECT 1 FROM public.profiles 
                WHERE id = auth.uid() AND role = 'super_admin'
            )
        );
    END IF;
END $$;

-- 4. Initial Config (Seed with a placeholder if needed, otherwise empty is fine)
-- INSERT INTO public.notification_configs (email) VALUES ('admin@example.com') ON CONFLICT DO NOTHING;
