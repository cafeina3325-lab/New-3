"use client";

import React from "react";
import { useReviewModal } from "../../hooks/useReviewModal";
import { ReviewFormUserInfo } from "./review-form/ReviewFormUserInfo";
import { ReviewFormTattooInfo } from "./review-form/ReviewFormTattooInfo";
import { ReviewFormReviewInfo } from "./review-form/ReviewFormReviewInfo";

interface ReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export default function ReviewModal({ isOpen, onClose, onSuccess }: ReviewModalProps) {
    const {
        name, setName, isAnonymous, setIsAnonymous,
        password, setPassword, phone, setPhone,
        rating, setRating, genre, setGenre,
        content, setContent, imagePreview, isSubmitting,
        fileInputRef, displayMaskedName, handleImageUpload, handleSubmit
    } = useReviewModal(onClose, onSuccess);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

            <div className="relative w-full max-w-lg bg-[#1a1412] border border-white/10 rounded-xl xs:rounded-2xl shadow-2xl p-4 xs:p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
                <CloseButton onClick={onClose} />

                <h2 className="text-3xl flex-shrink-0 font-extrabold text-gold mb-6 font-libre text-center md:text-left">리뷰 작성</h2>

                <form onSubmit={handleSubmit} className="space-y-4 xs:space-y-6">
                    <ReviewFormUserInfo name={name} setName={setName} isAnonymous={isAnonymous} setIsAnonymous={setIsAnonymous} phone={phone} setPhone={setPhone} password={password} setPassword={setPassword} displayMaskedName={displayMaskedName} />

                    <ReviewFormTattooInfo imagePreview={imagePreview} fileInputRef={fileInputRef} handleImageUpload={handleImageUpload} genre={genre} setGenre={setGenre} />

                    <ReviewFormReviewInfo content={content} setContent={setContent} rating={rating} setRating={setRating} />

                    <SubmitButton isSubmitting={isSubmitting} />
                </form>
            </div>
        </div>
    );
}

const CloseButton = ({ onClick }: { onClick: () => void }) => (
    <button onClick={onClick} className="absolute top-2 right-2 xs:top-4 xs:right-4 p-2 text-white/50 hover:text-white transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
    </button>
);

const SubmitButton = ({ isSubmitting }: { isSubmitting: boolean }) => (
    <button type="submit" disabled={isSubmitting} className={`w-full py-4 mt-4 bg-gradient-to-r from-red-950 to-[#1a0f0c] border border-red-900/30 text-white rounded-lg hover:from-red-900 hover:to-[#2a1814] hover:shadow-[0_0_20px_rgba(153,27,27,0.4)] transition-all font-medium text-sm md:text-base lg:text-lg tracking-wider ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}>
        {isSubmitting ? '게시 중...' : 'Submit Review'}
    </button>
);
