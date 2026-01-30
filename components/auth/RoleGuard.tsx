
import { UserRole, hasRole } from '@/types/auth';

interface RoleGuardProps {
    children: React.ReactNode;
    currentUserRole: UserRole | undefined; // Pass this data efficiently
    requiredRole: UserRole;
    fallback?: React.ReactNode;
}

export function RoleGuard({
    children,
    currentUserRole,
    requiredRole,
    fallback = null
}: RoleGuardProps) {
    if (!currentUserRole || !hasRole(currentUserRole, requiredRole)) {
        return <>{fallback}</>;
    }

    return <>{children}</>;
}
