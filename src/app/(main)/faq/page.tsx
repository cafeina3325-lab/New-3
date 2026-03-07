// 파일 요약: 스튜디오 이용과 관련된 자주 묻는 질문(FAQ)을 보여주고 검색할 수 있는 페이지입니다.

"use client";

import { useState } from "react";
import ContactOverlay from "@/components/layout/ContactOverlay";
import { CATEGORIES, FAQ_DATA } from "@/data/faqData";

// --- Main Component ---
// 함수 요약: FAQ 페이지 전체 화면을 구성하고 키워드 및 카테고리별 검색 기능을 돕는 컴포넌트입니다.
export default function FAQPage() {
    // State
    // 상태 정의: 사용자가 입력한 검색어, 활성화된 카테고리 탭, 모달 및 아코디언 상태
    const [searchTerm, setSearchTerm] = useState("");
    const [activeCategory, setActiveCategory] = useState("All");
    const [isContactOpen, setIsContactOpen] = useState(false);
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    // Helpers
    // 필터 로직: 입력된 검색어와 선택된 카테고리를 기준으로 보여줄 FAQ 리스트를 필터링
    const filteredFAQ = FAQ_DATA.filter(item => {
        const lowerSearch = searchTerm.toLowerCase();
        const matchesSearch = item.q.toLowerCase().includes(lowerSearch) || item.a.toLowerCase().includes(lowerSearch);
        const matchesCategory = activeCategory === "All" || item.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    // 핸들러: 클릭된 항목의 아코디언 뷰를 토글(동일 요소 클릭 시 초기화하여 닫기)
    const toggleAccordion = (index: number) => {
        setOpenIndex(prevIndex => prevIndex === index ? null : index);
    };

    // 추가 컨택트 모달창 열기/닫기 관련 함수
    const openContact = () => setIsContactOpen(true);
    const closeContact = () => setIsContactOpen(false);

    // Render Actions
    return (
        <main className="pt-[120px] sm:pt-[160px] md:pt-[200px] lg:pt-[240px] pb-10 sm:pb-16 lg:pb-24 min-h-screen bg-[#1C1310] text-[#F3EBE1]">
            {/* 1. Hero */}
            {/* 요약: 상단 메시지를 포함하는 헤더 영역 */}
            <section className="container mx-auto px-4 sm:px-8 mb-10 sm:mb-14 lg:mb-20 text-center">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">명확한 기준, 투명한 원칙 (Clear Protocol)</h1>
                <p className="text-base md:text-lg lg:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed word-keep-all">
                    타협 없는 마스터피스를 피부 위에 안전하게 구현하기 위해, 당소가 엄격하게 준수하고 있는 운영 기준과 작업 과정을 투명하게 안내합니다.
                </p>
            </section>

            {/* 2. Quick Search */}
            {/* 요약: 사용자가 특정 키워드로 FAQ 목록을 쉽게 검색할 수 있는 인풋 폼 영역 */}
            <section className="container mx-auto px-4 sm:px-8 mb-8 sm:mb-12 lg:mb-16 max-w-2xl">
                <div className="relative border border-white/5 rounded-lg overflow-hidden focus-within:border-gray-500 transition-colors">
                    <input
                        type="text"
                        placeholder="검색어 입력 (예: 예약금, 리터치)"
                        className="w-full py-3 px-4 pl-10 sm:py-4 sm:px-6 sm:pl-12 bg-white/5 text-sm md:text-base focus:outline-none focus:bg-white/10 transition-colors text-white placeholder-gray-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <svg className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <p className="text-sm md:text-base text-gray-500 mt-3 text-center">
                    키워드를 입력하면 관련된 FAQ 항목만 필터링되어 나타납니다.
                </p>
            </section>

            {/* 3. Sticky Category Navigation & FAQ List */}
            {/* 요약: 카테고리 필터 인터페이스와 필터링된 아코디언 매핑 리스트 영역 */}
            <section className="container mx-auto px-4 sm:px-8 max-w-5xl flex flex-col md:flex-row gap-6 sm:gap-10 lg:gap-16 items-start relative">
                {/* Sticky Nav */}
                <aside className="md:w-1/4 md:sticky md:top-32 w-full overflow-x-auto md:overflow-visible z-10 bg-[#1C1310] md:bg-transparent pb-2 md:pb-0 hide-scrollbar">
                    <div className="flex md:flex-col gap-2 sm:gap-3">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-4 py-2 text-sm md:text-base font-bold text-left rounded transition-colors whitespace-nowrap ${activeCategory === cat
                                    ? "bg-[#3A2A24] text-[#F3EBE1]"
                                    : "bg-[#1C1310] border border-white/5 text-gray-400 hover:bg-[#2A1D18]"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </aside>

                {/* FAQ Accordion Content */}
                {/* 조건부 렌더링: 필터된 결과 화면 혹은 무결과 알림 노출 */}
                <div className="md:w-3/4 w-full space-y-3 sm:space-y-4">
                    {filteredFAQ.length > 0 ? (
                        filteredFAQ.map((item, index) => {
                            // 토글 애니메이션 판단용 불리언 
                            const isOpen = openIndex === index;
                            return (
                                <div
                                    key={index}
                                    className={`border border-white/10 rounded-lg overflow-hidden transition-all duration-300 ${isOpen ? 'shadow-md bg-[#2A1D18]' : 'bg-[#1C1310] hover:bg-[#2A1D18]'
                                        }`}
                                >
                                    <button
                                        onClick={() => toggleAccordion(index)}
                                        className="w-full text-left p-4 xs:p-5 sm:p-6 flex items-start justify-between group focus:outline-none"
                                    >
                                        <div className="flex-1 pr-4 xs:pr-6 sm:pr-8">
                                            <span className="text-xs md:text-sm font-bold text-gray-400 uppercase tracking-wider mb-2 block">
                                                {item.category}
                                            </span>
                                            <h3 className={`text-2xl md:text-3xl lg:text-4xl font-bold transition-colors ${isOpen ? 'text-[#F3EBE1]' : 'text-gray-400 group-hover:text-[#F3EBE1]'
                                                }`}>
                                                <span className="text-gray-300 mr-2">Q.</span>
                                                {item.q}
                                            </h3>
                                        </div>
                                        {/* 아이콘 회전 애니메이션 */}
                                        <div className={`mt-0.5 xs:mt-1 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                                            <svg className="w-5 h-5 xs:w-6 xs:h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </button>

                                    {/* 답변 영역을 열고 닫는 부분 */}
                                    <div
                                        className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                            }`}
                                    >
                                        <div className="p-4 xs:p-5 sm:p-6 pt-0 border-t border-white/5 mx-4 xs:mx-5 sm:mx-6">
                                            <div className="flex items-start gap-2 text-base md:text-lg mt-4">
                                                <span className="text-gray-400 font-bold shrink-0 mt-1">A.</span>
                                                <p className="text-gray-300 leading-relaxed whitespace-pre-line word-keep-all">
                                                    {item.a}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-center py-12 xs:py-16 sm:py-20 text-gray-400 border border-white/5 rounded-lg bg-white/5 text-base md:text-lg">
                            검색 결과가 없습니다.
                        </div>
                    )}
                </div>
            </section>

            {/* 4. Private Concierge CTA */}
            {/* 요약: 하단에 1:1 상담 안내 문구 및 문의 연결 버튼을 포함하는 섹션 */}
            <section className="bg-[#2A1D18]/30 border-t border-white/10 py-12 sm:py-16 lg:py-24 mt-12 sm:mt-16 lg:mt-24">
                <div className="container mx-auto px-4 sm:px-8 text-center max-w-3xl">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-[#F3EBE1]">당신만의 고유한 서사에 대해 더 깊은 논의가 필요하십니까?</h2>
                    <p className="text-sm md:text-base text-[#D4C4BD] mb-8 md:mb-10 leading-relaxed word-keep-all">
                        세부적인 도안 방향성이나 체질에 따른 특이사항 등, 남겨진 질문이 있다면 전담 디렉터에게 문의해 주십시오.
                        프라이빗하고 심도 있는 상담을 도와드립니다.
                    </p>
                    <button
                        onClick={openContact}
                        className="px-6 py-4 md:px-8 md:py-5 border border-white/20 text-[#F3EBE1] font-bold rounded hover:bg-black transition shadow-lg hover:shadow-xl text-sm md:text-base bg-white/5 hover:border-white/40"
                    >
                        1:1 프라이빗 컨시어지 연결
                    </button>
                </div>
            </section>

            {/* Contact Overlay Local Instance */}
            {/* isContactOpen가 true가 될 때 연락상세를 담은 컴포넌트를 마운트 */}
            {isContactOpen && <ContactOverlay onClose={closeContact} />}
        </main>
    );
}
