-- Add missing INSERT policy for members
-- This allows authenticated users to insert a row for themselves (fallback if trigger fails)
create policy "Users can insert their own member profile" 
on public.members 
for insert 
with check (auth.uid() = id);
