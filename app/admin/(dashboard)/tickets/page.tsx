import { getAllTicketsAdmin } from '@/app/actions/tickets';
import TicketList from '@/components/admin/TicketList';
import UserMenu from '@/components/admin/UserMenuServer';
import NotificationsMenu from '@/components/admin/NotificationsMenuServer';

export const dynamic = 'force-dynamic';

export default async function AdminTicketsPage() {
    const { data: tickets, error } = await getAllTicketsAdmin();

    if (error) {
        return <div className="p-8 text-red-500">Error loading tickets: {error}</div>;
    }

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-8 lg:p-12 font-sans">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold dark:text-white mb-2">Support Tickets</h1>
                    <p className="text-zinc-500">Manage customer support requests</p>
                </div>
                <div className="flex items-center gap-4">
                    <NotificationsMenu />
                    <UserMenu />
                </div>
            </header>
            <TicketList initialTickets={tickets || []} />
        </div>
    );
}

