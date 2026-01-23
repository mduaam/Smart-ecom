-- Check status for BOTH admins
select 
  au.id as auth_id,
  au.email as auth_email,
  au.last_sign_in_at,
  p.id as profile_id,
  p.email as profile_email,
  p.role as profile_role
from auth.users au
left join public.profiles p on au.id = p.id
where au.email in ('jasonhomehome@gmail.com', 'ouazzanitopo@gmail.com');
