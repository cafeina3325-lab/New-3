"use client";

import { useState } from "react";
import Link from "next/link";
import ContactOverlay from "@/components/layout/ContactOverlay"; // Assuming path if available, or duplicate/move logic. 
// Since ContactOverlay specific export might not be global, I will stick to local state if I can import it. 
// However, looking at previous steps, ContactOverlay is in layout. Let's try to import it.

export default function ProcessPage() {
    const [isContactOpen, setIsContactOpen] = useState(false);

    const steps = [
        {
            step: "Step 01",
            title: "심층 분석 및 방향 설계 (In-depth Consultation)",
            desc: "고객의 비전과 작업 부위의 해부학적 구조(Anatomy)를 정밀하게 분석합니다. 단순한 스케치를 넘어, 이레즈미, 블랙워크 등 선호하시는 장르의 역사적 맥락과 예술적 특징을 바탕으로 최적의 시각적 방향성과 체계적인 작업 규모를 설정합니다.\n(아나토미: 신체의 골격과 근육 형태를 의미하며, 도안이 인체 굴곡에 자연스럽게 감기도록 설계하는 핵심 기준입니다.)"
        },
        {
            step: "Step 02",
            title: "비스포크 도안 세공 (Bespoke Design Process)",
            desc: "오직 한 사람만을 위한 마스터피스 도안을 세공합니다. 피부의 굴곡과 움직임까지 계산한 정교한 설계를 통해 시술 전 완벽한 형태를 검증하며, 고객의 완전한 동의가 이루어질 때까지 타협 없이 시각적 퀄리티를 끌어올립니다."
        },
        {
            step: "Step 03",
            title: "하이엔드 타투잉 (High-end Tattooing)",
            desc: "외부의 방해를 완벽히 차단한 독립적인 환경에서 오롯이 작업에만 집중합니다. 흔들림 없는 집중력과 오차 없는 정교한 타투잉 기술을 통해, 준비된 도안을 변치 않는 예술 작품으로 승화시킵니다."
        },
        {
            step: "Step 04",
            title: "영구적인 유산 관리 (Heritage Maintenance)",
            desc: "작업의 진정한 완성은 완벽한 발색과 보존에 있습니다. 피부의 안정적인 치유와 잉크의 변색 방지를 위해 체계적으로 설계된 사후 관리 매뉴얼과 전용 제품을 안내하며, 최상의 컨디션을 유지하기 위한 장기적인 관리 노하우를 제공합니다."
        }
    ];

    const prepGuides = [
        {
            title: "충분한 휴식과 컨디션 관리",
            desc: "피부의 텐션 유지와 통증 감소를 위해 작업 전날 충분한 수면을 취하고 음주를 삼가주십시오."
        },
        {
            title: "정확한 레퍼런스 준비",
            desc: "원하시는 장르나 느낌을 담은 참고 이미지를 준비해 주시면, 더욱 정밀한 맞춤형 상담이 가능합니다."
        },
        {
            title: "편안한 복장",
            desc: "작업 부위가 노출되기 쉽고, 장시간 편안하게 대기할 수 있는 넉넉한 복장으로 방문해 주시길 권장합니다."
        }
    ];

    return (
        <main className="pt-[120px] min-h-screen bg-[var(--color-green-900)] text-[var(--color-off-white)] pb-20 selection:bg-[var(--color-gold-500)] selection:text-black">
            {/* 1. Intro */}
            <section className="container mx-auto px-6 mb-20 text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight text-[var(--color-off-white)]">잉크의 건축 (The Architecture of Ink)</h1>
                <p className="text-lg md:text-xl text-white/60 max-w-3xl mx-auto leading-relaxed word-keep-all">
                    단 하나의 마스터피스를 완성하기 위해, 타협 없는 정밀함으로 설계된 비스포크(Bespoke) 여정을 안내합니다.
                </p>
            </section>

            {/* 2. Core Philosophy */}
            <section className="glass-premium py-16 mb-20">
                <div className="container mx-auto px-6 text-center max-w-4xl">
                    <h2 className="text-2xl font-bold mb-6 text-white">Core Philosophy</h2>
                    <p className="text-gray-300 leading-loose text-lg word-keep-all">
                        우리는 타투를 단순한 소비재가 아닌, 피부 위에 새겨지는 평생의 유산(Heritage)으로 대합니다.
                        고객의 고유한 서사를 독창적인 시각 언어로 번역하는 예술성과, 이를 오차 없이 안전하게 구현하는 기술력의 완벽한 균형을 추구합니다.
                    </p>
                </div>
            </section>

            {/* 3. Consultation Flow (Steps) */}
            <section className="container mx-auto px-6 mb-24 max-w-5xl">
                <h2 className="text-3xl font-bold text-center mb-16 text-white">Consultation Flow</h2>
                <div className="space-y-16">
                    {steps.map((item, index) => (
                        <div key={index} className="flex flex-col md:flex-row gap-8 items-start group">
                            <div className="md:w-1/4">
                                <span className="text-4xl font-bold text-gray-500 group-hover:text-white transition-colors duration-300">
                                    {item.step}
                                </span>
                            </div>
                            <div className="md:w-3/4">
                                <h3 className="text-2xl font-bold mb-4 text-white">{item.title}</h3>
                                <p className="text-gray-400 leading-relaxed whitespace-pre-line word-keep-all">
                                    {item.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* 4. Environment & Protocol */}
            <section className="glass-premium text-white py-20 mb-20">
                <div className="container mx-auto px-6 text-center max-w-4xl">
                    <span className="text-gray-400 font-medium tracking-widest uppercase mb-4 block">The Environment & Protocol</span>
                    <h2 className="text-3xl md:text-4xl font-bold mb-8 text-white">무결점의 공간, 철저한 통제</h2>
                    <p className="text-gray-300 leading-loose text-lg word-keep-all">
                        예술적 직관은 가장 안전하고 통제된 환경에서 발현됩니다.
                        본 스튜디오는 교차 감염을 완벽히 차단하는 메디컬 등급의 멸균 시스템을 가동하며,
                        모든 작업 환경은 1회용품 사용을 철칙으로 합니다.
                        고객이 온전히 작업에만 몰입할 수 있도록 프라이빗하고 쾌적한 VIP 환경을 제공합니다.
                    </p>
                </div>
            </section>

            {/* 5. Preparation Guide */}
            <section className="container mx-auto px-6 mb-24 max-w-5xl">
                <h2 className="text-3xl font-bold text-center mb-12 text-white">완벽한 작업을 위한 고객 가이드</h2>
                <p className="text-center text-gray-400 mb-12">최상의 결과물을 위해 작업 전 고객님의 세심한 준비가 필요합니다.</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {prepGuides.map((guide, idx) => (
                        <div key={idx} className="glass-premium p-8 rounded-lg border border-white/10 shadow-sm hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-shadow">
                            <h3 className="text-xl font-bold mb-4 text-white">{guide.title}</h3>
                            <p className="text-gray-400 text-sm leading-relaxed word-keep-all">
                                {guide.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* 6 & 7. CTA Buttons */}
            <section className="container mx-auto px-6 text-center pb-12">
                <p className="text-xl font-medium text-gray-300 mb-8">당신만의 서사를 시작할 준비가 되셨습니까?</p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                    {/* FAQ Button */}
                    <Link href="/faq">
                        <button className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded hover:bg-white hover:text-black transition w-full sm:w-auto min-w-[200px]">
                            FAQ
                        </button>
                    </Link>

                    {/* Contact Button */}
                    <button
                        onClick={() => setIsContactOpen(true)}
                        className="px-8 py-4 bg-white text-black font-bold rounded hover:bg-gray-200 transition w-full sm:w-auto min-w-[200px]"
                    >
                        Contact
                    </button>
                </div>
            </section>

            {/* Contact Overlay Component */}
            {isContactOpen && <ContactOverlay onClose={() => setIsContactOpen(false)} />}
        </main>
    );
}
