-- Update the trigger function to insert into 'members' instead of 'profiles'
create or replace function public.handle_new_user()
returns trigger as $$
begin
  -- Insert into public.members
  insert into public.members (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  
  return new;
end;
$$ language plpgsql security definer;

-- No need to recreate the trigger itself if the function name is same, 
-- but we should ensure 'profiles' rows are cleaned up for normal users if they exist?
-- We already did that in previous migration. 
-- Just updating the function logic is enough to stop future bad inserts.
