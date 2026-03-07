/**
 * 관리자 대시보드 커스텀 바 차트(SimpleBarChart) 컴포넌트
 * 
 * 주어진 데이터(data)를 바탕으로 세로 막대 그래프를 SVG로 직접 렌더링합니다.
 * - 단일 막대 모드: 방문자 수 등 단순 지표 표시
 * - 스택(Stacked) 모드: 예약의 확정/대기/취소 상태별 누적 수치 표시
 * - 보조 데이터(Secondary) 모드: 방문자 수 대비 전체 예약 수 등 중첩(Overlapped) 렌더링 지원
 */

"use client";

import React from "react";

// 바 차트 컴포넌트가 요구하는 속성(Props) 정의
interface BarChartProps {
    data: number[];                  // 기본 데이터 배열 (각 막대의 Y축 길이)
    labels: string[];                // 하단 X축 라벨 배열 (날짜, 카테고리 등)
    title: string;                   // 차트 상단 제목
    color?: string;                  // 기본 막대 색상 (단일 혹은 Primary 데이터용)
    secondaryData?: number[];        // [선택형] Primary 막대 위에 겹쳐서 보여줄 보조 데이터 배열
    secondaryColor?: string;         // 보조 데이터 막대 색상
    confirmedData?: number[];        // [스택모드 전용] 확정(Confirmed) 건수 배열
    cancelledData?: number[];        // [스택모드 전용] 취소(Cancelled) 건수 배열
    pendingData?: number[];          // [스택모드 전용] 대기(Pending) 건수 배열
    onBarClick?: (index: number, label: string) => void; // 막대 클릭 시 발생하는 콜백 (날짜값 등 반환)
}

