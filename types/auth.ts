
export type UserRole = 'user' | 'member' | 'admin' | 'super_admin' | 'support';

export interface UserProfile {
    id: string;
    email: string;
    full_name?: string;
    role: UserRole;
    avatar_url?: string;
    phone?: string;
    created_at?: string;
}

export const ROLES = {
    USER: 'user' as UserRole,
    MEMBER: 'member' as UserRole,
    ADMIN: 'admin' as UserRole,
    SUPER_ADMIN: 'super_admin' as UserRole,
    SUPPORT: 'support' as UserRole,
};

// Hierarchy: Higher index = more permissions
const ROLE_HIERARCHY: Record<UserRole, number> = {
    user: 0,
    member: 1,
    support: 2,
    admin: 3,
    super_admin: 4,
};

export function hasRole(currentRole: UserRole, requiredRole: UserRole): boolean {
    return ROLE_HIERARCHY[currentRole] >= ROLE_HIERARCHY[requiredRole];
}
