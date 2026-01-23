import { getNotifications } from '@/app/actions/admin/notifications';
import NotificationsMenu from './NotificationsMenu';

export default async function NotificationsMenuServer() {
    const notifications = await getNotifications();
    return <NotificationsMenu notifications={notifications} />;
}
