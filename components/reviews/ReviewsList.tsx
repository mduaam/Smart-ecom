import { getReviews } from '@/app/actions/reviews';
import { Star, User } from 'lucide-react';

export async function ReviewsList({ productId }: { productId: string }) {
    const { data: reviews, error } = await getReviews(productId);

    if (error) {
        return <div className="text-red-500">Failed to load reviews.</div>;
    }

    if (!reviews || reviews.length === 0) {
        return (
            <div className="text-center text-gray-400 py-12 bg-white/5 border border-dashed border-white/10 rounded-2xl">
                <p>No reviews yet. Be the first to share your experience!</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {reviews.map((review: any) => (
                <div key={review.id} className="group bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 shadow-xl">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
                        <div className="flex gap-4">
                            <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center border border-blue-500/30">
                                <User className="text-blue-400" size={24} />
                            </div>
                            <div>
                                <h4 className="font-bold text-white text-lg">{review.title}</h4>
                                <div className="flex items-center gap-3 mt-1">
                                    <div className="flex gap-0.5">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                size={14}
                                                className={star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-700'}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-gray-400 text-sm font-medium">
                                        by {review.profile?.full_name || 'Anonymous User'}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <span className="text-xs text-gray-500 font-mono tracking-tighter uppercase px-2 py-1 bg-white/5 rounded">
                            {new Date(review.created_at).toLocaleDateString(undefined, {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                            })}
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className={`${review.image_url ? 'md:col-span-3' : 'md:col-span-4'}`}>
                            <p className="text-gray-300 leading-relaxed italic">"{review.content}"</p>
                        </div>

                        {review.image_url && (
                            <div className="md:col-span-1">
                                <a href={review.image_url} target="_blank" rel="noopener noreferrer" className="block relative aspect-square rounded-xl overflow-hidden border border-white/10 hover:border-blue-500/50 transition-colors">
                                    <img
                                        src={review.image_url}
                                        alt="Review photo"
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                        <span className="text-xs text-white font-medium bg-black/60 px-2 py-1 rounded">View Photo</span>
                                    </div>
                                </a>
                            </div>
                        )}
                    </div>

                    {review.admin_reply && (
                        <div className="mt-8 pl-6 border-l-4 border-blue-500/50 bg-blue-500/5 py-4 rounded-r-xl">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                                <p className="text-sm text-blue-400 font-bold tracking-wider uppercase">Official Support Response</p>
                            </div>
                            <p className="text-gray-400 text-sm leading-relaxed">{review.admin_reply}</p>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
