/**
 * 스태프 패널 메인 대시보드 라우트 컴포넌트
 * 
 * `/staff` 접속 시 보여지는 오버뷰 화면입니다.
 * 예약 현황 요약과 빠른 링크를 제공합니다.
 */

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function StaffDashboard() {
    // 날짜 정규화 함수: "2026. 03. 11." -> "2026-03-11"
    const normalizeDate = (d: string) => d.replace(/\. /g, '-').replace(/\./g, '-').replace(/-$/, '').replace(/\s/g, '');

    const [pendingCount, setPendingCount] = useState(0);
    const [todayCount, setTodayCount] = useState(0);
    const [reviewCount, setReviewCount] = useState(0);
    const [recentAppointments, setRecentAppointments] = useState<any[]>([]);
    const [nicknameMap, setNicknameMap] = useState<Record<string, string>>({});

    useEffect(() => {
        const now = new Date();
        const nowYear = now.getFullYear();
        const nowMonth = now.getMonth() + 1;
        const todayStr = normalizeDate(`${nowYear}-${String(nowMonth).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`);

        // 1. 예약 데이터 가져오기 (공용 대시보드 - 필터 제거)
        fetch("/api/appointments")
            .then(res => res.json())
            .then((data: any[]) => {
                const activeApts = data.filter(a => !a.isDeleted);

                // 통계용 (전체 기준)
                setPendingCount(activeApts.filter(a => a.status === "pending").length);
                setTodayCount(activeApts.filter(a => normalizeDate(a.date) === todayStr).length);

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
            })
            .catch(() => { });

        // 2. 닉네임 매핑 데이터
        fetch("/api/admin/accounts")
            .then(res => res.json())
            .then(data => {
                const map: Record<string, string> = {};
                const allAccounts = [...(data.admins || []), ...(data.staffs || [])];
                allAccounts.forEach((acc: any) => {
                    map[acc.username] = acc.nickname || acc.username;
                });
                setNicknameMap(map);
            })
            .catch(() => { });

        // 3. 리뷰 수
        fetch("/api/reviews")
            .then(res => res.json())
            .then(data => {
                setReviewCount((data.reviews || []).length);
            })
            .catch(() => { });
    }, []);

    return (
        <div className="space-y-8 md:space-y-12 pt-6 md:pt-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">STUDIO DASHBOARD</h1>
                <p className="text-sm md:text-base text-gray-400 mt-2">스튜디오 전체 일정을 한눈에 확인하고 관리하세요.</p>
            </div>

            {/* 통계 카드 */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
                <div className="bg-[#0B0F14] border border-white/5 rounded-2xl p-6 transition-colors hover:bg-white/5">
                    <div className="flex items-center space-x-3 mb-3">
                        <span className="text-2xl text-yellow-500/80">⏳</span>
                        <span className="text-sm text-gray-400 font-medium">전체 대기 예약</span>
                    </div>
                    <p className="text-3xl font-bold text-white">{pendingCount}</p>
                </div>
                <div className="bg-[#0B0F14] border border-white/5 rounded-2xl p-6 transition-colors hover:bg-white/5">
                    <div className="flex items-center space-x-3 mb-3">
                        <span className="text-2xl text-blue-500/80">📅</span>
                        <span className="text-sm text-gray-400 font-medium">전체 오늘 일정</span>
                    </div>
                    <p className="text-3xl font-bold text-white">{todayCount}</p>
                </div>
                <div className="bg-[#0B0F14] border border-white/5 rounded-2xl p-6 transition-colors hover:bg-white/5">
                    <div className="flex items-center space-x-3 mb-3">
                        <span className="text-2xl text-purple-500/80">📊</span>
                        <span className="text-sm text-gray-400 font-medium">전체 리뷰</span>
                    </div>
                    <p className="text-3xl font-bold text-white">{reviewCount}</p>
                </div>
            </div>

            {/* 이달 일정 패널 (Admin과 통일된 공용 UI) */}
            <div className="bg-[#0B0F14] border border-white/5 rounded-2xl md:rounded-3xl p-6 md:p-8">
                <div className="flex justify-between items-center mb-6 md:mb-8">
                    <h2 className="text-2xl font-bold text-white font-mono">이달 일정</h2>
                </div>

                <div className="space-y-4 md:space-y-6">
                    {recentAppointments.length > 0 ? (
                        recentAppointments.map((apt) => {
                            const isHoliday = apt.status === 'holiday';
                            const staffName = apt.assignedTo ? (nicknameMap[apt.assignedTo] || apt.assignedTo) : "미지정";

                            return (
                                <div key={apt.id} className={`flex items-center justify-between p-3 md:p-4 rounded-xl md:rounded-2xl transition-colors group ${isHoliday ? 'bg-red-500/5 hover:bg-red-500/10 border border-red-500/10' : 'bg-white/5 hover:bg-white/10'}`}>
                                    <div className="flex items-center space-x-3 md:space-x-4">
                                        <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-bold border shrink-0 text-sm md:text-base uppercase ${isHoliday ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-[#a855f7]/20 text-[#d8b4fe] border-[#a855f7]/30'}`}>
                                            {isHoliday ? "H" : staffName[0]}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white text-base flex w-full items-center gap-2">
                                                {isHoliday ? "정기 휴무/마감" : staffName}
                                            </h4>
                                            <p className="text-xs md:text-sm text-gray-500 mt-1">
                                                <span className="text-white font-medium mr-2">
                                                    {normalizeDate(apt.date).split('-')[2]}일 {isHoliday ? "종일" : apt.time}
                                                </span>
                                                {!isHoliday && apt.service && <span>· {apt.service} </span>}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <span className={`text-[10px] md:text-xs px-2 py-0.5 rounded-md font-bold whitespace-nowrap border ${isHoliday ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-[#a855f7]/10 text-[#a855f7] border border-[#a855f7]/20'}`}>
                                            {isHoliday ? "휴무" : (apt.contact !== '-' ? "예약상담" : (apt.clientName || "상담"))}
                                        </span>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-center text-gray-500 py-8">이번 달 예정된 일정이 없습니다.</div>
                    )}
                </div>
            </div>
        </div>
    );
}
