/**
 * 갤러리 포트폴리오 상세 조회 모달(GalleryDetailModal) 컴포넌트
 * 
 * 포트폴리오 페이지에서 작품 썸네일을 클릭하면 원본 이미지를 크게 보여주는 팝업창입니다.
 * 타투 장르, 작업 부위에 대한 메타 데이터를 표시하고 "지금 예약하기" 기능이 동일하게 제공됩니다.
 */

"use client";

import { useEffect, useState } from "react";

// 갤러리 단일 아이템 정보 타입 정의
interface GalleryItem {
    id: string;
    title: string;
    genre: string;
    part: string;
    imageUrl: string;
    createdAt?: string;
}

interface GalleryDetailModalProps {
    item: GalleryItem | null;
    onClose: () => void;
}

export default function GalleryDetailModal({ item, onClose }: GalleryDetailModalProps) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        if (item) {
            document.body.style.overflow = "hidden";
        }
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [item]);

    if (!item || !isMounted) return null;

    const handleReservation = () => {
        // ContactOverlay를 열기 위한 커스텀 이벤트 발생 (장르, 부위, 이미지 정보 포함)
        window.dispatchEvent(new CustomEvent("openContactOverlay", {
            detail: {
                genre: item.genre,
                part: item.part,
                imageUrl: item.imageUrl,
                source: "gallery"
            }
        }));
        onClose();
    };

    return (
        <div
            className="fixed inset-0 z-[110] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 animate-fade-in"
            onClick={onClose}
        >
            <div
                className="bg-[#1C1310] border border-white/10 w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row relative max-h-[90vh]"
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
                <div className="w-full md:w-3/5 h-[300px] xs:h-[350px] sm:h-[400px] md:h-auto relative bg-black flex items-center justify-center">
                    <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-contain"
                    />
                </div>

                {/* Right: Info Section */}
                <div className="w-full md:w-2/5 p-6 xs:p-8 flex flex-col justify-between bg-[#1C1310] overflow-y-auto">
                    <div>
                        <div className="mb-8">
                            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight">
                                {item.title}
                            </h2>
                            <div className="flex flex-wrap gap-2">
                                <span className="px-3 py-1 bg-white/5 text-gray-400 text-xs md:text-sm font-medium rounded-full border border-white/10 uppercase tracking-widest">
                                    {item.genre}
                                </span>
                                <span className="px-3 py-1 bg-red-900/20 text-red-400 text-xs md:text-sm font-medium rounded-full border border-red-900/30 uppercase tracking-widest">
                                    {item.part}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-6 mb-10">
                            <div className="flex justify-between items-center py-4 border-b border-white/5">
                                <span className="text-gray-500 text-xs md:text-sm lg:text-base">Genre</span>
                                <span className="text-[#D4C4BD] font-medium text-sm md:text-base lg:text-lg">{item.genre}</span>
                            </div>
                            <div className="flex justify-between items-center py-4 border-b border-white/5">
                                <span className="text-gray-500 text-xs md:text-sm lg:text-base">Part</span>
                                <span className="text-[#D4C4BD] font-medium text-sm md:text-base lg:text-lg">{item.part}</span>
                            </div>
                        </div>

                        <div className="p-5 bg-white/[0.02] rounded-2xl border border-white/5 mb-8">
                            <p className="text-xs md:text-sm text-gray-500 leading-relaxed word-keep-all">
                                본 작품의 디자인 권한은 아티스트에게 있으며,<br />
                                무단 도용 및 복제를 금지합니다.<br />
                                상세 상담을 원하시면 아래 버튼을 눌러주세요.
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
