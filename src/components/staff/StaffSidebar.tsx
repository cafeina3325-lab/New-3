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
    { name: "메신저", path: "/staff/messenger", icon: "💬" },
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
    const { data: session, update: updateSession } = useSession();
    const pathname = usePathname();
    const [expandedGroups, setExpandedGroups] = useState<string[]>([]);

    // 계정관리 모달 상태
    const [showAccountModal, setShowAccountModal] = useState(false);
    const [accountView, setAccountView] = useState<'main' | 'password'>('main');

    // 닉네임 변경 상태
    const [editingNickname, setEditingNickname] = useState(false);
    const [newNickname, setNewNickname] = useState("");
    const [nicknameLoading, setNicknameLoading] = useState(false);
    const [nicknameError, setNicknameError] = useState("");
    const [nicknameSuccess, setNicknameSuccess] = useState(false);

    // 비밀번호 변경 상태
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [pwLoading, setPwLoading] = useState(false);
    const [pwError, setPwError] = useState("");
    const [pwSuccess, setPwSuccess] = useState(false);

    // 생일/전화번호 상태
    const [birthday, setBirthday] = useState("");
    const [phone, setPhone] = useState("");
    const [editingBirthday, setEditingBirthday] = useState(false);
    const [editingPhone, setEditingPhone] = useState(false);
    const [profileLoading, setProfileLoading] = useState(false);
    const [profileSuccess, setProfileSuccess] = useState("");

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

    const openAccountModal = async () => {
        setShowAccountModal(true);
        setAccountView('main');
        setEditingNickname(false);
        setNewNickname("");
        setNicknameError("");
        setNicknameSuccess(false);
        setEditingBirthday(false);
        setEditingPhone(false);
        setProfileSuccess("");
        resetPasswordForm();
        // 프로필 정보 조회
        try {
            const res = await fetch("/api/staff/profile");
            if (res.ok) {
                const data = await res.json();
                setNewNickname(data.nickname || "");
                setBirthday(data.birthday || "");
                setPhone(data.phone || "");
            }
        } catch {}
    };

    const resetPasswordForm = () => {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setPwError("");
        setPwSuccess(false);
    };

    // 닉네임 변경 핸들러
    const handleNicknameChange = async () => {
        if (!newNickname.trim()) {
            setNicknameError("닉네임을 입력해 주세요.");
            return;
        }
        if (newNickname.trim().length < 2) {
            setNicknameError("닉네임은 최소 2자 이상이어야 합니다.");
            return;
        }

        setNicknameLoading(true);
        setNicknameError("");

        try {
            const res = await fetch("/api/staff/profile", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ newNickname: newNickname.trim() }),
            });

            if (res.ok) {
                setNicknameSuccess(true);
                setEditingNickname(false);
                setTimeout(() => setNicknameSuccess(false), 2000);
            } else {
                const data = await res.json();
                setNicknameError(data.error || "닉네임 변경에 실패했습니다.");
            }
        } catch {
            setNicknameError("서버 연결에 실패했습니다.");
        } finally {
            setNicknameLoading(false);
        }
    };

    // 비밀번호 변경 핸들러
    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        setPwError("");

        if (!currentPassword.trim()) {
            setPwError("현재 비밀번호를 입력해 주세요.");
            return;
        }
        if (!newPassword.trim() || newPassword.trim().length < 4) {
            setPwError("새 비밀번호는 최소 4자 이상이어야 합니다.");
            return;
        }
        if (newPassword !== confirmPassword) {
            setPwError("새 비밀번호가 일치하지 않습니다.");
            return;
        }

        setPwLoading(true);

        try {
            const res = await fetch("/api/staff/profile/password", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    currentPassword: currentPassword.trim(),
                    newPassword: newPassword.trim(),
                }),
            });

            if (res.ok) {
                setPwSuccess(true);
                setTimeout(() => {
                    setAccountView('main');
                    resetPasswordForm();
                }, 2000);
            } else {
                const data = await res.json();
                setPwError(data.error || "비밀번호 변경에 실패했습니다.");
            }
        } catch {
            setPwError("서버 연결에 실패했습니다.");
        } finally {
            setPwLoading(false);
        }
    };

    const currentUsername = (session?.user as any)?.name || "스태프";

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
                    onClick={openAccountModal}
                    className="w-full flex items-center justify-center md:justify-start md:space-x-3 p-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all group"
                >
                    <span className="text-xl shrink-0 group-hover:rotate-12 transition-transform">👤</span>
                    <span className="font-semibold hidden md:inline text-sm lg:text-base whitespace-nowrap">계정관리</span>
                </button>

                <button
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    className="w-full flex items-center justify-center md:justify-start md:space-x-3 p-3 rounded-xl text-red-400/80 hover:text-red-400 hover:bg-red-500/10 transition-all group"
                >
                    <span className="text-xl shrink-0 group-hover:scale-110 transition-transform">🚪</span>
                    <span className="font-semibold hidden md:inline text-sm lg:text-base whitespace-nowrap">로그아웃</span>
                </button>
            </div>

            {/* 계정관리 모달 */}
            {showAccountModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAccountModal(false)} />
                    <div className="relative bg-[#1C1310] border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
                        {accountView === 'main' ? (
                            /* ===== 메인 뷰: 닉네임 & 비밀번호 항목 ===== */
                            <>
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-lg font-bold text-[#F3EBE1] flex items-center space-x-2">
                                        <span>👤</span>
                                        <span>계정관리</span>
                                    </h2>
                                    <button onClick={() => setShowAccountModal(false)} className="text-gray-500 hover:text-white transition-colors">✕</button>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1 min-w-0">
                                            <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold block mb-1">닉네임</span>
                                            <input
                                                type="text"
                                                value={newNickname}
                                                onChange={(e) => setNewNickname(e.target.value)}
                                                placeholder={currentUsername}
                                                className="bg-white/5 border border-white/20 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-white/40 transition-all w-full mt-1"
                                            />
                                        </div>
                                    </div>
                                    {nicknameError && <p className="text-xs text-red-400 mt-2">{nicknameError}</p>}

                                    {/* 비밀번호 항목 */}
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold block mb-1">비밀번호</span>
                                            <span className="text-white font-bold text-sm">••••••••</span>
                                        </div>
                                        <button
                                            onClick={() => { setAccountView('password'); resetPasswordForm(); }}
                                            className="px-3 py-1.5 text-xs text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors shrink-0 ml-3"
                                        >
                                            변경
                                        </button>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex-1 min-w-0">
                                            <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold block mb-1">생일</span>
                                            <div className="flex gap-1 w-full mt-1">
                                                <select
                                                    value={birthday.split('-')[0] || "1990"}
                                                    onChange={(e) => {
                                                        const parts = birthday.split('-');
                                                        setBirthday(`${e.target.value}-${parts[1] || "01"}-${parts[2] || "01"}`);
                                                    }}
                                                    className="bg-white/5 border border-white/20 rounded-lg px-2 py-1.5 text-white text-sm focus:outline-none focus:border-white/40 transition-all flex-[1.2]"
                                                >
                                                    {Array.from({ length: 70 }, (_, i) => new Date().getFullYear() - i).map(year => (
                                                        <option key={year} value={year} className="bg-[#1C1310] text-white">{year}년</option>
                                                    ))}
                                                </select>
                                                <select
                                                    value={birthday.split('-')[1] || "01"}
                                                    onChange={(e) => {
                                                        const parts = birthday.split('-');
                                                        setBirthday(`${parts[0] || "1990"}-${e.target.value}-${parts[2] || "01"}`);
                                                    }}
                                                    className="bg-white/5 border border-white/20 rounded-lg px-2 py-1.5 text-white text-sm focus:outline-none focus:border-white/40 transition-all flex-1"
                                                >
                                                    {Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0')).map(month => (
                                                        <option key={month} value={month} className="bg-[#1C1310] text-white">{month}월</option>
                                                    ))}
                                                </select>
                                                <select
                                                    value={birthday.split('-')[2] || "01"}
                                                    onChange={(e) => {
                                                        const parts = birthday.split('-');
                                                        setBirthday(`${parts[0] || "1990"}-${parts[1] || "01"}-${e.target.value}`);
                                                    }}
                                                    className="bg-white/5 border border-white/20 rounded-lg px-2 py-1.5 text-white text-sm focus:outline-none focus:border-white/40 transition-all flex-1"
                                                >
                                                    {Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0')).map(day => (
                                                        <option key={day} value={day} className="bg-[#1C1310] text-white">{day}일</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex-1 min-w-0">
                                            <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold block mb-1">전화번호</span>
                                            <input
                                                type="text"
                                                value={phone}
                                                onChange={(e) => {
                                                    let val = e.target.value.replace(/[^0-9]/g, "");
                                                    if (val.length > 11) val = val.slice(0, 11);
                                                    let formatted = val;
                                                    if (val.length > 3 && val.length <= 7) {
                                                        formatted = `${val.slice(0, 3)}-${val.slice(3)}`;
                                                    } else if (val.length > 7) {
                                                        formatted = `${val.slice(0, 3)}-${val.slice(3, 7)}-${val.slice(7)}`;
                                                    }
                                                    setPhone(formatted);
                                                }}
                                                maxLength={13}
                                                placeholder="010-0000-0000"
                                                className="bg-white/5 border border-white/20 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-white/40 transition-all w-full mt-1"
                                            />
                                        </div>
                                    </div>

                                    {profileSuccess && <p className="text-xs text-green-400 text-center">✅ {profileSuccess}</p>}
                                </div>

                                <div className="mt-6 pt-4 border-t border-white/5 flex gap-3">
                                    <button
                                        onClick={() => setShowAccountModal(false)}
                                        className="flex-1 px-4 py-2.5 bg-white/5 text-gray-400 rounded-xl text-sm font-medium hover:bg-white/10 hover:text-white transition-colors"
                                    >
                                        취소
                                    </button>
                                    <button
                                        onClick={async () => {
                                            setProfileLoading(true);
                                            try {
                                                // 닉네임 변경 
                                                const currentName = currentUsername;
                                                const trimmedNickname = newNickname.trim();
                                                if (trimmedNickname !== "" && trimmedNickname !== currentName) {
                                                    await handleNicknameChange();
                                                }
                                                // 다른 항목 변경 (생일/번호)
                                                const res = await fetch("/api/staff/profile", { 
                                                    method: "PATCH", 
                                                    headers: { "Content-Type": "application/json" }, 
                                                    body: JSON.stringify({ 
                                                        birthday: birthday.trim(),
                                                        phone: phone.trim() 
                                                    }) 
                                                });
                                                if (res.ok) { 
                                                    setProfileSuccess("프로필이 성공적으로 저장되었습니다."); 
                                                    setTimeout(() => setProfileSuccess(""), 3000); 
                                                }
                                            } catch (e) {
                                                console.error(e);
                                            } finally { 
                                                setProfileLoading(false); 
                                            }
                                        }}
                                        disabled={profileLoading}
                                        className="flex-[2] px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-bold transition-colors shadow-lg shadow-blue-600/20 disabled:opacity-50"
                                    >
                                        {profileLoading ? "저장 중..." : "완료"}
                                    </button>
                                </div>
                            </>
                        ) : (
                            /* ===== 비밀번호 변경 뷰 ===== */
                            <>
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-lg font-bold text-[#F3EBE1] flex items-center space-x-2">
                                        <span>🔑</span>
                                        <span>비밀번호 변경</span>
                                    </h2>
                                    <button onClick={() => { setAccountView('main'); resetPasswordForm(); }} className="text-gray-500 hover:text-white transition-colors">✕</button>
                                </div>

                                {pwSuccess ? (
                                    <div className="py-8 text-center space-y-4">
                                        <div className="text-4xl text-green-500">✅</div>
                                        <p className="text-[#F3EBE1] font-medium text-sm">비밀번호가 성공적으로 변경되었습니다.</p>
                                    </div>
                                ) : (
                                    <form onSubmit={handlePasswordChange} className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-xs text-gray-400 font-medium">현재 비밀번호</label>
                                            <input
                                                type="password"
                                                placeholder="현재 비밀번호 입력"
                                                value={currentPassword}
                                                onChange={(e) => setCurrentPassword(e.target.value)}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-white/30 transition-all text-sm"
                                                autoFocus
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs text-gray-400 font-medium">새 비밀번호</label>
                                            <input
                                                type="password"
                                                placeholder="최소 4자 이상 입력"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-white/30 transition-all text-sm"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs text-gray-400 font-medium">새 비밀번호 확인</label>
                                            <input
                                                type="password"
                                                placeholder="새 비밀번호 재입력"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-white/30 transition-all text-sm"
                                            />
                                        </div>
                                        {pwError && <p className="text-xs text-red-400 bg-red-950/30 border border-red-900/30 rounded-lg px-3 py-2">{pwError}</p>}
                                        <div className="flex gap-2 pt-2">
                                            <button
                                                type="button"
                                                onClick={() => { setAccountView('main'); resetPasswordForm(); }}
                                                className="flex-1 px-4 py-2.5 bg-white/5 text-gray-400 rounded-xl text-sm font-medium hover:bg-white/10 transition-colors"
                                            >
                                                뒤로
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={pwLoading}
                                                className="flex-1 px-4 py-2.5 bg-white/10 text-white rounded-xl text-sm font-medium hover:bg-white/20 transition-colors disabled:opacity-50"
                                            >
                                                {pwLoading ? "변경 중..." : "비밀번호 변경"}
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </>
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
