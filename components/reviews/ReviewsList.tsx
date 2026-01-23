import { getReviews } from '@/app/actions/reviews';

export async function ReviewsList({ productId }: { productId: string }) {
    const { data: reviews, error } = await getReviews(productId);

    if (error) {
        return <div className="text-red-500">Failed to load reviews.</div>;
    }

    if (!reviews || reviews.length === 0) {
        return (
            <div className="text-center text-gray-500 py-8">
                No reviews yet. Be the first to review!
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {reviews.map((review: any) => (
                <div key={review.id} className="bg-white/5 border border-white/10 rounded-xl p-6">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <h4 className="font-semibold text-white">{review.title}</h4>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-yellow-400">{'★'.repeat(review.rating)}</span>
                                <span className="text-gray-400 text-sm">by {review.member?.full_name || 'Anonymous'}</span>
                            </div>
                        </div>
                        <span className="text-xs text-gray-500">
                            {new Date(review.created_at).toLocaleDateString()}
                        </span>
                    </div>

                    <p className="text-gray-300">{review.content}</p>

                    {review.admin_reply && (
                        <div className="mt-4 pl-4 border-l-2 border-indigo-500">
                            <p className="text-sm text-indigo-400 font-medium mb-1">Response from Support:</p>
                            <p className="text-gray-400 text-sm">{review.admin_reply}</p>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
