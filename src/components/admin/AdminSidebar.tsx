"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

// 관리자 대시보드 내 주요 탭 메뉴 목록 정적 데이터
const MENU_ITEMS = [
    { name: "방문관리", path: "/admin/visits", icon: "🚶" },
    { name: "예약관리", path: "/admin/appointments", icon: "📅" },
    { name: "히어로 영상", path: "/admin/hero", icon: "🎥" },
    { name: "이벤트", path: "/admin/event", icon: "🎁" },
    { name: "갤러리", path: "/admin/gallery", icon: "🖼️" },
    { name: "리뷰", path: "/admin/reviews", icon: "📊" },
];

export default function AdminSidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-20 md:w-64 bg-[#140D0B] border-r border-white/5 flex flex-col h-full overflow-y-auto transition-all duration-300">
            <div className="p-5 md:p-8 border-b border-white/5 flex justify-center md:justify-start">
                <Link href="/admin">
                    <h2 className="text-base md:text-2xl font-bold tracking-tighter text-[#F3EBE1] hidden md:block">ADMIN PANEL</h2>
                    <h2 className="text-sm border border-white/20 p-1 md:hidden rounded font-bold text-[#F3EBE1]">A</h2>
                </Link>
            </div>
            <nav className="flex-1 p-3 md:p-4 space-y-2 mt-2 md:mt-4">
                {MENU_ITEMS.map((item) => (
                    <Link
                        key={item.path}
                        href={item.path}
                        className={`flex items-center justify-center md:justify-start md:space-x-3 p-3 rounded-lg transition-all ${pathname === item.path
                            ? "bg-white/10 text-white shadow-lg"
                            : "text-gray-400 hover:bg-white/5 hover:text-white"
                            }`}
                        title={item.name}
                    >
                        <span className="text-xl shrink-0">{item.icon}</span>
                        <span className="font-medium hidden md:inline text-sm lg:text-base whitespace-nowrap">{item.name}</span>
                    </Link>
                ))}
            </nav>

            <div className="p-3 md:p-4 border-t border-white/5">
                <button
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    className="w-full flex items-center justify-center md:justify-start md:space-x-3 p-3 rounded-xl text-red-400/80 hover:text-red-400 hover:bg-red-500/10 transition-all group"
                >
                    <span className="text-xl shrink-0 group-hover:scale-110 transition-transform">🚪</span>
                    <span className="font-semibold hidden md:inline text-sm lg:text-base whitespace-nowrap">로그아웃</span>
                </button>
            </div>
            <div className="p-4 border-t border-white/5 text-xs text-gray-500 text-center">
                &copy; 2026 Flying Studio Admin
            </div>
        </aside>
    );
}
