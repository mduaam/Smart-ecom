'use client';

import { useState, useEffect } from 'react';
import {
    Mail, Send, Filter, Users, CheckCircle, AlertCircle, Loader2,
    History, Layout, Plus, Trash2, Eye, Save, Copy, ChevronRight
} from 'lucide-react';
import {
    sendBroadcastEmail, getRecipientCount,
    saveCampaign, deleteCampaign,
    saveTemplate, deleteTemplate,
    sendTestEmail
} from '@/app/actions/admin/marketing';
import RichTextEditor from '@/components/admin/RichTextEditor';

interface MarketingClientProps {
    initialCampaigns: any[];
    initialTemplates: any[];
    initialStats: any;
}

export default function MarketingClient({ initialCampaigns, initialTemplates, initialStats }: MarketingClientProps) {
    const [activeTab, setActiveTab] = useState<'new' | 'history' | 'templates'>('new');
    const [subject, setSubject] = useState('');
    const [content, setContent] = useState('');
    const [filterConfig, setFilterConfig] = useState({ status: 'all', locale: 'all' });
    const [isSending, setIsSending] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    const [recipientCount, setRecipientCount] = useState<number | null>(initialStats?.totalRecipients ?? 0);
    const [campaigns, setCampaigns] = useState(initialCampaigns);
    const [templates, setTemplates] = useState(initialTemplates);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    // Fetch recipient count when filter changes
    useEffect(() => {
        const fetchCount = async () => {
            const res = await getRecipientCount(filterConfig);
            if (res && 'count' in res) setRecipientCount(res.count ?? 0);
        };
        fetchCount();
    }, [filterConfig]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!confirm('Are you sure you want to send this broadcast?')) return;

        setIsSending(true);
        setStatus(null);

        const res = await sendBroadcastEmail(subject, content, filterConfig.status as any);

        if (res.success) {
            setStatus({ type: 'success', message: `Successfully sent broadcast to ${res.count} recipients.` });
            // Save to history
            await saveCampaign(null, {
                subject,
                content,
                filter_config: filterConfig,
                status: 'sent',
                recipients_count: res.count,
                sent_at: new Date().toISOString()
            });
            setSubject('');
            setContent('');
        } else {
            setStatus({ type: 'error', message: res.error || 'Failed to send broadcast.' });
        }
        setIsSending(false);
    };

    const handleSaveDraft = async () => {
        setIsSaving(true);
        const res = await saveCampaign(null, {
            subject,
            content,
            filter_config: filterConfig,
            status: 'draft'
        });
        if (res.success) {
            setStatus({ type: 'success', message: 'Campaign saved as draft.' });
        }
        setIsSaving(false);
    };

    const handleSaveTemplate = async () => {
        const name = prompt('Enter template name:');
        if (!name) return;
        setIsSaving(true);
        const res = await saveTemplate(null, {
            name,
            subject,
            content
        });
        if (res.success) {
            setTemplates([...templates, res.data]);
            setStatus({ type: 'success', message: 'Template saved.' });
        }
        setIsSaving(false);
    };

    const useTemplate = (template: any) => {
        setSubject(template.subject || '');
        setContent(template.content || '');
        setActiveTab('new');
    };

    const handleSendTest = async () => {
        const email = prompt('Enter email address for test:', 'admin@ip-smarters.com');
        if (!email) return;

        setIsSending(true);
        setStatus(null);

        const res = await sendTestEmail(subject, content, email);

        if (res.success) {
            setStatus({ type: 'success', message: `Test email sent to ${email}` });
        } else {
            setStatus({ type: 'error', message: res.error || 'Failed to send test email.' });
        }
        setIsSending(false);
    };

    return (
        <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm transition-all hover:shadow-md">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl text-indigo-600 dark:text-indigo-400">
                            <Users className="w-6 h-6" />
                        </div>
                        <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Total Users</h3>
                    </div>
                    <div className="text-3xl font-black text-zinc-900 dark:text-white">{initialStats.totalRecipients || 0}</div>
                </div>
                <div className="p-6 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm transition-all hover:shadow-md">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-2xl text-green-600 dark:text-green-400">
                            <Send className="w-6 h-6" />
                        </div>
                        <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Sent (Month)</h3>
                    </div>
                    <div className="text-3xl font-black text-zinc-900 dark:text-white">{initialStats.monthlySentCount || 0}</div>
                </div>
                <div className="p-6 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm transition-all hover:shadow-md">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-2xl text-orange-600 dark:text-orange-400">
                            <Layout className="w-6 h-6" />
                        </div>
                        <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Templates</h3>
                    </div>
                    <div className="text-3xl font-black text-zinc-900 dark:text-white">{templates.length}</div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex gap-2 p-1.5 bg-zinc-100 dark:bg-zinc-900/50 rounded-2xl w-fit">
                <button
                    onClick={() => setActiveTab('new')}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'new' ? 'bg-white dark:bg-zinc-800 text-indigo-600 shadow-sm' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'}`}
                >
                    <Plus className="w-4 h-4" /> New Campaign
                </button>
                <button
                    onClick={() => setActiveTab('history')}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'history' ? 'bg-white dark:bg-zinc-800 text-indigo-600 shadow-sm' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'}`}
                >
                    <History className="w-4 h-4" /> History
                </button>
                <button
                    onClick={() => setActiveTab('templates')}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'templates' ? 'bg-white dark:bg-zinc-800 text-indigo-600 shadow-sm' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'}`}
                >
                    <Layout className="w-4 h-4" /> Templates
                </button>
            </div>

            {/* Main Content Area */}
            <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 p-8 shadow-sm">
                {activeTab === 'new' && (
                    <form onSubmit={handleSend} className="space-y-8">
                        {/* Filter Section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 bg-zinc-50 dark:bg-zinc-950 rounded-3xl border border-zinc-200 dark:border-zinc-800">
                            <div className="space-y-4">
                                <label className="text-sm font-black text-zinc-900 dark:text-white flex items-center gap-2 uppercase tracking-tight">
                                    <Filter className="w-4 h-4 text-indigo-600" /> Audience Filter
                                </label>
                                <select
                                    value={filterConfig.status}
                                    onChange={(e) => setFilterConfig({ ...filterConfig, status: e.target.value })}
                                    className="w-full p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl focus:ring-2 focus:ring-indigo-600 outline-none transition-all font-bold"
                                >
                                    <option value="all">All Registered Customers</option>
                                    <option value="paid">Customers with Paid Orders</option>
                                    <option value="active_sub">Active Subscribers Only</option>
                                </select>
                            </div>
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <div className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">Estimated Audience</div>
                                    <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                                        {recipientCount !== null ? recipientCount : <Loader2 className="w-5 h-5 animate-spin" />}
                                        <span className="text-sm font-medium text-zinc-500">Recipients</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">Status</div>
                                    <div className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full text-[10px] font-black uppercase">Ready</div>
                                </div>
                            </div>
                        </div>

                        {/* Composer Section */}
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-zinc-400 uppercase tracking-widest">Email Subject</label>
                                <input
                                    required
                                    type="text"
                                    placeholder="Enter subject line..."
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    className="w-full p-6 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl focus:ring-2 focus:ring-indigo-600 outline-none transition-all font-bold text-xl"
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-xs font-black text-zinc-400 uppercase tracking-widest">Message Content (HTML)</label>
                                    <button
                                        type="button"
                                        onClick={() => setIsPreviewOpen(!isPreviewOpen)}
                                        className="text-xs font-bold text-indigo-600 flex items-center gap-1 hover:underline"
                                    >
                                        <Eye className="w-3.5 h-3.5" /> {isPreviewOpen ? 'Edit Content' : 'Live Preview'}
                                    </button>
                                </div>

                                {isPreviewOpen ? (
                                    <div className="w-full min-h-[400px] p-8 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-auto border-dashed">
                                        <div dangerouslySetInnerHTML={{ __html: content || '<p class="text-zinc-400 italic">No content to preview...</p>' }} />
                                    </div>
                                ) : (
                                    <RichTextEditor
                                        value={content}
                                        onChange={setContent}
                                        placeholder="Type your message here... You can use HTML formatting."
                                        className="min-h-[400px]"
                                    />
                                )}
                            </div>
                        </div>

                        {status && (
                            <div className={`p-4 rounded-2xl flex items-center gap-3 ${status.type === 'success' ? 'bg-green-50 dark:bg-green-900/20 text-green-600 border border-green-200' : 'bg-red-50 dark:bg-red-900/20 text-red-600 border border-red-200'}`}>
                                {status.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                                <span className="text-sm font-bold">{status.message}</span>
                            </div>
                        )}

                        <div className="flex flex-col md:flex-row gap-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                            <button
                                type="submit"
                                disabled={isSending || !subject || !content}
                                className="flex-1 px-8 py-5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-black rounded-3xl shadow-xl shadow-indigo-600/20 transition-all flex items-center justify-center gap-3 group"
                            >
                                {isSending ? <Loader2 className="w-6 h-6 animate-spin" /> : <><Send className="w-6 h-6" /> Send Broadcast Now</>}
                            </button>

                            <button
                                type="button"
                                onClick={handleSendTest}
                                disabled={isSending || !subject}
                                className="px-8 py-5 bg-white dark:bg-zinc-900 border-2 border-dashed border-indigo-200 dark:border-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-bold rounded-3xl hover:border-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/10 transition-all flex items-center justify-center gap-2"
                            >
                                <Send className="w-4 h-4" /> Send Test Email
                            </button>

                            <button
                                type="button"
                                onClick={handleSaveTemplate}
                                disabled={isSaving || !subject || !content}
                                className="px-8 py-5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white font-bold rounded-3xl transition-all flex items-center justify-center gap-2"
                            >
                                {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Layout className="w-5 h-5" /> Save as Template</>}
                            </button>
                            <button
                                type="button"
                                onClick={handleSaveDraft}
                                disabled={isSaving || !subject}
                                className="px-8 py-5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white font-bold rounded-3xl transition-all flex items-center justify-center gap-2"
                            >
                                {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> Save Draft</>}
                            </button>
                        </div>
                    </form>
                )}

                {activeTab === 'history' && (
                    <div className="space-y-6">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-zinc-100 dark:border-zinc-800">
                                        <th className="py-4 text-left text-xs font-black text-zinc-400 uppercase tracking-widest">Campaign</th>
                                        <th className="py-4 text-left text-xs font-black text-zinc-400 uppercase tracking-widest">Status</th>
                                        <th className="py-4 text-left text-xs font-black text-zinc-400 uppercase tracking-widest">Sent To</th>
                                        <th className="py-4 text-left text-xs font-black text-zinc-400 uppercase tracking-widest">Date</th>
                                        <th className="py-4 text-right text-xs font-black text-zinc-400 uppercase tracking-widest">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800/50">
                                    {campaigns.map((camp: any) => (
                                        <tr key={camp.id} className="group hover:bg-zinc-50 dark:hover:bg-zinc-950/50 transition-colors">
                                            <td className="py-5 pr-4">
                                                <div className="font-bold text-zinc-900 dark:text-white truncate max-w-[300px]">{camp.subject}</div>
                                                <div className="text-[10px] text-zinc-400 font-mono mt-0.5 uppercase">{camp.id.slice(0, 8)}</div>
                                            </td>
                                            <td className="py-5">
                                                <span className={`px-2.5 py-1 text-[10px] font-black uppercase rounded-full ${camp.status === 'sent' ? 'bg-green-100 text-green-700 dark:bg-green-900/30' : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800'}`}>
                                                    {camp.status}
                                                </span>
                                            </td>
                                            <td className="py-5 font-bold text-zinc-500 dark:text-zinc-400">
                                                {camp.recipients_count || 0} users
                                            </td>
                                            <td className="py-5 text-sm text-zinc-400">
                                                {camp.sent_at ? new Date(camp.sent_at).toLocaleDateString() : 'Draft'}
                                            </td>
                                            <td className="py-5 text-right font-bold">
                                                <div className="flex justify-end gap-2">
                                                    <button onClick={() => { setSubject(camp.subject); setContent(camp.content); setActiveTab('new'); }} className="p-2 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-xl transition-colors">
                                                        <Copy className="w-4 h-4" />
                                                    </button>
                                                    <button onClick={() => { if (confirm('Delete?')) deleteCampaign(camp.id).then(() => setCampaigns(campaigns.filter(c => c.id !== camp.id))) }} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl transition-colors">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {campaigns.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="py-12 text-center text-zinc-400 font-medium italic">No campaigns found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'templates' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {templates.map((tpl: any) => (
                            <div key={tpl.id} className="p-6 bg-zinc-50 dark:bg-zinc-950 rounded-3xl border border-zinc-200 dark:border-zinc-800 group transition-all hover:border-indigo-600/50">
                                <div className="p-3 bg-white dark:bg-zinc-900 rounded-2xl w-fit mb-4 text-indigo-600 shadow-sm">
                                    <Layout className="w-5 h-5" />
                                </div>
                                <h4 className="font-black text-zinc-900 dark:text-white mb-2">{tpl.name}</h4>
                                <p className="text-xs text-zinc-500 line-clamp-3 mb-6 leading-relaxed">{tpl.subject || 'No subject'}</p>
                                <div className="flex items-center justify-between">
                                    <button
                                        onClick={() => useTemplate(tpl)}
                                        className="text-xs font-black text-indigo-600 hover:underline flex items-center gap-1"
                                    >
                                        Use Template <ChevronRight className="w-3 h-3" />
                                    </button>
                                    <button
                                        onClick={() => { if (confirm('Delete?')) deleteTemplate(tpl.id).then(() => setTemplates(templates.filter(t => t.id !== tpl.id))) }}
                                        className="p-2 text-zinc-400 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                        <button className="flex flex-col items-center justify-center p-8 bg-dashed border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl hover:border-indigo-600 transition-all text-zinc-400 hover:text-indigo-600 gap-3 group">
                            <Plus className="w-8 h-8 group-hover:scale-110 transition-transform" />
                            <span className="text-xs font-bold uppercase tracking-widest">Create Template</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
