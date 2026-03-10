"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

// 메뉴 항목 인터페이스
interface MenuItem {
    name: string;
    path?: string;
    icon: string;
    children?: { name: string; path: string; icon: string }[];
}

// 스태프 대시보드 메뉴 목록 (계층형)
const MENU_ITEMS: MenuItem[] = [
    { name: "방문관리", path: "/staff/visits", icon: "🚶" },
    { name: "메신저", path: "/staff/messenger", icon: "💬" },
    { name: "캘린더", path: "/staff/calendar", icon: "📅" },
    { name: "예약관리", path: "/staff/appointments", icon: "📅" },
    {
        name: "페이지관리",
        path: "/staff/pages",
        icon: "📄",
        children: [
            { name: "이벤트", path: "/staff/event", icon: "🎁" },
            { name: "갤러리", path: "/staff/gallery", icon: "🖼️" },
            { name: "리뷰", path: "/staff/reviews", icon: "📊" },
        ]
    },
];

export default function StaffSidebar() {
    const { data: session } = useSession();
    const pathname = usePathname();
    const [expandedGroups, setExpandedGroups] = useState<string[]>([]);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

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

    const handlePasswordChange = async (e: React.FormEvent) => {
        // ... (기존 비밀번호 변경 로직 유지)
        e.preventDefault();
        if (!newPassword.trim()) {
            setError("새 비밀번호를 입력해 주세요.");
            return;
        }

        if (newPassword.trim().length < 4) {
            setError("비밀번호는 최소 4자 이상이어야 합니다.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/staff/profile/password", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ newPassword: newPassword.trim() }),
            });

            if (res.ok) {
                setSuccess(true);
                setNewPassword("");
                setTimeout(() => {
                    setShowPasswordModal(false);
                    setSuccess(false);
                }, 2000);
            } else {
                const data = await res.json();
                setError(data.error || "비밀번호 변경에 실패했습니다.");
            }
        } catch {
            setError("서버 연결에 실패했습니다.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <aside className="w-20 md:w-64 bg-[#0B0F14] border-r border-white/5 flex flex-col h-full overflow-y-auto transition-all duration-300">
            <div className="p-5 md:p-8 border-b border-white/5 flex justify-center md:justify-start">
                <Link href="/staff">
                    <h2 className="text-base md:text-2xl font-bold tracking-tighter text-[#E1E8F3] hidden md:block">STAFF PANEL</h2>
                    <h2 className="text-sm border border-white/20 p-1 md:hidden rounded font-bold text-[#E1E8F3]">S</h2>
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

                            {/* 서브메뉴 렌더링 */}
                            {hasChildren && isExpanded && (
                                <div className="ml-4 md:ml-6 space-y-1 animate-in slide-in-from-top-1 duration-200">
                                    {item.children!.map((child) => (
                                        <Link
                                            key={child.path}
                                            href={child.path}
                                            className={`flex items-center justify-center md:justify-start md:space-x-3 p-2.5 rounded-lg transition-all ${pathname === child.path
                                                ? "text-blue-400 font-bold"
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


            <div className="p-3 md:p-4 border-t border-white/5 space-y-2">
                {(session?.user as any)?.role === "admin" && (
                    <Link
                        href="/admin"
                        className="w-full flex items-center justify-center md:justify-start md:space-x-3 p-3 rounded-xl text-orange-400 hover:text-orange-300 hover:bg-white/5 transition-all group"
                    >
                        <span className="text-xl shrink-0 group-hover:scale-110 transition-transform">⚙️</span>
                        <span className="font-semibold hidden md:inline text-sm lg:text-base whitespace-nowrap">관리자 페이지</span>
                    </Link>
                )}

                <Link
                    href="/"
                    className="w-full flex items-center justify-center md:justify-start md:space-x-3 p-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all group"
                >
                    <span className="text-xl shrink-0 group-hover:scale-110 transition-transform">🏠</span>
                    <span className="font-semibold hidden md:inline text-sm lg:text-base whitespace-nowrap">메인페이지</span>
                </Link>

                <button
                    onClick={() => setShowPasswordModal(true)}
                    className="w-full flex items-center justify-center md:justify-start md:space-x-3 p-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all group"
                >
                    <span className="text-xl shrink-0 group-hover:rotate-12 transition-transform">🔑</span>
                    <span className="font-semibold hidden md:inline text-sm lg:text-base whitespace-nowrap">비밀번호 변경</span>
                </button>

                <button
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    className="w-full flex items-center justify-center md:justify-start md:space-x-3 p-3 rounded-xl text-red-400/80 hover:text-red-400 hover:bg-red-500/10 transition-all group"
                >
                    <span className="text-xl shrink-0 group-hover:scale-110 transition-transform">🚪</span>
                    <span className="font-semibold hidden md:inline text-sm lg:text-base whitespace-nowrap">로그아웃</span>
                </button>
            </div>

            {/* 비밀번호 변경 모달 */}
            {showPasswordModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowPasswordModal(false)} />
                    <div className="relative bg-[#1C1310] border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-[#F3EBE1] flex items-center space-x-2">
                                <span>🔑</span>
                                <span>비밀번호 변경</span>
                            </h2>
                            <button onClick={() => setShowPasswordModal(false)} className="text-gray-500 hover:text-white transition-colors">✕</button>
                        </div>
                        {success ? (
                            <div className="py-8 text-center space-y-4">
                                <div className="text-4xl text-green-500">✅</div>
                                <p className="text-[#F3EBE1] font-medium text-sm">비밀번호가 성공적으로 변경되었습니다.</p>
                            </div>
                        ) : (
                            <form onSubmit={handlePasswordChange} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs text-gray-400 font-medium">새 비밀번호</label>
                                    <input
                                        type="password"
                                        placeholder="최소 4자 이상 입력"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-white/30 transition-all text-sm"
                                        autoFocus
                                    />
                                </div>
                                {error && <p className="text-xs text-red-400 bg-red-950/30 border border-red-900/30 rounded-lg px-3 py-2">{error}</p>}
                                <div className="flex gap-2 pt-2">
                                    <button type="button" onClick={() => setShowPasswordModal(false)} className="flex-1 px-4 py-2.5 bg-white/5 text-gray-400 rounded-xl text-sm font-medium hover:bg-white/10 transition-colors">취소</button>
                                    <button type="submit" disabled={loading} className="flex-1 px-4 py-2.5 bg-white/10 text-white rounded-xl text-sm font-medium hover:bg-white/20 transition-colors disabled:opacity-50">
                                        {loading ? "변경 중..." : "변경 완료"}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}
            <div className="p-4 border-t border-white/5 text-xs text-gray-500 text-center">
                &copy; 2026 Flying Studio Staff
            </div>
        </aside>
    );
}
