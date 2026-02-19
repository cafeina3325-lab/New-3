"use client";

import { useState } from "react";
import ContactOverlay from "@/components/layout/ContactOverlay";


export default function FAQPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [activeCategory, setActiveCategory] = useState("All");
    const [isContactOpen, setIsContactOpen] = useState(false);
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const categories = [
        "All",
        "Reservation",
        "Policy",
        "Design",
        "Preparation",
        "Cover-up",
        "Quotation",
        "Hygiene"
    ];

    const faqData = [
        {
            category: "Reservation",
            q: "온라인 예약 시 바로 본 작업(시술)이 진행되나요?",
            a: "아닙니다. 모든 작업은 고객님의 고유한 서사를 이해하는 대면 상담부터 시작됩니다. 온라인 예약은 이 심층 상담을 위한 시간 확보이며, 본 작업의 일정은 디자인의 방향성이 완벽히 조율된 후 결정됩니다."
        },
        {
            category: "Reservation",
            q: "상담만 받고 본 작업을 진행하지 않아도 괜찮습니까?",
            a: "물론입니다. 상담은 아이디어를 구체화하고 스튜디오의 작업 철학을 확인하는 시간입니다. 충분한 고민을 거치신 후 진행 여부를 결정하실 수 있도록 돕고 있습니다."
        },
        {
            category: "Reservation",
            q: "본 작업 날짜는 언제 확정됩니까?",
            a: "대면 상담을 통해 디자인의 규모와 세션(Session) 횟수가 명확해진 시점에, 고객님의 일정에 맞추어 프라이빗 스튜디오의 시간을 배정해 드립니다."
        },
        {
            category: "Policy",
            q: "예약금(Deposit) 제도를 운영하는 이유는 무엇입니까?",
            a: "예약금은 오직 한 분만을 위해 스튜디오의 프라이빗한 시간을 비워두고, 맞춤형 도안(Bespoke Design) 세공을 시작하기 위한 최소한의 약속이자 필수적인 기준입니다."
        },
        {
            category: "Policy",
            q: "예약금은 환불이 가능합니까?",
            a: "예약이 확정된 순간부터 아티스트의 시간과 디자인 기획이 집중적으로 소요되므로, 단순 변심이나 사전 연락 없는 불참 시에는 예약금이 반환되지 않습니다. 이는 타협 없는 하이엔드 작업 환경을 유지하기 위한 원칙입니다."
        },
        {
            category: "Policy",
            q: "확정된 일정을 변경할 수 있습니까?",
            a: "사전(최소 3일 전)에 스튜디오로 연락해 주시면 원활하게 일정을 조율해 드립니다. 다만 당일 취소나 무단 불참은 예약금 소멸로 이어지게 됩니다."
        },
        {
            category: "Design",
            q: "가져온 레퍼런스 이미지와 완전히 똑같이 작업해 주시나요?",
            a: "제공해 주신 이미지는 훌륭한 영감의 척도로 활용됩니다. 다만, 당소는 단순 모방을 지양하며 고객님의 해부학적 구조(Anatomy)와 피부 굴곡에 완벽히 들어맞도록 재해석된 오리지널 도안만을 피부에 올립니다."
        },
        {
            category: "Design",
            q: "완성된 결과물이 도안이나 사진과 다를 수 있습니까?",
            a: "피부는 살아 숨 쉬는 캔버스입니다. 개인의 피부 톤, 탄력도, 그리고 잉크가 착색되는 과정에 따라 미세한 발색의 뉘앙스 차이가 발생하며, 이는 비스포크 타투가 지닌 고유하고 자연스러운 예술적 특성입니다."
        },
        {
            category: "Design",
            q: "작업 결과물에 대한 환불 규정이 있습니까?",
            a: "본 작업은 도안 설계 단계에서 고객님의 완벽한 동의를 거친 후 진행됩니다. 피부에 영구적으로 안착하는 매체의 특성상 작업 완료 후의 물리적인 되돌림이나 환불은 성립되지 않습니다. 따라서 사전 조율 과정에서 오차 없이 시각적 합의를 이루어내는 것을 최우선으로 합니다."
        },
        {
            category: "Preparation",
            q: "완벽한 작업을 위해 사전에 피해야 할 요소가 있습니까?",
            a: "최상의 피부 텐션 유지와 통증 완화를 위해 작업 전날 과도한 음주, 수면 부족, 과량의 카페인 섭취는 피해주시길 권장합니다. 안정된 컨디션이 가장 정밀한 타투잉을 가능하게 합니다."
        },
        {
            category: "Preparation",
            q: "작업 직후 음주를 피해야 하는 이유는 무엇입니까?",
            a: "알코올은 체온을 높이고 혈류를 촉진하여 잉크의 안정적인 정착을 방해합니다. 완벽한 발색과 안전한 피부 회복을 위해 최소 48시간 동안은 금주를 권장합니다."
        },
        {
            category: "Preparation",
            q: "사후 관리(Aftercare) 지침은 얼마나 중요합니까?",
            a: "아티스트의 정밀한 타투잉이 절반을 차지한다면, 고객님의 철저한 사후 관리가 나머지 절반을 완성합니다. 안내해 드리는 프로토콜을 정확히 이행해 주셔야 평생을 함께할 선명한 마스터피스가 완성됩니다."
        },
        {
            category: "Cover-up",
            q: "기존 타투를 덮는 커버업(Cover-up) 작업도 가능합니까?",
            a: "커버업은 기존 잉크의 밀도와 명암을 역산해야 하는 고난도의 설계 과정입니다. 단순한 덮어쓰기가 아닌, 이전의 흔적을 완벽히 흡수하는 새로운 시각적 구조를 제안해 드립니다. 이를 위해 보다 심층적인 대면 상담이 필수적입니다."
        },
        {
            category: "Cover-up",
            q: "타 스튜디오에서 받은 작업의 터치업이나 연장도 진행하나요?",
            a: "당소의 엄격한 퀄리티 컨트롤과 예술적 일관성을 유지하기 위해, 원칙적으로 타 작업자의 도안을 단순 연장하는 작업은 지양합니다. 단, 전체적인 밸런스를 완전히 재설계하는 대규모 스케일업(Scale-up) 프로젝트인 경우 아티스트와의 상담을 통해 예외적으로 진행될 수 있습니다."
        },
        {
            category: "Quotation",
            q: "작업 견적은 어떤 기준으로 산출됩니까?",
            a: "하이엔드 비스포크 작업에는 규격화된 가격표가 존재하지 않습니다. 고객님이 선택하신 장르의 디테일 밀도, 작업 부위의 면적(Anatomy), 그리고 완성까지 소요되는 총 세션(Session) 횟수를 종합적으로 분석하여 투명하고 합리적인 견적을 도출합니다."
        },
        {
            category: "Quotation",
            q: "미성년자도 상담 및 작업이 가능합니까?",
            a: "불가능합니다. 피부 위에 영구적인 유산을 남기는 작업은 온전한 책임감을 요구합니다. 당소의 모든 서비스는 법적 성인에게만 제공되며, 철저한 프로토콜에 따라 방문 시 신분증명서 확인 절차를 거칩니다."
        },
        {
            category: "Hygiene",
            q: "켈로이드 피부나 특정 알레르기가 있어도 작업이 가능합니까?",
            a: "안전한 피부 회복이 모든 예술적 구현의 전제 조건입니다. 심한 켈로이드성 피부, 금속 알레르기, 아토피, 혹은 복용 중인 특수 약물이 있으신 경우 상담 시 반드시 고지해 주셔야 하며, 고객님의 안전을 위해 작업이 제한될 수 있습니다."
        },
        {
            category: "Hygiene",
            q: "작업 도중 마취 크림을 사용할 수 있습니까?",
            a: "원칙적으로 메디컬 처방이 없는 마취 크림의 사용은 엄격히 금지합니다. 이는 피부 표면의 질감을 변화시켜 정밀한 타투잉을 방해하고, 잉크의 완벽한 착색을 저해할 수 있기 때문입니다."
        }
    ];

    const filteredFAQ = faqData.filter(item => {
        const matchesSearch = item.q.toLowerCase().includes(searchTerm.toLowerCase()) || item.a.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = activeCategory === "All" || item.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    const toggleAccordion = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <main className="pt-[120px] min-h-screen bg-neutral-950 text-white pb-20">
            {/* 1. Hero */}
            <section className="container mx-auto px-6 mb-16 text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight text-white">명확한 기준, 투명한 원칙 (Clear Protocol)</h1>
                <p className="text-lg md:text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed word-keep-all">
                    타협 없는 마스터피스를 피부 위에 안전하게 구현하기 위해, 당소가 엄격하게 준수하고 있는 운영 기준과 작업 과정을 투명하게 안내합니다.
                </p>
            </section>

            {/* 2. Quick Search */}
            <section className="container mx-auto px-6 mb-12 max-w-2xl">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="찾으시는 과정이나 특정 규정이 있으십니까? (예: 예약금, 리터치, 커버업)"
                        className="w-full py-4 px-6 pl-12 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30 transition-all text-white placeholder-gray-500 backdrop-blur-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {/* Search Icon */}
                    <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <p className="text-sm text-gray-500 mt-2 text-center">
                    키워드를 입력하면 관련된 FAQ 항목만 필터링되어 나타납니다.
                </p>
            </section>

            {/* 3. Sticky Category Navigation & FAQ List */}
            <section className="container mx-auto px-6 max-w-5xl flex flex-col md:flex-row gap-12 items-start relative">
                {/* Sticky Nav */}
                <aside className="md:w-1/4 md:sticky md:top-32 w-full overflow-x-auto md:overflow-visible z-10 bg-neutral-950/80 backdrop-blur-md md:bg-transparent pb-2 md:pb-0">
                    <div className="flex md:flex-col gap-2">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-4 py-2 text-sm font-bold text-left rounded transition-colors whitespace-nowrap ${activeCategory === cat
                                    ? "bg-white text-black shadow-lg"
                                    : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </aside>

                {/* FAQ Accordion Content */}
                <div className="md:w-3/4 w-full space-y-4">
                    {filteredFAQ.length > 0 ? (
                        filteredFAQ.map((item, index) => (
                            <div
                                key={index}
                                className={`glass-panel rounded-lg overflow-hidden transition-all duration-300 border-white/5 ${openIndex === index ? 'shadow-lg border-white/20' : 'hover:border-white/20 hover:bg-white/5'}`}
                            >
                                <button
                                    onClick={() => toggleAccordion(index)}
                                    className="w-full text-left p-6 flex items-start justify-between group focus:outline-none"
                                >
                                    <div className="flex-1 pr-8">
                                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">{item.category}</span>
                                        <h3 className={`text-lg md:text-xl font-bold transition-colors ${openIndex === index ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>
                                            <span className="text-gray-500 mr-2">Q.</span>
                                            {item.q}
                                        </h3>
                                    </div>
                                    <div className={`mt-1 transition-transform duration-300 text-gray-400 ${openIndex === index ? 'rotate-180 text-white' : ''}`}>
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </button>

                                <div
                                    className={`transition-all duration-300 ease-in-out overflow-hidden ${openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                                >
                                    <div className="p-6 pt-0 border-t border-white/5">
                                        <div className="flex items-start gap-3 mt-4">
                                            <span className="text-gray-500 font-bold shrink-0 mt-1">A.</span>
                                            <p className="text-gray-300 leading-relaxed whitespace-pre-line word-keep-all">
                                                {item.a}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-20 text-gray-500 glass-panel border-dashed border-white/10 rounded-lg">
                            검색 결과가 없습니다.
                        </div>
                    )}
                </div>
            </section>

            {/* 4. Private Concierge CTA */}
            <section className="bg-white/5 border-t border-white/5 py-20 mt-20">
                <div className="container mx-auto px-6 text-center max-w-3xl">
                    <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">당신만의 고유한 서사에 대해 더 깊은 논의가 필요하십니까?</h2>
                    <p className="text-gray-400 mb-8 leading-relaxed word-keep-all">
                        세부적인 도안 방향성이나 체질에 따른 특이사항 등, 남겨진 질문이 있다면 전담 디렉터에게 문의해 주십시오.
                        프라이빗하고 심도 있는 상담을 도와드립니다.
                    </p>
                    <button
                        onClick={() => setIsContactOpen(true)}
                        className="px-8 py-4 bg-white text-black font-bold rounded hover:bg-gray-200 transition shadow-lg hover:shadow-xl"
                    >
                        1:1 프라이빗 컨시어지 연결
                    </button>
                </div>
            </section>

            {/* Contact Overlay Local Instance */}
            {isContactOpen && <ContactOverlay onClose={() => setIsContactOpen(false)} />}
        </main>
    );
}
