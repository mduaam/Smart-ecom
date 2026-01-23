-- Promote ouazzanitopo@gmail.com to Super Admin
-- This ensures they have full access to Team Management and all Admin features.

do $$
declare
  target_email text := 'ouazzanitopo@gmail.com';
  target_user_id uuid;
begin
  -- 1. Find the user ID from auth.users
  select id into target_user_id from auth.users where email = target_email;

  if target_user_id is null then
    raise exception 'User % not found in auth.users. Please sign up first.', target_email;
  end if;

  -- 2. Upsert into PROFILES table as super_admin
  insert into public.profiles (id, email, full_name, role)
  values (
    target_user_id, 
    target_email, 
    'Admin User', -- or fetch from metadata if available
    'super_admin'
  )
  on conflict (id) do update
  set role = 'super_admin';

  raise notice 'SUCCESS: User % is now a Super Admin.', target_email;
end;
$$;
