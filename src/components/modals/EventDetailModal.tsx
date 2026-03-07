/**
 * 이벤트 상세 정보 팝업 모달(EventDetailModal) 컴포넌트
 * 
 * 메인 랜딩 페이지 Section C에서 이벤트 카드를 클릭했을 때 나타납니다.
 * 이벤트 원본 이미지와 타이틀, 장르, 가격, 유의사항을 크게 보여주며,
 * "지금 예약하기" 클릭 시 ContactOverlay(예약 폼)에 해당 이벤트 데이터를 주입하며 창을 띄웁니다.
 */

"use client";

import { useEffect, useState } from "react";

// 개별 이벤트 게시물의 데이터 구조 타입 정의
interface EventItem {
    id: string;
    title: string;
    genre: string;
    price: number;
    imageUrl: string;
    createdAt?: string;
}

interface EventDetailModalProps {
    event: EventItem | null;
    onClose: () => void;
}

export default function EventDetailModal({ event, onClose }: EventDetailModalProps) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        if (event) {
            document.body.style.overflow = "hidden";
        }
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [event]);

    if (!event || !isMounted) return null;

    const handleReservation = () => {
        // ContactOverlay를 열기 위한 커스텀 이벤트 발생 (장르와 이미지 정보 포함)
        window.dispatchEvent(new CustomEvent("openContactOverlay", {
            detail: {
                genre: event.genre,
                imageUrl: event.imageUrl,
                source: "event"
            }
        }));
        onClose();
    };

    return (
        <div
            className="fixed inset-0 z-[110] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-fade-in"
            onClick={onClose}
        >
            <div
                className="bg-[#1C1310] border border-white/10 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row relative max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/50 text-white hover:bg-white/10 transition-colors"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Left: Image Section */}
                <div className="w-full md:w-1/2 h-[240px] xs:h-[280px] sm:h-[300px] md:h-auto relative bg-black">
                    {event.imageUrl ? (
                        <img
                            src={event.imageUrl}
                            alt={event.title}
                            className="w-full h-full object-contain"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500 italic text-sm md:text-base lg:text-lg">
                            No Image
                        </div>
                    )}
                </div>

                {/* Right: Info Section */}
                <div className="w-full md:w-1/2 p-6 xs:p-8 flex flex-col justify-between bg-[#1C1310] overflow-y-auto">
                    <div>
                        <div className="mb-6">
                            <span className="inline-block px-3 py-1 bg-red-900/30 text-red-400 text-xs md:text-sm lg:text-base font-bold rounded-full border border-red-900/50 uppercase tracking-widest mb-3">
                                {event.genre}
                            </span>
                            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 leading-tight">
                                {event.title}
                            </h2>
                        </div>

                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between items-center py-3 border-b border-white/5">
                                <span className="text-gray-500 text-xs md:text-sm lg:text-base">Genre</span>
                                <span className="text-[#D4C4BD] font-medium text-sm md:text-base lg:text-lg">{event.genre}</span>
                            </div>
                            <div className="flex justify-between items-center py-3 border-b border-white/5">
                                <span className="text-gray-500 text-xs md:text-sm lg:text-base">Price</span>
                                <span className="text-xl md:text-2xl lg:text-3xl font-black text-[#C5A059]">
                                    {event.price.toLocaleString()} KRW
                                </span>
                            </div>
                        </div>

                        <div className="p-4 bg-white/5 rounded-xl border border-white/10 mb-8">
                            <p className="text-xs md:text-sm text-gray-400 leading-relaxed italic">
                                * 모든 이벤트 작업은 상담 후 최종 확정됩니다.<br />
                                * 피부 상태나 부위에 따라 세부 디자인이 조정될 수 있습니다.
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={handleReservation}
                        className="w-full py-4 bg-[#E5D9D2] text-[#1C1310] font-bold rounded-xl shadow-lg hover:bg-white hover:shadow-xl transition-all text-sm md:text-base lg:text-lg tracking-wide"
                    >
                        지금 예약하기
                    </button>
                </div>
            </div>
        </div>
    );
}
