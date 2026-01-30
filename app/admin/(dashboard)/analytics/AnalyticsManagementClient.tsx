
'use client';

import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
    AreaChart, Area
} from 'recharts';
import { TrendingUp, Users, ShoppingBag, Star, ShieldAlert } from 'lucide-react';

const COLORS = ['#6366f1', '#a855f7', '#ec4899', '#f97316', '#eab308'];

export default function AnalyticsManagementClient({ data }: { data: any }) {
    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20">

            {/* KPI Ticker */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                    { label: 'Total Revenue', value: `$${data.totalRevenue.toLocaleString()}`, icon: <TrendingUp className="w-6 h-6" />, color: 'indigo' },
                    { label: 'Customer Satisfaction', value: `${data.satisfaction} / 5.0`, icon: <Star className="w-6 h-6" />, color: 'purple' },
                    { label: 'Open Support Tickets', value: data.support.open.toString(), icon: <ShieldAlert className="w-6 h-6" />, color: 'orange' },
                    { label: 'Total Orders', value: data.totalOrders.toString(), icon: <ShoppingBag className="w-6 h-6" />, color: 'green' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 shadow-xl overflow-hidden group">
                        <div className="flex justify-between items-start mb-6">
                            <div className={`p-4 rounded-2xl bg-${stat.color}-500/10 text-${stat.color}-500`}>
                                {stat.icon}
                            </div>
                        </div>
                        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                        <h3 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tighter">{stat.value}</h3>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Revenue by Plan */}
                <div className="bg-white dark:bg-zinc-900 rounded-[3rem] border border-zinc-200 dark:border-zinc-800 shadow-2xl p-10">
                    <div className="mb-10">
                        <h3 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">REVENUE DISTRIBUTION</h3>
                        <p className="text-zinc-500 text-sm font-medium mt-1">Breakdown of earnings by subscription plan / product.</p>
                    </div>
                    <div className="h-[400px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.revenueByPlan}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#71717a', fontSize: 10, fontWeight: 800 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#71717a', fontSize: 10, fontWeight: 800 }}
                                />
                                <Tooltip
                                    cursor={{ fill: 'transparent' }}
                                    contentStyle={{
                                        backgroundColor: '#18181b',
                                        border: '1px solid #27272a',
                                        borderRadius: '1rem',
                                        fontSize: '12px',
                                        fontWeight: '800'
                                    }}
                                />
                                <Bar dataKey="value" fill="#6366f1" radius={[8, 8, 0, 0]} barSize={40}>
                                    {data.revenueByPlan.map((entry: any, index: number) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Support Matrix */}
                <div className="bg-white dark:bg-zinc-900 rounded-[3rem] border border-zinc-200 dark:border-zinc-800 shadow-2xl p-10 flex flex-col justify-between">
                    <div>
                        <div className="mb-10">
                            <h3 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">SUPPORT PERFORMANCE</h3>
                            <p className="text-zinc-500 text-sm font-medium mt-1">Operational health of your help desk.</p>
                        </div>
                        <div className="space-y-6">
                            {[
                                { label: 'Resolution Rate', value: `${((data.support.closed / (data.support.total || 1)) * 100).toFixed(0)}%`, color: 'bg-green-500' },
                                { label: 'Urgent Load', value: `${data.support.urgent} Active`, color: 'bg-red-500' },
                                { label: 'Total Volume', value: `${data.support.total} Tickets`, color: 'bg-blue-500' },
                            ].map((item, i) => (
                                <div key={i} className="p-6 bg-zinc-50 dark:bg-zinc-950 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-3 h-3 rounded-full ${item.color}`} />
                                        <span className="text-xs font-black uppercase text-zinc-400 tracking-widest">{item.label}</span>
                                    </div>
                                    <span className="text-xl font-black text-zinc-900 dark:text-white uppercase">{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-10 p-6 bg-indigo-600 rounded-[2rem] shadow-lg shadow-indigo-600/20 text-white flex justify-between items-center group cursor-pointer hover:scale-[1.02] transition-all">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-80">System Health</p>
                            <h4 className="text-xl font-black tracking-tight mt-1">OPTIMIZED</h4>
                        </div>
                        <TrendingUp className="w-8 h-8 opacity-50 group-hover:opacity-100 transition-opacity" />
                    </div>
                </div>
            </div>
        </div>
    );
}
