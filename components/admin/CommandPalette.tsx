'use client';

import * as React from 'react';
import { Command } from 'cmdk';
import { Search, ShoppingBag, Users, Ticket, Tag, Settings, Home, LogOut, Package } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export function CommandPalette() {
    const [open, setOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };

        document.addEventListener('keydown', down);
        return () => document.removeEventListener('keydown', down);
    }, []);

    const runCommand = (command: () => void) => {
        setOpen(false);
        command();
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-2xl px-4">
                <Command className="w-full rounded-xl border border-zinc-800 bg-zinc-900 shadow-2xl overflow-hidden">
                    <div className="flex items-center border-b border-zinc-800 px-3">
                        <Search className="mr-2 h-5 w-5 shrink-0 text-zinc-500" />
                        <Command.Input
                            placeholder="Type a command or search..."
                            className="flex h-14 w-full bg-transparent py-3 text-lg outline-none text-white placeholder:text-zinc-500 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                    </div>
                    <Command.List className="max-h-[60vh] overflow-y-auto p-2">
                        <Command.Empty className="py-6 text-center text-sm text-zinc-500">No results found.</Command.Empty>

                        <Command.Group heading="Navigation" className="text-xs font-medium text-zinc-500 mb-2">
                            <CommandItem icon={Home} onSelect={() => runCommand(() => router.push('/admin/dashboard'))}>
                                Dashboard
                            </CommandItem>
                            <CommandItem icon={ShoppingBag} onSelect={() => runCommand(() => router.push('/admin/orders'))}>
                                Orders
                            </CommandItem>
                            <CommandItem icon={Users} onSelect={() => runCommand(() => router.push('/admin/customers'))}>
                                Customers
                            </CommandItem>
                            <CommandItem icon={Ticket} onSelect={() => runCommand(() => router.push('/admin/inbox'))}>
                                Inbox / Support
                            </CommandItem>
                            <CommandItem icon={Tag} onSelect={() => runCommand(() => router.push('/admin/coupons'))}>
                                Coupons & Discounts
                            </CommandItem>
                            <CommandItem icon={Package} onSelect={() => runCommand(() => router.push('/admin/products'))}>
                                Products & Plans
                            </CommandItem>
                        </Command.Group>

                        <Command.Group heading="Account" className="text-xs font-medium text-zinc-500 mb-2 mt-4">
                            <CommandItem icon={Settings} onSelect={() => runCommand(() => router.push('/admin/settings'))}>
                                Settings
                            </CommandItem>
                            <CommandItem icon={LogOut} onSelect={() => runCommand(() => console.log('Logout'))}>
                                Logout
                            </CommandItem>
                        </Command.Group>
                    </Command.List>
                </Command>
            </div>
        </div>
    );
}

function CommandItem({ children, icon: Icon, onSelect }: { children: React.ReactNode; icon: any; onSelect: () => void }) {
    return (
        <Command.Item
            onSelect={onSelect}
            className="flex items-center gap-3 px-4 py-3 text-sm text-zinc-300 rounded-lg cursor-pointer hover:bg-zinc-800 hover:text-white transition-colors aria-selected:bg-zinc-800 aria-selected:text-white"
        >
            <Icon className="w-4 h-4" />
            <span>{children}</span>
        </Command.Item>
    );
}
