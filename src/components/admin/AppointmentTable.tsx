/**
 * 관리자 시스템 - 진입/예약 목록 테이블(AppointmentTable) 컴포넌트
 * 
 * 고객들이 남긴 예약 정보(시간, 연락처, 희망 도안 등)를 테이블 목록 형태로 표시하고,
 * 각 예약 건에 대한 상태(대기, 확정, 취소) 변경 및 데이터 삭제 작업을 수행합니다.
 * "상세보기" 클릭 시 연동된 `AppointmentDetailModal`을 띄워 전체 정보를 확인합니다.
 * "배정" 클릭 시 스태프 선택 모달을 띄워 해당 예약을 특정 스태프에게 배정합니다.
 */

"use client";

import { useState, useEffect } from "react";
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
    assignedTo?: string | null;  // 배정된 스태프 이름
    createdAt?: string;         // 데이터 생성/업데이트 타임스탬프
}

// 스태프 계정 인터페이스
interface StaffAccount {
    id: string;
    username: string;
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


export default function AppointmentTable({ appointments, onStatusChange, onDelete, onAssign, isStaffView = false }: {
    appointments: Appointment[];
    onStatusChange?: (id: string, status: 'pending' | 'confirmed' | 'cancelled', assignedTo?: string | null) => void;
    onDelete?: (id: string) => void;
    onAssign?: (id: string, staffName: string) => void;
    isStaffView?: boolean;
}) {
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

    // 배정 모달 상태
    const [assignModalOpen, setAssignModalOpen] = useState(false);
    const [assignTarget, setAssignTarget] = useState<Appointment | null>(null);
    const [staffList, setStaffList] = useState<StaffAccount[]>([]);
    const [staffLoading, setStaffLoading] = useState(false);
    const [selectedStaff, setSelectedStaff] = useState<string>("");
    const [assigning, setAssigning] = useState(false);

    const getSourceInfo = (apt: Appointment) => {
        if (apt.source === 'event') return SOURCE_LABELS.event;
        if (apt.source === 'gallery') return SOURCE_LABELS.gallery;
        return SOURCE_LABELS.normal;
    };

    // 스태프 목록 로드
    const fetchStaffList = async () => {
        setStaffLoading(true);
        try {
            const res = await fetch("/api/admin/accounts");
            if (res.ok) {
                const data = await res.json();
                setStaffList(data.staffs || []);
            }
        } catch (error) {
            console.error("스태프 목록 로딩 실패:", error);
        } finally {
            setStaffLoading(false);
        }
    };

    // 배정 버튼 클릭
    const handleAssignClick = (apt: Appointment) => {
        setAssignTarget(apt);
        setSelectedStaff("");
        setAssignModalOpen(true);
        fetchStaffList();
    };

    // 배정 확인
    const handleAssignConfirm = async () => {
        if (!assignTarget || !selectedStaff) return;
        setAssigning(true);

        try {
            const staffName = staffList.find(s => s.id === selectedStaff)?.username || "스태프";

            // API로 상태 변경 + assignedTo 저장 (배정 시에는 확정이 아니므로 pending 유지)
            const res = await fetch("/api/appointments", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: assignTarget.id,
                    status: "pending",
                    assignedTo: staffName,
                }),
            });

            if (res.ok) {
                // 부모 컴포넌트에 상태 변경 알림
                if (onStatusChange) {
                    onStatusChange(assignTarget.id, 'pending');
                }
                // 로컬 상태 업데이트: assignedTo 반영
                if (onAssign) {
                    onAssign(assignTarget.id, staffName);
                }
                alert(`예약 ${assignTarget.id}이(가) ${staffName}에게 배정되었습니다.`);
            } else {
                alert("배정 처리에 실패했습니다.");
            }

