import React from 'react';
import UserMenuServer from './UserMenuServer';
import NotificationsMenuServer from './NotificationsMenuServer';
import HeaderSearch from './HeaderSearch';
import HeaderTitle from './HeaderTitle';

export default function AdminHeader() {
    return (
        <header className="sticky top-0 z-20 w-full bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 px-4 py-3 flex items-center justify-between">
            {/* Left: Title & Search Trigger */}
            <div className="flex items-center gap-4 flex-1">
                <HeaderTitle />
                <HeaderSearch />
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3">
                <NotificationsMenuServer />
                <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-800 mx-1" />
                <UserMenuServer />
            </div>
        </header>
    );
}
