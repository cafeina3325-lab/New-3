/**
 * 메인 랜딩 페이지 두 번째 섹션(Section B) - 갤러리 마키(Marquee)
 * 
 * DB에 저장된 갤러리(포트폴리오) 아이템들의 썸네일을 불러와
 * 화면 크기(반응형: Desktop, Tablet, Mobile)에 따라 N줄의 행을 구성합니다.
 * 각 줄마다 다른 속도와 방향(좌/우)으로 끊어짐 없이 무한 스크롤되는 애니메이션을 렌더링합니다.
 */

"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";

export default function SectionB() {
    // State
    // 서버 환경(SSR/SSG)과 클라이언트 환경 간 Hydration Mismatch를 방지하기 위한 마운트 플래그
    const [mounted, setMounted] = useState(false);
    // 갤러리 API를 통해 받아온 전체 타투 도안/작업물 배열
    const [items, setItems] = useState<any[]>([]);

    // Effect: 클라이언트 사이드 마운트 완료 설정 및 갤러리 데이터 패칭
    useEffect(() => {
        setMounted(true);
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

    // 대체 이미지 맵핑 파일 (public/Section E/ 폴더 기준)
    const FALLBACK_MAP: Record<string, string> = {
        "Irezumi": "irezumi.png",
        "Old School": "oldschool.png",
        "Tribal": "tribal.png",
        "Black & Grey": "black-and-gray.png",
        "Blackwork": "blackwork.png",
        "Oriental Art": "oriental art.png",
        "Watercolor": "watercolor.png",
        "Illustration": "illustration.png",
        "Mandala": "mandala.png",
        "Sak Yant": "sak-yant.png",
        "Lettering": "lettering.png",
        "ETC.": "etc.png",
    };

    // 유틸리티: 장르별 이미지 모음 후 부족한 이미지 보충
    const getImagesForGenres = (genreList: string[]) => {
        // imageUrl이 유효한 아이템만 필터링
        const realImages = items.filter(item =>
            genreList.includes(item.genre) && item.imageUrl
        );
        let result = [...realImages];
        const MIN_REQUIRED = 6;

        if (result.length < MIN_REQUIRED) {
            genreList.forEach(genre => {
                const fallbackFilename = FALLBACK_MAP[genre] || "etc.png";
                const fallbackId = `fallback-${genre}`;
                if (!result.find(item => item.id === fallbackId)) {
                    result.push({ id: fallbackId, genre, imageUrl: `/Section E/${fallbackFilename}` });
                }
            });
        }

        let displayList = [...result];
        // 무한 루프를 위한 최소 이미지 개수 확보 (결과가 없을 경우 대비)
        if (displayList.length === 0) {
            displayList.push({ id: 'fallback-empty', genre: 'ETC.', imageUrl: '/Section E/etc.png' });
        }

        while (displayList.length < MIN_REQUIRED) {
            displayList = [...displayList, ...result];
            // 무한 루프 방지 안전장치
            if (displayList.length === 0) break;
        }

        return displayList.sort(() => Math.random() - 0.5);
    };

    // Row definitions based on requirements
    // 화면 크기별 줄 구성 및 각 줄별 노출 장르, 스크롤 속도, 스크롤 방향 설정 캐싱 (Mobile)
    const rowsMobile = useMemo(() => [
        { genres: ["Illustration", "ETC."], speed: "20s", dir: "left" as const },
        { genres: ["Irezumi", "Old School"], speed: "10s", dir: "right" as const },
        { genres: ["Black & Grey", "Blackwork", "Tribal"], speed: "30s", dir: "left" as const },
        { genres: ["Oriental Art", "Watercolor"], speed: "25s", dir: "right" as const },
        { genres: ["Mandala", "Sak Yant", "Lettering"], speed: "15s", dir: "left" as const },
    ], []);

    // 화면 크기별 줄 구성 캐싱 (Tablet)
    const rowsTablet = useMemo(() => [
        { genres: ["Irezumi", "Old School", "Sak Yant", "ETC."], speed: "15s", dir: "left" as const },
        { genres: ["Black & Grey", "Blackwork", "Tribal", "Lettering"], speed: "20s", dir: "right" as const },
        { genres: ["Oriental Art", "Watercolor", "Illustration", "Mandala"], speed: "10s", dir: "left" as const },
    ], []);

    // 화면 크기별 줄 구성 캐싱 (Desktop)
    const rowsDesktop = useMemo(() => [
        { genres: ["Oriental Art", "Watercolor", "Illustration"], speed: "100s", dir: "left" as const },
        { genres: ["Black & Grey", "Blackwork", "Mandala"], speed: "150s", dir: "right" as const },
        { genres: ["Irezumi", "Old School", "Tribal"], speed: "170s", dir: "left" as const },
        { genres: ["Sak Yant", "Lettering", "ETC."], speed: "120s", dir: "right" as const },
    ], []);

    // 마키 데이터 캐싱: items가 변경될 때만 랜덤 배열 재생성 (useMemo로 매 렌더 방지)
    const mobileData = useMemo(() => rowsMobile.map(row => ({
        ...row, images: getImagesForGenres(row.genres)
    })), [items, rowsMobile]);

    const tabletData = useMemo(() => rowsTablet.map(row => ({
        ...row, images: getImagesForGenres(row.genres)
    })), [items, rowsTablet]);

    const desktopData = useMemo(() => rowsDesktop.map(row => ({
        ...row, images: getImagesForGenres(row.genres)
    })), [items, rowsDesktop]);

    if (!mounted) return <section id="section-b" className="bg-transparent h-screen w-full" />;

    return (
        <section id="section-b" className="bg-transparent h-screen w-full flex flex-col overflow-hidden pointer-events-none select-none py-2 xs:py-3 sm:py-4 md:py-6 lg:py-8 xl:py-10 2xl:py-12">
            {/* Mobile/sm View (5 rows) */}
            {/* 모바일 화면에서는 5줄 형태의 마키 컴포넌트를 렌더링 */}
            <div className="flex md:hidden flex-col h-full gap-0.5 xs:gap-1 sm:gap-1.5 py-0.5 xs:py-1">
                {mobileData.map((row, idx) => (
                    <div key={`m-${idx}`} className="flex-1 min-h-0 py-0.5 xs:py-1">
                        <MarqueeRow images={row.images} speed={row.speed} direction={row.dir} />
                    </div>
                ))}
            </div>

            {/* md/lg View (3 rows) */}
            {/* 태블릿 및 일반 데스크탑(중형) 화면에서는 3줄 형태의 마키 컴포넌트를 렌더링 */}
            <div className="hidden md:flex xl:hidden flex-col h-full gap-1 lg:gap-2 py-1 lg:py-2">
                {tabletData.map((row, idx) => (
                    <div key={`t-${idx}`} className="flex-1 min-h-0 py-1 lg:py-2">
                        <MarqueeRow images={row.images} speed={row.speed} direction={row.dir} />
                    </div>
                ))}
            </div>

            {/* xl/2xl+ View (4 rows) */}
            {/* 대형 데스크탑 화면에서는 4줄 형태의 마키 컴포넌트를 렌더링 */}
            <div className="hidden xl:flex flex-col h-full gap-1.5 xl:gap-2 2xl:gap-3 py-1.5 xl:py-2 2xl:py-3">
                {desktopData.map((row, idx) => (
                    <div key={`d-${idx}`} className="flex-1 min-h-0 py-1 xl:py-1.5 2xl:py-2">
                        <MarqueeRow images={row.images} speed={row.speed} direction={row.dir} />
                    </div>
                ))}
            </div>
        </section>
    );
}

// 서브 컴포넌트 요약: 무한 반복되는 단일 가로줄 (마키 슬라이드) 역할을 합니다.
function MarqueeRow({ images = [], speed, direction }: { images: any[], speed: string, direction: 'left' | 'right' }) {
    // 끊김 없는 루프(Seamless Loop) 동작을 보장하기 위해 이미지 세트를 다시 한 번 전체 복제(Double Duplication)
    const displayImages = images.length > 0 ? [...images, ...images] : [];

    if (displayImages.length === 0) return null;

    return (
        <div className="relative flex whitespace-nowrap overflow-hidden h-full">
            <div
                className={`flex h-full gap-2 md:gap-4 ${direction === 'left' ? 'animate-marquee-left' : 'animate-marquee-right'}`}
                style={{ animationDuration: speed }}
            >
                {/* 복제된 이미지 목록을 돌며 각각 하나씩 Image 태그로 매핑 출력 */}
                {displayImages.map((item, i) => (
                    <div
                        key={`${item.id}-${i}`}
                        // grayscale 효과 및 border를 주어 포트폴리오 이미지의 이질감을 줄이고 무드 통일
                        className="h-full aspect-[4/5] shrink-0 relative rounded-lg overflow-hidden border border-white/10 shadow-2xl grayscale-[0.3]"
                    >
                        {item.imageUrl ? (
                            <Image
                                src={item.imageUrl}
                                alt={item.genre || "gallery image"}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 25vh, 35vh"
                            />
                        ) : (
                            <div className="w-full h-full bg-neutral-800" />
                        )}
                        {/* 이미지 위에 덮이는 약간의 검은색 반투명 오버레이 */}
                        <div className="absolute inset-0 bg-black/10" />
                    </div>
                ))}
            </div>
        </div>
    );
}