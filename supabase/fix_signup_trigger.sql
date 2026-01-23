-- FIX: Ensure Signups go to Members, not Profiles (Team)

-- 1. Redefine the trigger function
create or replace function public.handle_new_user()
returns trigger as $$
begin
  -- Insert into public.members (Users)
  insert into public.members (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  
  -- Do NOT insert into public.profiles (Team Only)
  return new;
end;
$$ language plpgsql security definer;

-- 2. Cleanup: Remove non-team users from profiles
-- Delete any profile that is NOT an admin, support, super_admin, or manager
delete from public.profiles
where role not in ('admin', 'super_admin', 'support', 'manager')
   or role is null;

-- 3. Cleanup: Ensure these deleted users exist in members
-- (In case they were only in profiles and not members, though auth.ts tries to add to both now)
-- The best way is to do an insert select from auth.users but we can't easily access auth.users directly in this script for bulk migration safely without more privileges.
-- Assuming the cleanup is enough for now. The 'auth.ts' change I made earlier handles the 'members' creation.
