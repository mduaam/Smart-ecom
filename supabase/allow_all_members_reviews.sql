-- Migration: Allow All Members to Write Reviews

-- 1. Update Foreign Key Constraint
-- We want reviews to be linked to 'members' (all users), not 'customers' (buyers only).

alter table public.reviews
  drop constraint if exists reviews_user_id_fkey;

alter table public.reviews
  add constraint reviews_user_id_fkey
  foreign key (user_id)
  references public.members(id)
  on delete cascade;

-- 2. Update RLS Policies

-- Drop old "Customers create reviews" policy
drop policy if exists "Customers create reviews" on public.reviews;

-- Create new "Members create reviews" policy
create policy "Members create reviews" on public.reviews
  for insert with check (
    auth.uid() = user_id AND
    exists (select 1 from public.members where id = auth.uid())
  );

-- Helper comment:
-- "Customers read own reviews" policy is fine as long as auth.uid() = user_id is the check.
-- But we can rename it for clarity.
drop policy if exists "Customers read own reviews" on public.reviews;
create policy "Members read own reviews" on public.reviews
  for select using (auth.uid() = user_id);
