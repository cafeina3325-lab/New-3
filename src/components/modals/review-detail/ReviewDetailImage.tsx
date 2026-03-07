import React from "react";
import { ReviewDetailMode } from "../../../types/review";

interface ReviewDetailImageProps {
    isEditing: boolean;
    imageUrl?: string;
    imagePreview: string | null;
    fileInputRef: React.RefObject<HTMLInputElement | null>;
    handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ReviewDetailImage: React.FC<ReviewDetailImageProps> = ({
    isEditing,
    imageUrl,
    imagePreview,
    fileInputRef,
    handleImageChange,
}) => {
    if (!isEditing && !imageUrl) return null;

    return (
        <div className="w-full h-[30vh] xs:h-[35vh] sm:h-[40vh] md:h-[50vh] bg-black/50 overflow-hidden flex-shrink-0 relative">
            {isEditing ? (
                <div
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition-colors group"
                >
                    {imagePreview ? (
                        <>
                            <img src={imagePreview} alt="preview" className="w-full h-full object-contain" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                <span className="text-white text-sm font-bold">이미지 변경</span>
                            </div>
                        </>
                    ) : (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-white/20 mb-2">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                                <polyline points="21 15 16 10 5 21"></polyline>
                            </svg>
                            <span className="text-white/40 text-sm">클릭하여 이미지 추가</span>
                        </>
                    )}
                    <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
                </div>
            ) : (
                <img src={imageUrl} alt="review image" className="w-full h-full object-contain" />
            )}
        </div>
    );
};
