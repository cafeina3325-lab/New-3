export default function SectionG() {
    const steps = [
        {
            title: "1. Consultation",
            desc: "고객님의 방향성과 부위, 스타일을 논의합니다.\n대략적인 구성안과 범위를 안내합니다."
        },
        {
            title: "2. Design",
            desc: "상담내용을 기반으로 맞춤도안을 제작합니다.\n시술 전 구성과 방향을 최종 확인합니다."
        },
        {
            title: "3. Procedure",
            desc: "표준화 된 위생 환경에서 시술이 진행됩니다.\n피부 상태와 진행속도에 맞춰 조정됩니다."
        },
        {
            title: "4. Aftercare",
            desc: "치유과정과 관리방법을 안내합니다.\n필요 시 상태점검 및 리터치 여부를 상담합니다."
        }
    ];

    return (
        <section className="py-20 bg-gray-50 w-full">
            <div className="container mx-auto px-6">
                <h2 className="text-3xl font-bold text-center mb-12">Consultation Flow</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {steps.map((step, index) => (
                        <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                            <h3 className="text-xl font-bold mb-4 text-gray-900">{step.title}</h3>
                            <p className="text-gray-600 whitespace-pre-line leading-relaxed">{step.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
