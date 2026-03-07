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
import StatCard from "@/components/admin/StatCard";

export default function AdminDashboard() {
    // 각종 기초 통계용 상태 변수 선언
    const [pendingCount, setPendingCount] = useState(0);
    const [avgRating, setAvgRating] = useState("0.0");
    const [monthlyAppointments, setMonthlyAppointments] = useState(0);
    const [monthlyPageViews, setMonthlyPageViews] = useState(0);
    const [recentAppointments, setRecentAppointments] = useState<any[]>([]);

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

                // 최근 예약 (최신 4개, 삭제된 항목 제외)
                setRecentAppointments(data.filter(a => !a.isDeleted).slice(0, 4));
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
            })
            .catch(() => { });
    }, []);

    const stats = [
        { title: "예약 대기", value: String(pendingCount), icon: "⏳" },
        { title: "평점", value: `${avgRating} / 5.0`, icon: "⭐" },
        { title: "이번달 접수량", value: String(monthlyAppointments), icon: "📅" },
        { title: "페이지 조회수", value: monthlyPageViews.toLocaleString(), icon: "👁️" },
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                {/* 최근 예약 */}
                <div className="lg:col-span-2 bg-[#140D0B] border border-white/5 rounded-2xl md:rounded-3xl p-6 md:p-8">
                    <div className="flex justify-between items-center mb-6 md:mb-8">
                        <h2 className="text-2xl font-bold text-white font-mono">최근 예약 내역</h2>
                    </div>

                    <div className="space-y-4 md:space-y-6">
                        {recentAppointments.length > 0 ? (
                            recentAppointments.map((apt) => (
                                <div key={apt.id} className="flex items-center justify-between p-3 md:p-4 bg-white/5 rounded-xl md:rounded-2xl hover:bg-white/10 transition-colors group">
                                    <div className="flex items-center space-x-3 md:space-x-4">
                                        <div className="w-10 h-10 md:w-12 md:h-12 bg-[#1C1310] rounded-full flex items-center justify-center font-bold text-white border border-white/10 shrink-0 text-sm md:text-base">
                                            {apt.clientName?.[0] || "?"}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white text-base">{apt.clientName}</h4>
                                            <p className="text-xs md:text-sm text-gray-500">{apt.service} - {apt.time}</p>
                                        </div>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <span className={`text-xs md:text-sm px-2 py-1 md:px-3 rounded-full font-bold ${STATUS_STYLES[apt.status]?.class || ""}`}>
                                            {STATUS_STYLES[apt.status]?.text || apt.status}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center text-gray-500 py-8">아직 예약 내역이 없습니다.</div>
                        )}
                    </div>
                </div>

                {/* 기기 상태 */}
                <div className="bg-[#140D0B] border border-white/5 rounded-2xl md:rounded-3xl p-6 md:p-8">
                    <h2 className="text-2xl font-bold text-white mb-6 md:mb-8 font-mono">기기 상태</h2>
                    <div className="space-y-6 md:space-y-8">
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs md:text-sm">
                                <span className="text-gray-400">서버 부하</span>
                                <span className="text-green-400">안정</span>
                            </div>
                            <div className="h-1.5 md:h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full w-[12%] bg-green-400" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs md:text-sm">
                                <span className="text-gray-400">저장공간 사용량</span>
                                <span className="text-white">64.2%</span>
                            </div>
                            <div className="h-1.5 md:h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full w-[64.2%] bg-white/30" />
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 md:mt-12 p-4 md:p-6 bg-white/5 rounded-xl md:rounded-2xl border border-white/10">
                        <h4 className="text-sm font-bold text-white mb-2">공지사항</h4>
                        <p className="text-xs md:text-sm text-gray-500 leading-relaxed">
                            일요일 오전 3시(KST) 갤러리 서버 정기 점검이 예정되어 있습니다.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

