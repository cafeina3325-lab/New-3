/**
 * 랜딩 페이지 - 이벤트(Event) 메인 라우트 컴포넌트
 * 
 * 현재 진행 중이거나 예정된 기획성 이벤트, 게스트 워크, 전시 등의 포스터(이미지)를 카드 형태로 나열하여
 * 방문자에게 소식을 전하는 페이지입니다.
 * - 서버 API(`/api/event`)를 호출하여 관리자가 등록한 이벤트 데이터를 렌더링
 * - 카드를 클릭하면 상세 보기 모달(`EventDetailModal`)을 오픈
 */

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import EventDetailModal from "@/components/modals/EventDetailModal";

export default function EventPage() {
    const [events, setEvents] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedEvent, setSelectedEvent] = useState<any | null>(null);

    useEffect(() => {
        // 백엔드 이벤트 목록 데이터 페칭
        const fetchEvents = async () => {
            try {
                const res = await fetch("/api/event");
                if (res.ok) {
                    const data = await res.json();
                    setEvents(data.items || []);
                }
            } catch (error) {
                console.error("Failed to load events", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchEvents();
    }, []);

    return (
        <main className="pt-[120px] xs:pt-[140px] sm:pt-[160px] md:pt-[200px] lg:pt-[220px] xl:pt-[240px] pb-10 xs:pb-12 sm:pb-16 md:pb-20 lg:pb-24 min-h-screen bg-[#1C1310] text-[#F3EBE1]">
            <div className="max-w-[1600px] mx-auto px-2 xs:px-3 sm:px-4 md:px-6">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-12 md:mb-16 text-center text-white font-serif tracking-tight">Event</h1>

                {!isLoading && (
                    <>
                        {events.length === 0 ? (
                            // 이벤트가 등록되지 않았을 때의 대체 UI (Empty State)
                            <div className="animate-fade-in">
                                <div className="flex flex-col items-center justify-center py-16 xs:py-20 sm:py-24 md:py-28 lg:py-32 glass-panel rounded-xl xs:rounded-2xl sm:rounded-3xl border border-white/5 border-dashed bg-white/[0.02]">
                                    <div className="w-16 h-16 xs:w-20 xs:h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 xs:mb-8 text-gray-600">
                                        <svg className="w-8 h-8 xs:w-10 xs:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                        </svg>
                                    </div>
                                    <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">진행 중인 이벤트가 없습니다</h3>
                                    <p className="text-gray-500 text-sm md:text-base text-center max-w-md leading-relaxed px-6">
                                        현재 예정된 이벤트나 전시 소식이 없습니다.<br />
                                        새로운 소식이 있으면 가장 먼저 이곳에 업데이트하겠습니다.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            // 등록된 이벤트 카드 그리드 라인
                            <div className="grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-5 lg:gap-8 xl:gap-10 animate-fade-in">
                                {events.map((event) => (
                                    <div
                                        key={event.id}
                                        onClick={() => setSelectedEvent(event)}
                                        className="group relative aspect-[4/5] w-full rounded-2xl border border-white/10 overflow-hidden bg-black cursor-pointer hover:border-white/30 transition-all duration-500 shadow-2xl"
                                    >
                                        {/* 이벤트 포스터 배경 이미지 (Next.js Image 대신 네이티브 img 사용하여 예외 방어) */}
                                        {event.imageUrl ? (
                                            <img
                                                src={event.imageUrl}
                                                alt={event.title || "이벤트 이미지"}
                                                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 bg-white/5 flex items-center justify-center">
                                                <span className="text-gray-600 italic">No Image</span>
                                            </div>
                                        )}

                                        {/* 마우스 오버(호버) 시 어두워지는 레이어 및 상세 조회 버튼 효과 유도 */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500"></div>

                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                            <div className="px-6 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white font-bold text-xs uppercase tracking-widest shadow-2xl">
                                                View Details
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* 개별 이벤트 상세 내용 표출용 모달 */}
            <EventDetailModal
                event={selectedEvent}
                onClose={() => setSelectedEvent(null)}
            />
        </main>
    );
}