            setAssignModalOpen(false);
            setAssignTarget(null);
        } catch (error) {
            console.error("배정 실패:", error);
            alert("배정 처리 중 오류가 발생했습니다.");
        } finally {
            setAssigning(false);
        }
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
                                            <div className="flex flex-col gap-1 items-center justify-center">
                                                {!isStaffView ? (
                                                    // 어드민 뷰: 상태와 계정 UI 통합
                                                    apt.assignedTo ? (
                                                        <span className={`text-xs px-3 py-1 rounded-full font-bold inline-block min-w-[70px] text-center ${STATUS_LABELS[apt.status].class}`}>
                                                            👤 {apt.assignedTo}
                                                        </span>
                                                    ) : (
                                                        <span className={`text-xs px-3 py-1 rounded-full font-bold inline-block min-w-[70px] text-center ${STATUS_LABELS.pending.class}`}>
                                                            {STATUS_LABELS.pending.text}
                                                        </span>
                                                    )
                                                ) : (
                                                    // 스태프 뷰: 기존 상태 뱃지 유지 (계정명은 숨김)
                                                    <span className={`text-xs px-3 py-1 rounded-full font-bold inline-block min-w-[70px] text-center ${STATUS_LABELS[apt.status].class}`}>
                                                        {STATUS_LABELS[apt.status].text}
                                                    </span>
                                                )}
                                            </div>
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
                                                    {isStaffView ? (
                                                        // 스태프 전용 뷰: 확정 / 취소 버튼만 노출
                                                        <>
                                                            {apt.status === 'confirmed' && onStatusChange && (
                                                                <button
                                                                    onClick={() => {
                                                                        if (window.confirm("예약 확정을 취소하시겠습니까? (대기 중 상태로 변경됩니다)")) {
                                                                            onStatusChange(apt.id, 'pending');
                                                                        }
                                                                    }}
                                                                    className="px-3 py-1.5 text-xs font-bold hover:bg-yellow-500/10 rounded-lg text-gray-400 hover:text-yellow-500 transition-colors"
                                                                >
                                                                    확정 취소
                                                                </button>
                                                            )}
                                                            {apt.status === 'pending' && onStatusChange && (
                                                                <button
                                                                    onClick={() => {
                                                                        if (window.confirm("예약을 확정하시겠습니까?")) {
                                                                            onStatusChange(apt.id, 'confirmed');
                                                                        }
                                                                    }}
                                                                    className="px-3 py-1.5 text-xs font-bold bg-green-500/10 hover:bg-green-500/20 rounded-lg text-green-500 transition-colors"
                                                                >
                                                                    확정
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
                                                        </>
                                                    ) : (
                                                        // 기본 관리자 뷰 로직 유지
                                                        <>
                                                            {/* 배정 버튼: 배정된 스태프가 없을 때 노출 */}
                                                            {!apt.assignedTo && onStatusChange && (
                                                                <button
                                                                    onClick={() => handleAssignClick(apt)}
                                                                    className="px-3 py-1.5 text-xs font-bold hover:bg-blue-500/10 rounded-lg text-gray-400 hover:text-blue-400 transition-colors"
                                                                >
                                                                    배정
                                                                </button>
                                                            )}
                                                            {/* 배정 취소 버튼: 이미 배정된 스태프가 있을 때 노출 */}
                                                            {apt.assignedTo && onStatusChange && (
                                                                <button
                                                                    onClick={() => {
                                                                        if (window.confirm("배정을 취소하시겠습니까? (대기 중 상태로 변경되며 스태프 목록에서 제거됩니다)")) {
                                                                            onStatusChange(apt.id, 'pending', null);
                                                                        }
                                                                    }}
                                                                    className="px-3 py-1.5 text-xs font-bold hover:bg-yellow-500/10 rounded-lg text-gray-400 hover:text-yellow-500 transition-colors"
                                                                >
                                                                    배정 취소
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
                                                        </>
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
                isStaffView={isStaffView}
                onClose={() => setSelectedAppointment(null)}
                onStatusChange={onStatusChange}
                onAssign={handleAssignClick}
            />

            {/* 스태프 배정 모달 */}
            {assignModalOpen && assignTarget && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setAssignModalOpen(false)} />
                    <div className="relative w-full max-w-md bg-[#1a1412] border border-white/10 rounded-2xl shadow-2xl p-6 sm:p-8">
                        <button
                            onClick={() => setAssignModalOpen(false)}
                            className="absolute top-4 right-4 p-2 text-white/50 hover:text-white transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>

                        <h2 className="text-xl font-bold text-white mb-2">👤 스태프 배정</h2>
                        <p className="text-sm text-gray-400 mb-6 border-b border-white/5 pb-4">
                            예약 <span className="text-orange-400 font-mono">{assignTarget.id}</span> — {assignTarget.clientName} ({assignTarget.date})
                        </p>

                        {staffLoading ? (
                            <div className="py-12 text-center text-gray-500">스태프 목록 로딩 중...</div>
                        ) : staffList.length === 0 ? (
                            <div className="py-12 text-center text-gray-500">등록된 스태프 계정이 없습니다.</div>
                        ) : (
                            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                                {staffList.map((staff) => (
                                    <button
                                        key={staff.id}
                                        onClick={() => setSelectedStaff(staff.id)}
                                        className={`w-full flex items-center gap-3 p-4 rounded-xl border transition-all text-left
                                            ${selectedStaff === staff.id
                                                ? "bg-red-950/40 border-red-900/60 text-white"
                                                : "bg-white/5 border-white/5 text-gray-300 hover:bg-white/10 hover:border-white/20"
                                            }`}
                                    >
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0
                                            ${selectedStaff === staff.id ? "bg-red-900/60 text-white" : "bg-white/10 text-gray-400"}`}>
                                            {staff.username.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="font-bold text-sm">{staff.username}</div>
                                            <div className="text-xs text-gray-500">Staff</div>
                                        </div>
                                        {selectedStaff === staff.id && (
                                            <div className="ml-auto text-red-400">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}

                        <div className="mt-6 pt-4 border-t border-white/5 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setAssignModalOpen(false)}
                                className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors text-sm font-medium"
                            >
                                취소
                            </button>
                            <button
                                onClick={handleAssignConfirm}
                                disabled={!selectedStaff || assigning}
                                className="px-8 py-3 bg-red-950/80 hover:bg-red-900 text-white rounded-lg transition-colors text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {assigning ? "처리 중..." : "배정하기"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
