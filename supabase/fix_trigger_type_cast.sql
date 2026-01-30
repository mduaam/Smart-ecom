-- Fix for "Database error creating new user"
-- The trigger attempts to insert TEXT into an ENUM column. Explicit casting is safer.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  role_text TEXT;
BEGIN
  -- Get role from metadata (default to 'member')
  role_text := COALESCE(new.raw_user_meta_data->>'role', 'member');
  
  -- Ensure the role text is valid (fallback to member if not)
  -- This prevents crashes if an invalid role string is passed
  IF role_text NOT IN ('user', 'member', 'admin', 'super_admin', 'support') THEN
    role_text := 'member';
  END IF;

  -- Consistent insert into profiles ONLY with explicit cast
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    new.id, 
    new.email, 
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'), 
    role_text::public.user_role -- Explicit Cast
  );

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
