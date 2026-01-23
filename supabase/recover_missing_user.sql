-- 1. Insert the missing user into members if they don't exist
insert into public.members (id, email, full_name, created_at, updated_at)
values (
  '718dbb26-f064-4a08-8bbb-7ac2f6b8b622', -- The ID provided
  'ivanouazzani@gmail.com',         -- The Email provided
  'Ivan Ouazzani',                  -- Guessing name from email or leaving generic, user meta data usually has it.
                                    -- Safer to fetch from auth.users if possible, but we cannot cross-schema query easily in all envs without permissions.
                                    -- However, for a one-off fix, we can try to be safe.
  now(),
  now()
)
on conflict (id) do nothing;

-- 2. FORCE RE-APPLY of the Trigger to ensure future users work.
-- (Copying logic from separate_members_and_profiles.sql)

create or replace function public.handle_new_user()
returns trigger as $$
declare
  user_role text;
  user_full_name text;
begin
  -- Get metadata
  user_role := new.raw_user_meta_data->>'role';
  user_full_name := new.raw_user_meta_data->>'full_name';
  
  -- Fallback if full_name is null/empty
  if user_full_name is null or user_full_name = '' then
    user_full_name := new.email; -- Use email as fallback name
  end if;

  -- If role is admin-like, insert into profiles
  if user_role in ('admin', 'super_admin', 'support', 'manager') then
    insert into public.profiles (id, email, full_name, role)
    values (
      new.id, 
      new.email, 
      user_full_name, 
      user_role
    )
    on conflict (id) do nothing; -- Safety
  
  -- Otherwise, insert into members (for normal users)
  else
    insert into public.members (id, email, full_name)
    values (
      new.id, 
      new.email, 
      user_full_name
    )
    on conflict (id) do nothing; -- Safety
  end if;

  return new;
end;
$$ language plpgsql security definer;

-- Drop and Recreate Trigger
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
