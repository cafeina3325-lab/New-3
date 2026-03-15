/**
 * 메인 랜딩 페이지 다섯 번째 섹션(Section E) - 테스트모니얼(고객 리뷰)
 * 
 * DB에 등록된 고객들의 실제 이용 후기(Review) 데이터들을 가로 스크롤 카드 형태로 나열합니다.
 * 빙글 도는 폴라로이드 사진 스타일의 UI를 구현하며, 
 * 각 카드 클릭 시 리뷰 상세 모달 오픈 및 하단에서 신규 리뷰 작성 모달 호출 기능을 포함합니다.
 */

"use client";

import { useState, useEffect } from "react";
import ReviewModal from "../modals/ReviewModal";
import ReviewDetailModal from "../modals/ReviewDetailModal";

export default function SectionE() {
    const [isReviewOpen, setIsReviewOpen] = useState(false);
    const [reviews, setReviews] = useState<any[]>([]);

    // 상세 모달 상태
    const [selectedReview, setSelectedReview] = useState<any | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    const openDetailModal = (review: any) => {
        setSelectedReview(review);
        setIsDetailOpen(true);
    };

    const fetchReviews = async () => {
        try {
            const res = await fetch("/api/reviews");
            if (res.ok) {
                const data = await res.json();
                setReviews(data.reviews || []);
            }
        } catch (error) {
            console.error("Failed to fetch reviews:", error);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    return (
        <section className="py-12 sm:py-16 md:py-20 lg:py-28 bg-[#0A0706] w-full overflow-hidden border-t border-white/5">
            <div className="container mx-auto px-4 sm:px-8 lg:px-12 mb-8 sm:mb-12">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold luxury-title relative inline-block left-1/2 -translate-x-1/2">Testimonials</h2>
            </div>

            {/* 가로 스크롤 리뷰 카드 리스트 */}
            <div className="flex overflow-x-auto py-10 sm:py-16 px-4 sm:px-8 lg:px-12 gap-4 sm:gap-6 lg:gap-10 snap-x snap-mandatory scrollbar-hide min-h-[260px]">
                {reviews.length > 0 ? reviews.map((item) => (
                    <div
                        key={item.id}
                        onClick={() => openDetailModal(item)}
                        // 기본적으로 카드가 1도 돌아가있어("rotate-1") 폴라로이드처럼 보이며, 마우스 호버 시 똑바로 돌아옴("hover:rotate-0")
                        className="flex-shrink-0 w-[240px] sm:w-[280px] md:w-[320px] lg:w-[400px] bg-[#150E0C] border border-white/10 p-3 sm:p-4 lg:p-6 shadow-xl transform rotate-1 hover:rotate-0 transition-all duration-300 snap-center rounded-lg cursor-pointer hover:shadow-2xl hover:border-white/20 flex flex-col"
                    >
                        {/* 1. 이미지 (있을 경우에만 최상단) */}
                        {item.imageUrl && (
                            <div className="w-full h-[160px] md:h-[200px] lg:h-[240px] mb-3 md:mb-4 bg-white/5 rounded overflow-hidden flex-shrink-0">
                                <img src={item.imageUrl} alt="review detail" className="w-full h-full object-cover" />
                            </div>
                        )}

                        {/* 2. 장르 (좌) / 별점 (우) */}
                        <div className="flex items-center justify-between mb-2 md:mb-3 border-b border-white/5 pb-1 md:pb-2">
                            <span className="text-gray-400 font-medium text-[10px] md:text-xs lg:text-sm">
                                {item.genre || "비지정 장르"}
                            </span>
                            <div className="flex items-center gap-1">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <svg key={i} xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 xs:w-3.5 xs:h-3.5 md:w-4 md:h-4 lg:w-5 lg:h-5 mx-[1px]" viewBox="0 0 24 24" fill={i < item.rating ? "#eab308" : "none"} stroke={i < item.rating ? "#eab308" : "#4b5563"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                    </svg>
                                ))}
                            </div>
                        </div>

                        {/* 3. 본문 내용 */}
                        <div className="mb-3 md:mb-4 flex-1">
                            <p className="text-[#F3EBE1] font-handwriting text-sm md:text-base lg:text-lg xl:text-xl italic line-clamp-3 break-keep leading-relaxed">
                                &ldquo;{item.content}&rdquo;
                            </p>
                        </div>

                        {/* 4. 고객명 (좌) / 작성시간 (우) */}
                        <div className="flex items-center justify-between mt-auto pt-2 md:pt-3 border-t border-white/5">
                            <span className="text-[#D4C4BD] font-bold tracking-wide text-sm md:text-base lg:text-lg">{item.name}</span>
                            <span className="text-gray-500 font-medium tracking-widest uppercase text-[10px] md:text-xs lg:text-sm">
                                {new Date(item.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                )) : (
                    <div className="w-full text-center text-gray-500 font-medium tracking-wide py-10 md:py-16 text-sm md:text-base lg:text-lg">아직 작성된 리뷰가 없습니다. 첫 리뷰를 남겨주세요!</div>
                )}
            </div>

            {/* 리뷰 작성 버튼 */}
            <div className="w-full px-4 sm:px-8 lg:px-12 flex justify-end mt-2 md:mt-4">
                <button
                    onClick={() => setIsReviewOpen(true)}
                    className="luxury-button-premium inline-flex items-center justify-center min-w-[120px] h-12 px-6 group"
                >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    리뷰 작성
                </button>
            </div>

            <ReviewModal isOpen={isReviewOpen} onClose={() => setIsReviewOpen(false)} onSuccess={fetchReviews} />
            <ReviewDetailModal
                isOpen={isDetailOpen}
                review={selectedReview}
                onClose={() => setIsDetailOpen(false)}
                onDeleteSuccess={fetchReviews}
            />
        </section>
    );
}
