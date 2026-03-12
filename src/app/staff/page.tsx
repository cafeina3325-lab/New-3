/**
 * 스태프 패널 메인 대시보드 라우트 컴포넌트
 * 
 * `/staff` 접속 시 보여지는 오버뷰 화면입니다.
 * 예약 현황 요약과 빠른 링크를 제공합니다.
 */

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Calendar from "@/components/common/Calendar";

export default function StaffDashboard() {
    // 날짜 정규화 함수: "2026. 03. 11." -> "2026-03-11"
    const normalizeDate = (d: string) => d.replace(/\. /g, '-').replace(/\./g, '-').replace(/-$/, '').replace(/\s/g, '');

    const [pendingCount, setPendingCount] = useState(0);
    const [monthlyPageViews, setMonthlyPageViews] = useState(0);
    const [avgRating, setAvgRating] = useState("0.0");
    const [recentAppointments, setRecentAppointments] = useState<any[]>([]);
    const [nicknameMap, setNicknameMap] = useState<Record<string, string>>({});
    
    // 캘린더 연동을 위한 상태
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [selectedDateAppointments, setSelectedDateAppointments] = useState<any[]>([]);

    const fetchData = () => {
        const now = new Date();
        const nowYear = now.getFullYear();
        const nowMonth = now.getMonth() + 1;
        const todayStr = normalizeDate(`${nowYear}-${String(nowMonth).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`);

        // 1. 예약 데이터 가져오기
        fetch("/api/appointments")
            .then(res => res.json())
            .then((data: any[]) => {
                const activeApts = data.filter(a => !a.isDeleted);

                // 통계용
                setPendingCount(activeApts.filter(a => a.status === "pending").length);

                // 이번 달 일정 패널용 (확정/휴무만)
                const thisMonthApts = activeApts.filter(a => {
                    if (a.status !== 'confirmed' && a.status !== 'holiday') return false;
                    const normDate = normalizeDate(a.date);
                    const [y, m] = normDate.split('-');
                    return parseInt(y) === nowYear && parseInt(m) === nowMonth;
                });

                // 정렬: 오늘 이후 일정을 우선
                thisMonthApts.sort((a, b) => {
                    const dateA = normalizeDate(a.date);
                    const dateB = normalizeDate(b.date);
                    const isFutureA = dateA >= todayStr;
                    const isFutureB = dateB >= todayStr;
                    if (isFutureA !== isFutureB) return isFutureA ? -1 : 1;
                    const dateDiff = dateA.localeCompare(dateB);
                    if (dateDiff !== 0) return dateDiff;
                    const timeA = (a.time || "00:00").split('~')[0].trim();
                    const timeB = (b.time || "00:00").split('~')[0].trim();
                    return timeA.localeCompare(timeB);
                });

                setRecentAppointments(thisMonthApts.slice(0, 8));
                
                // 선택된 날짜가 있을 경우 해당 날짜 데이터도 즉시 업데이트
                if (selectedDate) {
                    const normSelected = normalizeDate(selectedDate);
                    const filtered = activeApts.filter(a => {
                        if (a.status !== 'confirmed' && a.status !== 'holiday') return false;
                        return normalizeDate(a.date) === normSelected;
                    });
                    filtered.sort((a, b) => (a.time || "00:00").localeCompare(b.time || "00:00"));
                    setSelectedDateAppointments(filtered);
                }
            })
            .catch(() => { });

        // 2. 닉네임 매핑
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

        // 3. 페이지 조회수
        fetch("/api/pageviews").then(res => res.json()).then(data => setMonthlyPageViews(data.monthly || 0)).catch(() => { });

        // 4. 리뷰 평점
        fetch("/api/reviews").then(res => res.json()).then(data => {
            const reviews = data.reviews || [];
            if (reviews.length > 0) {
                const avg = reviews.reduce((sum: number, r: any) => sum + (r.rating || 0), 0) / reviews.length;
                setAvgRating(avg.toFixed(1));
            }
        }).catch(() => { });
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSelectDate = (date: string | null) => {
        setSelectedDate(date);
        if (!date) {
            setSelectedDateAppointments([]);
            return;
        }
        
        fetch("/api/appointments")
            .then(res => res.json())
            .then((data: any[]) => {
                const normSelected = normalizeDate(date);
                const filtered = data.filter(a => {
                    if (!a.date || a.isDeleted) return false;
                    if (a.status !== 'confirmed' && a.status !== 'holiday') return false;
                    return normalizeDate(a.date) === normSelected;
                });
                filtered.sort((a, b) => (a.time || "00:00").localeCompare(b.time || "00:00"));
                setSelectedDateAppointments(filtered);
            }).catch(() => { });
    };

    return (
        <div className="space-y-8 md:space-y-12 pt-6 md:pt-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">STUDIO DASHBOARD</h1>
                <p className="text-sm md:text-base text-gray-400 mt-2">스튜디오 전체 일정을 한눈에 확인하고 관리하세요.</p>
            </div>

            {/* 통계 카드 */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
                <div className="bg-[#0F1218] border border-white/5 rounded-2xl p-6 transition-colors hover:bg-white/5">
                    <div className="flex items-center space-x-3 mb-3">
                        <span className="text-2xl text-blue-500/80">👁️</span>
                        <span className="text-sm text-gray-400 font-medium">페이지 조회수</span>
                    </div>
                    <p className="text-3xl font-bold text-white">{monthlyPageViews.toLocaleString()}</p>
                </div>
                <div className="bg-[#0F1218] border border-white/5 rounded-2xl p-6 transition-colors hover:bg-white/5">
                    <div className="flex items-center space-x-3 mb-3">
                        <span className="text-2xl text-yellow-500/80">⏳</span>
                        <span className="text-sm text-gray-400 font-medium">예약</span>
                    </div>
                    <p className="text-3xl font-bold text-white">{pendingCount}</p>
                </div>
                <div className="bg-[#0F1218] border border-white/5 rounded-2xl p-6 transition-colors hover:bg-white/5">
                    <div className="flex items-center space-x-3 mb-3">
                        <span className="text-2xl text-orange-500/80">⭐</span>
                        <span className="text-sm text-gray-400 font-medium">평점</span>
                    </div>
                    <p className="text-3xl font-bold text-white">{avgRating} / 5.0</p>
                </div>
            </div>

            {/* 메인 콘텐츠 레이아웃 (어드민과 통일된 구조, 스태프 톤 적용) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 items-start">
                {/* 캘린더 영역 */}
                <div className="lg:col-span-2 bg-[#0F1218] border border-white/5 rounded-2xl md:rounded-3xl p-4 md:p-8 animate-in fade-in duration-500">
                    <Calendar theme="staff" compact={true} onSelectDate={handleSelectDate} />
                </div>

                {/* 우측 일정 패널 */}
                <div className="lg:col-span-1 bg-[#0F1218] border border-white/5 rounded-2xl md:rounded-3xl p-6 md:p-8">
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
