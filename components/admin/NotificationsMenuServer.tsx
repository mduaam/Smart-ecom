import { getMyNotifications } from '@/app/actions/admin/notifications';
import NotificationsMenu from './NotificationsMenu';

export default async function NotificationsMenuServer() {
    const { data, unreadCount } = await getMyNotifications(10); // Fetch top 10

    // Transform backend snake_case to frontend interface matching if needed, 
    // but better to align types. The component expects "Notification" interface.
    // The backend returns DB rows.

    return <NotificationsMenu notifications={data || []} unreadCount={unreadCount || 0} />;
}
