/**
 * 통계 지표 카드(StatCard) 컴포넌트
 * 
 * 관리자 페이지 최상단 대시보드에서 주요 수치(예약 건수, 방문자 수 등)를 요약해서 보여줍니다.
 * 클릭(활성화) 시 필터링을 트리거할 수 있는 인터랙션 요소 및 
 * 증감 추세(Trend) 뱃지를 지원합니다.
 */

interface StatCardProps {
    title: string;                // 표시할 지표의 이름
    value: string | number;       // 실제 수치 (통화, 숫자 등 형식 포함)
    trend?: string;               // 이전 대비 증감 (예: "+15%", "-2.4등")
    icon: React.ReactNode | string; // 카드를 상징하는 아이콘(SVG나 이모지)
    onClick?: () => void;         // 카드 클릭 시 연동될 외부 햄들러 (선택)
    onReset?: () => void;         // 해당 지표와 연관된 차트 필터를 초기화하는 핸들러 (선택)
    active?: boolean;             // 현재 차트에서 이 지표 탭이 선택/활성화되었는지 여부
}

export default function StatCard({ title, value, trend, icon, onClick, onReset, active }: StatCardProps) {
    // 트렌드 값이 +로 시작하는지 판단하여 뱃지 색상을 초록/빨강으로 분기 처리합니다.
    const isPositive = trend?.startsWith('+') ?? true;

    return (
        <div
            onClick={onClick}
            className={`p-4 sm:p-6 rounded-2xl shadow-xl transition-all group border relative ${onClick ? 'cursor-pointer' : ''
                } ${active
                    ? 'bg-white/10 border-white/20 scale-[1.02]'
                    : 'bg-[#1C1310] border-white/5 hover:border-white/20'
                }`}
        >
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl transition-all ${active ? 'bg-white/20 scale-110' : 'bg-white/5 group-hover:scale-110'}`}>
                    <span className="text-2xl">{icon}</span>
                </div>
                <div className="flex items-center gap-3">
                    {onReset && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onReset();
                            }}
                            className="bg-white/5 hover:bg-red-500/20 text-gray-500 hover:text-red-400 text-[10px] font-bold px-2 py-1 rounded-lg border border-white/5 hover:border-red-500/20 transition-all uppercase tracking-tighter"
                        >
                            초기화
                        </button>
                    )}
                    {trend && (
                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${isPositive ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                            }`}>
                            {trend}
                        </span>
                    )}
                </div>
            </div>
            <h3 className={`text-sm md:text-base font-medium transition-colors ${active ? 'text-white' : 'text-gray-400'}`}>{title}</h3>
            <p className="text-2xl font-bold text-white mt-1">{value}</p>
        </div>
    );
}

