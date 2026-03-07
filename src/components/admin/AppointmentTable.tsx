/**
 * 관리자 시스템 - 진입/예약 목록 테이블(AppointmentTable) 컴포넌트
 * 
 * 고객들이 남긴 예약 정보(시간, 연락처, 희망 도안 등)를 테이블 목록 형태로 표시하고,
 * 각 예약 건에 대한 상태(대기, 확정, 취소) 변경 및 데이터 삭제 작업을 수행합니다.
 * "상세보기" 클릭 시 연동된 `AppointmentDetailModal`을 띄워 전체 정보를 확인합니다.
 */

"use client";

import { useState } from "react";
// [참고] 상대 경로에 위치한 모달 레이어 컴포넌트를 가져옵니다.
import AppointmentDetailModal from "./AppointmentDetailModal";

// 개별 예약 객체의 데이터 속성 매핑을 위한 타입 인터페이스
interface Appointment {
    id: string;
    date: string;
    time: string;
    clientName: string;
    service: string;
    contact: string;
    part?: string;
    genre?: string;
    referenceReviewId?: string; // 참조로 남긴 다른 고객 갤러리/리뷰 아이디
    referenceText?: string;     // 참조 사항 텍스트
    source?: string | null;     // 유입 경로 (이벤트 등)
    files?: string[];           // 첨부 도안 이미지
    status: 'pending' | 'confirmed' | 'cancelled';
    createdAt?: string;         // 데이터 생성/업데이트 타임스탬프
}

// 뱃지(Badge) 형태의 UI를 구성하기 위한 예약 상태별 색상 테마 및 한글 라벨링 정의
const STATUS_LABELS = {
    pending: { text: '대기 중', class: 'bg-yellow-500/10 text-yellow-500' },
    confirmed: { text: '확정됨', class: 'bg-green-500/10 text-green-500' },
    cancelled: { text: '취소됨', class: 'bg-red-500/10 text-red-500' },
};

