// 파일 요약: 장르 및 부위(Parts)별 타투 갤러리를 렌더링하며 필터링 기능을 제공하는 페이지 컴포넌트입니다.

"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { GENRES, PARTS } from "@/data/constants";

// --- Sub-components ---
// 컴포넌트 요약: 실제 갤러리 뷰와 필터 로직을 포함하는 서브 컴포넌트입니다.
// 역할: URL 쿼리 파라미터를 파싱하여 초기 상태를 설정하고, 선택된 필터에 따라 포트폴리오를 배열합니다.
function GalleryContent() {
    // 훅: URL의 쿼리 파라미터(예: ?filter=Genre&item=All)에 접근하기 위해 사용
    const searchParams = useSearchParams();

    // State
    // 포트폴리오 탭의 정렬 기준을 저장하는 상태 값 (Genre 혹은 Parts)
    const [portfolioFilterType, setPortfolioFilterType] = useState<"Genre" | "Parts">("Genre");
    // 선택된 단일 장르 상태값 (장르는 복수 선택 불가 구조)
    const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
    // 선택된 복수 부위(Parts)의 배열 상태값
    const [selectedParts, setSelectedParts] = useState<string[]>([]);

    // 갤러리 원본 데이터 상태
    const [items, setItems] = useState<any[]>([]);

    useEffect(() => {
        const fetchGallery = async () => {
            try {
                const res = await fetch("/api/gallery");
                if (res.ok) {
                    const data = await res.json();
                    setItems(data.items || []);
                }
            } catch (error) {
                console.error("Failed to load gallery:", error);
            }
        };
        fetchGallery();
    }, []);

    // Effect: URL 파라미터가 변경될 때마다 초기 필터 상태를 매핑하여 설정
    useEffect(() => {
        const filterParam = searchParams.get("filter");
        const itemParam = searchParams.get("item");

        if (filterParam === "Parts") {
            setPortfolioFilterType("Parts");
            if (itemParam && itemParam !== "All") {
                setSelectedParts([itemParam]);
            }
        } else {
            setPortfolioFilterType("Genre");
            if (itemParam) {
                // "Specialties"라는 예외 키워드(URL용)는 내부 상수 데이터인 "ETC."로 매핑
                const mappedItem = itemParam === "Specialties" ? "ETC." : itemParam;
                if (GENRES.includes(mappedItem)) {
                    setSelectedGenre(mappedItem);
                } else if (mappedItem === "All") {
                    setSelectedGenre(null); // 'All' 선택 시 null 처리
                }
            }
        }
    }, [searchParams]);

    // Helpers
    // 화면에 렌더링할 필터 버튼의 배열(현재 활성 필터 타입에 따라 결정)
    const filterItems = portfolioFilterType === "Genre" ? GENRES : PARTS;
    // '전체(All)'가 선택되어 있는지 여부를 판단하는 boolean
    const isAllSelected = portfolioFilterType === "Genre" ? selectedGenre === null : selectedParts.length === 0;

    // 핸들러: 특정 아이템 필터 버튼이 현재 선택된 상태인지 여부를 판단하여 반환
    const isSelected = (item: string) => {
        return portfolioFilterType === "Genre"
            ? item === selectedGenre
            : selectedParts.includes(item);
    };

    // 핸들러: 필터 아이템 클릭 시 선택/해제 상태를 토글하는 로직
    const handleFilterClick = (item: string) => {
        if (portfolioFilterType === "Genre") {
            // 장르는 토글 시 이전 상태와 같으면 해제(null), 아니면 선택으로 변경
            setSelectedGenre(selectedGenre === item ? null : item);
        } else {
            // 부위는 아이템 다중 선택 및 해제를 지원하도록 배열 업데이트
            setSelectedParts(prev =>
                prev.includes(item) ? prev.filter(p => p !== item) : [...prev, item]
            );
        }
    };

    // 핸들러: 작품 썸네일 아래에 부가적으로 노출될 설명(Subtext)을 문자열로 반환
    const getWorkSubtext = () => {
        if (portfolioFilterType === "Genre") {
            return isAllSelected ? "All Genres" : selectedGenre;
        }
        return isAllSelected ? "All Parts" : selectedParts.join(", ");
    };

    // 필터링 적용된 갤러리 목록 계산
    const filteredItems = items.filter((item) => {
        if (portfolioFilterType === "Genre") {
            // 장르 필터 로직: All(null) 이면 전부 통과, 아니면 장르 일치 여부 확인
            if (selectedGenre === null) return true;
            return item.genre === selectedGenre;
        } else {
            // 부위 필터 로직: 선택된 포트가 없으면 전부 통과, 선택된 목록에 있는 포트면 통과
            if (selectedParts.length === 0) return true;
            return selectedParts.includes(item.part);
        }
    });

    const [selectedItem, setSelectedItem] = useState<any | null>(null);

    return (
        <main className="pt-[120px] xs:pt-[140px] sm:pt-[160px] md:pt-[200px] lg:pt-[220px] xl:pt-[240px] pb-10 xs:pb-12 sm:pb-16 md:pb-20 lg:pb-24 min-h-screen bg-[#1C1310] text-[#F3EBE1]">
            <div className="max-w-[1800px] mx-auto px-2 xs:px-4 sm:px-6 md:px-8">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-16 text-center text-white font-serif tracking-tight">Gallery</h1>

                <div className="animate-fade-in space-y-8 xs:space-y-10 sm:space-y-12 md:space-y-16">
                    {/* Controls */}
                    {/* 요약: 장르별/부위별 탭을 전환하는 최상단 필터 메인 컨트롤 영역 */}
                    <div className="flex flex-col items-center gap-6 md:gap-8 lg:gap-10">
                        <div className="flex bg-white/5 p-1 rounded-full border border-white/10">
                            <button
                                onClick={() => setPortfolioFilterType("Genre")}
                                className={`px-4 py-1.5 md:px-6 md:py-2 rounded-full text-sm md:text-base font-bold transition-all ${portfolioFilterType === "Genre" ? "bg-white text-black shadow-sm" : "text-gray-400 hover:text-white"
                                    }`}
                            >
                                By Genre
                            </button>
                            <button
                                onClick={() => setPortfolioFilterType("Parts")}
                                className={`px-4 py-1.5 md:px-6 md:py-2 rounded-full text-sm md:text-base font-bold transition-all ${portfolioFilterType === "Parts" ? "bg-white text-black shadow-sm" : "text-gray-400 hover:text-white"
                                    }`}
                            >
                                By Parts
                            </button>
                        </div>

                        {/* Filter List */}
                        {/* 배열을 순회하며 개별 필터 선택 버튼들을 생성 */}
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 xs:gap-3 md:gap-4 lg:gap-5 w-full max-w-7xl px-2 xs:px-4">
                            {filterItems.map((item) => (
                                <button
                                    key={item}
                                    onClick={() => handleFilterClick(item)}
                                    className={`px-2 py-2 rounded-lg text-xs md:text-sm font-medium transition-all border ${isSelected(item)
                                        ? "bg-white text-black border-white shadow-md transform scale-[1.02]"
                                        : "glass-panel text-gray-400 border-white/5 hover:border-white/20 hover:text-white hover:shadow-sm"
                                        }`}
                                >
                                    {item}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Grid */}
                    {/* 요약: 실제 서버로부터 fetch해온 갤러리 아이템들을 필터 조건에 맞춰 렌더링하는 컨테이너 */}
                    <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-3 lg:gap-5">
                        {filteredItems.length > 0 ? filteredItems.map((item) => (
                            <div
                                key={item.id}
                                onClick={() => setSelectedItem(item)}
                                className="aspect-square bg-white/5 rounded-lg relative group overflow-hidden cursor-pointer border border-white/5 hover:border-white/20 transition-colors"
                            >
                                <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />

                                {/* 마우스 호버 시 부드럽게 나타나는 프로젝트 오버레이 배경 및 제목 */}
                                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm group-hover:opacity-100 opacity-0 transition-opacity duration-300 flex items-end p-3 xs:p-4 sm:p-5 md:p-6">
                                    <div className="w-full">
                                        <div className="glass-panel p-2 xs:p-3 sm:p-4 rounded-xl inline-block w-full">
                                            <span className="text-white font-bold block text-sm md:text-base lg:text-lg mb-1 truncate">{item.title}</span>
                                            <div className="flex items-center gap-2 text-xs md:text-sm text-gray-300">
                                                <span className="bg-white/10 px-2 py-1 rounded truncate max-w-[50%]">{item.genre}</span>
                                                <span className="bg-red-900/30 px-2 py-1 rounded text-red-200 truncate max-w-[50%]">{item.part}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="col-span-full py-16 xs:py-20 sm:py-24 text-center text-gray-500 text-sm md:text-base">
                                <p>해당 조건에 맞는 작품이 아직 등록되지 않았습니다.</p>
                                <p className="text-xs md:text-sm mt-2 text-gray-600">다른 카테고리를 선택해보세요.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Gallery Detail Modal */}
            <GalleryDetailModal
                item={selectedItem}
                onClose={() => setSelectedItem(null)}
            />
        </main>
    );
}

import GalleryDetailModal from "@/components/modals/GalleryDetailModal";

// 메인 페이지 함수 컴포넌트: next/navigation의 useSearchParams를 쓰기 위해 Suspense로 감싸줍니다. 
// (SSR 환경에서 해당 훅 사용에 따른 렌더링 에러를 방지)
export default function GalleryPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#1C1310] text-[#F3EBE1]">Loading...</div>}>
            <GalleryContent />
        </Suspense>
    );
}
