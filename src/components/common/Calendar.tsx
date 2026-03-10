"use client";

import { useState, useEffect, useMemo } from "react";
import { GENRES, PARTS } from "@/data/constants";

interface Appointment {
    id: string;
    clientName: string;
    date: string;
    time: string;
    status: string;
    service: string;
    assignedTo?: string | null;
}

interface CalendarProps {
    theme?: "admin" | "staff";
}

export default function Calendar({ theme = "admin" }: CalendarProps) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState<string | null>(null);

    // 일정 등록 모달 상태
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        genre: GENRES[0],
        part: PARTS[0],
        date: "",
        timeStart: "10:00",
        timeEnd: "11:00",
    });

    // 시간 슬롯 생성 (10:00 ~ 18:30, 30분 단위)
    const timeSlots = useMemo(() => {
        const slots = [];
        let start = 10 * 60;
        const end = 18 * 60 + 30;
        while (start <= end) {
            const h = Math.floor(start / 60);
            const m = start % 60;
            slots.push(`${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`);
            start += 30;
        }
        return slots;
    }, []);

    // 데이터 패칭
    const fetchAppointments = async () => {
        try {
            const res = await fetch("/api/appointments");
            if (res.ok) {
                const data = await res.json();
                setAppointments(data);
            }
        } catch (error) {
            console.error("Failed to fetch appointments:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchSession = async () => {
            try {
                const res = await fetch("/api/auth/session");
                if (res.ok) {
                    const session = await res.json();
                    if (session?.user?.name) {
                        setCurrentUser(session.user.name);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch session:", error);
            }
        };
        fetchSession();
        fetchAppointments();
    }, []);

    // 달력 날짜 계산 로직
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();

    const monthName = new Intl.DateTimeFormat("ko-KR", { month: "long" }).format(currentDate);

    // 날짜별 예약 그룹화
    const appointmentsByDate = useMemo(() => {
        const group: Record<string, Appointment[]> = {};
        const isAdmin = theme === "admin";

        appointments.forEach((apt) => {
            // 필터링: 상태가 'confirmed'이고 (어드민이면 전체, 스태프면 내 것만)
            const isConfirmed = apt.status === 'confirmed';
            const isMyApp = !isAdmin ? apt.assignedTo === currentUser : true;

            if (isConfirmed && isMyApp) {
                if (!group[apt.date]) group[apt.date] = [];
                group[apt.date].push(apt);
            }
        });
        return group;
    }, [appointments, theme, currentUser]);

    const handlePrevMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
    };

    const handleToday = () => {
        const today = new Date();
        setCurrentDate(today);
        setSelectedDate(today.toISOString().split("T")[0]);
    };

    const isToday = (day: number) => {
        const today = new Date();
        return today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;
    };

    // 일정 등록 모달 열기
    const handleOpenModal = () => {
        setFormData({
            title: "",
            genre: GENRES[0],
            part: PARTS[0],
            date: selectedDate || new Date().toISOString().split("T")[0],
            timeStart: "10:00",
            timeEnd: "11:00",
        });
        setIsModalOpen(true);
    };

    // 일정 등록 제출
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const res = await fetch("/api/appointments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.title || "일정",
                    phone: "-",
                    genre: formData.genre,
                    part: formData.part,
                    date: formData.date,
                    time: `${formData.timeStart}~${formData.timeEnd}`,
                }),
            });

            if (res.ok) {
                alert("일정이 등록되었습니다.");
                setIsModalOpen(false);
                setSelectedDate(formData.date);
                fetchAppointments();
            } else {
                const err = await res.json();
                alert(`등록 실패: ${err.error}`);
            }
        } catch (error) {
            console.error("Submit Error:", error);
            alert("서버 연결에 실패했습니다.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const isAdmin = theme === "admin";
    const accentColor = isAdmin ? "bg-[#C4A484]" : "bg-blue-500";
    const accentBtnBg = isAdmin ? "bg-red-950/80 hover:bg-red-900" : "bg-blue-950/80 hover:bg-blue-900";
    const accentFocus = isAdmin ? "focus:border-red-900/50" : "focus:border-blue-900/50";
    const textColor = isAdmin ? "text-[#F3EBE1]" : "text-[#E1E8F3]";
    const borderColor = "border-white/10";
    const modalBg = isAdmin ? "bg-[#1a1412]" : "bg-[#0F1218]";
    const selectBg = isAdmin ? "bg-[#1a1412]" : "bg-[#0F1218]";

    return (
        <div className={`w-full max-w-5xl mx-auto p-4 md:p-8 ${textColor}`}>
            <div className="flex flex-col lg:flex-row gap-8">
                {/* 캘린더 본체 */}
                <div className="flex-1">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-3xl font-bold tracking-tighter">{year}</h2>
                            <h3 className="text-xl font-medium opacity-60 uppercase">{monthName}</h3>
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={handleToday} className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm hover:bg-white/10 transition-all">Today</button>
                            <button onClick={handlePrevMonth} className="p-2 hover:bg-white/5 rounded-full transition-all">◀</button>
                            <button onClick={handleNextMonth} className="p-2 hover:bg-white/5 rounded-full transition-all">▶</button>
                        </div>
                    </div>

                    <div className="grid grid-cols-7 gap-1 md:gap-2">
                        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                            <div key={day} className="h-10 flex items-center justify-center text-xs font-bold opacity-40 uppercase tracking-widest">{day}</div>
                        ))}

                        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                            <div key={`empty-${i}`} className="aspect-square opacity-0" />
                        ))}

                        {Array.from({ length: daysInMonth }).map((_, i) => {
                            const day = i + 1;
                            const fullDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                            const hasAppointments = appointmentsByDate[fullDate];
                            const isSelected = selectedDate === fullDate;

                            return (
                                <button
                                    key={day}
                                    onClick={() => setSelectedDate(fullDate)}
                                    className={`relative aspect-square rounded-xl border flex flex-col items-center justify-center transition-all group group-hover:bg-white/5
                                        ${borderColor} 
                                        ${isSelected ? "bg-white/10 border-white/30" : "hover:border-white/20"}
                                    `}
                                >
                                    <span className={`text-sm md:text-base font-medium ${isToday(day) ? "text-orange-400 font-bold" : ""}`}>
                                        {day}
                                    </span>
                                    {hasAppointments && (
                                        <div className={`mt-1 flex gap-0.5 justify-center flex-wrap px-1`}>
                                            {hasAppointments.slice(0, 3).map((_, idx) => (
                                                <div key={idx} className={`w-1 h-1 rounded-full ${accentColor}`} />
                                            ))}
                                            {hasAppointments.length > 3 && <div className="w-1 h-1 rounded-full bg-gray-400" />}
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* 상세 내역 필드 */}
                <div className="w-full lg:w-80 flex flex-col">
                    <div className="p-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 h-full flex flex-col min-h-[400px]">
                        <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <span>📅</span>
                            <span>{selectedDate || "날짜를 선택하세요"}</span>
                        </h4>

                        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                            {selectedDate && appointmentsByDate[selectedDate] ? (
                                appointmentsByDate[selectedDate]
                                    .sort((a, b) => a.time.localeCompare(b.time))
                                    .map((apt) => (
                                        <div key={apt.id} className="p-4 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 transition-all border-l-4 border-l-orange-400/50">
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="text-xs font-bold text-orange-400 uppercase tracking-tighter">{apt.time}</span>
                                                <div className="flex flex-col items-end">
                                                    <span className={`text-[10px] px-2 py-0.5 rounded-full mb-1 ${apt.status === "confirmed" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}`}>
                                                        {apt.status === 'confirmed' ? '확정' : '대기'}
                                                    </span>
                                                    {apt.assignedTo && (
                                                        <span className="text-[10px] text-blue-400 font-bold">👤 {apt.assignedTo}</span>
                                                    )}
                                                </div>
                                            </div>
                                            <h5 className="font-bold text-sm mb-1">{apt.clientName}</h5>
                                            <p className="text-[11px] opacity-60 leading-tight">{apt.service}</p>
                                        </div>
                                    ))
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-gray-500 animate-pulse">
                                    <div className="text-4xl mb-4 opacity-20">🍃</div>
                                    <p className="text-sm">예약이 없습니다.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* 일정 등록 모달 */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
                    <div className={`relative w-full max-w-lg ${modalBg} border border-white/10 rounded-2xl shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto`}>
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-4 right-4 p-2 text-white/50 hover:text-white transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>

                        <h2 className={`text-xl font-medium ${textColor} mb-6 border-b border-white/5 pb-4`}>
                            📋 새 일정 등록
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* 타이틀 */}
                            <div className="space-y-2">
                                <label className="text-sm text-gray-400">타이틀</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="일정 제목을 입력하세요"
                                    className={`w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white ${accentFocus} outline-none`}
                                />
                            </div>

                            {/* 장르 · 부위 */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm text-gray-400">장르</label>
                                    <select
                                        value={formData.genre}
                                        onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                                        className={`w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white outline-none appearance-none`}
                                    >
                                        {GENRES.map((g) => <option key={g} value={g} className={`${selectBg} text-white`}>{g}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-gray-400">부위</label>
                                    <select
                                        value={formData.part}
                                        onChange={(e) => setFormData({ ...formData, part: e.target.value })}
                                        className={`w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white outline-none appearance-none`}
                                    >
                                        {PARTS.map((p) => <option key={p} value={p} className={`${selectBg} text-white`}>{p}</option>)}
                                    </select>
                                </div>
                            </div>

                            {/* 날짜 */}
                            <div className="space-y-2">
                                <label className="text-sm text-gray-400">날짜</label>
                                <input
                                    type="date"
                                    required
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    className={`w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white ${accentFocus} outline-none`}
                                />
                            </div>

                            {/* 시간 범위 (시작 ~ 종료) */}
                            <div className="space-y-2">
                                <label className="text-sm text-gray-400">시간</label>
                                <div className="flex items-center gap-3">
                                    <select
                                        value={formData.timeStart}
                                        onChange={(e) => setFormData({ ...formData, timeStart: e.target.value })}
                                        className={`flex-1 px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white outline-none appearance-none text-center`}
                                    >
                                        {timeSlots.map((t) => <option key={t} value={t} className={`${selectBg} text-white`}>{t}</option>)}
                                    </select>
                                    <span className="text-gray-400 font-medium text-lg">~</span>
                                    <select
                                        value={formData.timeEnd}
                                        onChange={(e) => setFormData({ ...formData, timeEnd: e.target.value })}
                                        className={`flex-1 px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white outline-none appearance-none text-center`}
                                    >
                                        {timeSlots.map((t) => <option key={t} value={t} className={`${selectBg} text-white`}>{t}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors"
                                >
                                    취소
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`px-8 py-3 ${accentBtnBg} text-white rounded-lg transition-colors disabled:opacity-50`}
                                >
                                    {isSubmitting ? "처리 중..." : "등록하기"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* 일정 등록 플로팅 버튼 */}
            <button
                onClick={handleOpenModal}
                className={`fixed bottom-8 right-8 z-50 p-4 ${accentBtnBg} text-white rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all flex items-center gap-2 group`}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 font-bold whitespace-nowrap">
                    일정 등록
                </span>
            </button>
        </div>
    );
}
