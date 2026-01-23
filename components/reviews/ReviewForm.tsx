'use client';

import { useState } from 'react';
import { submitReview } from '@/app/actions/reviews';

export function ReviewForm({ productId }: { productId: string }) {
    const [rating, setRating] = useState(5);
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(formData: FormData) {
        setIsSubmitting(true);
        setMessage('');

        // Append extra data
        formData.set('rating', rating.toString());
        formData.set('productId', productId);

        const result = await submitReview(formData);

        if (result.error) {
            setMessage(`Error: ${result.error}`);
        } else {
            setMessage('Success: Review submitted for approval!');
            // Reset form or close modal here
        }
        setIsSubmitting(false);
    }

    return (
        <div className="bg-white/5 p-6 rounded-xl border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-4">Write a Review</h3>

            <form action={handleSubmit} className="space-y-4">
                {/* Rating Stars */}
                <div>
                    <label className="block text-sm text-gray-400 mb-1">Rating</label>
                    <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                className={`text-2xl ${rating >= star ? 'text-yellow-400' : 'text-gray-600'}`}
                            >
                                ★
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm text-gray-400 mb-1">Title</label>
                    <input
                        name="title"
                        required
                        className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                        placeholder="Great service!"
                    />
                </div>

                <div>
                    <label className="block text-sm text-gray-400 mb-1">Review</label>
                    <textarea
                        name="content"
                        required
                        rows={4}
                        className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                        placeholder="Tell us about your experience..."
                    />
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-colors disabled:opacity-50"
                >
                    {isSubmitting ? 'Submitting...' : 'Submit Review'}
                </button>

                {message && (
                    <p className={`text-sm text-center ${message.startsWith('Error') ? 'text-red-400' : 'text-green-400'}`}>
                        {message}
                    </p>
                )}
            </form>
        </div>
    );
}
