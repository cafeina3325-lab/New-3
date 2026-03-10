"use client";

import React, { useEffect, useState } from "react";

interface Review {
    id: string;
    reviewId: string;
    name: string;
    originalName?: string;
    rating: number;
    genre?: string;
    content: string;
    imageUrl?: string;
    phone?: string;
    createdAt: string;
}

interface ReviewDetailModalProps {
    isOpen: boolean;
    reviewId: string | null;
    onClose: () => void;
}

export default function ReviewDetailModal({ isOpen, reviewId, onClose }: ReviewDetailModalProps) {
    const [review, setReview] = useState<Review | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (isOpen && reviewId) {
            fetchReview();
        }
    }, [isOpen, reviewId]);

    const fetchReview = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await fetch(`/api/admin/reviews/single?reviewId=${reviewId}`);
            if (res.ok) {
                const data = await res.json();
                setReview(data.review);
            } else {
                setError("리뷰 정보를 찾을 수 없습니다.");
            }
        } catch (err) {
            console.error("리뷰 페칭 오류:", err);
            setError("데이터를 가져오는 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/90 backdrop-blur-md cursor-pointer"
                onClick={onClose}
            />
            <div
                className="relative w-full max-w-lg bg-[#1a1412] border border-white/20 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5">
                    <h3 className="text-lg font-bold text-white">참고 리뷰 상세</h3>
                    <button onClick={onClose} className="p-2 text-white/50 hover:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[80vh]">
                    {loading ? (
                        <div className="py-20 text-center text-gray-400">정보를 불러오는 중...</div>
                    ) : error ? (
                        <div className="py-20 text-center text-red-400">{error}</div>
                    ) : review ? (
                        <div className="space-y-6">
                            {/* Review Image */}
                            {review.imageUrl && (
                                <div className="aspect-video w-full rounded-xl overflow-hidden border border-white/10 bg-black/40">
                                    <img src={review.imageUrl} alt="Review" className="w-full h-full object-cover" />
                                </div>
                            )}

                            {/* Review Meta */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">작성자</span>
                                    <div className="text-white font-medium mt-1">{review.originalName || review.name}</div>
                                </div>
                                <div className="text-right">
                                    <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">평점</span>
                                    <div className="text-yellow-500 font-bold mt-1">{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</div>
                                </div>
                                <div>
                                    <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">장르</span>
                                    <div className="text-gray-300 mt-1">{review.genre || "-"}</div>
                                </div>
                                <div className="text-right">
                                    <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">작성일</span>
                                    <div className="text-gray-400 mt-1">{new Date(review.createdAt).toLocaleDateString()}</div>
                                </div>
                            </div>

                            {/* Content Text */}
                            <div className="p-4 bg-white/5 rounded-xl border border-white/10 text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                                {review.content}
                            </div>

                            {/* Footer Link */}
                            <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                                <span className="text-[10px] text-gray-600 font-mono">{review.reviewId}</span>
                                <button
                                    onClick={onClose}
                                    className="px-6 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-sm transition-colors"
                                >
                                    확인 완료
                                </button>
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
}
