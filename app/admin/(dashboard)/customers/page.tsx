import CustomersClient from './CustomersClient';
import UserMenu from '@/components/admin/UserMenuServer';
import NotificationsMenu from '@/components/admin/NotificationsMenuServer';
import { Users, Mail, Calendar, Search, Filter, Shield, MoreVertical, CreditCard, ShoppingBag } from 'lucide-react';
import { getCustomers } from '@/app/actions/admin/customers';
import { useTranslations } from 'next-intl';

export const dynamic = 'force-dynamic';

export default async function CustomersPage() {
    const { data: customers, error } = await getCustomers();

    if (error) {
        return (
            <div className="p-8 text-red-500">
                Error loading customers: {error}
            </div>
        );
    }

    return (
        <main className="flex-1 p-4 md:p-8 lg:p-12 overflow-y-auto w-full bg-zinc-50 dark:bg-zinc-950 min-h-screen">
            <header className="flex justify-between items-center mb-12">
                <div>
                    <h1 className="text-3xl font-bold text-zinc-900 dark:text-white flex items-center gap-3">
                        <Users className="w-8 h-8 text-indigo-600" />
                        Customers
                    </h1>
                    <p className="text-zinc-500 mt-2">View and manage store customers.</p>
                </div>
                <div className="flex items-center gap-4">
                    <NotificationsMenu />
                    <UserMenu />
                </div>
            </header>

            <CustomersClient initialCustomers={customers || []} />
        </main>
    );
}
