export default function SectionG() {
    const steps = [
        {
            title: "Consultation",
            desc: "고객님의 방향성과 부위, 스타일을 논의합니다.\n대략적인 구성안과 범위를 안내합니다."
        },
        {
            title: "Design",
            desc: "상담내용을 기반으로 맞춤도안을 제작합니다.\n시술 전 구성과 방향을 최종 확인합니다."
        },
        {
            title: "Procedure",
            desc: "표준화 된 위생 환경에서 시술이 진행됩니다.\n피부 상태와 진행속도에 맞춰 조정됩니다."
        },
        {
            title: "Aftercare",
            desc: "치유과정과 관리방법을 안내합니다.\n필요 시 상태점검 및 리터치 여부를 상담합니다."
        }
    ];

    return (
        <section className="min-h-screen flex flex-col justify-center py-20 bg-gray-50 w-full">
            <div className="container mx-auto px-6">
                <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Consultation Flow</h2>
                <div className="flex flex-col items-center space-y-8">
                    {steps.map((step, index) => (
                        <div key={index} className="relative flex items-center w-full max-w-5xl h-24 md:h-44 group transition-transform hover:-translate-y-1 duration-300 drop-shadow-md hover:drop-shadow-xl">

                            {/* 1. Badge Hexagon (White - Scale h-24 w-[102px] - TITLE)
                                Mobile: h-24 w-[102px], Title text-xs
                                Desktop (md+): h-44 w-[204px], Title text-2xl
                            */}
                            <div
                                className="absolute left-0 z-20 h-24 w-[102px] md:h-44 md:w-[204px] shrink-0 bg-white flex items-center justify-center shadow-lg p-1 md:p-2 text-center"
                                style={{
                                    clipPath: "polygon(0% 50%, 25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%)",
                                    WebkitClipPath: "polygon(0% 50%, 25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%)"
                                }}
                            >
                                <span className="text-xs md:text-2xl font-bold text-gray-900 leading-tight break-keep word-keep px-2 md:px-8">
                                    {step.title}
                                </span>
                            </div>

                            {/* 2. Content Bar (Gray - Left Align Fix - DESC)
                                Mobile: ml-[50px] pl-[60px] pr-8
                                Desktop (md+): ml-[100px] pl-[115px] pr-16
                            */}
                            <div
                                className="ml-[50px] md:ml-[100px] flex-1 h-full bg-gray-200 flex flex-col justify-center items-start text-left pl-[60px] md:pl-[115px] pr-8 md:pr-16 relative z-10"
                                style={{
                                    // Flat Left, Pointy Right (Chevron-like ending)
                                    clipPath: "polygon(0% 0%, 95% 0%, 100% 50%, 95% 100%, 0% 100%)",
                                    WebkitClipPath: "polygon(0% 0%, 95% 0%, 100% 50%, 95% 100%, 0% 100%)"
                                }}
                            >
                                <p className="text-gray-700 whitespace-pre-line leading-snug md:leading-relaxed text-[10px] md:text-base font-medium">
                                    {step.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
