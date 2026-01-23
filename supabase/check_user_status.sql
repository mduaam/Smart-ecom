-- Check the status of the admin email
select 
  au.id as user_id,
  au.email as auth_email,
  m.id as member_id,
  p.id as profile_id,
  p.role as profile_role
from auth.users au
left join public.members m on au.id = m.id
left join public.profiles p on au.id = p.id
where au.email = 'ouazzanitopo@gmail.com';
