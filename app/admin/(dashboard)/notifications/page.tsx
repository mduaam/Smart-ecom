import { getMyNotifications } from '@/app/actions/admin/notifications';
import NotificationInboxClient from '@/components/admin/NotificationInboxClient';

export default async function NotificationsPage() {
    // Fetch a larger set for the main page
    const result = await getMyNotifications(50);

    // Simple error handling
    if ('error' in result) {
        return <div className="p-8 text-red-500">Error loading notifications: {result.error}</div>;
    }

    const { data: notifications } = result;

    return (
        <div className="p-6">
            <NotificationInboxClient initialNotifications={notifications || []} />
        </div>
    );
}
