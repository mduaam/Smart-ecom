'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Sidebar from './Sidebar';
import { AnimatePresence, motion } from 'framer-motion';

export default function AdminShell({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950">
            {/* Desktop Sidebar (Persistent) */}
            <Sidebar />

            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 -ml-2 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                    <span className="font-bold text-lg dark:text-white">Admin Panel</span>
                </div>
            </div>

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsSidebarOpen(false)}
                            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                        />

                        {/* Drawer */}
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 left-0 z-50 w-64 lg:hidden"
                        >
                            <Sidebar
                                className="flex h-full w-full shadow-2xl"
                                onLinkClick={() => setIsSidebarOpen(false)}
                            />
                            <button
                                onClick={() => setIsSidebarOpen(false)}
                                className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-screen pt-[60px] lg:pt-0">
                {children}
            </div>
        </div>
    );
}
