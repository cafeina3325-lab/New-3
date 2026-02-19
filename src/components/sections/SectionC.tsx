import GlassHexagon from "../ui/GlassHexagon";

export default function SectionC() {
    const events = [
        { id: 1, title: "Event 1", desc: "Limited Edition" },
        { id: 2, title: "Event 2", desc: "Special Offer" },
        { id: 3, title: "Event 3", desc: "New Arrival" },
        { id: 4, title: "Event 4", desc: "Artist Collab" },
        { id: 5, title: "Event 5", desc: "Seasonal Style" },
    ];

    return (
        <section className="py-24 bg-neutral-950 relative overflow-hidden">
            <div className="absolute inset-0 bg-white/[0.02] pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <span className="text-gray-500 tracking-widest uppercase text-sm font-medium mb-3 block">Monthly Drops</span>
                    <h2 className="text-4xl font-bold text-white mb-4">이달의 이벤트</h2>
                    <p className="text-gray-400">매월 새로운 소식을 전합니다</p>
                </div>

                {/* Horizontal Scroll Image Cards */}
                <div className="flex overflow-x-auto pb-12 gap-8 snap-x snap-mandatory scrollbar-hide mb-12 px-4 justify-start md:justify-center">
                    {events.map((event) => (
                        <div key={event.id} className="snap-center shrink-0 transition-transform hover:-translate-y-2 duration-300">
                            <GlassHexagon className="w-[280px] h-[320px] flex items-center justify-center group">
                                <span className="text-2xl text-white/50 group-hover:text-white transition-colors">{event.desc}</span>
                            </GlassHexagon>
                        </div>
                    ))}
                </div>

                {/* Information Card (Notion) */}
                <div className="max-w-3xl mx-auto glass-panel rounded-2xl p-8 border-white/5">
                    <h3 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4 inline-block">Notion</h3>
                    <ul className="space-y-3 text-gray-400 list-disc list-inside text-sm md:text-base leading-relaxed">
                        <li>이달의 이벤트 도안은 한정기간 동안만 진행됩니다.</li>
                        <li>예약 마감 시 조기 종료 될 수 있습니다.</li>
                        <li>갤러리 이미지는 참고용이며 동일한 결과를 보장하지 않습니다.</li>
                        <li>피부상태·부위·에이징에 따라 표현이 달라질 수 있습니다.</li>
                    </ul>
                </div>
            </div>
        </section>
    );
}
