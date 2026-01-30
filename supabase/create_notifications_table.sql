
-- Create Admin Notifications Table
-- This table stores individual notifications for each staff member.

CREATE TYPE public.notification_type AS ENUM ('info', 'success', 'warning', 'error');
CREATE TYPE public.notification_category AS ENUM ('system', 'order', 'ticket', 'subscription', 'security');

CREATE TABLE IF NOT EXISTS public.admin_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT,
    type public.notification_type DEFAULT 'info',
    category public.notification_category DEFAULT 'system',
    link TEXT, -- Optional URL to redirect to
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.admin_notifications ENABLE ROW LEVEL SECURITY;

-- Policies
-- 1. Users can view their own notifications
CREATE POLICY "Users view own notifications" 
ON public.admin_notifications FOR SELECT 
USING (auth.uid() = user_id);

-- 2. Users can update (mark as read) their own notifications
CREATE POLICY "Users update own notifications" 
ON public.admin_notifications FOR UPDATE 
USING (auth.uid() = user_id);

-- 3. Users can delete their notifications
CREATE POLICY "Users delete own notifications" 
ON public.admin_notifications FOR DELETE 
USING (auth.uid() = user_id);

-- 4. Server Role (Service Key) can insert notifications (for broadcasting)
-- Note: Service Key bypasses RLS, so no explicit INSERT policy needed if we assume only backend inserts.
-- But for completeness, Admins can insert (e.g. sending a message to another staff)
CREATE POLICY "Admins can insert notifications"
ON public.admin_notifications FOR INSERT 
WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);
