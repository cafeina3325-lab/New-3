/**
 * 관리자 전용 예약 상세 조회 모달(AppointmentDetailModal) 컴포넌트
 * 
 * 관리자 대시보드 내 예약 테이블에서 특정 예약 건을 클릭했을 때 나타나는 팝업 창입니다.
 * 예약자의 기본 정보(이름, 연락처)부터 신청한 타투 장르, 부위, 첨부 이미지,
 * 추가 문의사항 등 접수된 모든 세부 내역을 렌더링하고 상태(확정/취소)를 변경할 수 있는 콘솔을 제공합니다.
 */

"use client";

import React, { useState, useEffect } from "react";
import ReviewDetailModal from "./ReviewDetailModal";
import EventDetailModal from "@/components/modals/EventDetailModal";
import GalleryDetailModal from "@/components/modals/GalleryDetailModal";

// 예약 상세 내역 표시 및 상태 업데이트를 관장하는 커스텀 타입
interface Appointment {
    id: string;
    date: string;
    time: string;
    clientName: string;
    service: string;
    contact: string;
    gender?: 'male' | 'female' | null;
    part?: string;
    genre?: string;
    referenceReviewId?: string;
    referenceText?: string;
    source?: string | null;
    sourceId?: string | null;
    files?: string[];
    status: 'pending' | 'confirmed' | 'cancelled' | 'holiday';
    assignedTo?: string | null; // 배정 정보 추가
    createdAt?: string;
}

interface AppointmentDetailModalProps {
    isOpen: boolean;
    appointment: Appointment | null;
    isStaffView?: boolean; // 추가

    onClose: () => void;
    onStatusChange?: (id: string, status: 'pending' | 'confirmed' | 'cancelled' | 'holiday', assignedTo?: string | null) => void;
    onDelete?: (id: string) => void;
    onAssign?: (apt: Appointment) => void;
}

const STATUS_LABELS = {
    pending: { text: '대기 중', class: 'text-yellow-500 bg-yellow-500/10' },
    confirmed: { text: '확정됨', class: 'text-green-500 bg-green-500/10' },
    cancelled: { text: '취소됨', class: 'text-red-500 bg-red-500/10' },
    holiday: { text: '정기 휴무', class: 'text-purple-500 bg-purple-500/10' },
};

