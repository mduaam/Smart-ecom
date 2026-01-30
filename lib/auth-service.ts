
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { getAdminSupabase } from '@/lib/supabase-server';
import { UserProfile, UserRole, hasRole, ROLES } from '@/types/auth';

/**
 * Retrieves the current authenticated user's profile.
 * uses the Service Role client to bypass RLS recursion issues.
 */
export async function getCurrentProfile(): Promise<UserProfile | null> {
    const cookieStore = await cookies();

    // 1. Get User from Auth Session (using standard client)
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() { return cookieStore.getAll(); },
                setAll() { } // Read-only for this check
            },
        }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    // 2. Fetch Profile from DB (using Admin client for safety)
    const adminSupabase = await getAdminSupabase();
    const { data: profile } = await adminSupabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    if (!profile) return null;

    return profile as UserProfile;
}

/**
 * Guard: Throws error if user does not have required role.
 */
export async function requireRole(requiredRole: UserRole) {
    const profile = await getCurrentProfile();

    if (!profile) {
        throw new Error('Unauthorized: No active session');
    }

    if (!hasRole(profile.role, requiredRole)) {
        throw new Error(`Forbidden: Requires ${requiredRole} access. Current: ${profile.role}`);
    }

    return profile;
}

/**
 * Guard: Returns boolean, safe for UI checks.
 */
export async function checkRole(requiredRole: UserRole): Promise<boolean> {
    try {
        const profile = await getCurrentProfile();
        return !!profile && hasRole(profile.role, requiredRole);
    } catch {
        return false;
    }
}
