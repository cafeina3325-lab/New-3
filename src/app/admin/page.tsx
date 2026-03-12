/**
 * 관리자 패널 메인 대시보드(AdminDashboard) 라우트 컴포넌트
 * 
 * `/admin` 접속 시 가장 처음 보여지는 오버뷰 화면입니다.
 * - 예약 현황, 리뷰 평균, 조회수 등 각종 통계 브리핑(StatCard)
 * - 가장 최근에 접수된 고객의 예약 내역 간략 조회
 * - 서버 상태와 저장 공간 등의 인프라 모니터링 정보를 종합 요약하여 표시합니다.
 */

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import StatCard from "@/components/admin/StatCard";
import VisitsChartSection from "@/components/admin/VisitsChartSection";
import Calendar from "@/components/common/Calendar";

export default function AdminDashboard() {
    // 날짜 정규화 함수: "2026. 03. 11." -> "2026-03-11"
    const normalizeDate = (d: string) => d.replace(/\. /g, '-').replace(/\./g, '-').replace(/-$/, '').replace(/\s/g, '');

    // 각종 기초 통계용 상태 변수 선언
    const [pendingCount, setPendingCount] = useState(0);
    const [avgRating, setAvgRating] = useState("0.0");
    const [monthlyAppointments, setMonthlyAppointments] = useState(0);
    const [monthlyPageViews, setMonthlyPageViews] = useState(0);
    const [totalPageViews, setTotalPageViews] = useState(0);
    const [recentAppointments, setRecentAppointments] = useState<any[]>([]);
    const [nicknameMap, setNicknameMap] = useState<Record<string, string>>({});
    const [chartTab, setChartTab] = useState<"visit" | "apt" | null>(null);
    
    const router = useRouter();

    const fetchData = () => {
        // 예약 API (/api/appointments) 데이터 통신 로직
        fetch("/api/appointments")
            .then(res => res.json())
            .then((data: any[]) => {
                setPendingCount(data.filter(a => a.status === "pending").length);
                const now = new Date();
                const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
                const monthlyCount = data.filter(a => new Date(a.createdAt) >= startOfMonth).length;
                setMonthlyAppointments(monthlyCount);

                const nowYear = now.getFullYear();
                const nowMonth = now.getMonth() + 1;
                const todayFormatted = normalizeDate(`${nowYear}-${String(nowMonth).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`);

                const thisMonthApts = data.filter(a => {
                    if (!a.date || a.isDeleted) return false;
                    if (a.status !== 'confirmed' && a.status !== 'holiday') return false;
                    const normDate = normalizeDate(a.date);
                    const [y, m] = normDate.split('-');
                    return parseInt(y) === nowYear && parseInt(m) === nowMonth;
                });

                thisMonthApts.sort((a, b) => {
                    const dateA = normalizeDate(a.date);
                    const dateB = normalizeDate(b.date);
                    const isFutureA = dateA >= todayFormatted;
                    const isFutureB = dateB >= todayFormatted;
                    if (isFutureA !== isFutureB) return isFutureA ? -1 : 1;
                    const dateDiff = dateA.localeCompare(dateB);
                    if (dateDiff !== 0) return dateDiff;
                    const timeA = (a.time || "00:00").split('~')[0].trim();
                    const timeB = (b.time || "00:00").split('~')[0].trim();
                    return timeA.localeCompare(timeB);
                });
                setRecentAppointments(thisMonthApts.slice(0, 8));
            }).catch(() => { });

        // 리뷰 평균 평점
        fetch("/api/reviews")
            .then(res => res.json())
            .then(data => {
                const reviews = data.reviews || [];
                if (reviews.length > 0) {
                    const avg = reviews.reduce((sum: number, r: any) => sum + (r.rating || 0), 0) / reviews.length;
                    setAvgRating(avg.toFixed(1));
                }
            }).catch(() => { });

        // 페이지 조회수
        fetch("/api/pageviews")
            .then(res => res.json())
            .then(data => {
                setMonthlyPageViews(data.monthly || 0);
                setTotalPageViews(data.total || 0);
            }).catch(() => { });

        // 스태프 닉네임 매핑
        fetch("/api/admin/accounts")
            .then(res => res.json())
            .then(data => {
                const map: Record<string, string> = {};
                const allAccounts = [...(data.admins || []), ...(data.staffs || [])];
                allAccounts.forEach((acc: any) => {
                    map[acc.username] = acc.nickname || acc.username;
                });
                setNicknameMap(map);
            }).catch(() => { });
    };

    useEffect(() => {
        fetchData();
    }, []);

    const stats = [
        { 
            title: "페이지 조회수", 
            value: monthlyPageViews.toLocaleString(), 
            icon: "👁️", 
            active: chartTab === "visit", 
            onClick: () => setChartTab(chartTab === "visit" ? null : "visit"),
            onReset: async () => {
                if (window.confirm("페이지 조회수 기록을 초기화하시겠습니까?")) {
                    try {
                        const res = await fetch("/api/pageviews", { method: 'DELETE' });
                        if (res.ok) fetchData();
                    } catch (e) { alert("초기화 중 오류가 발생했습니다."); }
                }
            }
        },
        { 
            title: "누적예약", 
            value: String(monthlyAppointments), 
            icon: "📅", 
            active: chartTab === "apt", 
            onClick: () => setChartTab(chartTab === "apt" ? null : "apt"),
            onReset: async () => {
                if (window.confirm("모든 예약 데이터를 초기화하시겠습니까?\n이 작업은 취소할 수 없습니다.")) {
                    try {
                        const res = await fetch("/api/appointments?resetAll=true", { method: 'DELETE' });
                        if (res.ok) fetchData();
                    } catch (e) { alert("초기화 중 오류가 발생했습니다."); }
                }
            }
        },
        { title: "예약", value: String(pendingCount), icon: "⏳", onClick: () => router.push("/admin/appointments") },
        { title: "평점", value: `${avgRating} / 5.0`, icon: "⭐", onClick: () => router.push("/admin/reviews") },
    ];

    const STATUS_STYLES: Record<string, { text: string; class: string }> = {
        pending: { text: "대기 중", class: "bg-yellow-500/10 text-yellow-500" },
        confirmed: { text: "확정됨", class: "bg-green-500/10 text-green-500" },
        cancelled: { text: "취소됨", class: "bg-red-500/10 text-red-500" },
    };


    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [selectedDateAppointments, setSelectedDateAppointments] = useState<any[]>([]);

    const fetchSelectedDateData = (date: string | null) => {
        if (!date) {
            setSelectedDateAppointments([]);
            return;
        }
        // 전체 예약 데이터에서 해당 날짜만 필터링 (이미 fetchData에서 가져온 데이터를 재활용하거나 새로 호출)
        // 여기서는 명확성을 위해 API 재호출 또는 필터링 로직 적용
        fetch("/api/appointments")
            .then(res => res.json())
            .then((data: any[]) => {
                const normSelected = normalizeDate(date);
                const filtered = data.filter(a => {
                    if (!a.date || a.isDeleted) return false;
                    // 사용자가 요청한 조건: 휴무 또는 확정된 일정(스태프 등록 상담/시술 포함)만 표시
                    if (a.status !== 'confirmed' && a.status !== 'holiday') return false;
                    return normalizeDate(a.date) === normSelected;
                });
                filtered.sort((a, b) => (a.time || "00:00").localeCompare(b.time || "00:00"));
                setSelectedDateAppointments(filtered);
            }).catch(() => { });
    };

    const handleSelectDate = (date: string | null) => {
        setSelectedDate(date);
        fetchSelectedDateData(date);
    };

    return (
        <div className="space-y-8 md:space-y-12 pt-6 md:pt-8">
            {/* Header 섹션 */}
            <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">대시보드 개요</h1>
                <p className="text-sm md:text-base text-gray-400 mt-2">Flying Studio 관리자 패널에 오신 것을 환영합니다.</p>
            </div>

            {/* 통계 카드 그리드 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {stats.map((stat) => (
                    <StatCard key={stat.title} {...stat} />
                ))}
            </div>

            {/* 메인 콘텐츠 영역 (2단 레이아웃) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 items-start">
                {/* 왼쪽 섹션: 메인 통계/차트 공간 */}
                <div className="lg:col-span-2 space-y-6 md:space-y-8">
                    {chartTab ? (
                        <div className="bg-[#140D0B] border border-white/5 rounded-2xl md:rounded-3xl p-4 md:p-8 animate-in zoom-in-95 duration-300">
                             <VisitsChartSection 
                                initialTab={chartTab} 
                                showTitle={true}
                                onClose={() => setChartTab(null)}
                             />
                        </div>
                    ) : (
                        <div className="bg-[#140D0B] border border-white/5 rounded-2xl md:rounded-3xl p-4 md:p-8 animate-in fade-in duration-500">
                            <Calendar theme="admin" compact={true} onSelectDate={handleSelectDate} />
                        </div>
                    )}
                </div>

                {/* 우측 섹션: 이달 일정 또는 선택된 날짜 일정 */}
                <div className="lg:col-span-1 bg-[#140D0B] border border-white/5 rounded-2xl md:rounded-3xl p-6 md:p-8">
                    <div className="flex justify-between items-center mb-6 md:mb-8">
                        <h2 className="text-xl md:text-2xl font-bold text-white font-mono">
                            {selectedDate 
                                ? `${normalizeDate(selectedDate).split('-')[2]}일 일정` 
                                : `${new Date().getMonth() + 1}월 일정`
                            }
                        </h2>
                    </div>

                    <div className="space-y-4 md:space-y-6">
                        {(() => {
                            const apts = selectedDate ? selectedDateAppointments : recentAppointments;
                            if (apts.length === 0) {
                                return (
                                    <div className="text-center text-gray-500 py-8 text-sm md:text-base">
                                        {selectedDate ? "해당 날짜에 일정이 없습니다." : "이번 달 예정된 일정이 없습니다."}
                                    </div>
                                );
                            }

                            // 휴무일 그룹화 로직
                            const holidays = apts.filter(a => a.status === 'holiday');
                            const others = apts.filter(a => a.status !== 'holiday');
                            
                            const groupedHolidays: any[] = [];
                            if (holidays.length > 0) {
                                const sortedHolidays = [...holidays].sort((a, b) => normalizeDate(a.date).localeCompare(normalizeDate(b.date)));
                                let current = { ...sortedHolidays[0], startDate: sortedHolidays[0].date, endDate: sortedHolidays[0].date };
                                
                                for (let i = 1; i < sortedHolidays.length; i++) {
                                    const next = sortedHolidays[i];
                                    const d1 = new Date(normalizeDate(current.endDate));
                                    const d2 = new Date(normalizeDate(next.date));
                                    const diff = (d2.getTime() - d1.getTime()) / (1000 * 3600 * 24);
                                    
                                    if (Math.round(diff) === 1) {
                                        current.endDate = next.date;
                                    } else {
                                        groupedHolidays.push(current);
                                        current = { ...next, startDate: next.date, endDate: next.date };
                                    }
                                }
                                groupedHolidays.push(current);
                            }

                            const combined = [...groupedHolidays, ...others].sort((a, b) => {
                                const dateA = normalizeDate(a.startDate || a.date);
                                const dateB = normalizeDate(b.startDate || b.date);
                                const now = new Date();
                                const todayFormatted = normalizeDate(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`);
                                const isFutureA = dateA >= todayFormatted;
                                const isFutureB = dateB >= todayFormatted;
                                if (isFutureA !== isFutureB) return isFutureA ? -1 : 1;
                                const dDiff = dateA.localeCompare(dateB);
                                if (dDiff !== 0) return dDiff;
                                return (a.time || "00:00").localeCompare(b.time || "00:00");
                            });

                            return combined.map((apt) => {
                                const isHoliday = apt.status === 'holiday';
                                const dayText = isHoliday && apt.startDate !== apt.endDate
                                    ? `${normalizeDate(apt.startDate).split('-')[2]}일~${normalizeDate(apt.endDate).split('-')[2]}일`
                                    : `${normalizeDate(apt.date).split('-')[2]}일`;
                                
                                return (
                                    <div key={apt.id} className={`flex items-center justify-between p-2 md:p-3 rounded-xl transition-colors group ${isHoliday ? 'bg-red-500/5 hover:bg-red-500/10 border border-red-500/10' : 'bg-white/5 hover:bg-white/10'}`}>
                                        <div className="flex items-center">
                                            <span className={`font-mono text-base md:text-lg font-black tracking-tighter ${isHoliday ? 'text-red-400' : 'text-[#d8b4fe]'}`}>
                                                {dayText}
                                            </span>
                                            {isHoliday && <span className="ml-2 text-[10px] text-red-500/60 font-medium">종일</span>}
                                        </div>
                                        <div className="shrink-0">
                                            <span className={`text-[10px] md:text-xs px-2 py-0.5 md:py-1 rounded-full font-black whitespace-nowrap border tracking-tight ${isHoliday ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-[#a855f7]/10 text-white border-[#a855f7]/40 shadow-[0_0_10px_rgba(168,85,247,0.2)]'}`}>
                                                {isHoliday ? "휴무" : (apt.contact !== '-' ? "예약상담" : (apt.clientName || "상담"))}
                                            </span>
                                        </div>
                                    </div>
                                );
                            });
                        })()}
                    </div>
                </div>
            </div>
        </div>
    );
}

