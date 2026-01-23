
-- Drop the incorrect foreign key constraint
alter table public.order_notes
drop constraint if exists order_notes_admin_id_fkey;

-- Add the correct foreign key constraint to profiles
-- Assuming profiles table exists and has id as primary key (linked to auth.users)
alter table public.order_notes
add constraint order_notes_admin_id_fkey
foreign key (admin_id)
references public.profiles(id)
on delete set null;
