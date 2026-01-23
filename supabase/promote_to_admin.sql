-- Script to Promote a User to Admin
-- ONLY users in the 'profiles' table with role 'admin'/'super_admin' can see the Admin Dashboard data.

-- CHANGE THIS EMAIL to the user you are currently logged in with:
do $$
declare
  target_email text := 'ouazzanitopo@gmail.com'; 
  target_user_id uuid;
begin
  -- 1. Find the user ID from members table
  select id into target_user_id from public.members where email = target_email;

  if target_user_id is null then
    -- Fallback: try to find in auth.users if possible (depends on permissions)
    -- For now, we assume member exists.
    raise exception 'User % not found. Please ensure you have signed up first.', target_email;
  end if;

  -- 2. Insert into PROFILES table as super_admin
  -- This table is specifically for Staff/Admins.
  insert into public.profiles (id, email, full_name, role)
  values (
    target_user_id, 
    target_email, 
    (select full_name from public.members where id = target_user_id), 
    'super_admin'
  )
  on conflict (id) do update
  set role = 'super_admin';

  raise notice 'SUCCESS: User % is now a Super Admin.', target_email;
end;
$$;
