-- 1. Create members table if it doesn't exist
create table if not exists public.members (
  id uuid references auth.users on delete cascade not null primary key,
  email text not null,
  full_name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on members
alter table public.members enable row level security;
create policy "Users view own member profile" on public.members for select using (auth.uid() = id);
create policy "Users update own member profile" on public.members for update using (auth.uid() = id);

-- 2. Update the handle_new_user trigger
create or replace function public.handle_new_user()
returns trigger as $$
declare
  user_role text;
begin
  -- Get the role from metadata, default to 'user'
  user_role := new.raw_user_meta_data->>'role';

  -- If role is admin-like, insert into profiles
  if user_role in ('admin', 'super_admin', 'support', 'manager') then
    insert into public.profiles (id, email, full_name, role)
    values (
      new.id, 
      new.email, 
      new.raw_user_meta_data->>'full_name', 
      user_role
    );
  
  -- Otherwise, insert into members (for normal users)
  else
    insert into public.members (id, email, full_name)
    values (
      new.id, 
      new.email, 
      new.raw_user_meta_data->>'full_name'
    );
  end if;

  return new;
end;
$$ language plpgsql security definer;

-- 3. Ensure the trigger is active
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