// 유입 소스(예: 특별 체험단(event), 갤러리 구경 등)별 렌더링 UI 라벨 정의 
const SOURCE_LABELS: Record<string, { text: string, class: string }> = {
    event: { text: '이벤트', class: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
    gallery: { text: '갤러리', class: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
    normal: { text: '일반', class: 'bg-gray-500/10 text-gray-400 border-gray-500/20' },
};


export default function AppointmentTable({ appointments, onStatusChange, onDelete }: {
    appointments: Appointment[];
    onStatusChange?: (id: string, status: 'pending' | 'confirmed' | 'cancelled') => void;
    onDelete?: (id: string) => void;
}) {
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

    const getSourceInfo = (apt: Appointment) => {
        if (apt.source === 'event') return SOURCE_LABELS.event;
        if (apt.source === 'gallery') return SOURCE_LABELS.gallery;
        return SOURCE_LABELS.normal;
    };

    return (
        <>
            <div className="bg-[#140D0B] border border-white/5 rounded-2xl xs:rounded-3xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[700px]">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/5">
                                <th className="p-4 xs:p-6 text-xs md:text-sm font-bold text-gray-400 uppercase tracking-wider">예약 정보</th>
                                <th className="p-4 xs:p-6 text-xs md:text-sm font-bold text-gray-400 uppercase tracking-wider text-center">타입</th>
                                <th className="p-4 xs:p-6 text-xs md:text-sm font-bold text-gray-400 uppercase tracking-wider text-center">리뷰</th>
                                <th className="p-4 xs:p-6 text-xs md:text-sm font-bold text-gray-400 uppercase tracking-wider">상태</th>
                                <th className="p-4 xs:p-6 text-xs md:text-sm font-bold text-gray-400 uppercase tracking-wider text-right">관리</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {appointments.map((apt) => {
                                const sourceInfo = getSourceInfo(apt);
                                return (
                                    <tr key={apt.id} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="p-4 xs:p-6">
                                            <div className="flex items-center gap-2 xs:gap-3">
                                                <div>
                                                    <div className="text-white font-bold text-sm md:text-base">{apt.date}</div>
                                                    <div className="text-xs md:text-sm text-gray-500 mt-1">{apt.time} | {apt.clientName}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 xs:p-6 text-center">
                                            <span className={`text-[10px] md:text-xs px-2.5 py-1 rounded-md font-bold border ${sourceInfo.class}`}>
                                                {sourceInfo.text}
                                            </span>
                                        </td>
                                        <td className="p-4 xs:p-6 text-center">
                                            {apt.referenceReviewId ? (
                                                <span className="text-[10px] md:text-xs font-mono text-orange-400 bg-orange-400/10 px-2 py-0.5 rounded border border-orange-400/20">
                                                    {apt.referenceReviewId}
                                                </span>
                                            ) : (
                                                <span className="text-gray-600">-</span>
                                            )}
                                        </td>
                                        <td className="p-4 xs:p-6">
                                            <span className={`text-xs px-3 py-1 rounded-full font-bold inline-block min-w-[70px] text-center ${STATUS_LABELS[apt.status].class}`}>
                                                {STATUS_LABELS[apt.status].text}
                                            </span>
                                        </td>
                                        <td className="p-4 xs:p-6 text-right">
                                            <div className="flex justify-end items-center space-x-2">
                                                <button
                                                    onClick={() => setSelectedAppointment(apt)}
                                                    className="px-4 py-2 text-xs font-bold bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 transition-colors shrink-0"
                                                >
                                                    상세보기
                                                </button>

                                                {/* 간편 상태 변경 (상시 노출) */}
                                                <div className="flex space-x-2 transition-opacity ml-2">
                                                    {apt.status === 'pending' && onStatusChange && (
                                                        <button
                                                            onClick={() => onStatusChange(apt.id, 'confirmed')}
                                                            className="px-3 py-1.5 text-xs font-bold hover:bg-green-500/10 rounded-lg text-gray-400 hover:text-green-500 transition-colors"
                                                        >
                                                            확정
                                                        </button>
                                                    )}
                                                    {apt.status === 'confirmed' && onStatusChange && (
                                                        <button
                                                            onClick={() => {
                                                                if (window.confirm("확정을 취소하시겠습니까? (대기 중 상태로 변경됩니다)")) {
                                                                    onStatusChange(apt.id, 'pending');
                                                                }
                                                            }}
                                                            className="px-3 py-1.5 text-xs font-bold hover:bg-yellow-500/10 rounded-lg text-gray-400 hover:text-yellow-500 transition-colors"
                                                        >
                                                            확정 취소
                                                        </button>
                                                    )}
                                                    {apt.status !== 'cancelled' && onStatusChange && (
                                                        <button
                                                            onClick={() => {
                                                                if (window.confirm("예약을 취소하시겠습니까?")) {
                                                                    onStatusChange(apt.id, 'cancelled');
                                                                }
                                                            }}
                                                            className="px-3 py-1.5 text-xs font-bold hover:bg-red-500/10 rounded-lg text-gray-400 hover:text-red-500 transition-colors"
                                                        >
                                                            취소
                                                        </button>
                                                    )}

                                                    {onDelete && (
                                                        <button
                                                            onClick={() => {
                                                                if (window.confirm("이 예약 기록을 완전히 삭제하시겠습니까?")) {
                                                                    onDelete(apt.id);
                                                                }
                                                            }}
                                                            className="px-3 py-1.5 text-xs font-bold hover:bg-red-900/30 rounded-lg text-red-500 hover:text-red-400 transition-colors ml-2"
                                                        >
                                                            삭제
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                {appointments.length === 0 && (
                    <div className="p-20 text-center text-gray-500">
                        예약 데이터가 없습니다.
                    </div>
                )}
            </div>

            <AppointmentDetailModal
                isOpen={!!selectedAppointment}
                appointment={selectedAppointment}
                onClose={() => setSelectedAppointment(null)}
                onStatusChange={onStatusChange}
            />
        </>
    );
}
