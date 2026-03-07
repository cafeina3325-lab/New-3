/**
 * 관리자 대시보드 커스텀 라인(선형) 차트 컴포넌트
 * 
 * SVG를 사용하여 데이터를 직접 선 그래프로 매핑하여 렌더링합니다.
 * 주로 시간의 흐름에 따른 단순 지표(단일 트렌드 시계열 데이터) 변화를 보여주기 위해 사용됩니다.
 */

"use client";

import React from "react";

interface SimpleLineChartProps {
    data: number[];    // Y축 높이를 결정할 데이터 값 배열
    labels: string[];  // 하단 X축에 표시할 문자열들 (예: "01일", "02일" ...)
    title: string;     // 차트 제목 (차트 상단 렌더링)
    color?: string;    // 선 및 데이터 포인트 노드 색상 지정 (기본값 제공)
}

export default function SimpleLineChart({ data, labels, title, color = "#22c55e" }: SimpleLineChartProps) {
    const height = 200;
    const width = 500;
    const padding = 40;

    const maxValue = Math.max(...data, 1); // 0일 경우 대비
    const points = data.map((d, i) => {
        const x = (i / (data.length - 1 || 1)) * (width - padding * 2) + padding;
        const y = height - ((d / maxValue) * (height - padding * 2) + padding);
        return { x, y };
    });

    const pathData = points.reduce((acc, point, i) => {
        return i === 0 ? `M ${point.x},${point.y}` : `${acc} L ${point.x},${point.y}`;
    }, "");

    return (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-6 shadow-lg">
            <h4 className="text-sm md:text-base font-bold text-gray-400 mb-4 sm:mb-6 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }}></span>
                {title}
            </h4>
            <div className="relative h-[200px] w-full">
                <svg
                    viewBox={`0 0 ${width} ${height}`}
                    className="w-full h-full"
                    preserveAspectRatio="none"
                >
                    {/* 가이드 라인 (수평) */}
                    {[0, 0.25, 0.5, 0.75, 1].map((p) => (
                        <line
                            key={p}
                            x1={padding}
                            y1={height - (p * (height - padding * 2) + padding)}
                            x2={width - padding}
                            y2={height - (p * (height - padding * 2) + padding)}
                            stroke="white"
                            strokeOpacity="0.05"
                            strokeDasharray="4"
                        />
                    ))}

                    {/* 축 데이터 */}
                    <text x={padding - 10} y={padding} textAnchor="end" fontSize="10" fill="#666" dy="0.32em">
                        {maxValue}
                    </text>
                    <text x={padding - 10} y={height - padding} textAnchor="end" fontSize="10" fill="#666" dy="0.32em">
                        0
                    </text>

                    {/* 라인 */}
                    <path
                        d={pathData}
                        fill="none"
                        stroke={color}
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="drop-shadow-[0_0_8px_rgba(34,197,94,0.3)]"
                        style={{ filter: `drop-shadow(0 0 8px ${color}44)` }}
                    />

                    {/* 데이터 포인트 */}
                    {points.map((p, i) => (
                        <circle
                            key={i}
                            cx={p.x}
                            cy={p.y}
                            r="3"
                            fill={color}
                            className="hover:r-4 transition-all cursor-pointer"
                        />
                    ))}
                </svg>

                {/* X축 라벨 */}
                <div className="flex justify-between mt-2 px-[40px]">
                    {labels.map((l, i) => (
                        <span key={i} className="text-[10px] text-gray-500 font-mono">
                            {l}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}
