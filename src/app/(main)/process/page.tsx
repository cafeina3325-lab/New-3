// 파일 요약: 스튜디오의 고유한 타투 작업 파이프라인(상담, 도안 설계, 타투잉, 사후 관리)과 준비 사항을 안내하는 페이지입니다.

"use client";

import { useState } from "react";
import Link from "next/link";
import ContactOverlay from "@/components/layout/ContactOverlay";

// --- Static Data ---
// 정적 데이터: 단계별 작업 프로세스(Consultation Flow)를 설명하는 배열입니다.
const PROCESS_STEPS = [
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
        desc: "작업의 진정한 완성은 완벽한 발색과 보존에 있습니다. 피부의 안정적인 치유와 정교한 관리를 위해 체계적으로 설계된 사후 관리 매뉴얼과 전용 제품을 안내하며, 최상의 컨디션을 유지하기 위한 장기적인 관리 노하우를 제공합니다."
    }
];

// 정적 데이터: 완벽한 작업을 위해 고객이 미리 준비해야 할 가이드라인 목록입니다.
const PREP_GUIDES = [
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

// --- Main Component ---
// 컴포넌트 요약: Process (작업 과정) 페이지 전체를 구성하는 메인 컴포넌트입니다.
export default function ProcessPage() {
    // State
    // 컨택트 오버레이 모달의 노출 여부를 관리하는 상태
    const [isContactOpen, setIsContactOpen] = useState(false);

    // Handlers
    // 모달을 열고 닫는 핸들러 함수들
    const openContact = () => setIsContactOpen(true);
    const closeContact = () => setIsContactOpen(false);

    return (
        <main className="pt-[120px] xs:pt-[140px] sm:pt-[160px] md:pt-[200px] lg:pt-[220px] xl:pt-[240px] pb-10 xs:pb-12 sm:pb-16 md:pb-20 lg:pb-24 min-h-screen bg-[#1C1310] text-[#F3EBE1]">
            {/* Intro */}
            {/* 상단: 페이지의 주제 및 헤드카피를 나타내는 인트로 섹션 */}
            <section className="container mx-auto px-4 xs:px-6 sm:px-8 mb-12 xs:mb-16 md:mb-20 text-center">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 tracking-tight">잉크의 건축 (The Architecture of Ink)</h1>
                <p className="text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed word-keep-all">
                    단 하나의 마스터피스를 완성하기 위해, 타협 없는 정밀함으로 설계된 비스포크(Bespoke) 여정을 안내합니다.
                </p>
            </section>

            {/* Core Philosophy */}
            {/* 스튜디오 고유의 핵심 철학을 설명하는 섹션 */}
            <section className="bg-[#150E0C] py-12 xs:py-14 sm:py-16 md:py-20 mb-12 xs:mb-16 md:mb-20">
                <div className="container mx-auto px-4 xs:px-6 sm:px-8 text-center max-w-4xl">
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6">Core Philosophy</h2>
                    <p className="text-gray-700 leading-loose text-sm md:text-base lg:text-lg word-keep-all">
                        우리는 타투를 단순한 소비재가 아닌, 피부 위에 새겨지는 평생의 유산(Heritage)으로 대합니다.
                        고객의 고유한 서사를 독창적인 시각 언어로 번역하는 예술성과, 이를 오차 없이 안전하게 구현하는 기술력의 완벽한 균형을 추구합니다.
                    </p>
                </div>
            </section>

            {/* Consultation Flow */}
            {/* 배열을 순회하며 작업 프로세스 1단계부터 4단계까지 렌더링 */}
            <section className="container mx-auto px-4 xs:px-6 sm:px-8 mb-16 xs:mb-20 md:mb-24 max-w-5xl">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-10 md:mb-16">Consultation Flow</h2>
                <div className="space-y-10 md:space-y-16">
                    {PROCESS_STEPS.map((item, index) => (
                        <div key={index} className="flex flex-col md:flex-row gap-4 md:gap-8 items-start group">
                            {/* 좌측 스텝 번호 표시. 호버 시 폰트 컬러 변경 효과 */}
                            <div className="md:w-1/4">
                                <span className="text-4xl md:text-5xl font-bold text-white/10 group-hover:text-[#F3EBE1] transition-colors duration-300">
                                    {item.step}
                                </span>
                            </div>
                            {/* 우측 제목 및 상세 설명 */}
                            <div className="md:w-3/4">
                                <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4">{item.title}</h3>
                                <p className="text-gray-600 leading-relaxed whitespace-pre-line word-keep-all text-sm md:text-base">
                                    {item.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Environment & Protocol */}
            {/* 위생, 멸균, 환경 통제에 대한 원칙을 설명하는 섹션 */}
            <section className="bg-[#0A0706] text-[#F3EBE1] py-16 xs:py-20 md:py-24 mb-16 xs:mb-20 md:mb-24">
                <div className="container mx-auto px-4 xs:px-6 sm:px-8 text-center max-w-4xl">
                    <span className="text-xs md:text-sm text-gray-400 font-medium tracking-widest uppercase mb-3 md:mb-4 block">The Environment & Protocol</span>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 md:mb-8">무결점의 공간, 철저한 통제</h2>
                    <p className="text-gray-300 leading-loose text-sm md:text-base lg:text-lg word-keep-all">
                        예술적 직관은 가장 안전하고 통제된 환경에서 발현됩니다.
                        본 스튜디오는 교차 감염을 완벽히 차단하는 메디컬 등급의 멸균 시스템을 가동하며,
                        모든 작업 환경은 1회용품 사용을 철칙으로 합니다.
                        고객이 온전히 작업에만 몰입할 수 있도록 프라이빗하고 쾌적한 VIP 환경을 제공합니다.
                    </p>
                </div>
            </section>

            {/* Preparation Guide */}
            {/* 고객이 작업 전 준비해야 할 가이드라인 목록을 카드 형태로 맵핑 렌더링 */}
            <section className="container mx-auto px-4 xs:px-6 sm:px-8 mb-16 xs:mb-20 md:mb-24 max-w-5xl">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-8 md:mb-12">완벽한 작업을 위한 고객 가이드</h2>
                <p className="text-center text-sm md:text-base lg:text-lg text-gray-600 mb-8 md:mb-12">최상의 결과물을 위해 작업 전 고객님의 세심한 준비가 필요합니다.</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
                    {PREP_GUIDES.map((guide, idx) => (
                        <div key={idx} className="bg-[#1C1310] border border-white/10 p-6 md:p-8 rounded-lg shadow-sm hover:shadow-md hover:border-white/20 transition-all">
                            <h3 className="text-xl md:text-2xl lg:text-3xl font-bold mb-3 md:mb-4 text-[#F3EBE1]">{guide.title}</h3>
                            <p className="text-sm md:text-base text-gray-600 leading-relaxed word-keep-all">
                                {guide.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            {/* 최하단: FAQ 페이지 이동 혹은 Contact(문의) 모달 띄우기 버튼들 */}
            <section className="container mx-auto px-6 text-center pb-12">
                <p className="text-xl md:text-2xl font-medium text-[#F3EBE1] mb-8">당신만의 서사를 시작할 준비가 되셨습니까?</p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                    <Link href="/faq">
                        {/* FAQ 버튼 링크 */}
                        <button className="px-8 py-4 bg-transparent border-2 border-[#E5D9D2] text-[#E5D9D2] font-bold rounded hover:bg-[#E5D9D2] hover:text-[#1C1310] transition w-full sm:w-auto min-w-[200px]">
                            FAQ
                        </button>
                    </Link>
                    <button
                        onClick={openContact}
                        className="px-8 py-4 bg-[#E5D9D2] text-[#1C1310] font-bold rounded hover:bg-white transition w-full sm:w-auto min-w-[200px]"
                    >
                        예약하기
                    </button>
                </div>
            </section>

            {/* Modals */}
            {/* 상태 값에 따라 컨택트 컴포넌트를 호출 */}
            {isContactOpen && <ContactOverlay onClose={closeContact} />}
        </main>
    );
}
