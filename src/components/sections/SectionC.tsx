/**
 * 메인 랜딩 페이지 세 번째 섹션(Section C) - 이벤트 쇼케이스
 * 
 * DB에서 최신 한정 기간 이벤트 데이터를 불러와 가로형 스와이프(Snap scroll) 갤러리로 표시합니다.
 * 하단에는 노션 스타일의 유의사항 목록을 렌더링하며, 개별 이벤트를 클릭 시
 * 상세 모달(EventDetailModal)을 오픈합니다.
 */

"use client";

import { useState, useEffect } from "react";
// EventDetailModal은 컴포넌트 하단부가 아닌 상단에 명시적으로 임포트하는 것이 좋습니다.
import EventDetailModal from "@/components/modals/EventDetailModal";

interface EventItem {
    id: string;
    title: string;
    genre: string;
    price: number;
    imageUrl: string;
    createdAt: string;
}

export default function SectionC() {
    const [events, setEvents] = useState<EventItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await fetch('/api/event');
                if (res.ok) {
                    const data = await res.json();
                    setEvents(data.items || []);
                }
            } catch (error) {
                console.error("이벤트 로딩 실패:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    return (
        <section id="section-c" className="py-12 sm:py-16 md:py-20 lg:py-28 bg-[#150E0C] w-full overflow-hidden border-t border-white/5">
            <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
                <div className="text-center mb-8 sm:mb-12 lg:mb-16">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#F3EBE1] mb-3 md:mb-4 lg:mb-5">Event</h2>
                    <p className="text-sm md:text-base lg:text-lg text-gray-400 font-medium tracking-wide word-keep-all">이달의 이벤트 매월 새로운 소식을 전합니다</p>
                </div>

                {/* 가로 스와이프 이벤트 카드 */}
                <div className="flex overflow-x-auto pb-6 sm:pb-10 lg:pb-12 gap-4 sm:gap-6 lg:gap-10 snap-x snap-mandatory scrollbar-hide mb-8 sm:mb-12 lg:mb-14 min-h-[260px] sm:min-h-[340px] lg:min-h-[420px]">
                    {loading ? (
                        Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="flex-shrink-0 w-[240px] sm:w-[280px] md:w-[320px] lg:w-[400px] bg-[#1C1310] rounded-lg overflow-hidden animate-pulse border border-white/5 h-[320px] sm:h-[380px] lg:h-[480px]">
                                <div className="w-full h-full bg-white/5" />
                            </div>
                        ))
                    ) : events.length > 0 ? (
                        events.map((event) => (
                            <div
                                key={event.id}
                                onClick={() => setSelectedEvent(event)}
                                className="flex-shrink-0 w-[240px] sm:w-[280px] md:w-[320px] lg:w-[400px] bg-[#1C1310] rounded-lg overflow-hidden shadow-md snap-center border border-white/5 relative group cursor-pointer h-[320px] sm:h-[380px] lg:h-[480px]"
                            >
                                <div className="w-full h-full relative overflow-hidden">
                                    {event.imageUrl ? (
                                        <img
                                            src={event.imageUrl}
                                            alt={event.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-white/5 flex items-center justify-center text-gray-500 uppercase tracking-wider font-semibold text-xs md:text-sm lg:text-base">
                                            No Image
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="w-full py-10 sm:py-16 lg:py-20 text-center text-gray-500 text-sm md:text-base lg:text-lg font-medium">
                            진행 중인 이벤트가 없습니다.
                        </div>
                    )}
                </div>

                {/* Information Card (Notion) */}
                {/* 유의사항 카드 */}
                <div className="max-w-md sm:max-w-xl md:max-w-2xl lg:max-w-4xl mx-auto bg-[#1C1310] border border-white/10 rounded-lg p-5 sm:p-7 lg:p-10">
                    <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#E5D9D2] tracking-wide mb-4 md:mb-6 border-b border-white/10 pb-2 inline-block">Notion</h3>
                    <ul className="space-y-2 sm:space-y-3 lg:space-y-4 text-gray-400 list-disc list-inside text-sm md:text-base lg:text-lg leading-relaxed word-keep-all">
                        <li>이달의 이벤트 도안은 한정기간 동안만 진행됩니다.</li>
                        <li>예약 마감 시 조기 종료 될 수 있습니다.</li>
                        <li>갤러리 이미지는 참고용이며 동일한 결과를 보장하지 않습니다.</li>
                        <li>피부상태·부위·에이징에 따라 표현이 달라질 수 있습니다.</li>
                    </ul>
                </div>
            </div>

            {/* Event Detail Modal */}
            <EventDetailModal
                event={selectedEvent}
                onClose={() => setSelectedEvent(null)}
            />
        </section>
    );
}
