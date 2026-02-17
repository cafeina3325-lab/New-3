"use client";

import Link from "next/link";

export default function SectionD() {
    const cards = [
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
            desc: "1000+ 만족고객",
        },
    ];

    return (
        <section className="min-h-screen flex flex-col justify-center py-20 bg-gray-50 w-full">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-12 mb-16">
                    {/* Text Content */}
                    <div className="md:w-1/2">
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Philosophy</h2>
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">우리는 피부위에 예술을 새깁니다.</h3>
                        <p className="text-gray-600 leading-relaxed mb-6 whitespace-pre-line">
                            각 작품은 단순한 그림이 아닌, 당신의 이야기를 담은 영원한 캔버스입니다.
                            정밀함과 창의성의 균형, 그리고 고객과의 깊은 소통을 통해 세상에 단 하나뿐인 작품을 만듭니다.
                        </p>
                        <Link href="/about">
                            <button className="px-6 py-3 bg-gray-900 text-white rounded hover:bg-gray-800 transition">
                                Detail
                            </button>
                        </Link>
                    </div>

                    {/* Cards Grid - Triangle Layout */}
                    {/* Cards Grid - Triangle Layout (Gapless & Perfect Ratio) */}
                    <div className="md:w-1/2 flex flex-col items-center w-full mt-8 md:mt-0">
                        {/* Top Card (Precision) - Index 0 */}
                        <div
                            className="relative z-10 bg-white flex flex-col items-center justify-center text-center filter drop-shadow-xl hover:scale-105 transition-transform duration-300 w-[32%] md:w-[43%] lg:w-[32%]"
                            style={{
                                // width: '32%', // Removed: Handled by Tailwind classes for responsiveness
                                aspectRatio: '1 / 1.1547', // Perfect Regular Hexagon Ratio
                                clipPath: "polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%)",
                                WebkitClipPath: "polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%)",
                                // marginBottom removed to avoid double negative margin. Overlap is handled by the bottom row's -marginTop.
                                containerType: 'inline-size', // Enable Container Queries for proportional text
                            }}
                        >
                            <div className="p-[10%] flex flex-col items-center justify-center h-full">
                                <h4 className="font-bold text-gray-900 mb-[5cqw] text-[11cqw] leading-tight break-keep">{cards[0].title}</h4>
                                <p className="text-gray-500 word-keep break-keep text-[6.5cqw] leading-relaxed opacity-80">{cards[0].desc}</p>
                            </div>
                        </div>

                        {/* Bottom Row (Creativity, Trust) - Index 1, 2 */}
                        <div
                            className="flex w-full justify-center gap-[2vw]"
                            style={{ marginTop: '-6%' }}
                        // Reduced overlap (was -9.3%) to create vertical breathing room
                        >
                            {/* Re-do with strict calc inside mapping */}
                            {cards.slice(1).map((card, index) => (
                                <div
                                    key={index + 1}
                                    className="bg-white flex flex-col items-center justify-center text-center filter drop-shadow-lg hover:scale-105 transition-transform duration-300 w-[32%] md:w-[43%] lg:w-[32%]"
                                    style={{
                                        // width: '32%',
                                        aspectRatio: '1 / 1.1547',
                                        clipPath: "polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%)",
                                        WebkitClipPath: "polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%)",
                                        // marginTop removed to avoid double negative margin
                                        containerType: 'inline-size', // Enable Container Queries
                                    }}
                                >
                                    <div className="p-[10%] flex flex-col items-center justify-center h-full">
                                        <h4 className="font-bold text-gray-900 mb-[5cqw] text-[11cqw] leading-tight break-keep">{card.title}</h4>
                                        <p className="text-gray-500 word-keep break-keep text-[6.5cqw] leading-relaxed opacity-80">{card.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
