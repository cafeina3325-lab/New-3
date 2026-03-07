/**
 * 관리자용 비교 막대 그래프(ComparisonBarChart) 컴포넌트
 * 
 * 두 가지 서로 다른 데이터 세트(예: 일간 방문자 수 vs 예약 수)를
 * 하나의 X축 위에 나란히 렌더링하여 추이를 비교할 수 있도록 시각화합니다.
 * Hover 시 데이터를 툴팁으로 표시하는 인터랙션을 지원합니다.
 */

"use client";

import React from "react";

// 비교 바 차트를 그리기 위해 필요한 속성값 레이아웃 정의
interface ComparisonBarChartProps {
    data1: number[];       // 첫 번째 지표 데이터 배열 (예: 주간 방문자 수 집계)
    data2: number[];       // 두 번째 지표 데이터 배열 (예: 주간 평균 예약 건수 집계)
    labels: string[];      // 하단 X축을 구성할 라벨 문자열 배열
    title: string;         // 차트의 전체 제목
    label1?: string;       // 첫 번째 데이터 범례(Legend) 이름 (기본값: "방문")
    label2?: string;       // 두 번째 데이터 범례(Legend) 이름 (기본값: "예약")
    color1?: string;       // 첫 번째 데이터 막대 색상
    color2?: string;       // 두 번째 데이터 막대 색상
}

export default function ComparisonBarChart({
    data1,
    data2,
    labels,
    title,
    label1 = "방문",
    label2 = "예약",
    color1 = "#a855f7",
    color2 = "#22c55e"
}: ComparisonBarChartProps) {
    if (data1.length === 0) return (
        <div className="bg-[#140D0B] border border-white/5 rounded-3xl p-10 text-center text-gray-500">
            데이터가 없습니다.
        </div>
    );

    const maxVal = Math.max(...data1, ...data2, 1);
    const chartHeight = 250;
    const groupGap = labels.length > 25 ? 5 : labels.length > 15 ? 15 : 30;
    const barWidth = labels.length > 25 ? 10 : labels.length > 15 ? 15 : 25;
    const barGap = 2; // 막대 사이 간격
    const groupWidth = barWidth * 2 + barGap;
    const svgWidth = (groupWidth + groupGap) * labels.length + groupGap;

    return (
        <div className="bg-[#140D0B] border border-white/5 rounded-3xl p-4 sm:p-6 shadow-xl animate-in fade-in slide-in-from-bottom-2 duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 sm:mb-6 px-1 sm:px-2 gap-3 sm:gap-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-white/20"></span>
                    {title}
                </h3>
                <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: color1 }}></div>
                        <span className="text-gray-400">{label1}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: color2 }}></div>
                        <span className="text-gray-400">{label2}</span>
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto pb-4 scrollbar-hide">
                <svg width={Math.max(svgWidth, 300)} height={chartHeight + 40} className="mx-auto overflow-visible">
                    {labels.map((label, i) => {
                        const h1 = (data1[i] / maxVal) * chartHeight;
                        const h2 = (data2[i] / maxVal) * chartHeight;

                        const groupX = groupGap + i * (groupWidth + groupGap);

                        const x1 = groupX;
                        const x2 = groupX + barWidth + barGap;

                        const y1 = chartHeight - h1;
                        const y2 = chartHeight - h2;

                        return (
                            <g key={i} className="group">
                                {/* Bar 1 (Visit) */}
                                <rect
                                    x={x1}
                                    y={y1}
                                    width={barWidth}
                                    height={h1}
                                    fill={color1}
                                    rx={labels.length > 20 ? 1 : 4}
                                    className="transition-all duration-500 ease-out origin-bottom group-hover:filter group-hover:brightness-110"
                                    style={{
                                        animation: `bar-grow 0.8s ease-out forwards ${i * (0.5 / labels.length)}s`,
                                        transform: 'scaleY(0)',
                                        transformOrigin: 'bottom'
                                    }}
                                />

                                {/* Bar 2 (Apt) */}
                                <rect
                                    x={x2}
                                    y={y2}
                                    width={barWidth}
                                    height={h2}
                                    fill={color2}
                                    rx={labels.length > 20 ? 1 : 4}
                                    className="transition-all duration-500 ease-out origin-bottom group-hover:filter group-hover:brightness-110"
                                    style={{
                                        animation: `bar-grow 0.8s ease-out forwards ${(i * (0.5 / labels.length)) + 0.1}s`,
                                        transform: 'scaleY(0)',
                                        transformOrigin: 'bottom'
                                    }}
                                />

                                {/* Tooltip on group hover */}
                                <g className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                                    <rect
                                        x={groupX - 5}
                                        y={-30}
                                        width={groupWidth + 10}
                                        height={25}
                                        rx={4}
                                        fill="#1c1c1c"
                                        stroke="white/10"
                                    />
                                    <text
                                        x={groupX + groupWidth / 2}
                                        y={-14}
                                        textAnchor="middle"
                                        fill="white"
                                        fontSize="10"
                                        className="font-medium"
                                    >
                                        V:{data1[i]} / R:{data2[i]}
                                    </text>
                                </g>

                                {/* Label Text */}
                                <text
                                    x={groupX + groupWidth / 2}
                                    y={chartHeight + 24}
                                    textAnchor="middle"
                                    fill="#9ca3af"
                                    fontSize={labels.length > 20 ? "8" : "10"}
                                    className="font-medium"
                                >
                                    {label}
                                </text>
                            </g>
                        );
                    })}
                </svg>
            </div>

            <style jsx>{`
                @keyframes bar-grow {
                    from { transform: scaleY(0); }
                    to { transform: scaleY(1); }
                }
                .scrollbar-hide::-webkit-scrollbar { display: none; }
                .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </div>
    );
}
