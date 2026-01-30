'use client';

import { useState } from 'react';
import { Plus, MoreVertical, Shield, User, Mail, Check, X, Loader2, Trash2, ShieldAlert, ShieldCheck, Headset } from 'lucide-react';
import { inviteUser, updateRole, deleteUser } from '@/app/actions/admin/users';
import { useRouter } from 'next/navigation';

// Define Role Types properly
type StaffRole = 'admin' | 'super_admin' | 'support';

interface Profile {
    id: string;
    email: string;
    role: string;
    full_name: string | null;
    created_at: string;
    last_sign_in_at?: string; // Optional if available in future
}

const ROLE_CONFIG: Record<string, { label: string, color: string, icon: any }> = {
    'super_admin': { label: 'Super Admin', color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300', icon: ShieldAlert },
    'admin': { label: 'Admin', color: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300', icon: ShieldCheck },
    'support': { label: 'Support Agent', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300', icon: Headset },
    'default': { label: 'Staff', color: 'bg-gray-100 text-gray-700', icon: User }
};

export default function TeamList({ initialProfiles }: { initialProfiles: Profile[] | null }) {
    const router = useRouter();
    const [profiles, setProfiles] = useState<Profile[]>(initialProfiles || []);
    const [isInviteOpen, setIsInviteOpen] = useState(false);
    const [isInviting, setIsInviting] = useState(false);
    const [inviteError, setInviteError] = useState('');
    const [selectedRole, setSelectedRole] = useState<StaffRole>('admin');

    // UI helpers
    const getRoleConfig = (role: string) => ROLE_CONFIG[role] || ROLE_CONFIG['default'];

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
            router.refresh();
        }
        setIsInviting(false);
    };

    const handleRoleUpdate = async (userId: string, newRole: string) => {
        // Optimistic update
        setProfiles(prev => prev.map(p => p.id === userId ? { ...p, role: newRole } : p));

        const result = await updateRole(userId, newRole);
        if (result?.error) {
            // Revert on error
            router.refresh();
            alert(`Failed to update role: ${result.error}`);
        } else {
            router.refresh();
        }
    };

    const setIsOpen = (open: boolean) => {
        setIsInviteOpen(open);
        if (!open) setInviteError('');
    };

    const handleDelete = async (userId: string) => {
        if (confirm('Are you sure you want to remove this team member? This cannot be undone.')) {
            await deleteUser(userId);
            router.refresh();
        }
    };

    return (
        <div className="space-y-8">
            {/* Header Card */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 shadow-xl shadow-zinc-200/50 dark:shadow-none">
                <div>
                    <h1 className="text-3xl font-extrabold dark:text-white tracking-tight text-zinc-900">Team Members</h1>
                    <p className="text-zinc-500 mt-2 font-medium">Manage access and permissions for your dashboard.</p>
                </div>
                <button
                    onClick={() => setIsOpen(true)}
                    className="mt-4 md:mt-0 flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-900 px-6 py-3.5 rounded-2xl font-bold transition-all shadow-lg active:scale-95"
                >
                    <Plus className="w-5 h-5" />
                    Add Member
                </button>
            </div>

            {/* Team Grid (Desktop: Table, Mobile: Cards) */}
            <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 shadow-xl shadow-zinc-200/50 dark:shadow-none overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-zinc-50/50 dark:bg-zinc-950/50 border-b border-zinc-100 dark:border-zinc-800">
                            <tr>
                                <th className="text-left py-6 px-8 text-xs font-bold text-zinc-400 uppercase tracking-widest leading-none">User Profile</th>
                                <th className="text-left py-6 px-8 text-xs font-bold text-zinc-400 uppercase tracking-widest leading-none">Role Access</th>
                                <th className="text-left py-6 px-8 text-xs font-bold text-zinc-400 uppercase tracking-widest leading-none">Status</th>
                                <th className="text-right py-6 px-8 text-xs font-bold text-zinc-400 uppercase tracking-widest leading-none">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                            {profiles.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="py-12 text-center text-zinc-500 font-medium">
                                        No team members found. Invite someone to get started.
                                    </td>
                                </tr>
                            )}
                            {profiles.map((profile) => {
                                const roleConfig = getRoleConfig(profile.role);
                                const RoleIcon = roleConfig.icon;

                                return (
                                    <tr key={profile.id} className="group hover:bg-zinc-50/80 dark:hover:bg-zinc-800/20 transition-colors">
                                        <td className="py-6 px-8">
                                            <div className="flex items-center gap-5">
                                                <div className={`w-12 h-12 rounded-2xl ${roleConfig.color} flex items-center justify-center font-bold text-lg shadow-sm group-hover:scale-110 transition-transform`}>
                                                    {profile.full_name?.[0]?.toUpperCase() || profile.email?.[0]?.toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-zinc-900 dark:text-white text-base">{profile.full_name || 'No Name'}</p>
                                                    <p className="text-sm text-zinc-500 font-medium">{profile.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-6 px-8">
                                            <div className="flex items-center gap-3">
                                                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${roleConfig.color} w-fit`}>
                                                    <RoleIcon className="w-4 h-4" />
                                                    <span className="text-xs font-bold uppercase tracking-wider">{roleConfig.label}</span>
                                                </div>

                                                {/* Role Switcher (Hidden for Super Admin editing self, technically possible but risky) */}
                                                <select
                                                    defaultValue={profile.role}
                                                    onChange={(e) => handleRoleUpdate(profile.id, e.target.value)}
                                                    className="opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity bg-transparent text-xs font-bold text-zinc-500 cursor-pointer border-b border-zinc-300 hover:text-zinc-900 dark:hover:text-white pb-0.5 outline-none"
                                                    title="Change Role"
                                                >
                                                    <option value="super_admin">Super Admin</option>
                                                    <option value="admin">Admin</option>
                                                    <option value="support">Support</option>
                                                </select>
                                            </div>
                                        </td>
                                        <td className="py-6 px-8">
                                            {/* Hardcoded active mostly, unless we track last seen */}
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                                <span className="text-sm font-bold text-zinc-600 dark:text-zinc-400">Active</span>
                                            </div>
                                        </td>
                                        <td className="py-6 px-8 text-right">
                                            <button
                                                onClick={() => handleDelete(profile.id)}
                                                className="p-3 text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
                                                title="Remove Team Member"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Invite Modal */}
            {isInviteOpen && (
                <div className="fixed inset-0 bg-white/80 dark:bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] w-full max-w-lg border border-zinc-200 dark:border-zinc-800 shadow-2xl p-10 animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-10">
                            <div>
                                <h2 className="text-2xl font-bold dark:text-white">Invite Team Member</h2>
                                <p className="text-zinc-500 dark:text-zinc-400 mt-1">Send an invitation to join the admin panel.</p>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
                                <X className="w-6 h-6 text-zinc-500" />
                            </button>
                        </div>

                        <form onSubmit={handleInvite} className="space-y-8">
                            <div className="space-y-3">
                                <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">Email Address</label>
                                <div className="relative group">
                                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 group-focus-within:text-indigo-600 transition-colors" />
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        placeholder="colleague@example.com"
                                        className="w-full pl-14 pr-6 py-4 bg-zinc-50 dark:bg-zinc-950/50 border-2 border-transparent focus:border-indigo-600/20 rounded-2xl focus:ring-0 focus:bg-white dark:focus:bg-zinc-900 transition-all outline-none font-medium dark:text-white"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">Select Role</label>
                                <div className="grid grid-cols-1 gap-3">
                                    {[
                                        { id: 'admin', label: 'Admin', desc: 'Full access to everything except sensitive settings.', icon: ShieldCheck },
                                        { id: 'super_admin', label: 'Super Admin', desc: 'Complete access to all settings and team management.', icon: ShieldAlert },
                                        { id: 'support', label: 'Support Agent', desc: 'Can view orders and tickets, but limited edits.', icon: Headset },
                                    ].map((role) => {
                                        const RIcon = role.icon;
                                        const isSelected = selectedRole === role.id;
                                        return (
                                            <label
                                                key={role.id}
                                                className={`relative border-2 rounded-2xl p-4 cursor-pointer transition-all flex items-center gap-4 ${isSelected
                                                    ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-900/10'
                                                    : 'border-zinc-100 dark:border-zinc-800 hover:border-zinc-200 dark:hover:border-zinc-700'
                                                    }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="role"
                                                    value={role.id}
                                                    checked={isSelected}
                                                    onChange={(e) => setSelectedRole(e.target.value as StaffRole)}
                                                    className="hidden"
                                                />
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${isSelected ? 'bg-indigo-600 text-white' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400'}`}>
                                                    <RIcon className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <h3 className={`font-bold ${isSelected ? 'text-indigo-900 dark:text-indigo-300' : 'text-zinc-900 dark:text-white'}`}>{role.label}</h3>
                                                    <p className="text-xs text-zinc-500 mt-0.5">{role.desc}</p>
                                                </div>
                                                {isSelected && <Check className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-600" />}
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>

                            {inviteError && (
                                <div className="p-4 bg-red-50 text-red-600 rounded-2xl flex items-center gap-3 text-sm font-bold animate-in fade-in slide-in-from-top-2">
                                    <ShieldAlert className="w-5 h-5 flex-shrink-0" />
                                    {inviteError}
                                </div>
                            )}

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsOpen(false)}
                                    className="flex-1 py-4 font-bold text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-2xl transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isInviting}
                                    className="flex-[2] py-4 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-900 font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all disabled:opacity-70 flex items-center justify-center gap-2 active:scale-95"
                                >
                                    {isInviting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send Invitation'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
