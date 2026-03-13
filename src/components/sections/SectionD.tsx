/**
 * 메인 랜딩 페이지 네 번째 섹션(Section D) - 철학 및 강점 소개
 * 
 * 스튜디오의 핵심 업무 철학(Philosophy)과 브랜드 강점을
 * 텍스트 설명 및 압축된 카드(Card) 레이아웃 형태로 강조하여 보여줍니다.
 */

import Link from "next/link";

// 3가지 핵심 강점을 표현하는 정적 데이터 구조체
const CARDS = [
    {
        title: "Precision",
        desc: "1mm 단위의 섬세한 작업",
    },
    {
        title: "Creativity",
        desc: "다양한 장르의 전문성",
    },
    {
        title: "Trust",
        desc: "1000+ 만족 고객",
    },
];

export default function SectionD() {
    return (
        <section className="py-12 sm:py-16 md:py-20 lg:py-28 bg-[#1C1310] w-full border-t border-white/5">
            <div className="container mx-auto px-4 sm:px-8 lg:px-12">
                {/* 좌우 나눠 배열 (모바일에서는 세로 스택) */}
                <div className="flex flex-col md:flex-row items-center justify-center gap-10 md:gap-14 lg:gap-20 mb-10 sm:mb-14 lg:mb-20">
                    {/* 좌측 텍스트 영역 */}
                    <div className="w-full md:w-3/5">
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#F3EBE1] mb-4 lg:mb-6">Our Philosophy</h2>
                        <h3 className="text-xl md:text-2xl lg:text-4xl font-medium text-[#D4C4BD]/80 tracking-wide mb-4 lg:mb-6">우리는 피부위에 예술을 새깁니다.</h3>
                        <p className="text-sm md:text-base lg:text-lg text-gray-400 leading-relaxed break-keep max-w-[95%] mb-6 lg:mb-8">
                            각 작품은 단순한 그림이 아닌, <br className="sm:hidden" /> 당신의 이야기를 담은 영원한 캔버스입니다. <br className="sm:hidden" /> 정밀함과 창의성의 균형, <br className="sm:hidden" /> 그리고 고객과의 깊은 소통을 통해 <br className="sm:hidden" /> 세상에 단 하나뿐인 작품을 만듭니다.
                        </p>
                        {/* About 페이지 내비게이션 링크 */}
                        <Link href="/about">
                            <button className="px-5 py-2.5 sm:px-6 sm:py-3 lg:px-8 lg:py-4 bg-[#E5D9D2] text-[#1C1310] text-sm md:text-base lg:text-lg font-bold tracking-wide rounded hover:bg-white transition-colors">
                                자세히 →
                            </button>
                        </Link>
                    </div>

                    {/* Cards Grid */}
                    {/* 우측(혹은 모바일 하단) 특징 카드 3개를 그리드 레이아웃으로 정렬 */}
                    {/* 특징 카드 3종 그리드 */}
                    <div className="w-full md:w-[230px] xl:w-[380px] grid grid-cols-1 gap-4 sm:gap-6 lg:gap-8">
                        {CARDS.map((card, index) => (
                            <div
                                key={index}
                                className="bg-[#150E0C] p-4 sm:p-6 lg:p-8 rounded-lg shadow-sm border border-white/5 hover:border-white/20 hover:shadow-md hover:-translate-y-1 transition-all duration-300 text-center flex flex-col items-center justify-center"
                            >
                                <h4 className="text-xl md:text-2xl lg:text-3xl font-bold text-[#F3EBE1] tracking-wide mb-2 lg:mb-3">{card.title}</h4>
                                <p className="text-sm md:text-base lg:text-lg text-gray-400 leading-relaxed break-keep">{card.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
