'use client';

import { useState, useRef } from 'react';
import { submitReview } from '@/app/actions/reviews';
import { Star, Upload, X, Image as ImageIcon } from 'lucide-react';

export function ReviewForm({ productId }: { productId: string }) {
    const [rating, setRating] = useState(5);
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

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
            setRating(5);
            setImagePreview(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
            // Ideally reset form here
        }
        setIsSubmitting(false);
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="bg-white/5 p-8 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-sm">
            <h3 className="text-xl font-bold text-white mb-6">Write a Review</h3>

            <form action={handleSubmit} className="space-y-6">
                {/* Rating Stars */}
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">How would you rate it?</label>
                    <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                className="focus:outline-none transition-transform hover:scale-110"
                            >
                                <Star
                                    size={32}
                                    className={`${rating >= star ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'}`}
                                />
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-400 mb-2">Review Title</label>
                        <input
                            name="title"
                            required
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-gray-600"
                            placeholder="Summarize your experience..."
                        />
                    </div>

                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-400 mb-2">Review Content</label>
                        <textarea
                            name="content"
                            required
                            rows={4}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-gray-600 resize-none"
                            placeholder="What did you like or dislike? Your feedback helps us improve."
                        />
                    </div>

                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-400 mb-2">Photo (Optional)</label>
                        <div className="flex items-center gap-4">
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-dashed border-white/20 rounded-xl text-gray-300 hover:bg-white/10 hover:border-white/40 transition-all group"
                            >
                                <Upload size={18} className="group-hover:text-blue-400 transition-colors" />
                                <span>Upload Photo</span>
                            </button>
                            <input
                                type="file"
                                name="image"
                                accept="image/*"
                                ref={fileInputRef}
                                onChange={handleImageChange}
                                className="hidden"
                            />

                            {imagePreview && (
                                <div className="relative group">
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="w-16 h-16 object-cover rounded-lg border border-white/10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setImagePreview(null);
                                            if (fileInputRef.current) fileInputRef.current.value = '';
                                        }}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X size={12} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20 active:scale-[0.98]"
                >
                    {isSubmitting ? 'Submitting Review...' : 'Post Review'}
                </button>

                {message && (
                    <div className={`p-4 rounded-xl text-sm text-center ${message.startsWith('Error') ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'}`}>
                        {message}
                    </div>
                )}
            </form>
        </div>
    );
}
