/**
 * 관리자 전용 예약 상세 조회 모달(AppointmentDetailModal) 컴포넌트
 * 
 * 관리자 대시보드 내 예약 테이블에서 특정 예약 건을 클릭했을 때 나타나는 팝업 창입니다.
 * 예약자의 기본 정보(이름, 연락처)부터 신청한 타투 장르, 부위, 첨부 이미지,
 * 추가 문의사항 등 접수된 모든 세부 내역을 렌더링하고 상태(확정/취소)를 변경할 수 있는 콘솔을 제공합니다.
 */

"use client";

import React from "react";

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
    referenceReviewId?: string;       // 고객이 참고용으로 기재한 이전 리뷰 ID
    referenceText?: string;           // 추가적인 요청/참고사항 텍스트 영역
    source?: string | null;           // 유입 채널(event, gallery 등)
    files?: string[];                 // 고객이 업로드한 시안 이미지 경로 배열
    status: 'pending' | 'confirmed' | 'cancelled';
    createdAt?: string;
}

interface AppointmentDetailModalProps {
    isOpen: boolean;                                      // 모달 렌더링 스위치
    appointment: Appointment | null;                      // 조회 대상이 되는 예약 상세 객체

    onClose: () => void;
    onStatusChange?: (id: string, status: 'pending' | 'confirmed' | 'cancelled') => void;
    onDelete?: (id: string) => void;
}

const STATUS_LABELS = {
    pending: { text: '대기 중', class: 'text-yellow-500 bg-yellow-500/10' },
    confirmed: { text: '확정됨', class: 'text-green-500 bg-green-500/10' },
    cancelled: { text: '취소됨', class: 'text-red-500 bg-red-500/10' },
};

export default function AppointmentDetailModal({ isOpen, appointment, onClose, onStatusChange, onDelete }: AppointmentDetailModalProps) {
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
                    {/* 첫 번째 섹션: 요약 및 상태 */}
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
                        </div>
                        <span className={`px-4 py-1.5 rounded-full text-xs font-bold leading-none shrink-0 ml-2 ${STATUS_LABELS[appointment.status].class}`}>
                            {STATUS_LABELS[appointment.status].text}
                        </span>
                    </div>

                    {/* 두 번째 섹션: 고객 및 연결 정보 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                        <div className="space-y-4">
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
                        </div>
                        <div className="flex flex-col justify-start items-start md:items-end mt-2 md:mt-0">
                            <span className="block text-[10px] md:text-xs text-gray-500 mb-2 uppercase tracking-wider font-bold">참고 리뷰 ID</span>
                            {appointment.referenceReviewId ? (
                                <span className="inline-block px-3 py-1.5 bg-white/5 rounded-xl border border-white/10 text-gray-300 font-mono text-xs">
                                    {appointment.referenceReviewId}
                                </span>
                            ) : (
                                <span className="text-gray-600 text-xs italic">없음</span>
                            )}
                        </div>

                        {/* 예약 시간 정보 (중요 정보로 추가 유지) */}
                        <div className="col-span-1 md:col-span-2 grid grid-cols-2 gap-6 pt-2">
                            <div>
                                <span className="block text-[10px] md:text-xs text-gray-500 mb-1 uppercase tracking-wider font-bold">예약 일자</span>
                                <span className="text-white font-medium text-sm md:text-base">{appointment.date}</span>
                            </div>
                            <div>
                                <span className="block text-[10px] md:text-xs text-gray-500 mb-1 uppercase tracking-wider font-bold">예약 시간</span>
                                <span className="text-white font-medium text-sm md:text-base">{appointment.time}</span>
                            </div>
                        </div>
                    </div>

                    {/* 세 번째 섹션: 시각 자료 및 작업 상세 */}
                    <div className="space-y-6 pt-4 border-t border-white/5">
                        {/* 첨부 이미지 */}
                        <div>
                            <span className="block text-[10px] text-gray-500 mb-3 uppercase tracking-wider font-bold">첨부 이미지</span>
                            {appointment.files && appointment.files.length > 0 ? (
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {appointment.files.map((file, index) => (
                                        <div key={index} className="relative aspect-square rounded-xl overflow-hidden border border-white/10 bg-black/50 group">
                                            <img
                                                src={file}
                                                alt={`첨부 이미지 ${index + 1}`}
                                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                            />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="h-20 flex items-center justify-center rounded-xl border border-dashed border-white/10 bg-white/[0.02]">
                                    <span className="text-gray-600 text-xs italic">첨부된 이미지가 없습니다.</span>
                                </div>
                            )}
                        </div>

                        {/* 장르 및 부위 */}
                        <div className="grid grid-cols-2 gap-6 bg-white/[0.02] p-4 rounded-2xl border border-white/5">
                            <div>
                                <span className="block text-[10px] text-gray-500 mb-1 uppercase tracking-wider font-bold">장르</span>
                                <span className="text-white font-bold text-sm">{appointment.genre || "-"}</span>
                            </div>
                            <div>
                                <span className="block text-[10px] text-gray-500 mb-1 uppercase tracking-wider font-bold">부위</span>
                                <span className="text-white font-bold text-sm">{appointment.part || "-"}</span>
                            </div>
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
                    {appointment.status === 'pending' && onStatusChange && (
                        <button
                            onClick={() => {
                                onStatusChange(appointment.id, 'confirmed');
                                onClose();
                            }}
                            className="px-6 py-2.5 bg-green-900 border border-green-700/50 text-white rounded-lg hover:bg-green-800 transition-colors text-sm font-medium"
                        >
                            예약 확정
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
                            예약 취소
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

                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium ml-2"
                    >
                        닫기
                    </button>
                </div>
            </div>
        </div>
    );
}
