import React from 'react';
import { getUserTickets } from '@/app/actions/tickets';
import { getTranslations } from 'next-intl/server';
import TicketListAuth from '@/components/account/TicketListAuth';

export default async function TicketsPage({ params }: { params: Promise<{ locale: string, userId: string }> }) {
    const { locale, userId } = await params;
    const t = await getTranslations({ locale });
    const { data: tickets, error } = await getUserTickets();

    return (
        <TicketListAuth initialTickets={tickets || []} userId={userId} />
    );
}