export default function SimpleBarChart({
    data,
    labels,
    title,
    color = "#3b82f6",
    secondaryData,
    secondaryColor = "#22c55e",
    confirmedData,
    cancelledData,
    pendingData,
    onBarClick
}: BarChartProps) {
    if (data.length === 0) return (
        <div className="bg-[#140D0B] border border-white/5 rounded-3xl p-10 text-center text-gray-500">
            데이터가 없습니다.
        </div>
    );

    const isStacked = !!(confirmedData || cancelledData || pendingData);
    const hasSecondary = !!secondaryData;
    const maxVal = Math.max(...data, hasSecondary ? Math.max(...secondaryData!, 0) : 0, 1);

    const chartHeight = 250;
    const topPadding = 100;
    const barWidth = data.length > 25 ? 28 : data.length > 15 ? 45 : 70; // 너비 대폭 확대
    const actualBarWidth = (hasSecondary && !isStacked) ? barWidth / 2 - 2 : barWidth;
    const gap = data.length > 25 ? 12 : data.length > 15 ? 20 : 35; // 간격 최적화
    const svgWidth = (barWidth + gap) * data.length + gap;

    // 예약 상태별 색상
    const colors = {
        confirmed: "#22c55e", // 녹색
        pending: "#eab308",   // 황색
        cancelled: "#ef4444"  // 붉은색
    };

    return (
        <div className="bg-[#140D0B] border border-white/5 rounded-3xl p-4 sm:p-6 shadow-xl animate-in fade-in slide-in-from-bottom-2 duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 sm:mb-6 gap-3 sm:gap-4 border-b border-white/5 pb-3 sm:pb-4 px-1 sm:px-2">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: isStacked ? colors.confirmed : color }}></span>
                    {title}
                </h3>
                <div className="flex items-center gap-4 text-[10px] md:text-xs font-medium">
                    {isStacked ? (
                        <>
                            <div className="flex items-center gap-1.5">
                                <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: colors.confirmed }}></span>
                                <span className="text-gray-400">확정</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: colors.pending }}></span>
                                <span className="text-gray-400">대기</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: colors.cancelled }}></span>
                                <span className="text-gray-400">취소</span>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="flex items-center gap-1.5">
                                <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: color }}></span>
                                <span className="text-gray-400">{title.includes("방문자") ? "방문자" : "전체"}</span>
                            </div>
                            {hasSecondary && (
                                <div className="flex items-center gap-1.5">
                                    <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: secondaryColor }}></span>
                                    <span className="text-gray-400">예약</span>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            <div className="overflow-x-auto pb-4 scrollbar-hide">
                <svg width={Math.max(svgWidth, 300)} height={chartHeight + topPadding + 60} className="mx-auto overflow-visible">
                    {data.map((total, i) => {
                        const x = gap + i * (barWidth + gap);
                        const baselineY = topPadding + chartHeight;

                        if (isStacked) {
                            const conf = confirmedData?.[i] || 0;
                            const pend = pendingData?.[i] || 0;
                            const canc = cancelledData?.[i] || 0;

                            const hCanc = (canc / maxVal) * chartHeight;
                            const hPend = (pend / maxVal) * chartHeight;
                            const hConf = (conf / maxVal) * chartHeight;

                            const yCanc = baselineY - hCanc;
                            const yPend = yCanc - hPend;
                            const yConf = yPend - hConf;

                            return (
                                <g key={i} className={`group ${onBarClick ? 'cursor-pointer' : ''}`} onClick={() => onBarClick?.(i, labels[i])}>
                                    <rect x={x} y={yCanc} width={barWidth} height={hCanc} fill={colors.cancelled} rx={2} className="transition-all group-hover:brightness-110" />
                                    <rect x={x} y={yPend} width={barWidth} height={hPend} fill={colors.pending} rx={2} className="transition-all group-hover:brightness-110" />
                                    <rect x={x} y={yConf} width={barWidth} height={hConf} fill={colors.confirmed} rx={2} className="transition-all group-hover:brightness-110" />

                                    <g className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                                        <rect x={x + barWidth / 2 - 40} y={yConf - 65} width="80" height="60" rx="8" fill="rgba(0,0,0,0.9)" stroke="rgba(255,255,255,0.2)" className="backdrop-blur-md" />
                                        <text x={x + barWidth / 2} y={yConf - 48} textAnchor="middle" fill={colors.confirmed} fontSize="10" fontWeight="bold">확정: {conf}</text>
                                        <text x={x + barWidth / 2} y={yConf - 33} textAnchor="middle" fill={colors.pending} fontSize="10" fontWeight="bold">대기: {pend}</text>
                                        <text x={x + barWidth / 2} y={yConf - 18} textAnchor="middle" fill={colors.cancelled} fontSize="10" fontWeight="bold">취소: {canc}</text>
                                    </g>
                                    <text x={x + barWidth / 2} y={baselineY + 24} textAnchor="middle" fill="#9ca3af" fontSize={data.length > 15 ? "9" : "11"} className="font-medium">{labels[i]}</text>
                                </g>
                            );
                        } else {
                            const val2 = secondaryData?.[i] || 0;
                            const h1 = (total / maxVal) * chartHeight;
                            const h2 = (val2 / maxVal) * chartHeight;
                            const y1 = baselineY - h1;
                            const y2 = baselineY - h2;

                            // 중첩 스타일: 방문자(넓음), 예약(좁음, 중앙)
                            const innerBarWidth = barWidth * 0.6;
                            const innerX = x + (barWidth - innerBarWidth) / 2;

                            return (
                                <g key={i} className={`group ${onBarClick ? 'cursor-pointer' : ''}`} onClick={() => onBarClick?.(i, labels[i])}>
                                    {/* Primary Bar (Visits) - Full Width */}
                                    <rect x={x} y={y1} width={barWidth} height={h1} fill={color} rx={4} fillOpacity={0.8} className="transition-all group-hover:fill-opacity-100" />
                                    {/* Secondary Bar (Appointments) - Overlapped & Thinner */}
                                    {hasSecondary && (
                                        <rect x={innerX} y={y2} width={innerBarWidth} height={h2} fill={secondaryColor} rx={3} className="transition-all group-hover:brightness-110" />
                                    )}

                                    <g className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                                        <rect x={x + barWidth / 2 - 40} y={Math.min(y1, hasSecondary ? y2 : y1) - (hasSecondary ? 40 : 25)} width="80" height={hasSecondary ? "35" : "20"} rx="6" fill="rgba(0,0,0,0.9)" stroke="rgba(255,255,255,0.2)" className="backdrop-blur-md" />
                                        <text x={x + barWidth / 2} y={Math.min(y1, hasSecondary ? y2 : y1) - (hasSecondary ? 26 : 11)} textAnchor="middle" fill="#fff" fontSize="10" fontWeight="bold">{title.includes("방문자") ? "방문" : "전체"}: {total}</text>
                                        {hasSecondary && (
                                            <text x={x + barWidth / 2} y={Math.min(y1, y2) - 14} textAnchor="middle" fill={secondaryColor} fontSize="10" fontWeight="bold">예약: {val2}</text>
                                        )}
                                    </g>
                                    <text x={x + barWidth / 2} y={baselineY + 24} textAnchor="middle" fill="#9ca3af" fontSize={data.length > 15 ? "9" : "11"} className="font-medium">{labels[i]}</text>
                                </g>
                            );
                        }
                    })}
                </svg>
            </div>

            {/* 예약률 표시 (우측 하단 고정 형태) */}
            {hasSecondary && !isStacked && (
                <div className="flex justify-end mt-4 px-1 sm:px-4">
                    <div className="bg-[#1A110E] border border-white/10 px-3 py-2 sm:px-4 sm:py-2 rounded-xl sm:rounded-2xl flex items-center gap-3 sm:gap-4 shadow-2xl animate-in fade-in slide-in-from-right-4 duration-1000">
                        <div className="flex flex-col items-end">
                            <span className="text-[9px] sm:text-[10px] text-gray-400 font-medium">전체 기간 예약률</span>
                            <div className="flex items-baseline gap-1">
                                <span className="text-2xl font-bold text-green-500">
                                    {(() => {
                                        const totalVisitors = data.reduce((a, b) => a + b, 0);
                                        const totalApts = secondaryData!.reduce((a, b) => a + b, 0);
                                        return totalVisitors > 0 ? ((totalApts / totalVisitors) * 100).toFixed(1) : "0.0";
                                    })()}
                                </span>
                                <span className="text-xs text-green-500 font-medium">%</span>
                            </div>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center border border-green-500/20">
                            <span className="text-lg">📈</span>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                .scrollbar-hide::-webkit-scrollbar { display: none; }
                .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </div>
    );
}
