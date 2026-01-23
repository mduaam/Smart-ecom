import { getAdminReviews, updateReviewStatus, replyToReview } from '@/app/actions/reviews';
import { redirect } from 'next/navigation';

export default async function ReviewsPage() {
    const { data: reviews, error } = await getAdminReviews();

    if (error) {
        return <div className="p-8 text-red-500">Error loading reviews: {error}</div>;
    }

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold text-white mb-8">Manage Reviews</h1>

            <div className="space-y-6">
                {(reviews || []).map((review: any) => (
                    <div key={review.id} className="bg-white/5 border border-white/10 rounded-xl p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-xl font-semibold text-white">{review.title}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-yellow-400">{'★'.repeat(review.rating)}</span>
                                    <span className="text-gray-400 text-sm">by {review.member?.full_name || 'Unknown'}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${review.status === 'published' ? 'bg-green-500/20 text-green-400' :
                                    review.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                                        'bg-yellow-500/20 text-yellow-400'
                                    }`}>
                                    {review.status.toUpperCase()}
                                </span>
                            </div>
                        </div>

                        <p className="text-gray-300 mb-4">{review.content}</p>

                        {review.admin_reply && (
                            <div className="mb-4 pl-4 border-l-2 border-blue-500">
                                <p className="text-sm text-blue-400 mb-1">Reply:</p>
                                <p className="text-gray-300">{review.admin_reply}</p>
                            </div>
                        )}

                        <div className="flex flex-wrap gap-4 pt-4 border-t border-white/10">
                            {/* Actions Form */}
                            <form action={async () => {
                                'use server';
                                await updateReviewStatus(review.id, 'published');
                            }}>
                                <button className="px-4 py-2 bg-green-600/20 hover:bg-green-600/40 text-green-400 rounded-lg text-sm transition-colors">
                                    Publish
                                </button>
                            </form>

                            <form action={async () => {
                                'use server';
                                await updateReviewStatus(review.id, 'rejected');
                            }}>
                                <button className="px-4 py-2 bg-red-600/20 hover:bg-red-600/40 text-red-400 rounded-lg text-sm transition-colors">
                                    Reject
                                </button>
                            </form>

                            {/* Simple Reply Toggle/Form could go here, for now simpler implementation */}
                        </div>
                    </div>
                ))}

                {reviews?.length === 0 && (
                    <div className="text-center text-gray-500 py-12">
                        No reviews found.
                    </div>
                )}
            </div>
        </div>
    );
}
