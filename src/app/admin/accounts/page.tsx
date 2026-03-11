/**
 * 관리자 패널 - 계정관리(Accounts) 페이지
 * 
 * 관리자(Admin) 계정과 스태프(Staff) 계정을 분리하여
 * 조회, 추가, 삭제할 수 있는 페이지입니다.
 */

"use client";

import { useEffect, useState } from "react";

interface Account {
    id: string;
    username: string;
    nickname?: string;
    phone?: string;
    createdAt: string;
    birthday?: string;
}

export default function AdminAccountsPage() {
    const [admins, setAdmins] = useState<Account[]>([]);
    const [staffs, setStaffs] = useState<Account[]>([]);
    const [newUsername, setNewUsername] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newBirthday, setNewBirthday] = useState("");
    const [newRole, setNewRole] = useState<"admin" | "staff">("staff");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [editingAccount, setEditingAccount] = useState<{ id: string; username: string; nickname?: string; phone?: string; role: string; birthday?: string } | null>(null);
    const [editMode, setEditMode] = useState<"main" | "username" | "password">("main");
    const [currentPassword, setCurrentPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isCurrentPasswordCorrect, setIsCurrentPasswordCorrect] = useState<boolean | null>(null);
    const [newNickname, setNewNickname] = useState("");
    const [newPhone, setNewPhone] = useState("");

    const fetchAccounts = async () => {
        try {
            const res = await fetch("/api/admin/accounts");
            if (res.ok) {
                const data = await res.json();
                setAdmins(data.admins || []);
                setStaffs(data.staffs || []);
            }
        } catch (err) {
            console.error("계정 목록 조회 실패:", err);
        }
    };

    useEffect(() => {
        fetchAccounts();
    }, []);

    useEffect(() => {
        if (editMode === "password" && currentPassword && editingAccount) {
            const timer = setTimeout(async () => {
                try {
                    const res = await fetch("/api/admin/accounts/verify", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            id: editingAccount.id,
                            role: editingAccount.role,
                            password: currentPassword
                        }),
                    });
                    if (res.ok) {
                        const data = await res.json();
                        setIsCurrentPasswordCorrect(data.isMatch);
                    }
                } catch (err) {
                    console.error("비밀번호 검증 중 오류:", err);
                }
            }, 500);
            return () => clearTimeout(timer);
        } else {
            setIsCurrentPasswordCorrect(null);
        }
    }, [currentPassword, editMode, editingAccount]);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newUsername.trim() || !newPassword.trim()) {
            setError("아이디와 비밀번호를 입력해 주세요.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/admin/accounts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: newUsername.trim(),
                    password: newPassword.trim(),
                    role: newRole,
                }),
            });

            if (res.ok) {
                setNewUsername("");
                setNewPassword("");
                setShowModal(false);
                setError("");
                fetchAccounts();
            } else {
                const data = await res.json();
                setError(data.error || "계정 생성에 실패했습니다.");
            }
        } catch {
            setError("서버 연결에 실패했습니다.");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingAccount) return;

        // 아이디 변경 모드인 경우 아이디 필수
        if (editMode === "username" && !newUsername.trim()) {
            setError("새 아이디를 입력해 주세요.");
            return;
        }

        // 비밀번호 변경 모드인 경우 유효성 검사
        if (editMode === "password") {
            if (!currentPassword) {
                setError("현재 비밀번호를 입력해 주세요.");
                return;
            }
            if (!newPassword) {
                setError("새 비밀번호를 입력해 주세요.");
                return;
            }
            if (newPassword !== confirmPassword) {
                setError("새 비밀번호가 일치하지 않습니다.");
                return;
            }
            if (newPassword.length < 4) {
                setError("비밀번호는 최소 4자 이상이어야 합니다.");
                return;
            }
            if (currentPassword === newPassword) {
                setError("같은 비밀번호는 사용할 수 없습니다.");
                return;
            }
        }

        setLoading(true);
        setError("");

        try {
            const body: any = {
                id: editingAccount.id,
                role: editingAccount.role,
            };

            if (editMode === "username") {
                body.username = newUsername.trim();
            } else if (editMode === "password") {
                body.password = newPassword;
                body.currentPassword = currentPassword;
            } else {
                // main 모드 (스태프 계정 전체 혹은 관리자 기타 정보)
                body.username = newUsername.trim();
                body.birthday = newBirthday.trim() || undefined;
                body.nickname = newNickname.trim() || null;
                body.phone = newPhone.trim() || null;

                // 스태프 계정인 경우 새 비밀번호가 입력되었다면 포함
                if (editingAccount.role === "staff" && newPassword.trim()) {
                    if (newPassword.trim().length < 4) {
                        setError("비밀번호는 최소 4자 이상이어야 합니다.");
                        setLoading(false);
                        return;
                    }
                    body.password = newPassword.trim();
                }
            }

            const res = await fetch("/api/admin/accounts", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            if (res.ok) {
                setEditingAccount(null);
                setNewPassword("");
                setCurrentPassword("");
                setConfirmPassword("");
                setError("");
                fetchAccounts();
            } else {
                const data = await res.json();
                setError(data.error || "계정 수정에 실패했습니다.");
            }
        } catch {
            setError("서버 연결에 실패했습니다.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string, role: string) => {
        if (!window.confirm("정말 이 계정을 삭제하시겠습니까?")) return;

        try {
            const res = await fetch(`/api/admin/accounts?id=${id}&role=${role}`, {
                method: "DELETE",
            });
            if (res.ok) {
                fetchAccounts();
            } else {
                alert("계정 삭제에 실패했습니다.");
            }
        } catch {
            alert("서버 연결에 실패했습니다.");
        }
    };

    const AccountTable = ({ accounts, role, label, icon }: { accounts: Account[]; role: string; label: string; icon: string }) => (
        <div className="bg-[#1C1310] rounded-xl border border-white/10 p-6">
            <div className="flex items-center space-x-3 mb-6">
                <span className="text-2xl">{icon}</span>
                <h2 className="text-xl font-bold text-[#F3EBE1]">{label}</h2>
                <span className="ml-auto text-sm text-gray-500 bg-white/5 px-3 py-1 rounded-full">
                    {accounts.length}명
                </span>
            </div>
            <table className="w-full text-left text-sm text-gray-400">
                <thead className="bg-[#2A1D18] text-[#F3EBE1]">
                    <tr>
                        <th className="p-4 rounded-tl-lg">아이디</th>
                        <th className="p-4">닉네임</th>
                        {role === "admin" && <th className="p-4">휴대폰번호</th>}
                        {role === "admin" && <th className="p-4">생일</th>}
                        {role !== "admin" && <th className="p-4">비밀번호</th>}
                        {role !== "admin" && <th className="p-4">휴대폰번호</th>}
                        {role !== "admin" && <th className="p-4">생일</th>}
                        <th className="p-4 rounded-tr-lg text-right">관리</th>
                    </tr>
                </thead>
                <tbody>
                    {accounts.length > 0 ? (
                        accounts.map((account) => (
                            <tr key={account.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                <td className="p-4 font-medium text-white">{account.username}</td>
                                <td className="p-4 text-gray-400 text-sm">{account.nickname || "-"}</td>
                                {role === "admin" && (
                                    <td className="p-4 text-gray-400 text-xs text-nowrap">
                                        {account.phone || "-"}
                                    </td>
                                )}
                                {role === "admin" && (
                                    <td className="p-4 text-gray-400 text-xs text-nowrap">
                                        {account.birthday || "-"}
                                    </td>
                                )}
                                {role !== "admin" && (
                                    <td className="p-4">
                                        <span className="text-gray-600 font-mono tracking-widest">********</span>
                                    </td>
                                )}
                                {role !== "admin" && (
                                    <td className="p-4 text-gray-400 text-xs text-nowrap">
                                        {account.phone || "-"}
                                    </td>
                                )}
                                {role !== "admin" && (
                                    <td className="p-4 text-gray-400 text-xs text-nowrap">
                                        {account.birthday || "-"}
                                    </td>
                                )}
                                <td className="p-4 text-right flex items-center justify-end space-x-2">
                                    <button
                                        onClick={() => {
                                        setEditingAccount({ id: account.id, username: account.username, nickname: account.nickname, phone: account.phone, role: role, birthday: account.birthday });
                                            setEditMode("main");
                                            setNewUsername(account.username);
                                            setNewNickname(account.nickname || "");
                                            setNewPhone(account.phone || "");
                                            setNewPassword("");
                                            setCurrentPassword("");
                                            setConfirmPassword("");
                                            setIsCurrentPasswordCorrect(null);
                                            setNewBirthday(account.birthday || "");
                                            setError("");
                                        }}
                                        className="px-4 py-2 bg-blue-950/50 hover:bg-blue-900 border border-blue-900/50 text-white rounded-lg transition-colors text-xs"
                                    >
                                        수정
                                    </button>
                                    <button
                                        onClick={() => handleDelete(account.id, role)}
                                        className="px-4 py-2 bg-red-950/50 hover:bg-red-900 border border-red-900/50 text-white rounded-lg transition-colors text-xs"
                                    >
                                        삭제
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={role === "admin" ? 5 : 6} className="p-12 text-center text-gray-500">
                                등록된 {label}이 없습니다.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );

    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 max-h-none overflow-x-hidden w-full max-w-7xl mx-auto">
            {/* 헤더 */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-[#F3EBE1]">계정 관리</h1>
                    <p className="text-sm md:text-base text-gray-400 mt-2">
                        관리자 및 스태프 계정을 조회, 추가, 삭제할 수 있습니다.
                    </p>
                </div>
                <button
                    onClick={() => { setShowModal(true); setNewUsername(""); setNewPassword(""); setError(""); }}
                    className="flex items-center space-x-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/10 text-white rounded-xl transition-all text-sm font-medium whitespace-nowrap"
                >
                    <span>➕</span>
                    <span>새 계정 추가</span>
                </button>
            </div>

            {/* 새 계정 추가 모달 */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
                    <div className="relative bg-[#1C1310] border border-white/10 rounded-2xl p-8 w-full max-w-md mx-4 shadow-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-[#F3EBE1] flex items-center space-x-3">
                                <span className="text-2xl">➕</span>
                                <span>새 계정 추가</span>
                            </h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-white transition-colors text-xl">✕</button>
                        </div>
                        <form onSubmit={handleCreate} className="flex flex-col gap-5">
                            <div className="flex flex-col gap-2">
                                <label className="text-xs text-gray-400 font-medium">역할</label>
                                <select
                                    value={newRole}
                                    onChange={(e) => setNewRole(e.target.value as "admin" | "staff")}
                                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-white/30 transition-all text-sm"
                                >
                                    <option value="admin" className="bg-[#1C1310]">관리자</option>
                                    <option value="staff" className="bg-[#1C1310]">스태프</option>
                                </select>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-xs text-gray-400 font-medium">아이디</label>
                                <input
                                    type="text"
                                    placeholder="아이디 입력"
                                    value={newUsername}
                                    onChange={(e) => setNewUsername(e.target.value)}
                                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-white/30 transition-all text-sm"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-xs text-gray-400 font-medium">비밀번호</label>
                                <input
                                    type="password"
                                    placeholder="비밀번호 입력"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-white/30 transition-all text-sm"
                                />
                            </div>
                            {error && <p className="text-sm text-red-400 bg-red-950/30 border border-red-900/30 rounded-lg px-4 py-2">{error}</p>}
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-5 py-2.5 bg-white/5 text-gray-400 rounded-xl text-sm font-medium">취소</button>
                                <button type="submit" disabled={loading} className="flex-1 px-5 py-2.5 bg-white/10 text-white rounded-xl text-sm font-medium">{loading ? "생성 중..." : "계정 생성"}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* 계정 수정 모달 */}
            {editingAccount && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setEditingAccount(null)} />
                    <div className="relative bg-[#1C1310] border border-white/10 rounded-2xl p-8 w-full max-w-md mx-4 shadow-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-[#F3EBE1] flex items-center space-x-3">
                                <span className="text-2xl">⚙️</span>
                                <span>계정 정보 수정</span>
                            </h2>
                            <button onClick={() => setEditingAccount(null)} className="text-gray-500 hover:text-white transition-colors text-xl">✕</button>
                        </div>
                        <form onSubmit={handleUpdate} className="flex flex-col gap-5">
                            {editingAccount.role === "staff" ? (
                                // 스태프 계정: 기존 통합 수정 방식
                                <>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs text-gray-400 font-medium">아이디</label>
                                        <input
                                            type="text"
                                            placeholder="아이디 입력"
                                            value={newUsername}
                                            onChange={(e) => setNewUsername(e.target.value)}
                                            className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-white/30 transition-all text-sm"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs text-gray-400 font-medium">닉네임</label>
                                        <input
                                            type="text"
                                            placeholder="닉네임 입력"
                                            value={newNickname}
                                            onChange={(e) => setNewNickname(e.target.value)}
                                            className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-white/30 transition-all text-sm"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs text-gray-400 font-medium">새 비밀번호 (변경 시에만 입력)</label>
                                        <input
                                            type="password"
                                            placeholder="새 비밀번호 입력"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-white/30 transition-all text-sm"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs text-gray-400 font-medium">휴대폰번호</label>
                                        <input
                                            type="text"
                                            placeholder="예: 010-0000-0000"
                                            value={newPhone}
                                            onChange={(e) => setNewPhone(e.target.value)}
                                            className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-white/30 transition-all text-sm"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs text-gray-400 font-medium">생일 (YYYY-MM-DD)</label>
                                        <input
                                            type="text"
                                            placeholder="예: 1990-01-01"
                                            value={newBirthday}
                                            onChange={(e) => setNewBirthday(e.target.value)}
                                            className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-white/30 transition-all text-sm"
                                        />
                                    </div>
                                    {error && <p className="text-sm text-red-400 bg-red-950/30 border border-red-900/30 rounded-lg px-4 py-2">{error}</p>}
                                    <div className="flex gap-3 pt-2">
                                        <button type="button" onClick={() => setEditingAccount(null)} className="flex-1 px-5 py-2.5 bg-white/5 text-gray-400 rounded-xl text-sm font-medium">취소</button>
                                        <button type="submit" disabled={loading} className="flex-1 px-5 py-2.5 bg-white/10 text-white rounded-xl text-sm font-medium">{loading ? "수정 중..." : "수정 완료"}</button>
                                    </div>
                                </>
                            ) : (
                                // 관리자 계정: 고도화된 단계별 수정 방식
                                editMode === "main" ? (
                                    <>
                                        <div className="flex flex-col gap-2">
                                            <label className="text-xs text-gray-400 font-medium">아이디</label>
                                            <div className="flex gap-2">
                                                <div className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-gray-400 text-sm">
                                                    {editingAccount.username}
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => { setEditMode("username"); setError(""); }}
                                                    className="px-4 bg-white/10 hover:bg-white/20 border border-white/10 text-white rounded-xl text-xs transition-all"
                                                >
                                                    변경
                                                </button>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="text-xs text-gray-400 font-medium">닉네임</label>
                                            <input
                                                type="text"
                                                placeholder="닉네임 입력"
                                                value={newNickname}
                                                onChange={(e) => setNewNickname(e.target.value)}
                                                className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-white/30 transition-all text-sm"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="text-xs text-gray-400 font-medium">비밀번호</label>
                                            <div className="flex gap-2">
                                                <div className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-gray-400 text-sm tracking-widest">
                                                    ********
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => { setEditMode("password"); setError(""); }}
                                                    className="px-4 bg-white/10 hover:bg-white/20 border border-white/10 text-white rounded-xl text-xs transition-all"
                                                >
                                                    변경
                                                </button>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="text-xs text-gray-400 font-medium">휴대폰번호</label>
                                            <input
                                                type="text"
                                                placeholder="예: 010-0000-0000"
                                                value={newPhone}
                                                onChange={(e) => setNewPhone(e.target.value)}
                                                className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-white/30 transition-all text-sm"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="text-xs text-gray-400 font-medium">생일 (YYYY-MM-DD)</label>
                                            <input
                                                type="text"
                                                placeholder="예: 1990-01-01"
                                                value={newBirthday}
                                                onChange={(e) => setNewBirthday(e.target.value)}
                                                className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-white/30 transition-all text-sm"
                                            />
                                        </div>
                                        {error && <p className="text-sm text-red-400 bg-red-950/30 border border-red-900/30 rounded-lg px-4 py-2">{error}</p>}
                                        <div className="flex gap-3 pt-2">
                                            <button type="button" onClick={() => setEditingAccount(null)} className="flex-1 px-5 py-2.5 bg-white/5 text-gray-400 rounded-xl text-sm font-medium">닫기</button>
                                            <button type="submit" disabled={loading} className="flex-1 px-5 py-2.5 bg-white/10 text-white rounded-xl text-sm font-medium">{loading ? "수정 중..." : "정보 수정"}</button>
                                        </div>
                                    </>
                                ) : editMode === "username" ? (
                                    <>
                                        <div className="flex flex-col gap-2">
                                            <label className="text-xs text-gray-400 font-medium">현재 아이디</label>
                                            <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-gray-500 text-sm">
                                                {editingAccount.username}
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="text-xs text-gray-400 font-medium">새 아이디</label>
                                            <input
                                                type="text"
                                                placeholder="새 아이디 입력"
                                                value={newUsername}
                                                onChange={(e) => setNewUsername(e.target.value)}
                                                className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-white/30 transition-all text-sm"
                                                autoFocus
                                            />
                                        </div>
                                        {error && <p className="text-sm text-red-400 bg-red-950/30 border border-red-900/30 rounded-lg px-4 py-2">{error}</p>}
                                        <div className="flex gap-3 pt-2">
                                            <button type="button" onClick={() => { setEditMode("main"); setError(""); setNewUsername(editingAccount.username); }} className="flex-1 px-5 py-2.5 bg-white/5 text-gray-400 rounded-xl text-sm font-medium">취소</button>
                                            <button type="submit" disabled={loading} className="flex-1 px-5 py-2.5 bg-blue-900/50 text-white rounded-xl text-sm font-medium hover:bg-blue-800 transition-all">{loading ? "변경 중..." : "아이디 변경"}</button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="flex flex-col gap-2">
                                            <label className="text-xs text-gray-400 font-medium">현재 비밀번호</label>
                                            <input
                                                type="password"
                                                placeholder="현재 비밀번호 입력"
                                                value={currentPassword}
                                                onChange={(e) => setCurrentPassword(e.target.value)}
                                                className={`bg-white/5 border rounded-xl px-4 py-2.5 text-white focus:outline-none transition-all text-sm ${isCurrentPasswordCorrect === null
                                                    ? "border-white/10 focus:border-white/30"
                                                    : isCurrentPasswordCorrect
                                                        ? "border-green-500/50 focus:border-green-500"
                                                        : "border-red-500/50 focus:border-red-500"
                                                    }`}
                                                autoFocus
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="text-xs text-gray-400 font-medium">새 비밀번호</label>
                                            <input
                                                type="password"
                                                placeholder="새 비밀번호 입력"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-white/30 transition-all text-sm"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="text-xs text-gray-400 font-medium">새 비밀번호 확인</label>
                                            <input
                                                type="password"
                                                placeholder="새 비밀번호 다시 입력"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                className={`bg-white/5 border rounded-xl px-4 py-2.5 text-white focus:outline-none transition-all text-sm ${confirmPassword === ""
                                                    ? "border-white/10 focus:border-white/30"
                                                    : newPassword === confirmPassword
                                                        ? "border-green-500/50 focus:border-green-500"
                                                        : "border-red-500/50 focus:border-red-500"
                                                    }`}
                                            />
                                        </div>
                                        {error && <p className="text-sm text-red-400 bg-red-950/30 border border-red-900/30 rounded-lg px-4 py-2">{error}</p>}
                                        <div className="flex gap-3 pt-2">
                                            <button type="button" onClick={() => { setEditMode("main"); setError(""); setCurrentPassword(""); setNewPassword(""); setConfirmPassword(""); }} className="flex-1 px-5 py-2.5 bg-white/5 text-gray-400 rounded-xl text-sm font-medium">취소</button>
                                            <button type="submit" disabled={loading} className="flex-1 px-5 py-2.5 bg-blue-900/50 text-white rounded-xl text-sm font-medium hover:bg-blue-800 transition-all">{loading ? "변경 중..." : "비밀번호 변경"}</button>
                                        </div>
                                    </>
                                )
                            )}
                        </form>

                    </div>
                </div>
            )}

            {/* 관리자 계정 테이블 */}
            <AccountTable
                accounts={admins}
                role="admin"
                label="관리자 계정"
                icon="🛡️"
            />

            {/* 스태프 계정 테이블 */}
            <AccountTable
                accounts={staffs}
                role="staff"
                label="스태프 계정"
                icon="👥"
            />
        </div>
    );
}
