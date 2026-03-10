/**
 * 스태프 패널 - 예약 관리 페이지
 * 
 * 자신에게 배정된 예약만 표시됩니다.
 * 배정받지 못한(pending) 예약은 목록에 나타나지 않습니다.
 */

"use client";

import { useState, useEffect } from "react";
import StatCard from "@/components/admin/StatCard";
import AppointmentTable from "@/components/admin/AppointmentTable";

interface Appointment {
    id: string;
    date: string;
    time: string;
    clientName: string;
    service: string;
    contact: string;
    part?: string;
    genre?: string;
    referenceReviewId?: string;
    referenceText?: string;
    source?: string | null;
    files?: string[];
    status: 'pending' | 'confirmed' | 'cancelled';
    assignedTo?: string | null;
    createdAt?: string;
    isDeleted?: boolean;
    staffHidden?: boolean;
    isArchived?: boolean;
}

export default function StaffAppointmentsPage() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('all');
    const [search, setSearch] = useState("");
    const [currentUser, setCurrentUser] = useState<string>("");

    // 현재 로그인한 사용자 정보 가져오기
    useEffect(() => {
        const fetchSession = async () => {
            try {
                const res = await fetch("/api/auth/session");
                if (res.ok) {
                    const session = await res.json();
                    if (session?.user?.name) {
                        setCurrentUser(session.user.name);
                    }
                }
            } catch (error) {
                console.error("세션 정보 로딩 실패:", error);
            }
        };
        fetchSession();
    }, []);

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const res = await fetch('/api/appointments');
            if (res.ok) {
                const data = await res.json();
                setAppointments(data);
            }
        } catch (error) {
            console.error("예약 목록 로딩 실패:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (id: string, status: 'pending' | 'confirmed' | 'cancelled', assignedTo?: string | null) => {
        try {
            const body: any = { id, status };
            if (assignedTo !== undefined) body.assignedTo = assignedTo;

            const res = await fetch('/api/appointments', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            if (res.ok) {
                setAppointments(prev =>
                    prev.map(apt => apt.id === id ? { ...apt, status, ...(assignedTo !== undefined ? { assignedTo } : {}) } : apt)
                );
            }
        } catch (error) {
            console.error("상태 변경 실패:", error);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const res = await fetch(`/api/appointments?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                setAppointments(prev =>
                    prev.map(apt => apt.id === id ? { ...apt, isDeleted: true } : apt)
                );
            } else {
                alert("삭제 처리에 실패했습니다.");
            }
        } catch (error) {
            console.error("삭제 실패:", error);
        }
    };

    const handleClearCancelled = async () => {
        const cancelledAppointments = myAppointments.filter(apt => apt.status === 'cancelled');
        if (cancelledAppointments.length === 0) {
            alert("숨길 취소 내역이 없습니다.");
            return;
        }

        if (!window.confirm(`취소된 ${cancelledAppointments.length}건의 내역을 목록에서 비우시겠습니까?`)) return;

        try {
            const clearPromises = cancelledAppointments.map(apt =>
                fetch('/api/appointments', {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: apt.id, staffHidden: true }) // isDeleted 대신 staffHidden 사용
                })
            );

            await Promise.all(clearPromises);

            setAppointments(prev =>
                prev.map(apt => {
                    if (myAppointments.some(ma => ma.id === apt.id && ma.status === 'cancelled')) {
                        return { ...apt, staffHidden: true };
                    }
                    return apt;
                })
            );
            alert("취소된 내역을 모두 비웠습니다.");
        } catch (error) {
            console.error("비우기 실패:", error);
            alert("일부 내역을 비우는 중 오류가 발생했습니다.");
        }
    };

    // 핵심: 자신에게 배정된 예약만 필터링
    const myAppointments = appointments.filter(apt => {
        // isDeleted(어드민 삭제) 또는 staffHidden(스태프 비우기) 또는 isArchived인 경우 제외
        if (apt.isDeleted || apt.staffHidden || apt.isArchived) return false;
        // assignedTo가 현재 로그인한 사용자와 일치하는 항목만 표시
        if (!apt.assignedTo || apt.assignedTo !== currentUser) return false;
        return true;
    });

    const filteredAppointments = myAppointments.filter(apt => {
        const matchesFilter = filter === 'all' || apt.status === filter;
        const matchesSearch = !search ||
            apt.clientName.includes(search) ||
            apt.service.includes(search) ||
            apt.id.includes(search);
        return matchesFilter && matchesSearch;
    });

    const stats = [
        {
            title: "전체",
            value: String(myAppointments.length),
            icon: "📅",
            onClick: () => setFilter('all'),
            active: filter === 'all'
        },
        {
            title: "확정",
            value: String(myAppointments.filter(a => a.status === 'confirmed').length),
            icon: "✅",
            onClick: () => setFilter('confirmed'),
            active: filter === 'confirmed'
        },
        {
            title: "취소",
            value: String(myAppointments.filter(a => a.status === 'cancelled').length),
            icon: "❌",
            onClick: () => setFilter('cancelled'),
            active: filter === 'cancelled'
        },
    ];

    return (
        <div className="space-y-6 sm:space-y-10 pt-4 sm:pt-8">
            <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">내 예약 관리</h1>
                <p className="text-sm sm:text-base text-gray-400 mt-2">
                    {currentUser ? (
                        <><span className="text-blue-400 font-bold">{currentUser}</span>님에게 배정된 예약 목록입니다.</>
                    ) : (
                        "배정된 예약 내역을 확인하고 관리할 수 있습니다."
                    )}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat) => (
                    <StatCard key={stat.title} {...stat} />
                ))}
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="relative w-full md:w-80">
                    <input
                        type="text"
                        placeholder="고객명, 서비스, 예약ID 검색..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-white/30 transition-all font-medium"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
                </div>

                <button
                    onClick={handleClearCancelled}
                    disabled={myAppointments.filter(a => a.status === 'cancelled').length === 0}
                    className="w-full md:w-auto px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all text-sm font-bold disabled:opacity-30 disabled:cursor-not-allowed group flex items-center justify-center gap-2"
                >
                    <span className="text-lg group-hover:rotate-12 transition-transform">🧹</span>
                    취소 내역 비우기
                </button>
            </div>

            {loading ? (
                <div className="p-20 text-center text-gray-500">데이터 로딩 중...</div>
            ) : filteredAppointments.length === 0 ? (
                <div className="p-20 text-center text-gray-500">
                    <div className="text-5xl mb-4 opacity-20">📋</div>
                    <p className="text-lg font-medium">배정된 예약이 없습니다.</p>
                    <p className="text-sm mt-2 text-gray-600">관리자가 예약을 배정하면 이곳에 표시됩니다.</p>
                </div>
            ) : (
                <AppointmentTable
                    appointments={filteredAppointments}
                    onStatusChange={handleStatusChange}
                    isStaffView={true}
                />
            )}
        </div>
    );
}
