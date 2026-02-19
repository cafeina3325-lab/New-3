import GlassHexagon from "../ui/GlassHexagon";
import Image from "next/image";

export default function SectionC() {
    const events = [
        { id: 1, title: "Event 1", desc: "Limited Edition", image: "https://placehold.co/600x600/1a1a1a/FFF?text=Event+1" },
        { id: 2, title: "Event 2", desc: "Special Offer", image: "https://placehold.co/600x600/2a2a2a/FFF?text=Event+2" },
        { id: 3, title: "Event 3", desc: "New Arrival", image: "https://placehold.co/600x600/333333/FFF?text=Event+3" },
        { id: 4, title: "Event 4", desc: "Artist Collab", image: "https://placehold.co/600x600/444444/FFF?text=Event+4" },
        { id: 5, title: "Event 5", desc: "Seasonal Style", image: "https://placehold.co/600x600/555555/FFF?text=Event+5" },
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
                            <GlassHexagon className="w-[280px] h-[320px] relative group overflow-hidden">
                                {/* Image Background */}
                                <div className="absolute inset-0 z-0">
                                    <Image
                                        src={event.image}
                                        alt={event.title}
                                        fill
                                        className="object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-500 group-hover:scale-110"
                                        unoptimized
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                                </div>

                                {/* Content Overlay */}
                                <div className="absolute inset-0 z-10 flex flex-col justify-end p-8">
                                    <span className="text-xs font-bold text-cyan-400 tracking-wider mb-2 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                                        monthly drop
                                    </span>
                                    <h3 className="text-2xl font-bold text-white mb-1">{event.title}</h3>
                                    <p className="text-sm text-gray-300 transform translate-y-0 group-hover:-translate-y-1 transition-transform duration-300">{event.desc}</p>
                                </div>
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
