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
        <section className="py-20 bg-gray-50 w-full">
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

                    {/* Cards Grid */}
                    <div className="md:w-1/2 grid grid-cols-1 sm:grid-cols-3 gap-6">
                        {cards.map((card, index) => (
                            <div
                                key={index}
                                className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300 text-center"
                            >
                                <h4 className="text-lg font-bold text-gray-900 mb-2">{card.title}</h4>
                                <p className="text-sm text-gray-500">{card.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
