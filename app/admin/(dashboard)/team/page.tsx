import React, { Suspense } from 'react';


import TeamList from '@/components/admin/TeamList';
import { Search, Mail, Shield, UserPlus, MoreVertical, Loader2 } from 'lucide-react';
import { getTeamMembers, inviteUser, updateRole } from '@/app/actions/admin/users';

export const dynamic = 'force-dynamic';

export default async function TeamPage() {
    // Fetch Team Members
    // The server action now enforces the check, so if it fails, we handle it.
    const response = await getTeamMembers();

    if (response.error) {
        if (response.error.includes('Unauthorized')) {
            return (
                <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">
                    <div className="text-center">
                        <Shield className="w-16 h-16 text-zinc-300 mx-auto mb-4" />
                        <h1 className="text-xl font-bold text-zinc-900 dark:text-white">Access Denied</h1>
                        <p className="text-zinc-500 mt-2">Only the Super Admin can view this page.</p>
                    </div>
                </div>
            );
        }
        return <div className="p-8 text-red-500">Error: {response.error}</div>;
    }

    const profiles = response.data;

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans">
            <main className="flex-1 p-4 md:p-8 lg:p-12 overflow-y-auto w-full">
                <div className="flex justify-between items-center mb-12">
                    <div>
                        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Team Management</h1>
                        <p className="text-zinc-500">View and manage your team members.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                            <input type="text" placeholder="Search members..." className="pl-10 pr-4 py-2 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm focus:outline-none focus:border-indigo-600" />
                        </div>
                    </div>
                </div>

                <TeamList initialProfiles={profiles || []} />

                <Suspense fallback={<div>Loading logs...</div>}>
                    <AuditLogsSection />
                </Suspense>
            </main>
        </div>
    );
}

async function AuditLogsSection() {
    const { getAdminLogs } = await import('@/app/actions/admin/logs');
    const { default: AuditLogs } = await import('@/components/admin/AuditLogs');

    const { data: logs } = await getAdminLogs();

    return <AuditLogs logs={logs || []} />;
}
