-- Create Notifications Table
CREATE TABLE IF NOT EXISTS public.admin_notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    type TEXT NOT NULL, -- 'info', 'warning', 'error', 'success', 'broadcast'
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    action_url TEXT,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- Optional: Specific user, or NULL for all admins
    metadata JSONB DEFAULT '{}'::jsonb
);

-- RLS
ALTER TABLE public.admin_notifications ENABLE ROW LEVEL SECURITY;

-- Admins can do everything
CREATE POLICY "Admins have full access to admin_notifications"
ON public.admin_notifications
FOR ALL
USING (EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role IN ('admin', 'staff', 'super_admin')
));

-- Users can only read their own if applicable (though this table is primarily for admin view)
-- But if we want to use it for user broadcasts:
CREATE POLICY "Users can view their own notifications"
ON public.admin_notifications
FOR SELECT
USING (auth.uid() = user_id OR user_id IS NULL);
