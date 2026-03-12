/**
 * 관리자 대시보드 및 방문 관리용 통합 차트 섹션 컴포넌트
 * 
 * 방문자 현황 및 예약 현황 데이터를 페칭하고,
 * 연/월/일/시간 단위의 드릴다운 그래프(SimpleBarChart)를 제공합니다.
 */

"use client";

import { useState, useEffect, useMemo } from "react";
import SimpleBarChart from "./SimpleBarChart";

interface VisitLog {
    timestamp: string;
}

type DrillDownLevel = "year" | "month" | "day" | "hour";

interface VisitsChartSectionProps {
    initialTab?: "visit" | "apt";
    onClose?: () => void;
    showTitle?: boolean;
}

export default function VisitsChartSection({ 
    initialTab = "visit", 
    onClose,
    showTitle = true 
}: VisitsChartSectionProps) {
    const [visitLogs, setVisitLogs] = useState<VisitLog[]>([]);
    const [appointments, setAppointments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [activeTab, setActiveTab] = useState<"visit" | "apt">(initialTab);
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

    useEffect(() => {
        fetchData();
    }, []);

    // Props로 들어온 탭이 변경되면 상태 동기화
    useEffect(() => {
        setActiveTab(initialTab);
        setDrillLevel("year");
        setSelectedYear(null);
        setSelectedMonth(null);
        setSelectedDay(null);
    }, [initialTab]);

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
        const aptsForComparison = activeTab === "visit" ? filterData(appointments) : [];

        const counts: Record<string, number> = {};
        const aptCounts: Record<string, number> = {};
        const confCounts: Record<string, number> = {};
        const cancCounts: Record<string, number> = {};
        const pendCounts: Record<string, number> = {};
        let labels: string[] = [];

        const isApt = activeTab === "apt";

        const aggregate = (item: any, key: string, isFromAptSource: boolean = false) => {
            if (!isFromAptSource) {
                counts[key] = (counts[key] || 0) + 1;
            } else {
                aptCounts[key] = (aptCounts[key] || 0) + 1;
            }

            if (isApt || (isFromAptSource && activeTab === "visit")) {
                if (item.status === 'confirmed') confCounts[key] = (confCounts[key] || 0) + 1;
                else if (item.status === 'cancelled') cancCounts[key] = (cancCounts[key] || 0) + 1;
                else pendCounts[key] = (pendCounts[key] || 0) + 1;
            }
        };

        const chartSource = sourceData;

        switch (drillLevel) {
            case "year":
                chartSource.forEach(item => {
                    const y = new Date(item.timestamp || item.createdAt || item.date).getFullYear().toString();
                    aggregate(item, y);
                });
                if (activeTab === "visit") {
                    aptsForComparison.forEach(item => {
                        const y = new Date(item.timestamp || item.createdAt || item.date).getFullYear().toString();
                        aggregate(item, y, true);
                    });
                }
                labels = Object.keys(counts).sort();
                break;
            case "month":
                labels = Array.from({ length: 12 }, (_, i) => `${i + 1}월`);
                chartSource.forEach(item => {
                    const m = new Date(item.timestamp || item.createdAt || item.date).getMonth();
                    aggregate(item, `${m + 1}월`);
                });
                if (activeTab === "visit") {
                    aptsForComparison.forEach(item => {
                        const m = new Date(item.timestamp || item.createdAt || item.date).getMonth();
                        aggregate(item, `${m + 1}월`, true);
                    });
                }
                break;
            case "day":
                const lastDay = new Date(selectedYear!, selectedMonth! + 1, 0).getDate();
                labels = Array.from({ length: lastDay }, (_, i) => `${i + 1}일`);
                chartSource.forEach(item => {
                    const d = new Date(item.timestamp || item.createdAt || item.date).getDate();
                    aggregate(item, `${d}일`);
                });
                if (activeTab === "visit") {
                    aptsForComparison.forEach(item => {
                        const d = new Date(item.timestamp || item.createdAt || item.date).getDate();
                        aggregate(item, `${d}일`, true);
                    });
                }
                break;
            case "hour":
                labels = Array.from({ length: 24 }, (_, i) => `${i}시`);
                chartSource.forEach(item => {
                    const h = new Date(item.timestamp || item.createdAt || item.date).getHours();
                    aggregate(item, `${h}시`);
                });
                if (activeTab === "visit") {
                    aptsForComparison.forEach(item => {
                        const h = new Date(item.timestamp || item.createdAt || item.date).getHours();
                        aggregate(item, `${h}시`, true);
                    });
                }
                break;
        }

        return {
            labels,
            values: labels.map(label => counts[label] || 0),
            secondaryValues: activeTab === "visit" ? labels.map(label => aptCounts[label] || 0) : undefined,
            confirmedValues: isApt ? labels.map(label => confCounts[label] || 0) : undefined,
            cancelledValues: isApt ? labels.map(label => cancCounts[label] || 0) : undefined,
            pendingValues: isApt ? labels.map(label => pendCounts[label] || 0) : undefined,
            isApt,
            title: `${selectedYear ? selectedYear + '년 ' : ''}${selectedMonth !== null ? (selectedMonth + 1) + '월 ' : ''}${selectedDay ? selectedDay + '일 ' : ''}${isApt ? "예약 현황" : "방문자 현황"}`
        };
    }, [visitLogs, appointments, activeTab, drillLevel, selectedYear, selectedMonth, selectedDay]);

    if (loading) return <div className="p-20 text-center text-gray-500">데이터를 분석 중입니다...</div>;

    return (
        <div className="w-full space-y-6 animate-in fade-in duration-500">
            {showTitle && (
                <div className="flex justify-between items-center px-2">
                    <div className="flex items-center gap-2 text-[10px] md:text-sm bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                        <span className="text-gray-500 font-mono">PATH:</span>
                        <span className="text-white font-bold">{drillLevel === "year" ? "연도별" : drillLevel === "month" ? "월간" : drillLevel === "day" ? "일간" : "시간별"}</span>
                        {selectedYear && <span className="text-gray-400">/ {selectedYear}년</span>}
                        {selectedMonth !== null && <span className="text-gray-400">/ {selectedMonth + 1}월</span>}
                        {selectedDay && <span className="text-gray-400">/ {selectedDay}일</span>}
                    </div>
                    <div className="flex gap-2">
                        {drillLevel !== "year" && (
                            <button
                                onClick={goBack}
                                className="px-3 py-1.5 text-xs font-bold bg-[#a855f7]/10 hover:bg-[#a855f7]/20 text-[#a855f7] rounded-lg transition-all border border-[#a855f7]/10"
                            >
                                BACK
                            </button>
                        )}
                        {onClose && (
                            <button
                                onClick={onClose}
                                className="px-3 py-1.5 text-xs font-bold bg-white/5 hover:bg-white/10 text-gray-400 rounded-lg transition-all border border-white/10"
                            >
                                CLOSE
                            </button>
                        )}
                    </div>
                </div>
            )}

            {mainChartData ? (
                <SimpleBarChart
                    title={mainChartData.title}
                    labels={mainChartData.labels}
                    data={mainChartData.values}
                    secondaryData={mainChartData.secondaryValues}
                    secondaryColor="#22c55e"
                    confirmedData={mainChartData.confirmedValues}
                    cancelledData={mainChartData.cancelledValues}
                    pendingData={mainChartData.pendingValues}
                    color={activeTab === "visit" ? "#a855f7" : "#22c55e"}
                    onBarClick={handleDrillDown}
                />
            ) : (
                <div className="h-[300px] flex items-center justify-center bg-[#140D0B] border border-white/5 rounded-3xl text-gray-600 italic">
                    표시할 데이터가 없습니다.
                </div>
            )}
        </div>
    );
}
