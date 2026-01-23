import { getSupabase } from '@/lib/supabase-server';
import UserMenu from './UserMenu';

export default async function UserMenuServer() {
    const supabase = await getSupabase();

    const { data: { user } } = await supabase.auth.getUser();

    return <UserMenu user={user} />;
}
