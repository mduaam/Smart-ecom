
-- Fix Relationship Error: Ensure reviews.user_id points to public.members(id)
-- This allows PostgREST to automatically resolve joins like .select('*, member:user_id(...)')

ALTER TABLE public.reviews
DROP CONSTRAINT IF EXISTS reviews_user_id_fkey;

ALTER TABLE public.reviews
ADD CONSTRAINT reviews_user_id_fkey 
FOREIGN KEY (user_id) 
REFERENCES public.members(id) 
ON DELETE CASCADE;

-- Reload schema cache
NOTIFY pgrst, 'reload schema';
