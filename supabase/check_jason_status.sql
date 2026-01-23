-- Check status for jasonhomehome@gmail.com
select 
  au.id as user_id,
  au.email as auth_email,
  p.id as profile_id,
  p.role as profile_role
from auth.users au
left join public.profiles p on au.id = p.id
where au.email = 'jasonhomehome@gmail.com';
