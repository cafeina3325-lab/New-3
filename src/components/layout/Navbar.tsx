/**
 * 전역 상단 내비게이션 바(Navbar) 컨테이너
 * 
 * 사이트의 모든 화면 최상단에 고정(Sticky/Fixed)되어 로고(TitleBar)와 메뉴(NavMenu)를 담는 그릇 역할을 합니다.
 * 브라우저 리사이징 및 스크롤 이벤트를 감시하여, 뷰포트 크기나 스크롤 위치에 따라 메뉴를 
 * 햄버거 형태(모바일 호환)로 축소 및 확장하는 상태를 관리합니다.
 */

"use client";

import { useEffect, useState } from "react";
import TitleBar from "./TitleBar";
import NavMenu from "./NavMenu";

export default function Navbar() {
    // 뷰포트나 스크롤 조건에 의해 햄버거 사이드 메뉴(모바일 타입) 모드로 진입할지 여부
    const [isHamburgerMode, setIsHamburgerMode] = useState(true);
    // 우측 하단 "위로 가기(Scroll To Top)" 플로팅 버튼의 표시 여부
    const [showScrollTop, setShowScrollTop] = useState(false);

    // 훅: 스크롤 및 화면 리사이징 시 메뉴바의 형태를 전환할지 감지
    useEffect(() => {
        const handleScroll = () => {
            // 화면 뷰포트 너비가 1024px(LG) 미만인지 확인
            const isSmallScreen = window.innerWidth < 1024;
            // 메인 페이지에서 Section B 엘리먼트가 있는지 탐색
            const sectionTarget = document.getElementById("section-b");
            // 메인 페이지에서 Section C 엘리먼트가 있는지 탐색 (Scroll To Top 버튼용)
            const sectionCTarget = document.getElementById("section-c");

            if (sectionTarget) {
                const rect = sectionTarget.getBoundingClientRect();
                // Main Page: Section B의 상단이 헤더 영역(약 120px)에 도달하거나 창이 작아지면 햄버거 모드 켜기
                setIsHamburgerMode(rect.top <= 120 || isSmallScreen);
            } else {
                // Sub Pages: 서브페이지의 경우 스크롤을 200px 이상 내리거나 창이 작아지면 햄버거 모드 켜기
                setIsHamburgerMode(window.scrollY > 200 || isSmallScreen);
            }

            // Scroll To Top Button Logic
            if (sectionCTarget) {
                const rectC = sectionCTarget.getBoundingClientRect();
                // C섹션이 화면의 절반 이상 올라왔을 때 (반쯤 나타났을 때) 버튼 표시
                setShowScrollTop(rectC.top <= window.innerHeight / 2);
            } else {
                // 서브페이지 등 C섹션이 없는 경우 스크롤 200px 이상일 때 표시
                setShowScrollTop(window.scrollY > 200);
            }
        };

        // 스크롤 및 리사이즈 이벤트 리스너 등록
        window.addEventListener("scroll", handleScroll);
        window.addEventListener("resize", handleScroll);

        // Initial check: 마운트 직후 한 번 실행하여 초기 렌더링 값 세팅
        handleScroll();

        // 클린업 함수: 컴포넌트 언마운트 시 등록된 리스너 제거
        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", handleScroll);
        };
    }, []);

    // 페이지 최상단으로 부드럽게 스크롤을 다시 올리는 함수
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        // z-50으로 최상단 고정시키되 바탕 클릭 방해 방지를 위해 기본 pointer-events-none 처리 후 하위에서 auto로 설정
        <header className="fixed top-0 left-0 w-full z-50 flex items-start pointer-events-none">
            {/* 로고 영역 컨테이너 */}
            <TitleBar />
            {/* 전체 메뉴 컴포넌트에 현재의 모드 boolean 전달 */}
            <NavMenu isHamburgerMode={isHamburgerMode} />

            {/* Scroll To Top Button */}
            {/* C섹션이 일정 수준 노출되었을 때 우측 하단에 탑 버튼 노출 */}
            {showScrollTop && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-8 right-8 z-50 p-4 bg-black text-white rounded-full shadow-lg hover:bg-gray-800 transition-all animate-fade-in pointer-events-auto"
                    aria-label="Scroll to Top"
                >
                    {/* 최상단 화살표 아이콘 */}
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                </button>
            )}
        </header>
    );
}
