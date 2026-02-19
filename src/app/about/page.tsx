"use client";

import { useState } from "react";
import Link from "next/link";
import GlassHexagon from "@/components/ui/GlassHexagon";


function InfoOverlay({ onClose }: { onClose: () => void }) {
    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm pointer-events-auto p-4"
            onClick={onClose}
        >
            <div
                className="glass-panel rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative text-white"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="absolute inset-0 bg-black/40 pointer-events-none -z-10 rounded-2xl" /> {/* Darker background for readability */}

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <div className="p-8">
                    <h2 className="text-2xl font-bold mb-6 text-white border-b border-white/10 pb-2">Aftercare Checklist</h2>

                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-bold text-white mb-2">A. Healing Overview</h3>
                            <ul className="list-disc list-inside text-gray-300 space-y-1">
                                <li>초기 24~48시간: 민감한 단계, 진물이나 붓기가 있을 수 있습니다.</li>
                                <li>1~2주: 각질, 가려움, 톤 변화가 일어나는 시기입니다.</li>
                                <li>4주 전후: 피부가 안정화되며 최종 발색을 확인할 수 있습니다.</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold text-white mb-2">B. Do / Don’t</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-green-900/40 border border-green-500/20 p-4 rounded-lg">
                                    <h4 className="font-bold text-green-400 mb-1">Do</h4>
                                    <ul className="text-sm text-gray-300 space-y-1">
                                        <li>안내받은 Aftercare 지침 준수</li>
                                        <li>청결 유지, 과도한 마찰 최소화</li>
                                        <li>보습/연고는 권장량만 얇게 도포</li>
                                    </ul>
                                </div>
                                <div className="bg-red-900/40 border border-red-500/20 p-4 rounded-lg">
                                    <h4 className="font-bold text-red-400 mb-1">Don’t</h4>
                                    <ul className="text-sm text-gray-300 space-y-1">
                                        <li>24~48시간 음주 권장하지 않음</li>
                                        <li>사우나/수영/과격 운동(초기 2주)</li>
                                        <li>긁거나 각질을 억지로 뜯기 금지</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold text-white mb-2">C. Why results vary</h3>
                            <p className="text-gray-300 text-sm">
                                피부 상태, 부위, 에이징, 관리 상태에 따라 표현이 달라질 수 있습니다.
                                갤러리 이미지는 참고용이며 동일한 결과를 보장하지 않습니다.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold text-white mb-2">D. Support & Touch-up</h3>
                            <p className="text-gray-300 text-sm">
                                상태 점검이 필요하면 언제든 사진과 함께 상담을 요청해 주세요.
                                리터치 여부는 아티스트 판단 및 회복 상태를 기준으로 결정됩니다.
                            </p>
                        </div>
                    </div>

                    <div className="mt-8 text-center">
                        <button
                            onClick={onClose}
                            className="px-6 py-2 bg-white text-black font-semibold rounded hover:bg-gray-200 transition"
                        >
                            확인했습니다
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function AboutPage() {
    const [showInfoOverlay, setShowInfoOverlay] = useState(false);

    return (
        <main className="pt-[120px] min-h-screen bg-neutral-950 text-white selection:bg-white/20">

            {/* 1. Our Legacy Section */}
            <section className="container mx-auto px-6 py-20 relative z-10">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-800/20 via-neutral-950/0 to-neutral-950/0 pointer-events-none" />

                <div className="text-center max-w-3xl mx-auto mb-16 relative">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight text-white">Our Legacy</h1>
                    <div className="text-lg md:text-xl text-gray-400 space-y-2 leading-relaxed font-light">
                        <p>바늘로 그리는 것은 그림이 아니라, 시간을 새기는 일입니다.</p>
                        <p>Flying Studio는 한 사람의 서사를 존중하며, 한 번의 시술을 하나의 작품으로 완성합니다.</p>
                    </div>
                </div>

                {/* Key Pillars - Hexagonal/Glass Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16 px-4">
                    {[
                        { title: "Craft", desc: "디테일·선·명암·밀도에 대한 집요함" },
                        { title: "Safety", desc: "위생과 프로세스의 표준화" },
                        { title: "Respect", desc: "피부·취향·상황을 고려한 현실적인 디자인" },
                        { title: "Continuity", desc: "사후 관리와 에이징까지 포함한 결과 설계" }
                    ].map((item, idx) => (
                        <div key={idx} className="h-[260px] flex items-center justify-center">
                            <GlassHexagon className="w-full max-w-[280px] text-white">
                                <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                                <p className="text-sm text-gray-200 font-light">{item.desc}</p>
                            </GlassHexagon>
                        </div>
                    ))}
                </div>

                {/* Studio Facts */}
                <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-4 md:gap-12 text-sm text-gray-500 border-t border-white/10 pt-8">
                    <span className="flex items-center gap-2">📍 예약제 운영 · 인천 구월동</span>
                    <span className="flex items-center gap-2">🤝 다수 아티스트 협업 시스템</span>
                    <span className="flex items-center gap-2">💬 상담 중심 진행 (시술 예약 아님)</span>
                </div>
            </section>

            {/* 2. Custom Design */}
            <section className="py-20 bg-neutral-900 border-y border-white/5 relative">
                <div className="container mx-auto px-6 relative z-10">
                    <h2 className="text-3xl font-bold mb-12 text-center text-white">맞춤 도안 디자인</h2>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
                        {/* A. What we customize - Glass Panel Style */}
                        <div className="glass-panel p-8 rounded-xl">
                            <h3 className="text-xl font-bold mb-6 border-b border-white/10 pb-4 text-white">A. What we customize</h3>
                            <ul className="space-y-4">
                                {[
                                    { t: "Placement Fit", d: "부위 곡률·근육 라인·관절 움직임 반영" },
                                    { t: "Style Integrity", d: "장르 문법 유지 (이레즈미/블랙워크 등)" },
                                    { t: "Skin Reality", d: "피부 상태·색소·흉터·에이징 고려" },
                                    { t: "Scale & Readability", d: "거리감/사이즈에 따른 가독성 설계" }
                                ].map((li, i) => (
                                    <li key={i} className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4">
                                        <span className="font-bold text-white min-w-[140px]">{li.t}</span>
                                        <span className="text-gray-400 text-sm">{li.d}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* B, C, D Combined */}
                        <div className="space-y-6">
                            {/* B. Reference Policy */}
                            <div className="glass-panel p-6 rounded-xl border-l-4 border-l-white">
                                <h3 className="text-lg font-bold mb-2 text-white">B. Reference Policy</h3>
                                <p className="text-sm text-gray-400">
                                    레퍼런스는 무드/구성/질감 참고용입니다. 동일한 결과를 보장하지 않으며, 고객의 피부·부위에 맞춰 재해석됩니다.
                                </p>
                            </div>

                            {/* C. Design Flow */}
                            <div className="glass-panel p-6 rounded-xl">
                                <h3 className="text-lg font-bold mb-4 text-white">C. Design Approval Flow</h3>
                                <div className="flex flex-wrap items-center gap-2 text-sm text-gray-400">
                                    <span className="bg-white/5 px-3 py-1 rounded border border-white/10">상담/방향 확정</span>
                                    <span>→</span>
                                    <span className="bg-white/5 px-3 py-1 rounded border border-white/10">1차 스케치</span>
                                    <span>→</span>
                                    <span className="bg-white/5 px-3 py-1 rounded border border-white/10">수정 안내</span>
                                    <span>→</span>
                                    <span className="bg-white text-black px-3 py-1 rounded font-bold">최종 승인</span>
                                </div>
                            </div>

                            {/* D. Deliverables */}
                            <div className="glass-panel p-6 rounded-xl">
                                <h3 className="text-lg font-bold mb-2 text-white">D. Deliverables</h3>
                                <p className="text-sm text-gray-400 mb-4">구성안, 라인/명암 방향, 예상 사이즈, UI 추천</p>

                                <div className="border-t border-white/10 pt-4">
                                    <h4 className="font-bold mb-2 text-sm text-white">Before you book</h4>
                                    <ul className="text-xs text-gray-500 space-y-1 mb-4">
                                        <li>• 원하는 스타일/부위가 명확한가요?</li>
                                        <li>• 미성년자가 아님을 확인했나요?</li>
                                        <li>• 예약금 환불 규정을 확인했나요?</li>
                                    </ul>
                                    <button className="w-full py-3 bg-white text-black font-bold rounded hover:bg-gray-200 transition">
                                        Enter to Request
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. Booking Operation */}
            <section className="container mx-auto px-6 py-20">
                <h2 className="text-3xl font-bold mb-12 text-center text-white">예약 운영</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                    {[
                        { title: "Booking", subtitle: "상담 예약제", desc: "온라인 예약은 대면 상담 예약이며, 시술 예약이 아닙니다. 상담 결과에 따라 시술이 제한될 수 있습니다.", highlight: "text-red-400" },
                        { title: "Deposit", subtitle: "예약금 제도", desc: "일정 확보 및 노쇼 방지 목적. 단순 변심/무단 불참 시 환불 불가.", highlight: "" },
                        { title: "Policy", subtitle: "변경/취소", desc: "사전 문의 시 변경 가능. 당일 취소/무단 불참 시 예약금 반환 불가.", highlight: "" },
                        { title: "Eligibility", subtitle: "시술 조건", desc: "만 19세 미만 시술 불가 (신분증 필수). 피부/건강 상태에 따라 제한 가능.", highlight: "" }
                    ].map((item, idx) => (
                        <div key={idx} className="glass-panel p-6 rounded-lg hover:bg-white/[0.05] transition-colors">
                            <h3 className={`text-xl font-bold mb-4 ${item.highlight || 'text-white'}`}>{item.title}</h3>
                            <p className="text-sm text-gray-300 font-bold mb-2">{item.subtitle}</p>
                            <p className="text-xs text-gray-500">
                                {item.desc}
                            </p>
                        </div>
                    ))}
                </div>
                <div className="text-center mt-8">
                    <Link href="/faq" className="text-gray-500 underline text-sm hover:text-white transition-colors">
                        자세한 정책 보기 (FAQ)
                    </Link>
                </div>
            </section>

            {/* 4. Aftercare Info Overlay Trigger */}
            <section className="py-16 border-t border-white/10 relative">
                <div className="container mx-auto px-6 text-center relative z-10">
                    <h2 className="text-2xl font-bold mb-4 text-white">Aftercare Guide</h2>
                    <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
                        타투는 시술만큼 관리가 중요합니다. Flying Studio의 체계적인 관리 방법을 확인하세요.
                    </p>
                    <button
                        onClick={() => setShowInfoOverlay(true)}
                        className="px-8 py-3 border border-white text-white rounded-full hover:bg-white hover:text-black transition-all"
                    >
                        관리 체크리스트 확인하기
                    </button>
                </div>
            </section>

            {/* Modal Overlay */}
            {showInfoOverlay && <InfoOverlay onClose={() => setShowInfoOverlay(false)} />}
        </main>
    );
}
