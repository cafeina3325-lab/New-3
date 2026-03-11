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
    
    const router = useRouter();

    useEffect(() => {
        // 예약 API (/api/appointments) 데이터 통신 로직
        fetch("/api/appointments")
            .then(res => res.json())
            .then((data: any[]) => {
                // 대기 중 수
                setPendingCount(data.filter(a => a.status === "pending").length);

                // 이번 달 접수량
                const now = new Date();
                const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
                const monthlyCount = data.filter(a => new Date(a.createdAt) >= startOfMonth).length;
                setMonthlyAppointments(monthlyCount);

                // 이번 달 캘린더 일정 (확정된 예약/일정 및 휴무만 포함)
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
                
                // 정렬: 오늘 이후 일정을 우선, 그 안에서 순차적 정렬
                thisMonthApts.sort((a, b) => {
                    const dateA = normalizeDate(a.date);
                    const dateB = normalizeDate(b.date);
                    
                    // 오늘 이후인 것들을 앞으로 (isFuture)
                    const isFutureA = dateA >= todayFormatted;
                    const isFutureB = dateB >= todayFormatted;
                    
                    if (isFutureA !== isFutureB) {
                        return isFutureA ? -1 : 1;
                    }
                    
                    // 같은 미래/과거 그룹 내에서는 시간 순 정렬
                    const dateDiff = dateA.localeCompare(dateB);
                    if (dateDiff !== 0) return dateDiff;
                    
                    const timeA = (a.time || "00:00").split('~')[0].trim();
                    const timeB = (b.time || "00:00").split('~')[0].trim();
                    return timeA.localeCompare(timeB);
                });

                // 가장 관련성 높은 8개 항목 노출 (기존 5개에서 확대)
                setRecentAppointments(thisMonthApts.slice(0, 8));
            })
            .catch(() => { });

        // 리뷰 평균 평점
        fetch("/api/reviews")
            .then(res => res.json())
            .then(data => {
                const reviews = data.reviews || [];
                if (reviews.length > 0) {
                    const avg = reviews.reduce((sum: number, r: any) => sum + (r.rating || 0), 0) / reviews.length;
                    setAvgRating(avg.toFixed(1));
                }
            })
            .catch(() => { });

        // 페이지 조회수
        fetch("/api/pageviews")
            .then(res => res.json())
            .then(data => {
                setMonthlyPageViews(data.monthly || 0);
                setTotalPageViews(data.total || 0);
            })
            .catch(() => { });

        // 스태프 닉네임/아이디 매핑을 위한 계정 정보
        fetch("/api/admin/accounts")
            .then(res => res.json())
            .then(data => {
                const map: Record<string, string> = {};
                const allAccounts = [...(data.admins || []), ...(data.staffs || [])];
                allAccounts.forEach((acc: any) => {
                    // 닉네임이 있으면 닉네임, 없으면 아이디(username) 사용
                    map[acc.username] = acc.nickname || acc.username;
                });
                setNicknameMap(map);
            })
            .catch(() => { });
    }, []);

    const stats = [
        { title: "예약 대기", value: String(pendingCount), icon: "⏳", onClick: () => router.push("/admin/appointments") },
        { title: "평점", value: `${avgRating} / 5.0`, icon: "⭐", onClick: () => router.push("/admin/reviews") },
        { title: "이번달 접수량", value: String(monthlyAppointments), icon: "📅", onClick: () => router.push("/admin/visits?tab=apt") },
        { title: "페이지 조회수", value: monthlyPageViews.toLocaleString(), icon: "👁️", onClick: () => router.push("/admin/visits?tab=visit") },
    ];

    const STATUS_STYLES: Record<string, { text: string; class: string }> = {
        pending: { text: "대기 중", class: "bg-yellow-500/10 text-yellow-500" },
        confirmed: { text: "확정됨", class: "bg-green-500/10 text-green-500" },
        cancelled: { text: "취소됨", class: "bg-red-500/10 text-red-500" },
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

            {/* 메인 콘텐츠 영역 */}
            <div className="grid grid-cols-1 gap-6 md:gap-8">
                {/* 이달 일정 */}
                <div className="bg-[#140D0B] border border-white/5 rounded-2xl md:rounded-3xl p-6 md:p-8">
                    <div className="flex justify-between items-center mb-6 md:mb-8">
                        <h2 className="text-2xl font-bold text-white font-mono">이달 일정</h2>
                    </div>

                    <div className="space-y-4 md:space-y-6">
                        {recentAppointments.length > 0 ? (
                            recentAppointments.map((apt) => {
                                // assignedTo는 예약 데이터 상 저장된 담당자 아이디 문자열
                                const displayName = apt.assignedTo ? (nicknameMap[apt.assignedTo] || apt.assignedTo) : "미지정";
                                const isHoliday = apt.status === 'holiday';
                                
                                return (
                                    <div key={apt.id} className={`flex items-center justify-between p-3 md:p-4 rounded-xl md:rounded-2xl transition-colors group ${isHoliday ? 'bg-red-500/5 hover:bg-red-500/10 border border-red-500/10' : 'bg-white/5 hover:bg-white/10'}`}>
                                        <div className="flex items-center space-x-3 md:space-x-4">
                                            <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-bold border shrink-0 text-sm md:text-base uppercase ${isHoliday ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-[#a855f7]/20 text-[#d8b4fe] border-[#a855f7]/30'}`}>
                                                {isHoliday ? "H" : displayName[0]}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-white text-base flex w-full items-center gap-2">
                                                    {isHoliday ? "정기 휴무/마감" : displayName} 
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
                                            <span className={`text-[10px] md:text-xs px-2 py-1 md:px-3 rounded-full font-bold whitespace-nowrap border ${isHoliday ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-[#a855f7]/10 text-[#a855f7] border border-[#a855f7]/20'}`}>
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
        </div>
    );
}

