"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { categoryData, categoryInfo, genreInfo } from "@/data/genreData";

const MAIN_CATEGORIES = Object.keys(categoryData);

// 컴포넌트: Genres 콘텐츠 영역 전체를 담당하며, 메인 탭(카테고리) 및 서브 탭(장르) 상태 관리를 수행합니다.
function GenresContent() {
    const searchParams = useSearchParams();
    const genreParam = searchParams.get('genre');

    // 상태 관리: 메인 카테고리 탭과 종속된 서브 장르 탭의 활성화 상태를 관리합니다.
    // State
    const [activeMainTab, setActiveMainTab] = useState(MAIN_CATEGORIES[0]);
    const [activeSubTab, setActiveSubTab] = useState(categoryData[MAIN_CATEGORIES[0]][0]);

    // 사이드 이펙트: URL 파라미터를 파싱하여 초기 활성 탭을 동기화하고, 탭 간 계층적 일관성을 유지합니다.
    // Hooks
    useEffect(() => {
        if (genreParam) {
            const foundCategory = Object.entries(categoryData).find(([_, subGenres]) =>
                subGenres.includes(genreParam)
            );
            if (foundCategory) {
                setActiveMainTab(foundCategory[0]);
                setActiveSubTab(genreParam);
            }
        }
    }, [genreParam]);

    useEffect(() => {
        if (!categoryData[activeMainTab].includes(activeSubTab)) {
            setActiveSubTab(categoryData[activeMainTab][0]);
        }
    }, [activeMainTab, activeSubTab]);

    // 데이터 파생 로직: 현재 선택된 서브 탭에 해당하는 장르 상세 정보 추출 및 예외 처리
    // Helpers
    const currentGenre = genreInfo[activeSubTab] || {
        desc: "해당 장르에 대한 상세 설명이 준비 중입니다.",
        features: ["준비 중", "준비 중", "준비 중"],
        details: []
    };

    const isIrezumi = activeSubTab === "Irezumi";
    const galleryItemParam = encodeURIComponent(activeSubTab === "ETC." ? "Specialties" : activeSubTab);

    // 렌더링(JSX): 상단 메인 카테고리, 하위 탭 분기, 세부 정보 및 갤러리/예약 이동 버튼 렌더링
    // Render Actions
    return (
        <div className="container mx-auto px-4 xs:px-6 sm:px-8 max-w-6xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-10 text-center text-[#F3EBE1]">Genres</h1>

            {/* 메인 탭 영역: 각 주요 카테고리(Heritage, Contrast 등)에 대한 버튼 렌더링 */}
            {/* Main Tabs (Categories) */}
            <div className="flex flex-col items-center mb-8 xs:mb-10">
                <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-4 md:mb-6">
                    {MAIN_CATEGORIES.map((cat) => {
                        const isActive = activeMainTab === cat;
                        return (
                            <button
                                key={cat}
                                onClick={() => setActiveMainTab(cat)}
                                className={`px-6 py-3 rounded-full text-sm md:text-base font-bold transition-all duration-300 border ${isActive
                                    ? "bg-[#3A2A24] text-[#F3EBE1] border-transparent shadow-md"
                                    : "bg-[#1C1310] text-[#D4C4BD] border-white/10 hover:border-white/20 hover:text-[#F3EBE1]"
                                    }`}
                            >
                                {cat}
                            </button>
                        );
                    })}
                </div>
                {/* Category Description */}
                <p className="text-[#D4C4BD] text-center max-w-2xl text-sm md:text-base leading-relaxed break-keep">
                    {categoryInfo[activeMainTab]}
                </p>
            </div>

            {/* 서브 탭 영역: 선택된 메인 카테고리에 할당된 세부 장르 목록을 렌더링 */}
            {/* Sub Tabs (Specific Genres) */}
            <div className="flex flex-wrap justify-center gap-x-4 md:gap-x-8 gap-y-3 md:gap-y-4 mb-10 md:mb-16 border-b border-white/10 pb-4 md:pb-6 px-4">
                {categoryData[activeMainTab].map((sub) => {
                    const isActive = activeSubTab === sub;
                    return (
                        <button
                            key={sub}
                            onClick={() => setActiveSubTab(sub)}
                            className={`text-base md:text-lg font-medium transition-colors relative pb-2 ${isActive
                                ? "text-[#F3EBE1] after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#E5D9D2]"
                                : "text-gray-500 hover:text-[#D4C4BD]"
                                }`}
                        >
                            {sub}
                        </button>
                    );
                })}
            </div>

            {/* Content Area */}
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-start animation-fade-in bg-[#150E0C] p-6 md:p-12 rounded-xl border border-white/5">
                {/* Left: Main Content & Details */}
                <div className="lg:w-3/5">
                    <div className="mb-8 xs:mb-10">
                        <span className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-2 block">{activeMainTab}</span>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#F3EBE1] mb-4 md:mb-6">{activeSubTab}</h2>
                        <p className="text-base md:text-lg lg:text-xl text-[#D4C4BD] leading-loose word-keep-all mb-6 md:mb-8">
                            {currentGenre.desc}
                        </p>
                    </div>

                    {/* Detailed Sections (if available) - e.g. for Irezumi */}
                    {currentGenre.details && currentGenre.details.map((section, idx) => (
                        <div key={idx} className="mb-10 border-t border-white/10 pt-8 last:mb-0">
                            <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#F3EBE1] mb-4 md:mb-6">{section.title}</h3>
                            {section.text && <p className="text-sm md:text-base text-[#D4C4BD] mb-6 leading-relaxed">{section.text}</p>}

                            <div className="space-y-6">
                                {/* Sub-items (Subtitle + Text) */}
                                {section.items && section.items.map((item, i) => (
                                    <div key={i}>
                                        <h4 className="text-xl md:text-2xl lg:text-3xl font-bold text-[#E5D9D2] mb-2">{item.subtitle}</h4>
                                        <p className="text-[#D4C4BD] leading-relaxed text-sm md:text-base word-keep-all">
                                            {item.text}
                                        </p>
                                    </div>
                                ))}

                                {/* Definition List (Term + Desc) */}
                                {section.list && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {section.list.map((li, i) => (
                                            <div key={i} className="bg-[#1C1310] p-4 rounded border border-white/5">
                                                <span className="font-bold text-[#F3EBE1] block text-base md:text-lg mb-1">{li.term}</span>
                                                <span className="text-sm md:text-base text-[#D4C4BD] block">{li.desc}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Right: Key Features (Sticky) */}
                <div className="lg:w-2/5 w-full bg-[#1C1310] p-8 rounded-lg border border-white/10 shadow-sm lg:sticky lg:top-32">
                    <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#F3EBE1] mb-6 border-b border-white/10 pb-3">Key Characteristics</h3>
                    <ul className="space-y-4">
                        {currentGenre.features.map((feature, idx) => (
                            <li key={idx} className="flex items-start gap-3 text-sm md:text-base text-[#D4C4BD]">
                                <span className="mt-1.5 w-1.5 h-1.5 bg-[#D4C4BD] rounded-full shrink-0" />
                                <span>{feature}</span>
                            </li>
                        ))}
                    </ul>

                    {/* Additional Info Box for Irezumi context or generic */}
                    {isIrezumi && (
                        <div className="mt-8 pt-6 border-t border-white/10">
                            <p className="text-xs md:text-sm text-gray-500 leading-relaxed">
                                * ?대젅利덈????⑥닚??臾몄떊???섏뼱 ?쇰낯??誘쇰떞, 遺덇탳???멸퀎愿€, ?먯뿰愿??吏묒빟???섎굹??醫낇빀 ?덉닠?낅땲??
                                ?꾨??먮뒗 ?꾪넻 諛⑹떇肉먮쭔 ?꾨땲???ㅼ뼇???뚯깮 ?λⅤ濡??뺤옣?섍퀬 ?덉뒿?덈떎.
                            </p>
                        </div>
                    )}

                    {/* View Gallery Button */}
                    <div className="mt-8 pt-6 border-t border-white/10">
                        <Link
                            href={`/gallery?tab=Portfolio&filter=Genre&item=${galleryItemParam}`}
                            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-[#2A1D18] text-[#F3EBE1] rounded-xl shadow-lg hover:bg-[#3A2A24] hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 group"
                        >
                            <span className="font-bold text-sm md:text-base tracking-wide">VIEW {activeSubTab.toUpperCase()} GALLERY</span>
                            <div className="bg-white/20 p-1.5 rounded-full group-hover:bg-white/30 transition-colors">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>

        </div>
    );
};

// 파일 요약: Next.js App Router 환경에서 타투 장르 소개 페이지를 담당하는 클라이언트 컴포넌트입니다.
// 외부 데이터(categoryData, genreInfo 등)를 임포트하여 카테고리별 탭 기반 탐색과 장르 상세 정보를 렌더링합니다.
export default function GenresPage() {
    return (
        <main className="pt-[120px] md:pt-[160px] lg:pt-[200px] xl:pt-[240px] pb-12 md:pb-20 lg:pb-24 min-h-screen bg-[#1C1310] text-[#F3EBE1]">
            <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
                <GenresContent />
            </Suspense>
        </main>
    );
}





