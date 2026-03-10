"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

// 메뉴 항목 인터페이스 정의
interface MenuItem {
    name: string;
    path?: string;
    icon: string;
    children?: { name: string; path: string; icon: string }[];
}

// 계층화된 메뉴 데이터
const MENU_ITEMS: MenuItem[] = [
    { name: "계정관리", path: "/admin/accounts", icon: "👤" },
    { name: "방문관리", path: "/admin/visits", icon: "🚶" },
    { name: "메신저", path: "/admin/messenger", icon: "💬" },
    { name: "캘린더", path: "/admin/calendar", icon: "📅" },
    { name: "예약관리", path: "/admin/appointments", icon: "📅" },
    {
        name: "페이지관리",
        path: "/admin/pages",
        icon: "📄",
        children: [
            { name: "히어로 영상", path: "/admin/hero", icon: "🎥" },
            { name: "이벤트", path: "/admin/event", icon: "🎁" },
            { name: "갤러리", path: "/admin/gallery", icon: "🖼️" },
            { name: "리뷰", path: "/admin/reviews", icon: "📊" },
        ]
    },
];

export default function AdminSidebar() {
    const pathname = usePathname();
    const [expandedGroups, setExpandedGroups] = useState<string[]>([]);

    // 현재 경로에 맞는 그룹을 자동으로 펼침
    useEffect(() => {
        const activeGroup = MENU_ITEMS.find(item =>
            item.children?.some(child => pathname.startsWith(child.path))
        );
        if (activeGroup && !expandedGroups.includes(activeGroup.name)) {
            setExpandedGroups(prev => [...prev, activeGroup.name]);
        }
    }, [pathname]);

    const toggleGroup = (name: string) => {
        setExpandedGroups(prev =>
            prev.includes(name) ? prev.filter(g => g !== name) : [...prev, name]
        );
    };

    return (
        <aside className="w-20 md:w-64 bg-[#140D0B] border-r border-white/5 flex flex-col h-full overflow-y-auto transition-all duration-300">
            <div className="p-5 md:p-8 border-b border-white/5 flex justify-center md:justify-start">
                <Link href="/admin">
                    <h2 className="text-base md:text-2xl font-bold tracking-tighter text-[#F3EBE1] hidden md:block">ADMIN PANEL</h2>
                    <h2 className="text-sm border border-white/20 p-1 md:hidden rounded font-bold text-[#F3EBE1]">A</h2>
                </Link>
            </div>
            <nav className="flex-1 p-3 md:p-4 space-y-1 mt-2 md:mt-4">
                {MENU_ITEMS.map((item) => {
                    const hasChildren = item.children && item.children.length > 0;
                    const isExpanded = expandedGroups.includes(item.name);
                    const isActive = item.path ? pathname === item.path : item.children?.some(c => pathname.startsWith(c.path));

                    return (
                        <div key={item.name} className="space-y-1">
                            {item.path ? (
                                <Link
                                    href={item.path}
                                    className={`flex items-center justify-center md:justify-start md:space-x-3 p-3 rounded-lg transition-all ${isActive
                                        ? "bg-white/10 text-white shadow-lg"
                                        : "text-gray-400 hover:bg-white/5 hover:text-white"
                                        }`}
                                    title={item.name}
                                    onClick={() => hasChildren && toggleGroup(item.name)}
                                >
                                    <span className="text-xl shrink-0">{item.icon}</span>
                                    <span className="font-medium hidden md:inline text-sm lg:text-base whitespace-nowrap flex-1">{item.name}</span>
                                    {hasChildren && (
                                        <span className={`hidden md:inline transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}>
                                            ▼
                                        </span>
                                    )}
                                </Link>
                            ) : (
                                <button
                                    onClick={() => toggleGroup(item.name)}
                                    className={`w-full flex items-center justify-center md:justify-start md:space-x-3 p-3 rounded-lg transition-all ${isActive
                                        ? "bg-white/10 text-white shadow-lg"
                                        : "text-gray-400 hover:bg-white/5 hover:text-white"
                                        }`}
                                    title={item.name}
                                >
                                    <span className="text-xl shrink-0">{item.icon}</span>
                                    <span className="font-medium hidden md:inline text-sm lg:text-base whitespace-nowrap flex-1 text-left">{item.name}</span>
                                    <span className={`hidden md:inline transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}>
                                        ▼
                                    </span>
                                </button>
                            )}

                            {/* Submenu Item Render */}
                            {hasChildren && isExpanded && (
                                <div className="ml-4 md:ml-6 space-y-1 animate-in slide-in-from-top-1 duration-200">
                                    {item.children!.map((child) => (
                                        <Link
                                            key={child.path}
                                            href={child.path}
                                            className={`flex items-center justify-center md:justify-start md:space-x-3 p-2.5 rounded-lg transition-all ${pathname === child.path
                                                ? "text-orange-400 font-bold"
                                                : "text-gray-500 hover:text-gray-300"
                                                }`}
                                        >
                                            <span className="text-lg shrink-0">{child.icon}</span>
                                            <span className="hidden md:inline text-xs lg:text-sm whitespace-nowrap">{child.name}</span>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </nav>

            <div className="p-3 md:p-4 border-t border-white/5">
                <Link
                    href="/"
                    className="w-full flex items-center justify-center md:justify-start md:space-x-3 p-3 rounded-xl transition-all text-gray-400 hover:bg-white/5 hover:text-white"
                    title="메인 페이지"
                >
                    <span className="text-xl shrink-0">🏠</span>
                    <span className="font-medium hidden md:inline text-sm lg:text-base whitespace-nowrap">메인 페이지</span>
                </Link>
            </div>
            <div className="p-3 md:p-4 border-t border-white/5">
                <Link
                    href="/staff"
                    className={`w-full flex items-center justify-center md:justify-start md:space-x-3 p-3 rounded-xl transition-all group ${pathname.startsWith("/staff")
                        ? "bg-white/10 text-white shadow-lg"
                        : "text-gray-400 hover:bg-white/5 hover:text-white"
                        }`}
                    title="스태프 페이지"
                >
                    <span className="text-xl shrink-0">📋</span>
                    <span className="font-medium hidden md:inline text-sm lg:text-base whitespace-nowrap">스태프 페이지</span>
                </Link>
            </div>
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
