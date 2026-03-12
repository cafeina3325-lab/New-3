/**
 * 내비게이션 메뉴(NavMenu) 리스트 및 햄버거 토글 컴포넌트
 * 
 * Navbar 내부 우측에 배치되며, 데스크탑 환경에서의 전체 펼침 메뉴(GNB)와
 * 모바일(혹은 스크롤 다운 시) 환경에서의 햄버거 터치/클릭식 사이드 패널 메뉴를 모두 렌더링합니다.
 * 또한, 다른 컴포넌트에서 발생하는 전역 이벤트('openContactOverlay')를 감지하여 상담 모달 제어를 수행합니다.
 */

"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import ContactOverlay from "./ContactOverlay";
import { MENU_ITEMS } from "@/data/constants";

interface NavMenuProps {
    isHamburgerMode?: boolean; // 상위(Navbar)에서 스크롤/뷰포트 기반으로 판단한 모바일 간소화 모드 여부
}

export default function NavMenu({ isHamburgerMode }: NavMenuProps) {
    const { data: session } = useSession();
    // --- State: 모달 제어용 ---
    // Contact Us 상담 예약 팝업 내부의 오픈 상태 및 초기 주입 데이터(이벤트/리뷰 연동용)
    const [isContactOpen, setIsContactOpen] = useState(false);
    const [contactInitialReviewId, setContactInitialReviewId] = useState("");
    const [contactInitialGenre, setContactInitialGenre] = useState("");
    const [contactInitialPart, setContactInitialPart] = useState("");
    const [contactInitialImage, setContactInitialImage] = useState("");
    const [contactInitialSource, setContactInitialSource] = useState<string | null>(null);

    // --- State: 모바일 햄버거 메뉴 패널 전용 ---
    // 모바일 햄버거 아이콘 클릭으로 우측 사이드 패널 단위 메뉴가 열렸는지 여부
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    // (현재는 1depth 구조이나) 드롭다운 하위 메뉴가 있을 경우 열림 상태 추적
    const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);

    // 외부 영역 클릭 감지를 위한 DOM 참조 레퍼런스
    const navRef = useRef<HTMLElement>(null);

    // Hooks
    // 모달 또는 햄버거 메뉴 바깥의 영역을 클릭했을 때 메뉴를 닫는 이펙트 처리
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (isMenuOpen && isHamburgerMode && navRef.current && !navRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        const handleOpenContactOverlay = (e: Event) => {
            const detail = (e as CustomEvent).detail;
            setContactInitialReviewId(detail?.reviewId || "");
            setContactInitialGenre(detail?.genre || "");
            setContactInitialPart(detail?.part || "");
            setContactInitialImage(detail?.imageUrl || "");
            setContactInitialSource(detail?.source || null);
            
            setIsMenuOpen(false);
            setIsContactOpen(true);
        };

        window.addEventListener("openContactOverlay", handleOpenContactOverlay);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            window.removeEventListener("openContactOverlay", handleOpenContactOverlay);
        };
    }, [isMenuOpen, isHamburgerMode]);

    // Helpers
    // Contact 버튼 클릭 시 메뉴 창을 닫고 중앙 예약 모달 띄우기
    const handleContactClick = () => {
        setContactInitialReviewId(""); // 직접 클릭 시 초기화
        setContactInitialGenre("");
        setContactInitialPart("");
        setContactInitialImage("");
        setContactInitialSource(null);
        setIsMenuOpen(false);
        setIsContactOpen(true);
    };

    // 내비게이션 바 자체를 화면에 렌더링 할 조건:
    // 햄버거 모드가 아니거나, 햄버거 모드인데 메뉴 보기 버튼을 클릭해서 열린 경우
    const showNavBar = !isHamburgerMode || (isHamburgerMode && isMenuOpen);

    // Style variables for cleaner return block
    // 데스크탑 / 모바일 및 상태 조건에 따른 네비게이션 컨테이너 클래스 지정
    // 보여질 때는 opacity-100 및 clip-path 제거, 가릴 때는 투명화 및 숨김 처리
    const navVisibilityClasses = showNavBar
        ? '[clip-path:inset(0_0_0_0)] lg:[clip-path:none] opacity-100'
        : '[clip-path:inset(0_0_100%_0)] opacity-0 lg:h-0 lg:opacity-0 lg:overflow-hidden lg:[clip-path:none]';

    const navContainerClasses = `
        transition-all duration-500 ease-in-out pointer-events-auto 
        lg:flex-1 lg:flex lg:items-center lg:justify-end lg:px-8
        fixed lg:relative top-[100px] md:top-[120px] lg:top-0 left-0 
        h-[calc(100vh-100px)] md:h-[calc(100vh-120px)] lg:h-[100px] 
        w-[170px] md:w-[325px] lg:w-auto 
        z-40 flex flex-col lg:flex-row pt-8 lg:pt-0
        overflow-y-auto lg:overflow-y-visible
        ${navVisibilityClasses}
    `;

    return (
        <>
            <nav ref={navRef} className={navContainerClasses}>
                {/* Independent Background Layer with Fade Mask */}
                {/* 배경 블러 처리 및 데스크탑용 투명 마스크 레이어 */}
                <div className={`
                    absolute inset-0 z-0 pointer-events-none
                    bg-[#1C1310]/90 backdrop-blur-md border-r border-white/5 
                    lg:border-r-0 lg:bg-[#1C1310]/[0.38] 
                    lg:[mask-image:linear-gradient(to_right,transparent_0px,transparent_100px,black_30%,black_100%)]
                `} />

                {/* Navigation Items - Content Layer */}
                {/* 실제 링크들이 렌더링되는 레이어 */}
                <div className={`relative z-10 flex flex-col lg:flex-row items-start lg:items-center w-full lg:w-auto ${showNavBar ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>
                    <ul className="flex flex-col lg:flex-row space-y-6 lg:space-y-0 lg:space-x-8 lg:mr-12 w-full lg:w-auto pb-20 lg:pb-0 pl-8 lg:pl-0">
                        {MENU_ITEMS.map((item) => (
                            <li key={item.name} className="relative group lg:h-full flex flex-col lg:flex-row lg:items-center item-start w-full lg:w-auto">
                                <div className="flex items-center justify-between w-full lg:w-auto">
                                    <Link
                                        href={item.path}
                                        className="text-base lg:text-lg font-medium text-gray-400 hover:text-white transition-colors py-2 lg:py-4 block w-full lg:w-auto"
                                        onClick={(e) => {
                                            if (!isHamburgerMode) return;

                                            // 햄버거 모드에서 서브메뉴가 있는 아이템을 누르면 아코디언처럼 하위항목 토글
                                            if (item.subItems) {
                                                e.preventDefault();
                                                setOpenSubMenu(openSubMenu === item.name ? null : item.name);
                                            } else {
                                                // 일반 링크라면 모바일/햄버거 메뉴를 닫음
                                                setIsMenuOpen(false);
                                            }
                                        }}
                                    >
                                        {item.name}
                                    </Link>
                                    {/* Mobile Toggle Chevron */}
                                    {/* 서브아이템 보유 시 모바일에서 토글 버튼 우측 화살표 렌더링 */}
                                    {item.subItems && isHamburgerMode && (
                                        <button
                                            className="p-2 lg:hidden outline-none focus:outline-none text-gray-400"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setOpenSubMenu(openSubMenu === item.name ? null : item.name);
                                            }}
                                        >
                                            <svg
                                                className={`w-5 h-5 transition-transform duration-300 ${openSubMenu === item.name ? 'rotate-180' : ''}`}
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>
                                    )}
                                </div>

                                {/* Dropdown Menu (Glass Style) */}
                                {/* 데스크탑 호버 혹은 모바일 토글 방식으로 보이는 서브메뉴 계층 렌더링 */}
                                {item.subItems && (
                                    <div className={`
                                        lg:absolute lg:top-full lg:left-1/2 lg:-translate-x-1/2 lg:pt-4 
                                        static w-full pl-4 lg:pl-0
                                        lg:opacity-0 lg:invisible lg:group-hover:opacity-100 lg:group-hover:visible 
                                        transition-all duration-300 ease-out z-50
                                        ${openSubMenu === item.name ? 'block' : 'hidden'} lg:block
                                    `}>
                                        <div className="bg-[#1C1310]/95 backdrop-blur-xl rounded-xl lg:border border-white/10 overflow-hidden min-w-[200px] shadow-2xl">
                                            <ul className="py-2">
                                                {item.subItems.map((subItem) => (
                                                    <li key={subItem.name}>
                                                        <Link
                                                            href={subItem.path}
                                                            className="block px-4 lg:px-6 py-2 lg:py-3 text-sm text-gray-400 hover:bg-white/10 hover:text-white transition-colors whitespace-nowrap"
                                                            onClick={() => isHamburgerMode && setIsMenuOpen(false)}
                                                        >
                                                            {subItem.name}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>

                    {/* Nav 우측 끝: 독립된 디자인의 Contact 예약 버튼 (로그인 시 관리자/스태프 페이지로 전환) */}
                    <div className="mt-8 lg:mt-0 w-full lg:w-auto flex justify-center lg:block">
                        {session?.user ? (
                            <Link
                                href={(session.user as any).role === "admin" ? "/admin" : "/staff"}
                                className="px-9 py-3.5 lg:px-6 lg:py-2 bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/50 text-white font-bold rounded-lg transition-all w-auto lg:w-auto lg:mr-4 backdrop-blur-sm flex items-center gap-2"
                                onClick={() => isHamburgerMode && setIsMenuOpen(false)}
                            >
                                <span>⚙️</span>
                                {(session.user as any).role === "admin" ? "관리자 페이지" : "스태프 페이지"}
                            </Link>
                        ) : (
                            <button
                                onClick={handleContactClick}
                                className="px-9 py-3.5 lg:px-6 lg:py-2 bg-white/10 hover:bg-white/20 border border-white/10 text-white font-bold rounded-lg transition-all w-auto lg:w-auto lg:mr-4 backdrop-blur-sm"
                            >
                                예약하기
                            </button>
                        )}
                    </div>
                </div>
            </nav>

            {/* Backdrop for Mobile */}
            {/* 햄버거 팝업 시 뒷편의 바디 전체를 흐리게 깔아주는 백그라운드 레이어 */}
            {isHamburgerMode && isMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden animate-fade-in"
                    onClick={() => setIsMenuOpen(false)}
                />
            )}

            {/* Hamburger Button (Glass Style) */}
            {/* 스크롤 다운 혹은 모바일 모드 시 플로팅 아이콘 형태로 나오는 '메뉴 열기' 버튼 */}
            {isHamburgerMode && !isMenuOpen && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsMenuOpen(true);
                    }}
                    className="fixed top-[100px] md:top-[120px] left-[85px] md:left-[162.5px] -translate-x-1/2 lg:fixed lg:top-8 lg:right-8 lg:left-auto lg:translate-x-0 z-50 pointer-events-auto w-[170px] md:w-[325px] h-9 lg:w-14 lg:h-14 bg-white/10 backdrop-blur-md border-b border-l border-r border-white/10 text-white drop-shadow-md hover:bg-white/20 transition-all animate-fade-in flex items-center justify-center [clip-path:polygon(0%_0%,_100%_0%,_100%_70%,_50%_100%,_0%_70%)] lg:rounded-full lg:[clip-path:none]"
                    aria-label="Open Menu"
                >
                    <svg className="w-4 h-4 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            )}

            {/* Contact Overlay */}
            {/* 메뉴 트리 외부에서 별도 호출되는 상담 예약 모달 */}
            {isContactOpen && (
                <ContactOverlay
                    onClose={() => setIsContactOpen(false)}
                    initialReviewId={contactInitialReviewId}
                    initialGenre={contactInitialGenre}
                    initialPart={contactInitialPart}
                    initialSource={contactInitialSource}
                    initialImage={contactInitialImage}
                />
            )}
        </>
    );
}
