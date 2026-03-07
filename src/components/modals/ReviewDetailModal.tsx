"use client";

import React from "react";
import { Review } from "../../types/review";
import { useReviewDetail } from "../../hooks/useReviewDetail";
import { ReviewDetailImage } from "./review-detail/ReviewDetailImage";
import { ReviewDetailHeader } from "./review-detail/ReviewDetailHeader";
import { ReviewDetailContent } from "./review-detail/ReviewDetailContent";
import { ReviewDetailActions } from "./review-detail/ReviewDetailActions";
import { StarRating } from "../common/StarRating";

interface ReviewDetailModalProps {
    isOpen: boolean;
    review: Review | null;
    onClose: () => void;
    onDeleteSuccess?: () => void;
}

export default function ReviewDetailModal({ isOpen, review, onClose, onDeleteSuccess }: ReviewDetailModalProps) {
    const {
        mode, setMode, isSubmitting,
        editName, setEditName, editIsAnonymous, setEditIsAnonymous,
        editPhone, setEditPhone, editGenre, setEditGenre,
        editContent, setEditContent, editRating, setEditRating,
        editImagePreview, fileInputRef,
        displayMaskedName, handleImageChange, handleVerifyPassword, handleUpdate, handleDelete,
        verifyPassword, setVerifyPassword, deletePassword, setDeletePassword
    } = useReviewDetail(isOpen, review, onClose, onDeleteSuccess);

    if (!isOpen || !review) return null;

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-pointer" onClick={onClose} />

            <div className="relative w-full max-w-2xl bg-[#1a1412] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
                <CloseButton onClick={onClose} />

                <ReviewDetailImage isEditing={mode === "edit"} imageUrl={review.imageUrl} imagePreview={editImagePreview} fileInputRef={fileInputRef} handleImageChange={handleImageChange} />

                <div className="p-4 xs:p-6 sm:p-8 overflow-y-auto w-full">
                    <ReviewDetailHeader isEditing={mode === "edit"} review={review} editName={editName} setEditName={setEditName} editIsAnonymous={editIsAnonymous} setEditIsAnonymous={setEditIsAnonymous} editPhone={editPhone} setEditPhone={setEditPhone} editGenre={editGenre} setEditGenre={setEditGenre} displayMaskedName={displayMaskedName} onClose={onClose} />

                    <ReviewDetailContent isEditing={mode === "edit"} content={review.content} editContent={editContent} setEditContent={setEditContent} />

                    <div className="flex flex-col sm:flex-row sm:items-end justify-between pt-6 border-t border-white/5 gap-6">
                        <div className="flex items-center gap-2">
                            <ReviewDetailActions mode={mode} setMode={setMode} isSubmitting={isSubmitting} verifyPassword={verifyPassword} setVerifyPassword={setVerifyPassword} deletePassword={deletePassword} setDeletePassword={setDeletePassword} handleUpdate={handleUpdate} handleDelete={handleDelete} handleVerifyPassword={handleVerifyPassword} />
                        </div>

                        <div className="flex flex-col items-end gap-2">
                            <StarRating rating={mode === "edit" ? editRating : review.rating} isEditable={mode === "edit"} onRatingChange={setEditRating} />
                            <div className="text-gray-500 text-xs md:text-sm font-medium">
                                {new Date(review.createdAt).toLocaleString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const CloseButton = ({ onClick }: { onClick: () => void }) => (
    <button onClick={onClick} className="absolute top-2 right-2 xs:top-4 xs:right-4 z-10 p-2 bg-black/40 rounded-full text-white/50 hover:text-white transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" className="xs:w-5 xs:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
    </button>
);
