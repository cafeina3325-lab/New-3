/**
 * 관리자 패널 - 예약 관리(Appointments) 페이지 라우트
 * 
 * 랜딩 페이지의 ContactOverlay 및 다양한 모달에서 들어온 고객 예약(상담) 신청 내역을
 * 전체 조회, 상태 변경(대기/확정/취소), 논리적 삭제(isDeleted) 및 영구 보관(isArchived) 처리하는 핵심 페이지 컴포넌트입니다.
 * 필터링 탭과 검색 기능을 통해 방대한 예약 데이터를 손쉽게 관리할 수 있습니다.
 */

"use client";

import { useState, useEffect } from "react";
import StatCard from "@/components/admin/StatCard";
import AppointmentTable from "@/components/admin/AppointmentTable";

// 관리자 예약 리스트 렌더링을 위한 예약 정보 인터페이스
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
    createdAt?: string;
    isDeleted?: boolean;      // 목록에서 숨김 처리 여부 (일시적 뷰어 삭제)
    isArchived?: boolean;     // 완전 초기화(영구 보관) 처리 여부
}

export default function AppointmentsPage() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('all');
    const [search, setSearch] = useState("");

    // 데이터 로딩
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

    // 상태 변경 핸들러
    const handleStatusChange = async (id: string, status: 'pending' | 'confirmed' | 'cancelled') => {
        try {
            const res = await fetch('/api/appointments', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status }),
            });

            if (res.ok) {
                setAppointments(prev =>
                    prev.map(apt => apt.id === id ? { ...apt, status } : apt)
                );
            }
        } catch (error) {
            console.error("상태 변경 실패:", error);
        }
    };

    // 목록 삭제 핸들러 (isDeleted 반영)
    const handleDelete = async (id: string) => {
        try {
            const res = await fetch(`/api/appointments?id=${id}`, {
                method: 'DELETE',
            });

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

    // 전체 목록 삭제 핸들러 (isDeleted 일괄 반영)
    const handleDeleteAll = async () => {
        if (!window.confirm("정말로 모든 예약 내역을 화면에서 삭제하시겠습니까?\n(통계 수치는 유지됩니다)")) return;

        try {
            // 현재 화면에 보이지 않는 것 포함하여 모든 목록의 ID 리스트를 추출
            const allIds = appointments.filter(apt => !apt.isDeleted).map(apt => apt.id);
            if (allIds.length === 0) {
                alert("삭제할 내역이 없습니다.");
                return;
            }

            // 다중 삭제를 위해 각 ID별로 delete 요청을 보냄 (임시)
            const deletePromises = allIds.map(id =>
                fetch(`/api/appointments?id=${id}`, { method: 'DELETE' })
            );

            await Promise.all(deletePromises);

            setAppointments(prev =>
                prev.map(apt => ({ ...apt, isDeleted: true }))
            );

        } catch (error) {
            console.error("전체 삭제 실패:", error);
            alert("일부 데이터를 삭제하는 중 오류가 발생했습니다.");
        }
    };

    // 삭제 내역 복구 핸들러
    const handleRestoreAll = async () => {
        if (!window.confirm("삭제 처리되어 보이지 않는 예약 내역들을 다시 복구하시겠습니까?")) return;

        try {
            // isDeleted가 true인 항목들의 id 추출
            const deletedIds = appointments.filter(apt => apt.isDeleted).map(apt => apt.id);
            if (deletedIds.length === 0) {
                alert("복구할 데이터가 존재하지 않습니다.");
                return;
            }

            const restorePromises = deletedIds.map(id =>
                fetch('/api/appointments', {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id, isDeleted: false })
                })
            );

            await Promise.all(restorePromises);

            // 로컬 상태에 즉각 반영
            setAppointments(prev =>
                prev.map(apt => apt.isDeleted ? { ...apt, isDeleted: false } : apt)
            );
        } catch (error) {
            console.error("복구 실패:", error);
            alert("복구하는 중 오류가 발생했습니다.");
        }
    };

    // 전체 데이터 초기화 핸들러 (통계는 유지하되 관리 목록에서 영구 제거 - Archived 처리)
    const handleResetAll = async () => {
        if (!window.confirm("삭제 처리되어 목록에 보이지 않는 예약 데이터를 완전히 아카이브(보관)하시겠습니까?\n주의: 보관된 데이터는 다시 복구할 수 없으나, 방문관리의 통계 수치에는 계속 포함됩니다.")) return;

        try {
            // 보이지 않는 데이터(isDeleted가 true이고 아직 아카이브되지 않은 항목들) 추출
            const targetIds = appointments.filter(apt => apt.isDeleted && !apt.isArchived).map(apt => apt.id);
            if (targetIds.length === 0) {
                alert("초기화할 데이터가 없습니다.");
                return;
            }

            // 실제 삭제 대신 isArchived 플래그를 true로 업데이트합니다.
            const archivePromises = targetIds.map(id =>
                fetch('/api/appointments', {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id, isArchived: true })
                })
            );

            await Promise.all(archivePromises);

            // 로컬 상태 업데이트 (아카이브된 데이터는 상태에서 제거하거나 플래그 변경)
            setAppointments(prev =>
                prev.map(apt => targetIds.includes(apt.id) ? { ...apt, isArchived: true } : apt)
            );

            alert("데이터가 안전하게 아카이브되었습니다. (통계 수치는 유지됩니다)");
        } catch (error) {
            console.error("초기화(아카이브) 실패:", error);
            alert("초기화하는 중 오류가 발생했습니다.");
        }
    };

    // 필터링 로직 (소프트 삭제되거나 아카이브된 항목은 리스트에서 제외)
    const filteredAppointments = appointments.filter(apt => {
        if (apt.isDeleted || apt.isArchived) return false;

        const matchesFilter = filter === 'all' || apt.status === filter;
        const matchesSearch = !search ||
            apt.clientName.includes(search) ||
            apt.service.includes(search) ||
            (apt.referenceReviewId && apt.referenceReviewId.includes(search)) ||
            apt.id.includes(search);
        return matchesFilter && matchesSearch;
    });

    // 통계 카드 실시간 계산 (아카이브된 항목 제외)
    const activeAppointments = appointments.filter(a => !a.isArchived);
    const totalCount = activeAppointments.length;
    const pendingCount = activeAppointments.filter(a => a.status === 'pending').length;
    const confirmedCount = activeAppointments.filter(a => a.status === 'confirmed').length;
    const cancelledCount = activeAppointments.filter(a => a.status === 'cancelled').length;

    const stats = [
        { title: "전체 예약", value: String(totalCount), trend: "", icon: "📅" },
        { title: "확정 대기", value: String(pendingCount), trend: "", icon: "⏳" },
        { title: "확정됨", value: String(confirmedCount), trend: "", icon: "✅" },
        { title: "취소됨", value: String(cancelledCount), trend: "", icon: "❌" },
    ];

    return (
        <div className="space-y-6 sm:space-y-10 pt-4 sm:pt-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">예약 관리</h1>
                <p className="text-sm sm:text-base text-gray-400 mt-2">고객들의 예약 신청 내역을 관리하고 상태를 변경할 수 있습니다.</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <StatCard key={stat.title} {...stat} />
                ))}
            </div>

            {/* 초기화 버튼 영역 */}
            <div className="flex justify-end pt-2 sm:pt-4">
                <button
                    onClick={handleResetAll}
                    disabled={appointments.filter(apt => apt.isDeleted).length === 0}
                    className={`px-4 py-2 sm:px-6 sm:py-2.5 bg-gray-900 border border-gray-700 text-gray-400 rounded-lg sm:rounded-xl hover:bg-gray-800 hover:text-white transition-colors font-medium text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                    데이터 초기화
                </button>
            </div>

            {/* Filters & Search & DeleteAll */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex p-1 bg-white/5 rounded-xl border border-white/10 w-full md:w-fit overflow-x-auto scrollbar-hide">
                    {(['all', 'pending', 'confirmed', 'cancelled'] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setFilter(tab)}
                            className={`px-4 sm:px-6 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${filter === tab
                                ? "bg-white text-black shadow-lg"
                                : "text-gray-400 hover:text-white"
                                }`}
                        >
                            {tab === 'all' ? '전체' : tab === 'pending' ? '대기 중' : tab === 'confirmed' ? '확정' : '취소'}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative group">
                        <input
                            type="text"
                            placeholder="고객명, 서비스, 예약ID, 리뷰ID 검색..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full md:w-80 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-white/30 transition-all font-medium"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
                    </div>
                </div>
            </div>

            {/* List Table Title & Buttons */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-3 md:gap-0 pb-2">
                <h3 className="text-xl font-bold text-white px-2">예약 목록</h3>
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={handleRestoreAll}
                        disabled={appointments.filter(apt => apt.isDeleted && !apt.isArchived).length === 0}
                        className={`px-4 py-2 bg-blue-900/40 border border-blue-900/50 text-blue-500 rounded-lg hover:bg-blue-900/60 hover:text-blue-400 transition-colors font-bold whitespace-nowrap text-sm disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                        삭제내역복구
                    </button>
                    <button
                        onClick={handleDeleteAll}
                        className="px-4 py-2 bg-red-900/40 border border-red-900/50 text-red-500 rounded-lg hover:bg-red-900/60 hover:text-red-400 transition-colors font-bold whitespace-nowrap text-sm"
                    >
                        전체 내역 삭제
                    </button>
                </div>
            </div>

            {/* List Table */}
            {loading ? (
                <div className="p-20 text-center text-gray-500">데이터 로딩 중...</div>
            ) : (
                <AppointmentTable
                    appointments={filteredAppointments}
                    onStatusChange={handleStatusChange}
                    onDelete={handleDelete}
                />
            )}



        </div>
    );
}
