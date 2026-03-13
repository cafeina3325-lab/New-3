/**
 * 전역 하단 푸터(Footer) 컴포넌트
 * 
 * 모든 페이지의 최하단에 공통으로 삽입되어 스튜디오 상세 상호 정보,
 * 영업시간, SNS 등 외부 링크, 그리고 예약/문의(Contact Us) 버튼 레이아웃을 제공합니다.
 * 'use client'를 통해 오버레이 모달 상태를 스스로 제어합니다.
 */

"use client";

import Link from "next/link";
import { useState } from "react";
import ContactOverlay from "./ContactOverlay";
import { MENU_ITEMS } from "@/data/constants";

export default function Footer() {
    // 'Contact Us' 버튼 클릭 시 전역 오버레이(방문 상담 예약 폼)의 표시 여부를 관리하는 상태값
    const [isContactOpen, setIsContactOpen] = useState(false);

    return (
        <footer className="bg-[#1C1310] text-[#D4C4BD] py-10 sm:py-14 lg:py-20 border-t border-[#3A2A24]">
            <div className="container mx-auto px-4 sm:px-8 lg:px-12">
                {/* 푸터 그리드: 모바일/태블릿 1열 → 데스크탑(md 이상) 2열 → 대형 데스크탑(lg 이상) 4열 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 sm:gap-16 lg:gap-16 mb-10 sm:mb-14 lg:mb-20">
                    {/* 1. 브랜드 & SNS & Contact */}
                    <div className="space-y-6 sm:space-y-8">
                        <h2 className="luxury-carbon-text flex flex-col font-playfair">
                            <span className="text-4xl sm:text-5xl lg:text-6xl font-black leading-none">Flying</span> <br />
                            <span className="text-4xl sm:text-5xl lg:text-6xl font-black leading-none">Studio</span>
                        </h2>
                        {/* SNS 링크 아이콘 */}
                        <div className="flex items-center space-x-3 sm:space-x-5">
                            {/* Kakao Button */}
                            <button className="w-10 h-10 shrink-0 rounded-lg bg-[#FAE100] text-[#371D1E] flex items-center justify-center hover:opacity-80 transition transform hover:scale-105">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 3c-5.523 0-10 3.582-10 8 0 2.872 1.884 5.397 4.777 6.776-.324 1.182-1.055 4.314-1.258 4.965-.247.788.291.874.607.662 2.651-1.777 5.438-3.649 6.293-4.184.516.096 1.058.181 1.581.181 5.523 0 10-3.582 10-8s-4.477-8-10-8z" />
                                </svg>
                            </button>
                            {/* Facebook Button */}
                            <button className="w-10 h-10 shrink-0 rounded-lg bg-[#3b5998] text-white flex items-center justify-center hover:opacity-80 transition transform hover:scale-105">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                                </svg>
                            </button>
                            {/* Instagram Button */}
                            <button className="w-10 h-10 shrink-0 rounded-lg bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 text-white flex items-center justify-center hover:opacity-80 transition transform hover:scale-105">
                                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" strokeWidth="2" />
                                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" strokeWidth="2" />
                                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                        </div>
                        <button
                            onClick={() => setIsContactOpen(true)}
                            className="px-10 py-4 border border-gray-600 text-gray-300 text-xl font-bold tracking-wide rounded-xl hover:border-white hover:text-white transition w-full sm:w-auto"
                        >
                            예약하기
                        </button>
                    </div>

                    {/* 2. Center-Left Column: Nav Menu */}
                    {/* 정적 메뉴 배열을 매핑 렌더링 */}
                    <div>
                        <h3 className="text-gold font-bold mb-3 sm:mb-5 text-2xl tracking-wider font-playfair luxury-carbon-text">Menu</h3>
                        <ul className="space-y-2 sm:space-y-3">
                            {MENU_ITEMS.map((item) => (
                                <li key={item.name}>
                                    <Link href={item.path} className="text-gray-400 hover:text-white transition-colors text-lg">
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* 3. 사업자 정보 (대형 화면에서 2칸 점유) */}
                    <div className="sm:col-span-2 lg:col-span-2 flex flex-col lg:items-end font-medium text-xs leading-relaxed word-keep-all">
                        <div className="text-left">
                            <h3 className="text-gold font-black mb-3 sm:mb-5 text-xl tracking-wider font-playfair luxury-carbon-text">Information</h3>
                            <div className="flex flex-col space-y-1 md:space-y-2 text-gray-400">
                                <p><span className="font-bold text-md text-gray-600 mr-2">OWNER</span> Kim Gwangpil</p>
                                <p><span className="font-bold text-md text-gray-600 mr-2">LICENSE</span> 123-45-67890</p>
                                <p><span className="font-bold text-md text-gray-600 mr-2">MANAGER</span> Park Boseung</p>
                                <p className="flex flex-col sm:flex-row sm:items-start"><span className="font-bold text-md text-gray-600 mr-2 shrink-0">ADDRESS</span> <span>MoonHwah-ro 95, 2F, <br className="sm:hidden" /> Namdong-gu, Incheon</span></p>
                                <p><span className="font-bold text-md text-gray-600 mr-2">HOURS</span> 09:00 - 20:00 (Mon - Sat)</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom: Copyright */}
                <div className="border-t border-gray-800 pt-6 sm:pt-10 text-center text-xs text-gray-500">
                    <p>&copy; 2026 Flying Studio. All rights reserved.</p>
                </div>
            </div>

            {/* Contact Overlay */}
            {/* 상태 변수로 컨택트 모달 노출 제어 */}
            {isContactOpen && <ContactOverlay onClose={() => setIsContactOpen(false)} />}
        </footer>
    );
}
