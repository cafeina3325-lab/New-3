import React from "react";
import { StarRating } from "../../common/StarRating";

interface ReviewFormReviewInfoProps {
    content: string;
    setContent: (val: string) => void;
    rating: number;
    setRating: (val: number) => void;
}

export const ReviewFormReviewInfo: React.FC<ReviewFormReviewInfoProps> = ({
    content, setContent, rating, setRating
}) => {
    return (
        <>
            {/* Review Content */}
            <div className="space-y-1">
                <label className="text-xs md:text-base text-gray-400 font-medium flex items-center justify-between">
                    <span>Review</span>
                    <span className="text-xs md:text-base text-gray-500 font-normal ml-1">선택사항</span>
                </label>
                <textarea
                    value={content} onChange={(e) => setContent(e.target.value)}
                    placeholder="멋진 타투 경험을 공유해주세요!" rows={4}
                    className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white focus:outline-none focus:border-red-900/50 transition-colors resize-none text-xs md:text-base"
                />
            </div>

            {/* Rating */}
            <div className="space-y-1">
                <label className="text-xs md:text-base text-gray-400 font-medium">Rating <span className="text-red-400">*</span></label>
                <div className="flex items-center gap-1">
                    <StarRating rating={rating} isEditable={true} onRatingChange={setRating} size={28} />
                    <span className="ml-3 text-xs md:text-base text-yellow-500/90 font-medium">{rating} Points</span>
                </div>
            </div>
        </>
    );
};
