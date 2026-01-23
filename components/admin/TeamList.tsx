'use client';

import { useState } from 'react';
import { Plus, MoreVertical, Shield, User, Mail, Check, X, Loader2, Trash2 } from 'lucide-react';
import { inviteUser, updateRole, deleteUser } from '@/app/actions/admin/users';
import { useRouter } from 'next/navigation';

interface Profile {
    id: string;
    email: string;
    role: string;
    full_name: string | null;
    created_at: string;
}

export default function TeamList({ initialProfiles }: { initialProfiles: Profile[] | null }) {
    const router = useRouter();
    const [profiles, setProfiles] = useState<Profile[]>(initialProfiles || []);
    const [isInviteOpen, setIsInviteOpen] = useState(false);
    const [isInviting, setIsInviting] = useState(false);
    const [inviteError, setInviteError] = useState('');
    const [selectedRole, setSelectedRole] = useState('admin');

    const handleInvite = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsInviting(true);
        setInviteError('');

        const formData = new FormData(e.currentTarget);
        const email = formData.get('email') as string;
        const role = formData.get('role') as string;

        const result = await inviteUser(email, role);

        if (result.error) {
            setInviteError(result.error);
        } else {
            setIsOpen(false);
            router.refresh(); // Refresh to show new user
        }
        setIsInviting(false);
    };

    const handleRoleUpdate = async (userId: string, newRole: string) => {
        await updateRole(userId, newRole);
        router.refresh(); // Optimistic update would be better but this is fine for now
    };

    const setIsOpen = (open: boolean) => {
        setIsInviteOpen(open);
        if (!open) setInviteError('');
    };

    const handleDelete = async (userId: string) => {
        if (confirm('Are you sure you want to remove this team member? This cannot be undone.')) {
            await deleteUser(userId);
            // Error handling could be improved here with a toast
            router.refresh();
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white dark:bg-zinc-900 p-6 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <div>
                    <h1 className="text-2xl font-bold dark:text-white">Team Members</h1>
                    <p className="text-zinc-500">Manage who has access to the admin dashboard.</p>
                </div>
                <button
                    onClick={() => setIsOpen(true)}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
                >
                    <Plus className="w-5 h-5" />
                    Invite Member
                </button>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-zinc-50 dark:bg-zinc-950/50 border-b border-zinc-200 dark:border-zinc-800">
                            <tr>
                                <th className="text-left py-4 px-8 text-xs font-bold text-zinc-400 uppercase tracking-widest">User</th>
                                <th className="text-left py-4 px-8 text-xs font-bold text-zinc-400 uppercase tracking-widest">Role</th>
                                <th className="text-left py-4 px-8 text-xs font-bold text-zinc-400 uppercase tracking-widest">Status</th>
                                <th className="text-left py-4 px-8 text-xs font-bold text-zinc-400 uppercase tracking-widest">Joined</th>
                                <th className="text-right py-4 px-8 text-xs font-bold text-zinc-400 uppercase tracking-widest">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                            {profiles.map((profile) => (
                                <tr key={profile.id} className="group hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
                                    <td className="py-5 px-8">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                                                {profile.email?.[0]?.toUpperCase() || '?'}
                                            </div>
                                            <div>
                                                <p className="font-bold dark:text-white">{profile.full_name || 'No Name'}</p>
                                                <p className="text-xs text-zinc-500">{profile.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-5 px-8">
                                        <div className="flex items-center gap-2">
                                            <Shield className="w-4 h-4 text-zinc-400" />
                                            <select
                                                defaultValue={profile.role}
                                                onChange={(e) => handleRoleUpdate(profile.id, e.target.value)}
                                                className="bg-transparent text-sm font-medium dark:text-zinc-300 focus:outline-none cursor-pointer"
                                            >
                                                <option value="owner">Owner</option>
                                                <option value="admin">Admin</option>
                                                <option value="editor">Editor</option>
                                                <option value="viewer">Viewer</option>
                                                <option value="support">Support</option>
                                            </select>
                                        </div>
                                    </td>
                                    <td className="py-5 px-8">
                                        <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-green-100 text-green-600">
                                            Active
                                        </span>
                                    </td>
                                    <td className="py-5 px-8 text-sm text-zinc-500">
                                        {new Date(profile.created_at).toISOString().split('T')[0]}
                                    </td>
                                    <td className="py-5 px-8 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => handleDelete(profile.id)}
                                                className="p-2 hover:bg-red-50 text-zinc-400 hover:text-red-600 rounded-lg transition-colors"
                                                title="Remove User"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Invite Modal */}
            {isInviteOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-zinc-900 rounded-3xl w-full max-w-md border border-zinc-200 dark:border-zinc-800 shadow-2xl p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold dark:text-white">Invite Team Member</h2>
                            <button onClick={() => setIsOpen(false)} className="text-zinc-400 hover:text-zinc-600">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleInvite} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-3.5 w-5 h-5 text-zinc-400" />
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        placeholder="colleague@example.com"
                                        className="w-full pl-12 pr-4 py-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-indigo-600 outline-none dark:text-white"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Role</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {['admin', 'support', 'editor', 'viewer'].map((role) => (
                                        <label
                                            key={role}
                                            className={`border rounded-xl p-3 cursor-pointer transition-all flex items-center gap-2 ${selectedRole === role
                                                ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600'
                                                : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300'
                                                }`}
                                        >
                                            <input
                                                type="radio"
                                                name="role"
                                                value={role}
                                                checked={selectedRole === role}
                                                onChange={(e) => setSelectedRole(e.target.value)}
                                                className="hidden"
                                            />
                                            <span className="capitalize font-bold text-sm">{role}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {inviteError && (
                                <p className="text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-100">
                                    {inviteError}
                                </p>
                            )}

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsOpen(false)}
                                    className="flex-1 py-3 font-bold text-zinc-600 hover:bg-zinc-100 rounded-xl transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isInviting}
                                    className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 disabled:opacity-70 flex items-center justify-center gap-2"
                                >
                                    {isInviting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