export default function AppointmentDetailModal({ isOpen, appointment, isStaffView = false, onClose, onStatusChange, onDelete, onAssign }: AppointmentDetailModalProps) {
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
    const [selectedGalleryItem, setSelectedGalleryItem] = useState<any | null>(null);

    const [showEventModal, setShowEventModal] = useState(false);
    const [showGalleryModal, setShowGalleryModal] = useState(false);

    // source가 event 또는 gallery인 경우 → 원본 게시물 클릭 가능 여부
    const hasSourcePost = appointment?.source === 'event' || appointment?.source === 'gallery';

    // 원본 게시물 데이터를 미리 로드 (sourceId 또는 이미지 URL로 매칭)
    useEffect(() => {
        if (!isOpen || !appointment) return;
        if (appointment.source !== 'event' && appointment.source !== 'gallery') return;

        // 모달이 다시 열릴 때 이전 데이터 초기화
        setSelectedEvent(null);
        setSelectedGalleryItem(null);
        setShowEventModal(false);
        setShowGalleryModal(false);

        const fetchData = async () => {
            try {
                if (appointment.source === 'event') {
                    const res = await fetch(`/api/event`);
                    if (res.ok) {
                        const data = await res.json();
                        let event = null;
                        // 1순위: sourceId로 매칭
                        if (appointment.sourceId) {
                            event = data.items?.find((item: any) => item.id === appointment.sourceId);
                        }
                        // 2순위: 이미지 URL로 매칭 (sourceId가 없는 이전 예약 데이터 대응)
                        if (!event && appointment.files && appointment.files.length > 0) {
                            event = data.items?.find((item: any) => 
                                appointment.files?.some((file: string) => file === item.imageUrl)
                            );
                        }
                        if (event) setSelectedEvent(event);
                    }
                } else if (appointment.source === 'gallery') {
                    const res = await fetch(`/api/gallery`);
                    if (res.ok) {
                        const data = await res.json();
                        let galleryItem = null;
                        // 1순위: sourceId로 매칭
                        if (appointment.sourceId) {
                            galleryItem = data.items?.find((item: any) => item.id === appointment.sourceId);
                        }
                        // 2순위: 이미지 URL로 매칭
                        if (!galleryItem && appointment.files && appointment.files.length > 0) {
                            galleryItem = data.items?.find((item: any) => 
                                appointment.files?.some((file: string) => file === item.imageUrl)
                            );
                        }
                        if (galleryItem) setSelectedGalleryItem(galleryItem);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch source data", error);
            }
        };

        fetchData();
    }, [isOpen, appointment]);

    if (!isOpen || !appointment) return null;


    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-pointer"
                onClick={onClose}
            />

            {/* Modal */}
            <div
                className="relative w-full max-w-lg bg-[#1a1412] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 md:p-6 border-b border-white/10 bg-white/5">
                    <h2 className="text-xl md:text-2xl font-bold text-white">예약 상세 정보</h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-white/50 hover:text-white bg-black/40 rounded-full hover:bg-black/60 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 md:p-6 space-y-6 md:space-y-8 max-h-[70vh] overflow-y-auto">
                    {/* 첫 번째 섹션: 요약, 타입, 참고 리뷰 */}
                    <div className="flex items-center justify-between pb-3 md:pb-4 border-b border-white/10">
                        <div className="flex items-center gap-4">
                            <div>
                                <span className="text-[10px] md:text-xs text-gray-500 font-mono uppercase tracking-wider block">예약 ID</span>
                                <div className="text-white font-mono text-xs md:text-sm mt-0.5">{appointment.id}</div>
                            </div>
                            <div className="h-6 w-px bg-white/10 mx-2" />
                            <div>
                                <span className="text-[10px] md:text-xs text-gray-500 font-mono uppercase tracking-wider block">예약 타입</span>
                                <div className="mt-0.5">
                                    <span className="text-xs px-2 py-0.5 rounded bg-white/5 border border-white/10 text-gray-300">
                                        {appointment.source === 'event' ? "이벤트" : appointment.source === 'gallery' ? "갤러리" : "일반"}
                                    </span>
                                </div>
                            </div>
                            <div className="h-6 w-px bg-white/10 mx-2" />
                            <div>
                                <span className="text-[10px] md:text-xs text-gray-500 font-mono uppercase tracking-wider block">참고 리뷰</span>
                                <div className="mt-0.5">
                                    {appointment.referenceReviewId ? (
                                        <button
                                            onClick={() => setIsReviewModalOpen(true)}
                                            className="inline-block px-2 py-0.5 bg-white/5 hover:bg-white/10 rounded-md border border-white/10 text-orange-400 hover:text-orange-300 font-mono text-xs transition-colors group/review"
                                        >
                                            {appointment.referenceReviewId}
                                            <span className="ml-1 opacity-0 group-hover/review:opacity-100 transition-opacity">↗</span>
                                        </button>
                                    ) : (
                                        <span className="text-gray-600 text-xs italic">없음</span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <span className={`px-4 py-1.5 rounded-full text-xs font-bold leading-none shrink-0 ml-2 ${STATUS_LABELS[appointment.status].class}`}>
                            {appointment.assignedTo ? `👤 ${appointment.assignedTo}` : STATUS_LABELS[appointment.status].text}
                        </span>
                    </div>

                    {/* 두 번째 섹션: 고객 정보 */}
                    <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                        <div className="flex items-end gap-3">
                            <div>
                                <span className="block text-[10px] md:text-xs text-gray-500 mb-1 uppercase tracking-wider font-bold">고객명</span>
                                <span className="text-white font-bold text-lg leading-none">{appointment.clientName}</span>
                            </div>
                            <div className="mb-[2px]">
                                <span className="px-2 py-0.5 rounded-md bg-[#22c55e]/10 border border-[#22c55e]/20 text-[#22c55e] text-[10px] font-bold">
                                    {appointment.gender === 'male' ? "남성" : appointment.gender === 'female' ? "여성" : "미지정"}
                                </span>
                            </div>
                        </div>
                        <div>
                            <span className="block text-[10px] md:text-xs text-gray-500 mb-1 uppercase tracking-wider font-bold">연락처</span>
                            <span className="text-[#D4C4BD] font-medium text-sm md:text-base">{appointment.contact}</span>
                        </div>
                        <div>
                            <span className="block text-[10px] md:text-xs text-gray-500 mb-1 uppercase tracking-wider font-bold">장르</span>
                            <span className="text-white font-bold text-sm">{appointment.genre || "-"}</span>
                        </div>
                        <div>
                            <span className="block text-[10px] md:text-xs text-gray-500 mb-1 uppercase tracking-wider font-bold">부위</span>
                            <span className="text-white font-bold text-sm">{appointment.part || "-"}</span>
                        </div>
                        <div>
                            <span className="block text-[10px] md:text-xs text-gray-500 mb-1 uppercase tracking-wider font-bold">상담희망 일시</span>
                            <span className="text-white font-bold text-sm">{appointment.date} {appointment.time}</span>
                        </div>
                    </div>

                    {/* 세 번째 섹션: 시각 자료 및 작업 상세 */}
                    <div className="space-y-6 pt-4 border-t border-white/5">
                        {/* 첨부 이미지 */}
                        <div>
                            <div className="flex justify-between items-center mb-3">
                                <span className="block text-[10px] text-gray-500 uppercase tracking-wider font-bold">첨부 이미지</span>
                                {hasSourcePost && (
                                    <span className="text-[10px] text-orange-400 font-bold animate-pulse">
                                        💡 이미지를 클릭하면 원본 게시물을 확인합니다
                                    </span>
                                )}
                            </div>
                            {appointment.files && appointment.files.length > 0 ? (
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {appointment.files.map((file, index) => (
                                        <div 
                                            key={index} 
                                            className={`relative aspect-square rounded-xl overflow-hidden border border-white/10 bg-black/50 group ${hasSourcePost ? 'cursor-pointer' : ''}`}
                                            onClick={() => {
                                                if (appointment.source === 'event') {
                                                    setShowEventModal(true);
                                                } else if (appointment.source === 'gallery') {
                                                    setShowGalleryModal(true);
                                                }
                                            }}
                                        >
                                            <img
                                                src={file}
                                                alt={`첨부 이미지 ${index + 1}`}
                                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                            />
                                            {hasSourcePost && (
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <span className="text-white text-[10px] font-bold px-2 py-1 bg-white/20 rounded-full backdrop-blur-sm">원본 보기</span>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="h-20 flex items-center justify-center rounded-xl border border-dashed border-white/10 bg-white/[0.02]">
                                    <span className="text-gray-600 text-xs italic">첨부된 이미지가 없습니다.</span>
                                </div>
                            )}
                        </div>



                        {/* 참고 내용 (추가 유지) */}
                        {appointment.referenceText && (
                            <div>
                                <span className="block text-[10px] text-gray-500 mb-2 uppercase tracking-wider font-bold">참고 내용</span>
                                <div className="p-3 bg-black/40 rounded-xl border border-white/5 text-gray-400 text-xs whitespace-pre-wrap leading-relaxed">
                                    {appointment.referenceText}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* 네 번째 섹션: 접수 정보 */}
                    <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                        <span className="text-[10px] md:text-xs text-gray-500 uppercase tracking-wider font-bold">접수 일시</span>
                        <span className="text-gray-500 text-xs text-right mt-1">
                            {appointment.createdAt ? new Date(appointment.createdAt).toLocaleString('ko-KR') : "-"}
                        </span>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-4 md:p-6 border-t border-white/10 bg-white/[0.02] flex flex-wrap justify-end gap-3">
                    {!isStaffView ? (
                        /* 관리자 전용 푸터 */
                        <>
                            {/* 배정 버튼 (배정되지 않았을 때) */}
                            {!appointment.assignedTo && onAssign && (
                                <button
                                    onClick={() => {
                                        onAssign(appointment);
                                        onClose();
                                    }}
                                    className="px-6 py-2.5 bg-blue-900 border border-blue-700/50 text-white rounded-lg hover:bg-blue-800 transition-colors text-sm font-medium"
                                >
                                    배정
                                </button>
                            )}

                            {/* 배정 취소 버튼 (이미 배정되었을 때) */}
                            {appointment.assignedTo && onStatusChange && (
                                <button
                                    onClick={() => {
                                        if (window.confirm("배정을 취소하시겠습니까? (대기 중 상태로 변경되며 스태프 목록에서 제거됩니다)")) {
                                            onStatusChange(appointment.id, 'pending', null);
                                            onClose();
                                        }
                                    }}
                                    className="px-6 py-2.5 bg-yellow-900 border border-yellow-700/50 text-white rounded-lg hover:bg-yellow-800 transition-colors text-sm font-medium"
                                >
                                    배정 취소
                                </button>
                            )}

                            {/* 취소 버튼 (기존 예약 취소) */}
                            {appointment.status !== 'cancelled' && onStatusChange && (
                                <button
                                    onClick={() => {
                                        if (window.confirm('예약을 취소하시겠습니까?')) {
                                            onStatusChange(appointment.id, 'cancelled');
                                            onClose();
                                        }
                                    }}
                                    className="px-6 py-2.5 bg-red-950/40 border border-red-900/40 text-red-200 rounded-lg hover:bg-red-900 hover:text-white transition-colors text-sm font-medium"
                                >
                                    취소
                                </button>
                            )}

                            {onDelete && (
                                <button
                                    onClick={() => {
                                        if (window.confirm('이 예약을 목록에서 삭제하시겠습니까? (통계 데이터는 유지됩니다)')) {
                                            onDelete(appointment.id);
                                            onClose();
                                        }
                                    }}
                                    className="px-6 py-2.5 bg-red-900/80 border border-red-700/50 text-white rounded-lg hover:bg-red-800 transition-colors text-sm font-medium ml-2"
                                >
                                    삭제
                                </button>
                            )}
                        </>
                    ) : (
                        /* 스태프 전용 푸터 */
                        <>
                            {appointment.status === 'confirmed' && onStatusChange && (
                                <button
                                    onClick={() => {
                                        if (window.confirm("예약 확정을 취소하시겠습니까? (대기 중 상태로 변경됩니다)")) {
                                            onStatusChange(appointment.id, 'pending');
                                            onClose();
                                        }
                                    }}
                                    className="px-6 py-2.5 bg-yellow-900 border border-yellow-700/50 text-white rounded-lg hover:bg-yellow-800 transition-colors text-sm font-medium"
                                >
                                    확정 취소
                                </button>
                            )}
                            {appointment.status === 'pending' && onStatusChange && (
                                <button
                                    onClick={() => {
                                        if (window.confirm("예약을 확정하시겠습니까?")) {
                                            onStatusChange(appointment.id, 'confirmed');
                                            onClose();
                                        }
                                    }}
                                    className="px-6 py-2.5 bg-green-900 border border-green-700/50 text-white rounded-lg hover:bg-green-800 transition-colors text-sm font-medium"
                                >
                                    확정
                                </button>
                            )}
                            {appointment.status !== 'cancelled' && onStatusChange && (
                                <button
                                    onClick={() => {
                                        if (window.confirm('예약을 취소하시겠습니까?')) {
                                            onStatusChange(appointment.id, 'cancelled');
                                            onClose();
                                        }
                                    }}
                                    className="px-6 py-2.5 bg-red-950/40 border border-red-900/40 text-red-200 rounded-lg hover:bg-red-900 hover:text-white transition-colors text-sm font-medium"
                                >
                                    취소
                                </button>
                            )}
                        </>
                    )}

                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium ml-2"
                    >
                        닫기
                    </button>
                </div>
            </div>

            {/* 참고 리뷰 상세 모달 연동 */}
            <ReviewDetailModal
                isOpen={isReviewModalOpen}
                reviewId={appointment.referenceReviewId || null}
                onClose={() => setIsReviewModalOpen(false)}
            />

            {/* 원본 이벤트 상세 모달 연동 */}
            {showEventModal && selectedEvent && (
                <EventDetailModal
                    event={selectedEvent}
                    onClose={() => setShowEventModal(false)}
                />
            )}
            {showEventModal && !selectedEvent && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-[#1a1412] p-6 rounded-xl border border-white/10 text-white">데이터를 불러오는 중...</div>
                </div>
            )}

            {/* 원본 갤러리 상세 모달 연동 */}
            {showGalleryModal && selectedGalleryItem && (
                <GalleryDetailModal
                    item={selectedGalleryItem}
                    onClose={() => setShowGalleryModal(false)}
                />
            )}
            {showGalleryModal && !selectedGalleryItem && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-[#1a1412] p-6 rounded-xl border border-white/10 text-white">데이터를 불러오는 중...</div>
                </div>
            )}
        </div>
    );
}
