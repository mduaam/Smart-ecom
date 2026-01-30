import { getSupabase } from '@/lib/supabase-server';
import UserMenu from './UserMenu';

export default async function UserMenuServer() {
    try {
        const supabase = await getSupabase();
        const { data: { user } } = await supabase.auth.getUser();
        return <UserMenu user={user} />;
    } catch (err: any) {
        console.error('[UserMenu Action] Unexpected error:', err.message);
        return <UserMenu user={null} />;
    }
}
