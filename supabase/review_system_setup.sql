
-- Setup Review System: Add Image Support and Storage Bucket

-- 1. Add image_url to reviews table
ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS image_url TEXT;

-- 2. Ensure RLS is enabled
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- 3. Storage Bucket for Review Photos
-- This part might need manual execution or via Supabase Admin API if it fails in SQL editor
-- But usually, inserts into storage.buckets works if Superuser
INSERT INTO storage.buckets (id, name, public) 
VALUES ('reviews', 'reviews', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies for 'reviews' bucket
CREATE POLICY "Public Read Reviews"
ON storage.objects FOR SELECT
USING (bucket_id = 'reviews');

CREATE POLICY "Authenticated Upload Reviews"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'reviews');

-- Table Policies (Ensuring they are present)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can view published reviews') THEN
        CREATE POLICY "Anyone can view published reviews" ON public.reviews
            FOR SELECT USING (status = 'published');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Members can submit reviews') THEN
        CREATE POLICY "Members can submit reviews" ON public.reviews
            FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
    END IF;
END $$;
