-- Fix for "invalid input value for enum user_role" error
-- This script safely adds the missing roles to the existing enum type.

DO $$
BEGIN
    -- 1. Add 'admin' if it doesn't exist
    BEGIN   
        ALTER TYPE public.user_role ADD VALUE IF NOT EXISTS 'admin';
    EXCEPTION
        WHEN duplicate_object THEN null; -- Ignore if exists (redundant with IF NOT EXISTS but safe)
    END;

    -- 2. Add 'super_admin' if it doesn't exist
    BEGIN   
        ALTER TYPE public.user_role ADD VALUE IF NOT EXISTS 'super_admin';
    EXCEPTION
        WHEN duplicate_object THEN null;
    END;

    -- 3. Add 'support' if it doesn't exist
    BEGIN   
        ALTER TYPE public.user_role ADD VALUE IF NOT EXISTS 'support';
    EXCEPTION
        WHEN duplicate_object THEN null;
    END;
    
    -- 4. Add 'member' if it doesn't exist (just in case)
    BEGIN   
        ALTER TYPE public.user_role ADD VALUE IF NOT EXISTS 'member';
    EXCEPTION
        WHEN duplicate_object THEN null;
    END;

END $$;

-- Verify the migration
COMMIT;
