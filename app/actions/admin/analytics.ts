
'use server';

import { getAdminSupabase } from '@/lib/supabase-server';
import { assertAdmin } from '../auth';

export async function getDeepAnalytics() {
    await assertAdmin();
    const supabase = await getAdminSupabase();

    // 1. Fetch Parallel Data
    const [
        { data: orders },
        { data: subs },
        { data: tickets },
        { data: reviews }
    ] = await Promise.all([
        supabase.from('orders').select('created_at, final_amount, plan_name, payment_status'),
        supabase.from('subscriptions').select('created_at, status, plan_id'),
        supabase.from('tickets').select('created_at, status, priority'),
        supabase.from('reviews').select('created_at, rating')
    ]);

    const paidOrders = orders?.filter(o => o.payment_status === 'paid') || [];

    // Revenue by Plan
    const revenueByPlan: Record<string, number> = {};
    paidOrders.forEach(o => {
        const plan = o.plan_name || 'Other';
        revenueByPlan[plan] = (revenueByPlan[plan] || 0) + (o.final_amount || 0);
    });

    const revenueByPlanData = Object.entries(revenueByPlan).map(([name, value]) => ({ name, value }));

    // Support Performance
    const ticketStats = {
        total: tickets?.length || 0,
        open: tickets?.filter(t => t.status === 'open').length || 0,
        closed: tickets?.filter(t => t.status === 'closed').length || 0,
        urgent: tickets?.filter(t => t.priority === 'urgent' && t.status === 'open').length || 0
    };

    // Satisfaction
    const avgRating = reviews?.length
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

    return {
        revenueByPlan: revenueByPlanData,
        support: ticketStats,
        satisfaction: avgRating.toFixed(1),
        totalOrders: orders?.length || 0,
        totalRevenue: paidOrders.reduce((sum, o) => sum + (o.final_amount || 0), 0)
    };
}
