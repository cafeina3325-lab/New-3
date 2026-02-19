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
        <section className="min-h-screen flex flex-col justify-center py-20 bg-neutral-950 w-full overflow-hidden relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-900/20 rounded-full blur-[120px] pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col md:flex-row items-center justify-between gap-12 mb-16">
                    {/* Text Content */}
                    <div className="md:w-1/2">
                        <h2 className="text-3xl font-bold text-white mb-6">Our Philosophy</h2>
                        <h3 className="text-xl font-semibold text-gray-200 mb-4">우리는 피부위에 예술을 새깁니다.</h3>
                        <p className="text-gray-400 leading-relaxed mb-6 whitespace-pre-line">
                            각 작품은 단순한 그림이 아닌, 당신의 이야기를 담은 영원한 캔버스입니다.<br />
                            정밀함과 창의성의 균형, 그리고 고객과의 깊은 소통을 통해 세상에 단 하나뿐인 작품을 만듭니다.
                        </p>
                        <Link href="/about">
                            <button className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded transition backdrop-blur-sm">
                                Detail
                            </button>
                        </Link>
                    </div>

                    {/* Cards Grid - Triangle Layout (Restored) */}
                    <div className="md:w-1/2 flex flex-col items-center w-full mt-8 md:mt-0">
                        {/* Top Card (Precision) - Index 0 */}
                        <div
                            className="relative z-10 bg-white/5 backdrop-blur-md flex flex-col items-center justify-center text-center filter drop-shadow-xl hover:scale-105 transition-transform duration-300 w-[32%] md:w-[43%] lg:w-[32%]"
                            style={{
                                aspectRatio: '1 / 1.1547', // Perfect Regular Hexagon Ratio (Pointy Top)
                                clipPath: "polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%)",
                                WebkitClipPath: "polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%)",
                                containerType: 'inline-size',
                            }}
                        >
                            {/* Inner Border imitation using inset shadow or just reliance on bg difference */}
                            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />

                            <div className="p-[10%] flex flex-col items-center justify-center h-full relative z-20">
                                <h4 className="font-bold text-white mb-[5cqw] text-[11cqw] leading-tight break-keep">{cards[0].title}</h4>
                                <p className="text-gray-300 word-keep break-keep text-[6.5cqw] leading-relaxed opacity-80">{cards[0].desc}</p>
                            </div>
                        </div>

                        {/* Bottom Row (Creativity, Trust) - Index 1, 2 */}
                        <div
                            className="flex w-full justify-center gap-[2vw]"
                            style={{ marginTop: '-6%' }}
                        >
                            {cards.slice(1).map((card, index) => (
                                <div
                                    key={index + 1}
                                    className="bg-white/5 backdrop-blur-md flex flex-col items-center justify-center text-center filter drop-shadow-lg hover:scale-105 transition-transform duration-300 w-[32%] md:w-[43%] lg:w-[32%]"
                                    style={{
                                        aspectRatio: '1 / 1.1547',
                                        clipPath: "polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%)",
                                        WebkitClipPath: "polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%)",
                                        containerType: 'inline-size',
                                    }}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />

                                    <div className="p-[10%] flex flex-col items-center justify-center h-full relative z-20">
                                        <h4 className="font-bold text-white mb-[5cqw] text-[11cqw] leading-tight break-keep">{card.title}</h4>
                                        <p className="text-gray-300 word-keep break-keep text-[6.5cqw] leading-relaxed opacity-80">{card.desc}</p>
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
