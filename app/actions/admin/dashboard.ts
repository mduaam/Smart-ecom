'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

async function getSupabase() {
    const cookieStore = await cookies();
    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() { return cookieStore.getAll(); },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        );
                    } catch { }
                },
            },
        }
    );
}

export async function getAdminDashboardStats(period: 'daily' | 'monthly' | 'yearly' = 'monthly') {
    const supabase = await getSupabase();

    // Fetch all independent data in parallel
    // ... (keep fetches same, we sort in memory for chart)
    const [
        { data: paidOrders, error: revenueError },
        { data: allOrders, error: ordersError },
        { data: allMembers, error: usersError },
        { count: openTicketsCount, error: ticketsError },
        { data: recentOrders, error: recentOrdersError },
        { data: { user } }
    ] = await Promise.all([
        supabase
            .from('orders')
            .select('created_at, total_amount, metadata')
            .eq('payment_status', 'paid')
            .order('created_at', { ascending: true }),
        supabase.from('orders').select('created_at'),
        supabase.from('members').select('created_at'),
        supabase.from('tickets').select('*', { count: 'exact', head: true }).eq('status', 'open'),
        supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(5),
        supabase.auth.getUser()
    ]);

    // ... (keep trend calculations)
    // Helper to calculate trend
    const calculateTrend = (data: any[], valueKey?: string) => {
        if (!data) return '+0%';
        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

        const currentPeriod = data.filter(item => {
            const d = new Date(item.created_at);
            return d >= thirtyDaysAgo && d <= now;
        });

        const previousPeriod = data.filter(item => {
            const d = new Date(item.created_at);
            return d >= sixtyDaysAgo && d < thirtyDaysAgo;
        });

        let currentVal = currentPeriod.length;
        let prevVal = previousPeriod.length;

        if (valueKey) {
            currentVal = currentPeriod.reduce((sum, item) => sum + (item[valueKey] || 0), 0);
            prevVal = previousPeriod.reduce((sum, item) => sum + (item[valueKey] || 0), 0);
        }

        if (prevVal === 0) return currentVal > 0 ? '+100%' : '0%';

        const change = ((currentVal - prevVal) / prevVal) * 100;
        return (change >= 0 ? '+' : '') + change.toFixed(1) + '%';
    };

    const revenueTrend = calculateTrend(paidOrders || [], 'total_amount');
    const ordersTrend = calculateTrend(allOrders || []);
    const usersTrend = calculateTrend(allMembers || []);

    const totalRevenue = paidOrders?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0;

    const subscriptionStats = {
        basic: 0,
        standard: 0,
        premium: 0
    };

    paidOrders?.forEach((order: any) => {
        const planName = order.metadata?.plan_name?.toLowerCase() || '';
        if (planName.includes('1 month') || planName.includes('basic')) {
            subscriptionStats.basic++;
        } else if (planName.includes('6 months') || planName.includes('standard')) {
            subscriptionStats.standard++;
        } else if (planName.includes('12 months') || planName.includes('premium') || planName.includes('1 year')) {
            subscriptionStats.premium++;
        }
    });

    // Process Chart Data based on Period
    const chartDataMap = new Map<string, { revenue: number, orders: number }>();
    const now = new Date();

    if (period === 'daily') {
        // Last 30 days
        for (let i = 29; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const key = d.toLocaleString('default', { month: 'short', day: 'numeric' }); // Jan 22
            chartDataMap.set(key, { revenue: 0, orders: 0 });
        }
    } else if (period === 'monthly') {
        // Last 12 months
        for (let i = 11; i >= 0; i--) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            const key = d.toLocaleString('default', { month: 'short' }); // Jan
            chartDataMap.set(key, { revenue: 0, orders: 0 });
        }
    } else if (period === 'yearly') {
        // Last 5 years
        for (let i = 4; i >= 0; i--) {
            const d = new Date();
            d.setFullYear(d.getFullYear() - i);
            const key = d.getFullYear().toString(); // 2026
            chartDataMap.set(key, { revenue: 0, orders: 0 });
        }
    }

    paidOrders?.forEach(order => {
        const date = new Date(order.created_at);
        let key = '';

        if (period === 'daily') {
            // Only include if within last 30 days? map keys handle it implicitly by only matching valid keys
            key = date.toLocaleString('default', { month: 'short', day: 'numeric' });
        } else if (period === 'monthly') {
            key = date.toLocaleString('default', { month: 'short' });
        } else if (period === 'yearly') {
            key = date.getFullYear().toString();
        }

        if (chartDataMap.has(key)) {
            const entry = chartDataMap.get(key)!;
            entry.revenue += order.total_amount;
            entry.orders += 1;
        }
    });

    const chartData = Array.from(chartDataMap.entries()).map(([name, stats]) => ({
        name,
        revenue: stats.revenue,
        orders: stats.orders
    }));

    return {
        user,
        stats: {
            revenue: totalRevenue,
            orders: allOrders?.length || 0,
            users: allMembers?.length || 0,
            openTickets: openTicketsCount || 0,
            subscriptions: subscriptionStats,
            trends: {
                revenue: revenueTrend,
                orders: ordersTrend,
                users: usersTrend
            }
        },
        recentOrders: recentOrders || [],
        chartData,
        error: revenueError || ordersError || usersError || ticketsError || recentOrdersError ? 'Error fetching data' : null
    };
}
