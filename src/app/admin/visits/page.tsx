/**
 * 관리자 패널 - 방문 및 서버 통계 관리(Visits) 페이지 라우트
 * 
 * 랜딩 페이지의 접속자 로그(Pageviews)와 예약 트렌드(Appointments), 
 * 부문별 스토리지 점유율(Server Stats) 정보를 통합하여 시각화(`SimpleBarChart`)하는 대시보드입니다.
 * 연간 → 월간 → 일간 → 시간대별로 "드릴다운(Drill-down)" 탐색이 기능이 구현되어 있습니다.
 */

"use client";

import { useState, useEffect, useMemo } from "react";
import StatCard from "@/components/admin/StatCard";
import SimpleBarChart from "@/components/admin/SimpleBarChart";

interface VisitLog {
    timestamp: string;
}

type DrillDownLevel = "year" | "month" | "day" | "hour";

// 내부 통계 카드 컴포넌트
function StatListCard({ title, data, color }: { title: string, data: [string, number][], color: string }) {
    return (
        <div className="bg-[#140D0B] border border-white/5 rounded-3xl p-6">
            <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                <span className="w-1 h-4 rounded-full" style={{ backgroundColor: color }}></span>
                {title}
            </h4>
            <div className="flex flex-wrap gap-2">
                {data.length > 0 ? (
                    data.map(([name, count]) => (
                        <div key={name} className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl flex items-center gap-2">
                            <span className="text-gray-300 text-sm font-medium">{name}</span>
                            <span className="text-xs font-bold" style={{ color }}>{count}건</span>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 text-xs italic">정보가 없습니다.</p>
                )}
            </div>
        </div>
    );
}

export default function VisitsPage() {
    const [visitLogs, setVisitLogs] = useState<VisitLog[]>([]);
    const [appointments, setAppointments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // 탐색 상태 관리
    const [activeTab, setActiveTab] = useState<"visit" | "apt" | "server" | null>(null);
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
        // 탑 대시보드에서 넘어온 URL query params (tab) 확인 후 상태 동기화 처리
        const searchParams = new URLSearchParams(window.location.search);
        const tab = searchParams.get("tab");
        if (tab === "visit" || tab === "apt") {
            setActiveTab(tab);
        }

        fetchData();
    }, []);

    // 드릴다운 네비게이션 처리
    const handleDrillDown = (index: number, label: string) => {
        if (drillLevel === "year") {
            setSelectedYear(parseInt(label));
            setDrillLevel("month");
        } else if (drillLevel === "month") {
            setSelectedMonth(parseInt(label.replace("월", "")) - 1);
            setDrillLevel("day");
        } else if (drillLevel === "day") {
            setSelectedDay(parseInt(label.replace("일", "")));
            setDrillLevel("hour");
        }
    };

    const goBack = () => {
        if (drillLevel === "hour") {
            setDrillLevel("day");
            setSelectedDay(null);
        } else if (drillLevel === "day") {
            setDrillLevel("month");
            setSelectedMonth(null);
        } else if (drillLevel === "month") {
            setDrillLevel("year");
            setSelectedYear(null);
        }
    };

    // 공통 데이터 필터링 로직
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

    // 메인 차트 데이터 집계
    const mainChartData = useMemo(() => {
        const sourceData = activeTab === "visit" ? visitLogs : appointments;
        if (sourceData.length === 0) return null;

        const filtered = filterData(sourceData);
        // 방문자 탭에서 예약을 함께 보기 위한 추가 필터링
        const aptsForComparison = activeTab === "visit" ? filterData(appointments) : [];

        const counts: Record<string, number> = {};
        const aptCounts: Record<string, number> = {}; // 방문자 탭에서의 예약 수
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

        if (drillLevel === "year") {
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
        } else if (drillLevel === "month") {
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
        } else if (drillLevel === "day") {
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
        } else if (drillLevel === "hour") {
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

    // 상세 속성 통계 (장르, 부위)
    const detailedAptStats = useMemo(() => {
        if (activeTab !== "apt") return null;

        const filtered = filterData(appointments);

        // 확정 데이터 집계
        const confGenre: Record<string, number> = {};
        const confPart: Record<string, number> = {};
        const confGender: Record<string, number> = {};

        // 취소 데이터 집계
        const cancGenre: Record<string, number> = {};
        const cancPart: Record<string, number> = {};
        const cancGender: Record<string, number> = {};

        // 전체 상태 요약
        const statusCounts: Record<string, number> = {};

        filtered.forEach(apt => {
            const isConfirmed = apt.status === 'confirmed';
            const isCancelled = apt.status === 'cancelled';

            // 상태 요약
            const statusLabel = isConfirmed ? '확정' : isCancelled ? '취소' : '대기';
            statusCounts[statusLabel] = (statusCounts[statusLabel] || 0) + 1;

            if (isConfirmed) {
                if (apt.genre) confGenre[apt.genre] = (confGenre[apt.genre] || 0) + 1;
                if (apt.part) confPart[apt.part] = (confPart[apt.part] || 0) + 1;
                if (apt.gender) {
                    const label = apt.gender === 'male' ? '남성' : '여성';
                    confGender[label] = (confGender[label] || 0) + 1;
                }
            } else if (isCancelled) {
                if (apt.genre) cancGenre[apt.genre] = (cancGenre[apt.genre] || 0) + 1;
                if (apt.part) cancPart[apt.part] = (cancPart[apt.part] || 0) + 1;
                if (apt.gender) {
                    const label = apt.gender === 'male' ? '남성' : '여성';
                    cancGender[label] = (cancGender[label] || 0) + 1;
                }
            }
        });

        const sortStats = (counts: Record<string, number>) =>
            Object.entries(counts)
                .sort((a, b) => b[1] - a[1])
                .filter(([_, count]) => count > 0);

        return {
            status: sortStats(statusCounts),
            confirmed: {
                genres: sortStats(confGenre),
                parts: sortStats(confPart),
                genders: sortStats(confGender),
            },
            cancelled: {
                genres: sortStats(cancGenre),
                parts: sortStats(cancPart),
                genders: sortStats(cancGender),
            }
        };
    }, [appointments, activeTab, drillLevel, selectedYear, selectedMonth, selectedDay]);

    const stats = [
        {
            title: "방문",
            value: visitLogs.length.toLocaleString(),
            icon: "🚶",
            onClick: () => {
                if (activeTab === "visit") setActiveTab(null);
                else {
                    setActiveTab("visit");
                    setDrillLevel("year");
                    setSelectedYear(null);
                    setSelectedMonth(null);
                    setSelectedDay(null);
                }
            },
            onReset: async () => {
                if (window.confirm("모든 방문 기록이 삭제됩니다. 계속하시겠습니까?\n(이 작업은 취소할 수 없습니다.)")) {
                    try {
                        const res = await fetch('/api/pageviews', { method: 'DELETE' });
                        if (res.ok) {
                            alert("방문 기록이 초기화되었습니다.");
                            fetchData(); // 데이터 새로고침
                        }
                    } catch (error) {
                        alert("초기화 실패");
                    }
                }
            },
            active: activeTab === "visit"
        },
        {
            title: "예약",
            value: appointments.length.toLocaleString(),
            icon: "📅",
            onClick: () => {
                if (activeTab === "apt") setActiveTab(null);
                else {
                    setActiveTab("apt");
                    setDrillLevel("year");
                    setSelectedYear(null);
                    setSelectedMonth(null);
                    setSelectedDay(null);
                }
            },
            onReset: async () => {
                if (window.confirm("모든 예약 데이터가 삭제됩니다. 계속하시겠습니까?\n(이 작업은 취소할 수 없습니다.)")) {
                    try {
                        const res = await fetch('/api/appointments?resetAll=true', { method: 'DELETE' });
                        if (res.ok) {
                            alert("모든 예약 데이터가 초기화되었습니다.");
                            fetchData(); // 데이터 새로고침
                        }
                    } catch (error) {
                        alert("초기화 실패");
                    }
                }
            },
            active: activeTab === "apt"
        }
    ];

    return (
        <div className="space-y-6 sm:space-y-10 pt-4 sm:pt-8">
            <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">방문 관리</h1>
                <p className="text-sm md:text-base text-gray-400 mt-2">수치를 클릭하여 상세 추이를 드릴다운 탐색할 수 있습니다.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl">
                {stats.map((stat) => (
                    <StatCard key={stat.title} {...stat} />
                ))}
            </div>

            {activeTab && mainChartData && (
                <div className="w-full max-w-[1600px] space-y-8 animate-in fade-in duration-500">
                    <div className="flex justify-between items-center px-4">
                        <div className="flex items-center gap-2 text-sm bg-white/5 px-4 py-2 rounded-full border border-white/5">
                            <span className="text-gray-500">탐색 경로:</span>
                            <span className="text-white font-semibold">{drillLevel === "year" ? "가계도(연)" : drillLevel === "month" ? "월간" : drillLevel === "day" ? "일간" : "시간별"}</span>
                            {selectedYear && <span className="text-gray-400">→ {selectedYear}년</span>}
                            {selectedMonth !== null && <span className="text-gray-400">→ {selectedMonth + 1}월</span>}
                            {selectedDay && <span className="text-gray-400">→ {selectedDay}일</span>}
                        </div>
                        {drillLevel !== "year" && (
                            <button
                                onClick={goBack}
                                className="px-4 py-2 text-sm font-semibold bg-[#a855f7]/20 hover:bg-[#a855f7]/30 text-[#a855f7] rounded-xl transition-all border border-[#a855f7]/10 flex items-center gap-2"
                            >
                                <span>←</span> 단계 뒤로
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 gap-8">
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

                        {/* 예약 상세 속성 통계 */}
                        {activeTab === "apt" && detailedAptStats && (
                            <div className="space-y-12 animate-in fade-in duration-700 delay-200">
                                {/* 1. 상태 요약 전체 */}
                                <div className="bg-[#140D0B] border border-white/5 rounded-3xl p-6">
                                    <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                                        <span className="w-1.5 h-4 bg-[#a855f7] rounded-full"></span>
                                        전체 예약 상태 요약
                                    </h4>
                                    <div className="flex flex-wrap gap-3">
                                        {detailedAptStats.status.map(([name, count]) => (
                                            <div key={name} className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl flex items-center gap-3">
                                                <span className="text-gray-300 font-medium">{name}</span>
                                                <span className={`${name === '취소' ? 'text-red-500' : name === '확정' ? 'text-green-500' : 'text-yellow-500'} font-bold`}>{count}건</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* 2. 확정 테마 통계 */}
                                <div className="space-y-4">
                                    <h3 className="text-lg sm:text-xl font-bold text-green-500 px-1 sm:px-2 flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-500"></span>
                                        확정 건수 상세 통계
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <StatListCard title="성별 (확정)" data={detailedAptStats.confirmed.genders} color="#22c55e" />
                                        <StatListCard title="장르 (확정)" data={detailedAptStats.confirmed.genres} color="#22c55e" />
                                        <StatListCard title="부위 (확정)" data={detailedAptStats.confirmed.parts} color="#22c55e" />
                                    </div>
                                </div>

                                {/* 3. 취소 테마 통계 */}
                                <div className="space-y-4">
                                    <h3 className="text-lg sm:text-xl font-bold text-red-500 px-1 sm:px-2 flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-red-500"></span>
                                        취소 건수 상세 통계
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <StatListCard title="성별 (취소)" data={detailedAptStats.cancelled.genders} color="#ef4444" />
                                        <StatListCard title="장르 (취소)" data={detailedAptStats.cancelled.genres} color="#ef4444" />
                                        <StatListCard title="부위 (취소)" data={detailedAptStats.cancelled.parts} color="#ef4444" />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <p className="text-center text-xs text-gray-500 italic pb-10">
                        {drillLevel !== "hour" ? "⚡ 그래프의 막대를 상세한 데이터가 궁금한 시점을 클릭해 보세요." : "✅ 모든 탐색 단계가 끝났습니다."}
                    </p>
                </div>
            )}
        </div>
    );
}
