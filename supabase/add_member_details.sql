-- Add contact and address columns to members table
ALTER TABLE public.members
ADD COLUMN IF NOT EXISTS phone text,
ADD COLUMN IF NOT EXISTS billing_address text,
ADD COLUMN IF NOT EXISTS shipping_address text;

-- Enable admins to update members (if policy doesn't exist)
create policy "Admins can update any member" on public.members 
for update using (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'super_admin'))
);

create policy "Admins can delete any member" on public.members 
for delete using (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'super_admin'))
);
