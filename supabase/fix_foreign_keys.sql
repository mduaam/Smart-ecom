-- 1. Drop existing Foreign Keys referencing profiles
alter table public.tickets drop constraint if exists tickets_user_id_fkey;
alter table public.orders drop constraint if exists orders_user_id_fkey;
alter table public.subscriptions drop constraint if exists subscriptions_user_id_fkey;
alter table public.ticket_messages drop constraint if exists ticket_messages_sender_id_fkey;
alter table public.reviews drop constraint if exists reviews_user_id_fkey;

-- 2. Add new Foreign Keys referencing auth.users (The common source)
alter table public.tickets add constraint tickets_user_id_fkey foreign key (user_id) references auth.users(id) on delete cascade;
alter table public.orders add constraint orders_user_id_fkey foreign key (user_id) references auth.users(id) on delete set null;
alter table public.subscriptions add constraint subscriptions_user_id_fkey foreign key (user_id) references auth.users(id) on delete cascade;
alter table public.ticket_messages add constraint ticket_messages_sender_id_fkey foreign key (sender_id) references auth.users(id) on delete cascade;
alter table public.reviews add constraint reviews_user_id_fkey foreign key (user_id) references auth.users(id) on delete cascade;

-- 3. Create a unified view for easier querying (profiles + members)
create or replace view public.all_users_view as
select 
  id, 
  email, 
  full_name, 
  'user' as source_table, 
  'user' as role -- default for members
from public.members
union all
select 
  id, 
  email, 
  full_name, 
  'profile' as source_table, 
  role
from public.profiles;

-- 4. Grant access to the view
grant select on public.all_users_view to authenticated;
grant select on public.all_users_view to service_role;
