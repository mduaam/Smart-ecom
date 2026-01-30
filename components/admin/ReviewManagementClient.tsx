'use client';

import { useState } from 'react';
import { updateReviewStatus, replyToReview, deleteReview } from '@/app/actions/reviews';
import { Star, MessageSquare, Check, X, Trash2, Calendar, User, Mail, ShieldCheck, AlertCircle } from 'lucide-react';

export function ReviewManagementClient({ reviews: initialReviews }: { reviews: any[] }) {
    const [reviews, setReviews] = useState(initialReviews);
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [replyText, setReplyText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [filter, setFilter] = useState<'all' | 'pending' | 'published' | 'rejected'>('all');

    const filteredReviews = reviews.filter(r => filter === 'all' || r.status === filter);

    async function handleStatusUpdate(id: string, status: 'published' | 'rejected') {
        const res = await updateReviewStatus(id, status);
        if (res.success) {
            setReviews(reviews.map(r => r.id === id ? { ...r, status } : r));
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('Are you sure you want to delete this review? This action cannot be undone.')) return;
        const res = await deleteReview(id);
        if (res.success) {
            setReviews(reviews.filter(r => r.id !== id));
        }
    }

    async function handleReply(id: string) {
        if (!replyText.trim()) return;
        setIsSubmitting(true);
        const res = await replyToReview(id, replyText);
        if (res.success) {
            setReviews(reviews.map(r => r.id === id ? { ...r, admin_reply: replyText } : r));
            setReplyingTo(null);
            setReplyText('');
        }
        setIsSubmitting(false);
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Filter Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl">
                <div className="flex gap-1">
                    {['all', 'pending', 'published', 'rejected'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f as any)}
                            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${filter === f
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 font-extrabold'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            {f.charAt(0).toUpperCase() + f.slice(1)}
                            {f !== 'all' && (
                                <span className={`ml-2 px-2 py-0.5 rounded-full text-[10px] ${filter === f ? 'bg-blue-200 text-blue-800' : 'bg-white/10 text-gray-400'
                                    }`}>
                                    {reviews.filter(r => r.status === f).length}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                <div className="px-4 text-xs font-medium text-gray-500 uppercase tracking-widest hidden md:block">
                    {filteredReviews.length} Result{filteredReviews.length !== 1 ? 's' : ''} Found
                </div>
            </div>

            {/* Review Cards Grid */}
            <div className="grid gap-6">
                {filteredReviews.map((review) => (
                    <div
                        key={review.id}
                        className="group bg-gradient-to-b from-white/[0.08] to-transparent backdrop-blur-sm border border-white/10 rounded-3xl overflow-hidden hover:border-white/20 transition-all duration-500 shadow-2xl"
                    >
                        <div className="flex flex-col lg:flex-row">
                            {/* Left: User Info */}
                            <div className="lg:w-72 p-8 lg:border-r border-white/5 flex flex-col items-center lg:items-start text-center lg:text-left bg-white/[0.02]">
                                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center p-0.5 mb-4 shadow-xl rotate-3 group-hover:rotate-0 transition-transform duration-500">
                                    <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
                                        <User className="text-blue-400" size={28} />
                                    </div>
                                </div>
                                <h4 className="text-white font-bold text-lg truncate w-full">{review.profile?.full_name || 'Anonymous User'}</h4>
                                <p className="text-gray-500 text-xs flex items-center gap-2 mt-1 truncate w-full">
                                    <Mail size={12} /> {review.profile?.email || 'No email provided'}
                                </p>
                                <div className="mt-4 pt-4 border-t border-white/5 w-full flex flex-col gap-2">
                                    <span className="text-[10px] text-gray-600 uppercase font-extrabold tracking-widest">Date Submitted</span>
                                    <p className="text-gray-400 text-xs flex items-center gap-2 font-mono">
                                        <Calendar size={12} /> {new Date(review.created_at).toLocaleDateString(undefined, {
                                            month: 'short', day: 'numeric', year: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>

                            {/* Center: Content */}
                            <div className="relative flex-1 p-8 lg:p-10">
                                <div className="flex justify-between items-start gap-4 mb-4">
                                    <div className="space-y-1">
                                        <div className="flex gap-1 mb-2">
                                            {[1, 2, 3, 4, 5].map(s => (
                                                <Star
                                                    key={s}
                                                    size={16}
                                                    className={s <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-700'}
                                                />
                                            ))}
                                        </div>
                                        <h3 className="text-2xl font-black text-white leading-tight tracking-tight">{review.title}</h3>
                                    </div>
                                    <div className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-[0.2em] uppercase border ${review.status === 'published' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                        review.status === 'rejected' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                            'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                                        }`}>
                                        {review.status}
                                    </div>
                                </div>

                                <p className="text-gray-300 text-lg leading-relaxed mb-8 italic font-medium">
                                    "{review.content}"
                                </p>

                                {review.image_url && (
                                    <div className="mb-8">
                                        <div className="text-[10px] text-gray-600 uppercase font-extrabold tracking-widest mb-3">Attached Proof</div>
                                        <a href={review.image_url} target="_blank" rel="noopener noreferrer" className="inline-block relative overflow-hidden rounded-2xl border border-white/10 group/img">
                                            <img
                                                src={review.image_url}
                                                className="h-32 w-auto object-cover hover:scale-105 transition-transform duration-500"
                                                alt="Review"
                                            />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-opacity text-white text-[10px] font-bold">
                                                VIEW FULL
                                            </div>
                                        </a>
                                    </div>
                                )}

                                {review.admin_reply && (
                                    <div className="bg-blue-600/5 backdrop-blur-sm border border-blue-500/20 p-6 rounded-3xl mb-8 group/reply">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <ShieldCheck className="text-blue-500" size={16} />
                                                <span className="text-[10px] text-blue-400 font-black uppercase tracking-[0.15em]">Admin Response</span>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    setReplyText(review.admin_reply);
                                                    setReplyingTo(review.id);
                                                }}
                                                className="text-white/40 hover:text-blue-400 text-[10px] font-bold transition-colors opacity-0 group-hover/reply:opacity-100"
                                            >
                                                EDIT REPLY
                                            </button>
                                        </div>
                                        <p className="text-gray-400 text-sm italic font-medium">
                                            {review.admin_reply}
                                        </p>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="flex flex-wrap items-center gap-3 pt-6 border-t border-white/5">
                                    {review.status !== 'published' && (
                                        <button
                                            onClick={() => handleStatusUpdate(review.id, 'published')}
                                            className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-2xl text-xs font-black uppercase tracking-wider hover:bg-green-600 transition-all shadow-lg shadow-green-500/20 active:scale-95"
                                        >
                                            <Check size={16} strokeWidth={3} /> Approve Review
                                        </button>
                                    )}
                                    {review.status !== 'rejected' && (
                                        <button
                                            onClick={() => handleStatusUpdate(review.id, 'rejected')}
                                            className="flex items-center gap-2 px-6 py-3 bg-red-500/10 text-red-500 border border-red-500/20 rounded-2xl text-xs font-black uppercase tracking-wider hover:bg-red-500 hover:text-white transition-all active:scale-95"
                                        >
                                            <X size={16} strokeWidth={3} /> Reject
                                        </button>
                                    )}
                                    {!review.admin_reply && (
                                        <button
                                            onClick={() => {
                                                setReplyingTo(review.id);
                                                setReplyText('');
                                            }}
                                            className="flex items-center gap-2 px-6 py-3 bg-blue-600/10 text-blue-400 border border-blue-600/20 rounded-2xl text-xs font-black uppercase tracking-wider hover:bg-blue-600 hover:text-white transition-all active:scale-95"
                                        >
                                            <MessageSquare size={16} /> Send Reply
                                        </button>
                                    )}
                                    <div className="flex-1" />
                                    <button
                                        onClick={() => handleDelete(review.id)}
                                        className="p-3 text-gray-700 hover:text-red-500 hover:bg-red-500/10 rounded-2xl transition-all"
                                        title="Delete Permanently"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>

                                {/* Reply Editor Overlay */}
                                {replyingTo === review.id && (
                                    <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-xl p-8 lg:p-10 flex flex-col animate-in fade-in zoom-in duration-300 rounded-3xl z-10">
                                        <div className="flex justify-between items-center mb-6">
                                            <h5 className="text-white font-black uppercase tracking-[0.2em] text-sm">Craft Response</h5>
                                            <button onClick={() => setReplyingTo(null)} className="text-gray-500 hover:text-white transition-colors">
                                                <X size={24} />
                                            </button>
                                        </div>
                                        <textarea
                                            value={replyText}
                                            onChange={(e) => setReplyText(e.target.value)}
                                            autoFocus
                                            className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-6 text-white text-lg focus:outline-none focus:border-blue-500 transition-colors mb-6 resize-none placeholder:text-gray-700"
                                            placeholder="Example: Thank you for your feedback! We're glad you enjoyed our service..."
                                        />
                                        <div className="flex justify-end gap-3">
                                            <button
                                                onClick={() => setReplyingTo(null)}
                                                className="px-8 py-4 text-gray-500 hover:text-white font-black uppercase text-xs tracking-widest transition-colors"
                                            >
                                                Discard
                                            </button>
                                            <button
                                                disabled={isSubmitting || !replyText.trim()}
                                                onClick={() => handleReply(review.id)}
                                                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all disabled:opacity-50 shadow-xl shadow-blue-500/20"
                                            >
                                                {isSubmitting ? 'Sending...' : 'Publish Response'}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}

                {filteredReviews.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-32 bg-white/5 rounded-3xl border border-dashed border-white/10 opacity-50">
                        <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6">
                            <AlertCircle className="text-gray-600" size={48} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-500 mb-2">No Reviews Found</h3>
                        <p className="text-gray-600 text-sm max-w-xs text-center">There are no reviews matching the current filter. Try selecting a different category.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
