-- 1. Allow Profiles (Staff) to view all MEMBERS
drop policy if exists "Admins view all members" on public.members;
create policy "Admins view all members" 
on public.members 
for select 
using (
  exists (
    select 1 from public.profiles
    where profiles.id = auth.uid()
  )
);

-- 2. Allow Profiles (Staff) to view/modify all TICKETS
-- First enable RLS to be safe (if not already)
alter table public.tickets enable row level security;

drop policy if exists "Admins view all tickets" on public.tickets;
create policy "Admins view all tickets" 
on public.tickets 
for select 
using (
  exists (
    select 1 from public.profiles
    where profiles.id = auth.uid()
  )
);

drop policy if exists "Admins update all tickets" on public.tickets;
create policy "Admins update all tickets" 
on public.tickets 
for update 
using (
  exists (
    select 1 from public.profiles
    where profiles.id = auth.uid()
  )
);

drop policy if exists "Admins delete all tickets" on public.tickets;
create policy "Admins delete all tickets" 
on public.tickets 
for delete
using (
  exists (
    select 1 from public.profiles
    where profiles.id = auth.uid()
  )
);

-- 3. Allow Profiles (Staff) to view/reply to TICKET MESSAGES
alter table public.ticket_messages enable row level security;

drop policy if exists "Admins view all ticket messages" on public.ticket_messages;
create policy "Admins view all ticket messages" 
on public.ticket_messages 
for select 
using (
  exists (
    select 1 from public.profiles
    where profiles.id = auth.uid()
  )
);

drop policy if exists "Admins insert ticket messages" on public.ticket_messages;
create policy "Admins insert ticket messages" 
on public.ticket_messages 
for insert 
with check (
  exists (
    select 1 from public.profiles
    where profiles.id = auth.uid()
  )
);
