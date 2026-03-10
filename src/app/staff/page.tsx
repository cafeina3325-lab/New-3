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
    const [pendingCount, setPendingCount] = useState(0);
    const [todayCount, setTodayCount] = useState(0);
    const [reviewCount, setReviewCount] = useState(0);

    useEffect(() => {
        // 예약 데이터
        fetch("/api/appointments")
            .then(res => res.json())
            .then((data: any[]) => {
                setPendingCount(data.filter(a => a.status === "pending").length);

                const today = new Date().toISOString().split("T")[0];
                setTodayCount(data.filter(a => a.date === today).length);
            })
            .catch(() => { });

        // 리뷰 수
        fetch("/api/reviews")
            .then(res => res.json())
            .then(data => {
                setReviewCount((data.reviews || []).length);
            })
            .catch(() => { });
    }, []);

    const quickLinks = [
        { name: "메신저", path: "/staff/messenger", icon: "💬", desc: "실시간 소통 메신저" },
        { name: "방문관리", path: "/staff/visits", icon: "🚶", desc: "방문자 및 서비스 통계 확인" },
        { name: "예약관리", path: "/staff/appointments", icon: "📅", desc: "고객 예약 확인 및 관리" },
        { name: "리뷰", path: "/staff/reviews", icon: "📊", desc: "고객 리뷰 확인" },
    ];

    return (
        <div className="space-y-8 md:space-y-12 pt-6 md:pt-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">스태프 대시보드</h1>
                <p className="text-sm md:text-base text-gray-400 mt-2">Flying Studio 스태프 패널에 오신 것을 환영합니다.</p>
            </div>

            {/* 통계 카드 */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
                <div className="bg-[#0B0F14] border border-white/5 rounded-2xl p-6">
                    <div className="flex items-center space-x-3 mb-3">
                        <span className="text-2xl">⏳</span>
                        <span className="text-sm text-gray-400">대기 중 예약</span>
                    </div>
                    <p className="text-3xl font-bold text-white">{pendingCount}</p>
                </div>
                <div className="bg-[#0B0F14] border border-white/5 rounded-2xl p-6">
                    <div className="flex items-center space-x-3 mb-3">
                        <span className="text-2xl">📅</span>
                        <span className="text-sm text-gray-400">오늘 예약</span>
                    </div>
                    <p className="text-3xl font-bold text-white">{todayCount}</p>
                </div>
                <div className="bg-[#0B0F14] border border-white/5 rounded-2xl p-6">
                    <div className="flex items-center space-x-3 mb-3">
                        <span className="text-2xl">📊</span>
                        <span className="text-sm text-gray-400">총 리뷰</span>
                    </div>
                    <p className="text-3xl font-bold text-white">{reviewCount}</p>
                </div>
            </div>

            {/* 빠른 링크 */}
            <div>
                <h2 className="text-2xl font-bold text-white mb-6">빠른 이동</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
                    {quickLinks.map((link) => (
                        <Link
                            key={link.path}
                            href={link.path}
                            className="bg-[#0B0F14] border border-white/5 rounded-2xl p-6 hover:bg-white/5 hover:border-white/10 transition-all group"
                        >
                            <span className="text-3xl mb-4 block group-hover:scale-110 transition-transform">{link.icon}</span>
                            <h3 className="text-lg font-bold text-white mb-1">{link.name}</h3>
                            <p className="text-sm text-gray-500">{link.desc}</p>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
