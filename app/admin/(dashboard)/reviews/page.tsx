import { getAdminReviews } from '@/app/actions/reviews';
// Force rebuild
import { ReviewManagementClient } from '@/components/admin/ReviewManagementClient';

export default async function ReviewsPage() {
    const { data: reviews, error } = await getAdminReviews();

    if (error) {
        return (
            <div className="p-8">
                <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-xl">
                    Error loading reviews: {error}
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 lg:p-12 max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
                <div>
                    <h1 className="text-4xl font-extrabold text-white tracking-tight">Review Moderation</h1>
                    <p className="text-gray-400 mt-2 text-lg">Manage, approve, and reply to customer feedback.</p>
                </div>
                <div className="bg-white/5 px-4 py-2 rounded-xl border border-white/10">
                    <span className="text-gray-400 text-sm font-medium">Total Reviews: </span>
                    <span className="text-white font-bold">{reviews?.length || 0}</span>
                </div>
            </div>

            <ReviewManagementClient reviews={reviews || []} />
        </div>
    );
}
