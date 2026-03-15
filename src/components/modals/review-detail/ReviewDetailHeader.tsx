import React from "react";
import { Review } from "../../../types/review";

interface ReviewDetailHeaderProps {
    isEditing: boolean;
    review: Review;
    editName: string;
    setEditName: (val: string) => void;
    editIsAnonymous: boolean;
    setEditIsAnonymous: (val: boolean) => void;
    editPhone: string;
    setEditPhone: (val: string) => void;
    editGenre: string;
    setEditGenre: (val: string) => void;
    displayMaskedName: (name: string) => string;
    onClose: () => void;
}

export const ReviewDetailHeader: React.FC<ReviewDetailHeaderProps> = ({
    isEditing,
    review,
    editName,
    setEditName,
    editIsAnonymous,
    setEditIsAnonymous,
    editPhone,
    setEditPhone,
    editGenre,
    setEditGenre,
    displayMaskedName,
    onClose,
}) => {
    return (
        <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-3 xs:gap-0 mb-4 xs:mb-6 pb-4 border-b border-white/10 w-full">
            <div className="w-full xs:w-auto">
                {isEditing ? (
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                className="px-2 py-1 bg-black/40 border border-white/10 rounded text-[#F3EBE1] font-bold text-lg md:text-xl lg:text-2xl focus:outline-none focus:border-red-900/50 w-32"
                            />
                            <div className="flex items-center gap-1 px-2 py-1 bg-black/40 border border-white/10 rounded">
                                <input
                                    type="checkbox"
                                    id="edit-anonymous"
                                    checked={editIsAnonymous}
                                    onChange={(e) => setEditIsAnonymous(e.target.checked)}
                                    className="w-3 h-3 accent-red-900"
                                />
                                <label htmlFor="edit-anonymous" className="text-xs md:text-sm text-white/80 cursor-pointer select-none">익명</label>
                            </div>
                        </div>
                        {editIsAnonymous && editName && (
                            <p className="text-[10px] md:text-xs text-red-400/80">&apos;{displayMaskedName(editName)}&apos; 님으로 표시</p>
                        )}
                        <input
                            type="tel"
                            value={editPhone}
                            onChange={(e) => {
                                const raw = e.target.value.replace(/[^0-9]/g, "");
                                let formatted = raw;
                                if (raw.length > 3 && raw.length <= 7) {
                                    formatted = `${raw.slice(0, 3)}-${raw.slice(3)}`;
                                } else if (raw.length > 7) {
                                    formatted = `${raw.slice(0, 3)}-${raw.slice(3, 7)}-${raw.slice(7, 11)}`;
                                }
                                setEditPhone(formatted);
                            }}
                            placeholder="010-0000-0000"
                            maxLength={13}
                            className="px-2 py-1 bg-black/40 border border-white/10 rounded text-sm md:text-base text-white focus:outline-none focus:border-red-900/50 w-40 font-mono"
                        />
                    </div>
                ) : (
                    <>
                        <div className="text-[#F3EBE1] font-bold text-xl md:text-2xl lg:text-3xl mb-1">{review.name}</div>
                        {review.reviewId && (
                            <button
                                onClick={() => {
                                    const event = new CustomEvent('openContactOverlay', { detail: { reviewId: review.reviewId } });
                                    window.dispatchEvent(event);
                                    onClose();
                                }}
                                className="mt-1 inline-flex items-center gap-1.5 px-2 py-0.5 bg-white/5 border border-white/10 rounded-md text-[10px] md:text-xs text-gray-500 font-mono hover:bg-white/10 hover:border-[#E5D9D2]/30 hover:text-[#E5D9D2] transition-all group"
                                title="클릭 시 이 리뷰를 참고하여 예약 폼을 엽니다"
                            >
                                <span>ID: {review.reviewId}</span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600 group-hover:text-[#E5D9D2] transition-colors">
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                </svg>
                            </button>
                        )}
                    </>
                )}
            </div>

            <div className="text-left xs:text-right w-full xs:w-auto">
                {isEditing ? (
                    <select
                        value={editGenre}
                        onChange={(e) => setEditGenre(e.target.value)}
                        className="bg-black/40 border border-white/10 rounded px-2 py-1 text-sm md:text-base text-white focus:outline-none focus:border-red-900/50 w-full xs:w-auto"
                    >
                        <option value="">장르 선택</option>
                        {["Irezumi", "Old School", "Tribal", "Black & Grey", "Blackwork", "Oriental Art", "Watercolor", "Illustration", "Mandala", "Sak Yant", "Lettering", "ETC."].map(g => (
                            <option key={g} value={g}>{g}</option>
                        ))}
                    </select>
                ) : (
                    <span className="inline-block px-3 py-1 bg-white/5 border border-white/10 rounded-full text-gray-400 text-xs md:text-sm font-medium tracking-wide">
                        {review.genre || "비지정 장르"}
                    </span>
                )}
            </div>
        </div>
    );
};
