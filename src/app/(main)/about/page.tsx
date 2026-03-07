// 파일 요약: 스튜디오의 철학, 맞춤 도안 정책, 예약 운영 방식 등을 안내하는 소개 페이지입니다.

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { LEGACY_PILLARS, CUSTOMIZE_POINTS } from "@/data/aboutData";
import ReviewModal from "@/components/modals/ReviewModal";
import ReviewDetailModal from "@/components/modals/ReviewDetailModal";

// --- Sub-components ---
// 함수 요약: 사후 관리 가이드라인을 보여주는 모달 오버레이 컴포넌트입니다.
// 입력값: 모달을 닫는 동작을 하는 onClose 콜백 함수
function InfoOverlay({ onClose }: { onClose: () => void }) {
    return (
        // 배경을 클릭(onClick)하면 모달이 닫히도록 핸들러 부착
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md pointer-events-auto p-4"
            onClick={onClose}
        >
            {/* 내부 컨텐츠 영역: 클릭 이벤트가 부모(배경)로 전파되는 것(stopPropagation)을 막음 */}
            <div
                className="bg-[#1C1310] border border-white/10 rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <div className="p-8">
                    <h2 className="text-2xl font-bold mb-6 text-[#F3EBE1] border-b border-white/10 pb-2">Aftercare Checklist</h2>

                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2">A. Healing Overview</h3>
                            <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1">
                                <li>초기 24~48시간: 민감한 단계, 진물이나 붓기가 있을 수 있습니다.</li>
                                <li>1~2주: 각질, 가려움, 톤 변화가 일어나는 시기입니다.</li>
                                <li>4주 전후: 피부가 안정화되며 최종 발색을 확인할 수 있습니다.</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2">B. Do / Don’t</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded">
                                    <h4 className="font-bold text-green-700 dark:text-green-400 mb-1">Do</h4>
                                    <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                                        <li>안내받은 Aftercare 지침 준수</li>
                                        <li>청결 유지, 과도한 마찰 최소화</li>
                                        <li>보습/연고는 권장량만 얇게 도포</li>
                                    </ul>
                                </div>
                                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded">
                                    <h4 className="font-bold text-red-700 dark:text-red-400 mb-1">Don’t</h4>
                                    <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                                        <li>24~48시간 음주 권장하지 않음</li>
                                        <li>사우나/수영/과격 운동(초기 2주)</li>
                                        <li>긁거나 각질을 억지로 뜯기 금지</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2">C. Why results vary</h3>
                            <p className="text-gray-600 dark:text-gray-300 text-sm">
                                피부 상태, 부위, 에이징, 관리 상태에 따라 표현이 달라질 수 있습니다.
                                갤러리 이미지는 참고용이며 동일한 결과를 보장하지 않습니다.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2">D. Support & Touch-up</h3>
                            <p className="text-gray-600 dark:text-gray-300 text-sm">
                                상태 점검이 필요하면 언제든 사진과 함께 상담을 요청해 주세요.
                                리터치 여부는 아티스트 판단 및 회복 상태를 기준으로 결정됩니다.
                            </p>
                        </div>
                    </div>

                    <div className="mt-8 text-center">
                        <button
                            onClick={onClose}
                            className="px-6 py-2 bg-[#2A1D18] text-[#F3EBE1] rounded hover:bg-[#3A2A24] transition"
                        >
                            확인했습니다
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// --- Main Component ---
// 함수 요약: 소개(About) 페이지 전체를 렌더링하는 컴포넌트입니다.
export default function AboutPage() {
    // State
    // 상태 정의: 사후 관리 모달창의 가시성을 제어하는 boolean 상태 변수
    const [showInfoOverlay, setShowInfoOverlay] = useState(false);
    // 리뷰 작성 모달 제어 상태
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

    // 리뷰 상세 뷰 모달 상태
    const [selectedReview, setSelectedReview] = useState<any | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    // 리뷰 목록 상태
    const [reviews, setReviews] = useState<any[]>([]);

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

    // Handlers
    // 모달창을 제어(열기/닫기)하는 상태 변경 함수들
    const openInfoOverlay = () => setShowInfoOverlay(true);
    const closeInfoOverlay = () => setShowInfoOverlay(false);

    // 상담 예약 모달 열기 요청 (NavMenu의 이벤트를 활용)
    const handleContactRequest = () => {
        window.dispatchEvent(new CustomEvent("openContactOverlay"));
    };

    return (
        <main className="pt-[100px] xs:pt-[110px] sm:pt-[120px] md:pt-[130px] lg:pt-[140px] xl:pt-[160px] 2xl:pt-[180px] min-h-screen bg-[#1C1310] text-[#F3EBE1]">

            {/* 1. Our Legacy Section */}
            {/* 요약: 스튜디오의 핵심 가치관과 철학을 소개하는 섹션 */}
            <section className="container mx-auto px-4 xs:px-6 sm:px-8 md:px-10 py-12 xs:py-14 sm:py-16 md:py-20 lg:py-24 xl:py-28 2xl:py-32">
                <div className="text-center max-w-3xl mx-auto mb-10 xs:mb-12 sm:mb-14 md:mb-16 lg:mb-20">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight text-[#F3EBE1]">Our Legacy</h1>
                    <div className="text-base md:text-lg lg:text-xl text-gray-600 space-y-2 leading-relaxed font-light">
                        <p>바늘로 그리는 것은 그림이 아니라, 시간을 새기는 일입니다.</p>
                        <p>Flying Studio는 한 사람의 서사를 존중하며, 한 번의 시술을 하나의 작품으로 완성합니다.</p>
                    </div>
                </div>

                {/* Key Pillars - Hexagonal/Glass Cards */}
                {/* 정적 데이터 LEGACY_PILLARS 배열을 통해 육각형 디자인의 카드를 렌더링 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 xs:gap-6 sm:gap-8 lg:gap-10 xl:gap-12 mb-10 xs:mb-12 sm:mb-14 md:mb-16 lg:mb-20">
                    {LEGACY_PILLARS.map((item, idx) => (
                        <div key={idx} className="relative group h-[240px] xs:h-[260px] md:h-[280px] lg:h-[300px] flex items-center justify-center">
                            {/* Hexagon Shape with Clip-path */}
                            <div
                                className="absolute inset-0 bg-white/5 backdrop-blur-sm border border-white/10 transition-all duration-300 group-hover:bg-white/10 group-hover:scale-105"
                                style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
                            />
                            <div className="relative z-10 text-center p-6 max-w-[200px]">
                                <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#F3EBE1] mb-3">{item.title}</h3>
                                <p className="text-sm md:text-base text-gray-600">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Studio Facts */}
                <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-4 md:gap-8 lg:gap-12 text-sm md:text-base text-gray-500 border-t border-gray-100 pt-6 md:pt-10">
                    <span className="flex items-center gap-1.5 xs:gap-2">📍 예약제 운영 · 인천 구월동</span>
                    <span className="flex items-center gap-1.5 xs:gap-2">🤝 다수 아티스트 협업 시스템</span>
                    <span className="flex items-center gap-1.5 xs:gap-2">💬 상담 중심 진행 (시술 예약 아님)</span>
                </div>
            </section>

            {/* 1.5. Reviews Section */}
            {/* 요약: 실제 고객들의 리뷰를 보여주는 섹션 */}
            <section className="bg-[#150E0C] py-12 xs:py-14 sm:py-16 md:py-20 lg:py-24 xl:py-28 2xl:py-32">
                <div className="container mx-auto px-4 xs:px-6 sm:px-8 md:px-10">
                    <div className="text-center mb-10 xs:mb-12 sm:mb-14 md:mb-16 lg:mb-20">
                        <span className="text-gray-400 font-medium tracking-widest uppercase mb-4 block text-sm md:text-base">Client Reviews</span>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#F3EBE1]">고객 후기</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 xs:gap-6 sm:gap-8 lg:gap-10 xl:gap-12 max-w-6xl mx-auto">
                        {reviews.length > 0 ? reviews.map((review, idx) => (
                            <div
                                key={idx}
                                onClick={() => openDetailModal(review)}
                                className="bg-[#1C1310] border border-white/10 p-4 xs:p-5 sm:p-6 md:p-8 rounded-xl hover:border-white/20 transition-all duration-300 group hover:shadow-lg hover:shadow-black/20 cursor-pointer flex flex-col"
                            >
                                {/* 이미지 존재 시 최상단 표시 */}
                                {review.imageUrl && (
                                    <div className="mb-4 w-full h-[200px] overflow-hidden rounded-md border border-white/5 bg-white/5 flex-shrink-0">
                                        <img src={review.imageUrl} alt="review detail" className="w-full h-full object-cover" />
                                    </div>
                                )}

                                {/* 장르 (좌) / 별점 (우) 중앙 위 */}
                                <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
                                    <span className="text-gray-400 font-medium text-sm">
                                        {review.genre || "비지정 장르"}
                                    </span>
                                    <div className="flex items-center gap-1">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <svg key={i} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill={i < review.rating ? "#eab308" : "none"} stroke={i < review.rating ? "#eab308" : "#4b5563"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-0.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                                        ))}
                                    </div>
                                </div>

                                {/* 리뷰 본문 */}
                                <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-6 group-hover:text-white transition-colors word-keep-all line-clamp-4 flex-1">
                                    &ldquo;{review.content}&rdquo;
                                </p>

                                {/* 고객 정보 (좌측 이름, 우측 작성시간) */}
                                <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-auto">
                                    <span className="text-[#F3EBE1] font-bold text-sm md:text-base">{review.name}</span>
                                    <span className="text-gray-600 text-xs md:text-sm">
                                        {new Date(review.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        )) : (
                            <div className="col-span-1 md:col-span-3 text-center text-gray-500 py-10">
                                아직 작성된 리뷰가 없습니다.
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* 리뷰 작성 버튼 - 우측 하단 배치 */}
            <div className="bg-[#150E0C] pb-12 -mt-12">
                <div className="container mx-auto px-6 flex justify-end max-w-6xl">
                    <button
                        onClick={() => setIsReviewModalOpen(true)}
                        className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/10 hover:border-white/30 text-[#F3EBE1] font-bold rounded-lg transition-all backdrop-blur-sm flex items-center gap-2"
                    >
                        <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                        <span className="text-sm md:text-base">리뷰 작성</span>
                    </button>
                </div>
            </div>

            {/* 2. Custom Design */}
            {/* 요약: 맞춤 도안 프로세스와 정책을 제시하는 섹션 */}
            <section className="bg-[#150E0C] py-12 xs:py-14 sm:py-16 md:py-20 lg:py-24 xl:py-28 2xl:py-32">
                <div className="container mx-auto px-4 xs:px-6 sm:px-8 md:px-10">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-10 md:mb-16 text-center">맞춤 도안 디자인</h2>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 xs:gap-8 sm:gap-10 lg:gap-12 xl:gap-16 max-w-6xl mx-auto">
                        {/* A. What we customize */}
                        {/* 배열을 매핑하여 커스터마이즈 고려 요소 리스트를 렌더링 */}
                        <div className="bg-[#1C1310] border border-white/10 p-8 rounded-lg shadow-sm">
                            <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6 border-b border-white/10 pb-4">A. What we customize</h3>
                            <ul className="space-y-4">
                                {CUSTOMIZE_POINTS.map((li, i) => (
                                    <li key={i} className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4">
                                        <span className="font-bold text-[#F3EBE1] text-base md:text-lg min-w-[140px]">{li.t}</span>
                                        <span className="text-gray-400 text-sm md:text-base">{li.d}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* B, C, D Combined */}
                        <div className="space-y-6">
                            {/* B. Reference Policy */}
                            <div className="bg-[#1C1310] border border-white/10 p-6 rounded-lg shadow-sm border-l-4 border-l-[#E5D9D2]">
                                <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">B. Reference Policy</h3>
                                <p className="text-sm md:text-base text-gray-400">
                                    레퍼런스는 무드/구성/질감 참고용입니다. 동일한 결과를 보장하지 않으며, 고객의 피부·부위에 맞춰 재해석됩니다.
                                </p>
                            </div>

                            {/* C. Design Flow */}
                            <div className="bg-[#1C1310] border border-white/10 p-6 rounded-lg shadow-sm">
                                <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">C. Design Approval Flow</h3>
                                <div className="flex flex-wrap items-center gap-2 text-sm md:text-base text-gray-400">
                                    <span className="bg-[#2A1D18] px-3 py-1 rounded">상담/방향 확정</span>
                                    <span>→</span>
                                    <span className="bg-[#2A1D18] px-3 py-1 rounded">1차 스케치</span>
                                    <span>→</span>
                                    <span className="bg-[#2A1D18] px-3 py-1 rounded">수정 안내</span>
                                    <span>→</span>
                                    <span className="bg-[#E5D9D2] text-[#1C1310] px-3 py-1 rounded">최종 승인</span>
                                </div>
                            </div>

                            {/* D. Deliverables */}
                            <div className="bg-[#1C1310] border border-white/10 p-6 rounded-lg shadow-sm">
                                <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">D. Deliverables</h3>
                                <p className="text-sm md:text-base text-gray-400 mb-4">구성안, 라인/명암 방향, 예상 사이즈, UI 추천</p>

                                <div className="border-t border-white/10 pt-4">
                                    <h4 className="font-bold mb-2 text-xl md:text-2xl lg:text-3xl">Before you book</h4>
                                    <ul className="text-sm md:text-base text-gray-500 space-y-1 mb-4">
                                        <li>• 원하는 스타일/부위가 명확한가요?</li>
                                        <li>• 미성년자가 아님이 확실한가요?</li>
                                        <li>• 예약금 환불 규정을 확인했나요?</li>
                                    </ul>
                                    <button
                                        onClick={handleContactRequest}
                                        className="w-full py-3 bg-[#E5D9D2] text-[#1C1310] font-bold text-sm md:text-base rounded hover:bg-white transition"
                                    >
                                        예약하기
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. Booking Operation */}
            {/* 요약: 실제 샵의 예약 및 환불 규정에 대한 정보를 안내하는 섹션 */}
            <section className="container mx-auto px-4 xs:px-6 sm:px-8 md:px-10 py-12 xs:py-14 sm:py-16 md:py-20 lg:py-24 xl:py-28 2xl:py-32">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-10 lg:mb-16 text-center">예약 운영</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 xs:gap-5 sm:gap-6 md:gap-8 lg:gap-10 max-w-6xl mx-auto">
                    <div className="p-6 border border-white/10 rounded-lg hover:border-[#E5D9D2] transition-colors">
                        <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 text-red-400">Booking</h3>
                        <p className="text-sm md:text-base text-[#D4C4BD] font-bold mb-2">상담 예약제</p>
                        <p className="text-sm text-gray-500">
                            온라인 예약은 대면 상담 예약이며, 시술 예약이 아닙니다. 상담 결과에 따라 시술이 제한될 수 있습니다.
                        </p>
                    </div>
                    <div className="p-6 border border-white/10 rounded-lg hover:border-[#E5D9D2] transition-colors">
                        <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 text-[#F3EBE1]">Deposit</h3>
                        <p className="text-sm md:text-base text-[#D4C4BD] font-bold mb-2">예약금 제도</p>
                        <p className="text-sm text-gray-500">
                            일정 확보 및 노쇼 방지 목적. 단순 변심/무단 불참 시 환불 불가.
                        </p>
                    </div>
                    <div className="p-6 border border-white/10 rounded-lg hover:border-[#E5D9D2] transition-colors">
                        <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 text-[#F3EBE1]">Policy</h3>
                        <p className="text-sm md:text-base text-[#D4C4BD] font-bold mb-2">변경/취소</p>
                        <p className="text-sm text-gray-500">
                            사전 문의 시 변경 가능. 당일 취소/무단 불참 시 예약금 반환 불가.
                        </p>
                    </div>
                    <div className="p-6 border border-white/10 rounded-lg hover:border-[#E5D9D2] transition-colors">
                        <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 text-[#F3EBE1]">Eligibility</h3>
                        <p className="text-sm md:text-base text-[#D4C4BD] font-bold mb-2">시술 조건</p>
                        <p className="text-sm text-gray-500">
                            만 19세 미만 시술 불가 (신분증 필수). 피부/건강 상태에 따라 제한 가능.
                        </p>
                    </div>
                </div>
                <div className="text-center mt-8">
                    <Link href="/faq" className="text-gray-400 underline text-sm hover:text-[#E5D9D2]">
                        자세한 정책 보기 (FAQ)
                    </Link>
                </div>
            </section>

            {/* 4. Aftercare Info Overlay Trigger */}
            {/* 요약: 관리 지침 모달을 호출하는 상태 변경 버튼을 포함한 액션 섹션 */}
            <section className="bg-[#0A0706] text-[#F3EBE1] py-12 xs:py-14 sm:py-16 md:py-20 lg:py-24">
                <div className="container mx-auto px-4 xs:px-6 sm:px-8 text-center">
                    <h2 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold mb-3 xs:mb-4 sm:mb-5">Aftercare Guide</h2>
                    <p className="text-xs xs:text-sm sm:text-base md:text-lg text-gray-400 mb-6 xs:mb-8 sm:mb-10 max-w-2xl mx-auto">
                        타투는 시술만큼 관리가 중요합니다. Flying Studio의 체계적인 관리 방법을 확인하세요.
                    </p>
                    <button
                        onClick={openInfoOverlay}
                        className="px-6 py-2.5 xs:px-8 xs:py-3 md:px-10 md:py-4 border border-white rounded-full hover:bg-white hover:text-gray-900 transition-all text-sm xs:text-base md:text-lg font-medium"
                    >
                        관리 체크리스트 확인하기
                    </button>
                </div>
            </section>

            {/* Modal Overlay */}
            {/* showInfoOverlay 값이 참(true)일 때만 모달 컴포넌트를 렌더링합니다. */}
            {showInfoOverlay && <InfoOverlay onClose={closeInfoOverlay} />}

            {/* Review Modal */}
            <ReviewModal
                isOpen={isReviewModalOpen}
                onClose={() => setIsReviewModalOpen(false)}
                onSuccess={fetchReviews}
            />

            <ReviewDetailModal
                isOpen={isDetailOpen}
                review={selectedReview}
                onClose={() => setIsDetailOpen(false)}
                onDeleteSuccess={fetchReviews}
            />
        </main>
    );
}
