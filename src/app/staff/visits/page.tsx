/**
 * 스태프 패널 - 방문 관리 페이지
 * 
 * 어드민 버전의 방문관리 기능을 스태프 전용 테마로 제공합니다.
 */

"use client";

import { useState, useEffect, useMemo } from "react";
import StatCard from "@/components/admin/StatCard";
import SimpleBarChart from "@/components/admin/SimpleBarChart";

interface VisitLog {
    timestamp: string;
}

type DrillDownLevel = "year" | "month" | "day" | "hour";

export default function StaffVisitsPage() {
    const [visitLogs, setVisitLogs] = useState<VisitLog[]>([]);
    const [appointments, setAppointments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [activeTab, setActiveTab] = useState<"visit" | "apt" | null>("visit");
    const [drillLevel, setDrillLevel] = useState<DrillDownLevel>("year");
    const [selectedYear, setSelectedYear] = useState<number | null>(null);
    const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
    const [selectedDay, setSelectedDay] = useState<number | null>(null);

    const fetchData = async () => {
        try {
            const [pvRes, aptRes] = await Promise.all([
                fetch("/api/pageviews"),
                fetch("/api/appointments")
            ]);

            if (pvRes.ok) {
                const pvData = await pvRes.json();
                setVisitLogs(Array.isArray(pvData) ? pvData : (pvData.logs || []));
            }

            if (aptRes.ok) {
                const aptData = await aptRes.json();
                setAppointments(Array.isArray(aptData) ? aptData : []);
            }
        } catch (err) {
            console.error("데이터 로딩 실패:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const handleDrillDown = (index: number, label: string) => {
        switch (drillLevel) {
            case "year":
                setSelectedYear(parseInt(label));
                setDrillLevel("month");
                break;
            case "month":
                setSelectedMonth(parseInt(label.replace("월", "")) - 1);
                setDrillLevel("day");
                break;
            case "day":
                setSelectedDay(parseInt(label.replace("일", "")));
                setDrillLevel("hour");
                break;
        }
    };

    const goBack = () => {
        switch (drillLevel) {
            case "hour":
                setDrillLevel("day");
                setSelectedDay(null);
                break;
            case "day":
                setDrillLevel("month");
                setSelectedMonth(null);
                break;
            case "month":
                setDrillLevel("year");
                setSelectedYear(null);
                break;
        }
    };

    const filterData = (source: any[]) => {
        return source.filter(item => {
            const date = new Date(item.timestamp || item.createdAt || item.date);
            if (drillLevel === "year") return true;
            if (date.getFullYear() !== selectedYear) return false;
            if (drillLevel === "month") return true;
            if (date.getMonth() !== selectedMonth) return false;
            if (drillLevel === "day") return true;
            if (date.getDate() !== selectedDay) return false;
            return true;
        });
    };

    const mainChartData = useMemo(() => {
        const sourceData = activeTab === "visit" ? visitLogs : appointments;
        if (sourceData.length === 0) return null;

        const filtered = filterData(sourceData);
        const counts: Record<string, number> = {};
        let labels: string[] = [];

        const aggregate = (key: string) => { counts[key] = (counts[key] || 0) + 1; };

        switch (drillLevel) {
            case "year":
                sourceData.forEach(item => {
                    const y = new Date(item.timestamp || item.createdAt || item.date).getFullYear().toString();
                    aggregate(y);
                });
                labels = Object.keys(counts).sort();
                break;
            case "month":
                labels = Array.from({ length: 12 }, (_, i) => `${i + 1}월`);
                sourceData.forEach(item => {
                    const m = new Date(item.timestamp || item.createdAt || item.date).getMonth();
                    aggregate(`${m + 1}월`);
                });
                break;
            case "day":
                const lastDay = new Date(selectedYear!, selectedMonth! + 1, 0).getDate();
                labels = Array.from({ length: lastDay }, (_, i) => `${i + 1}일`);
                sourceData.forEach(item => {
                    const d = new Date(item.timestamp || item.createdAt || item.date).getDate();
                    aggregate(`${d}일`);
                });
                break;
            case "hour":
                labels = Array.from({ length: 24 }, (_, i) => `${i}시`);
                sourceData.forEach(item => {
                    const h = new Date(item.timestamp || item.createdAt || item.date).getHours();
                    aggregate(`${h}시`);
                });
                break;
        }

        return {
            labels,
            values: labels.map(label => counts[label] || 0),
            title: `${selectedYear ? selectedYear + '년 ' : ''}${selectedMonth !== null ? (selectedMonth + 1) + '월 ' : ''}${selectedDay ? selectedDay + '일 ' : ''}${activeTab === "visit" ? "방문자 현황" : "예약 현황"}`
        };
    }, [visitLogs, appointments, activeTab, drillLevel, selectedYear, selectedMonth, selectedDay]);

    return (
        <div className="space-y-6 sm:space-y-10 pt-4 sm:pt-8">
            <div>
                <h1 className="text-3xl md:text-4xl font-bold text-[#E1E8F3] tracking-tight">방문 관리</h1>
                <p className="text-sm md:text-base text-gray-400 mt-2">서비스 이용 및 방문 통계를 확인할 수 있습니다.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
                <StatCard
                    title="총 방문"
                    value={visitLogs.length.toLocaleString()}
                    icon="🚶"
                    active={activeTab === "visit"}
                    onClick={() => { setActiveTab("visit"); setDrillLevel("year"); }}
                />
                <StatCard
                    title="총 예약"
                    value={appointments.length.toLocaleString()}
                    icon="📅"
                    active={activeTab === "apt"}
                    onClick={() => { setActiveTab("apt"); setDrillLevel("year"); }}
                />
            </div>

            {activeTab && mainChartData && (
                <div className="w-full space-y-8 animate-in fade-in duration-500">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2 text-sm bg-white/5 px-4 py-2 rounded-full border border-white/5">
                            <span className="text-gray-500">탐색 경로:</span>
                            <span className="text-white font-semibold">{drillLevel === "year" ? "연도별" : drillLevel === "month" ? "월간" : drillLevel === "day" ? "일간" : "시간별"}</span>
                            {selectedYear && <span className="text-gray-400">→ {selectedYear}년</span>}
                            {selectedMonth !== null && <span className="text-gray-400">→ {selectedMonth + 1}월</span>}
                            {selectedDay && <span className="text-gray-400">→ {selectedDay}일</span>}
                        </div>
                        {drillLevel !== "year" && (
                            <button onClick={goBack} className="px-4 py-2 text-sm font-semibold bg-blue-900/20 hover:bg-blue-900/30 text-blue-400 rounded-xl transition-all border border-blue-900/10 flex items-center gap-2">
                                <span>←</span> 뒤로가기
                            </button>
                        )}
                    </div>

                    <SimpleBarChart
                        title={mainChartData.title}
                        labels={mainChartData.labels}
                        data={mainChartData.values}
                        color={activeTab === "visit" ? "#3b82f6" : "#10b981"}
                        onBarClick={handleDrillDown}
                    />
                </div>
            )}
        </div>
    );
}
