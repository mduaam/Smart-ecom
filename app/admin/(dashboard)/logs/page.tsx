
import { getAdminSupabase } from '@/lib/supabase-server';
import { assertSuperAdmin } from '@/app/actions/auth';
import { ShieldCheck, History } from 'lucide-react';


export default async function AuditLogsPage() {
    await assertSuperAdmin();
    const supabase = await getAdminSupabase();

    const { data: logs } = await supabase
        .from('admin_activity_logs')
        .select('*, admin:admin_id(email, full_name)')
        .order('created_at', { ascending: false })
        .limit(100);

    return (
        <main className="flex-1 p-4 md:p-8 lg:p-12 overflow-y-auto w-full bg-zinc-50 dark:bg-zinc-950 min-h-screen">
            <div className="flex justify-between items-center mb-12">
                <div>
                    <h1 className="text-3xl font-black text-zinc-900 dark:text-white flex items-center gap-3 tracking-tighter">
                        <ShieldCheck className="w-10 h-10 text-emerald-600" />
                        AUDIT TRAIL
                    </h1>
                    <p className="text-zinc-500 mt-2 font-medium">Security logs and administrative activity history.</p>
                </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 shadow-xl overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-zinc-50 dark:bg-zinc-950/50 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">
                        <tr>
                            <th className="py-6 px-8">Admin</th>
                            <th className="py-6 px-8">Action</th>
                            <th className="py-6 px-8">Entity</th>
                            <th className="py-6 px-8">IP Address</th>
                            <th className="py-6 px-8">Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                        {logs?.map((log: any) => (
                            <tr key={log.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
                                <td className="py-6 px-8">
                                    <p className="font-bold dark:text-white">{log.admin?.full_name || 'System'}</p>
                                    <p className="text-xs text-zinc-500">{log.admin?.email || 'automated@system'}</p>
                                </td>
                                <td className="py-6 px-8 font-black text-xs">
                                    <span className={`px-3 py-1 rounded-full ${log.action.includes('DELETE') ? 'bg-red-500/10 text-red-600' :
                                        log.action.includes('UPDATE') ? 'bg-indigo-500/10 text-indigo-600' :
                                            'bg-zinc-500/10 text-zinc-600'
                                        }`}>
                                        {log.action}
                                    </span>
                                </td>
                                <td className="py-6 px-8 text-sm text-zinc-600 font-medium">
                                    {log.entity_type} <span className="text-zinc-400 opacity-50">#{log.entity_id?.slice(0, 8)}</span>
                                </td>
                                <td className="py-6 px-8 text-xs font-mono text-zinc-400">
                                    {log.ip_address || '---'}
                                </td>
                                <td className="py-6 px-8 text-xs text-zinc-500 font-bold">
                                    {new Date(log.created_at).toLocaleString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {(!logs || logs.length === 0) && (
                    <div className="p-20 text-center flex flex-col items-center">
                        <History className="w-16 h-16 text-zinc-200 mb-4" />
                        <p className="text-zinc-500 italic">No activity logs recorded yet.</p>
                    </div>
                )}
            </div>
        </main>
    );
}
