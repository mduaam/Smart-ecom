-- Force delete the user from the Authentication table (auth.users)
-- This will automatically cascade and remove them from public.members and public.profiles as well.

delete from auth.users 
where email = 'ivanouazzani@gmail.com';

-- Verify it's gone (should return 0 rows)
select * from public.members where email = 'ivanouazzani@gmail.com';
