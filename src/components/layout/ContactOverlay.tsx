"use client";

import { useState, useMemo } from "react";
import Image from "next/image";

// Constants
const parts = [
    "Head", "Face", "Neck", "Shoulder", "Chest",
    "Belly", "Back", "Arm", "Leg", "Hand", "Foot"
];

const genres = [
    "Irezumi", "Old School", "Tribal", "Black & Grey", "Blackwork",
    "Oriental Art", "Watercolor", "Illustration", "Mandala", "Sak Yant", "Lettering", "ETC."
];

export default function ContactOverlay({ onClose }: { onClose: () => void }) {
    // Form State
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [selectedPart, setSelectedPart] = useState<string | null>(null);
    const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
    const [referenceText, setReferenceText] = useState("");
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [files, setFiles] = useState<File[]>([]);

    // Date Generation (Next 14 days)
    const dates = useMemo(() => {
        const result = [];
        const today = new Date();
        for (let i = 0; i < 14; i++) {
            const d = new Date(today);
            d.setDate(today.getDate() + i);
            result.push(d);
        }
        return result;
    }, []);

    // Time Slots Generation (10:00 - 18:30, 30 min interval)
    const timeSlots = useMemo(() => {
        const slots = [];
        let start = 10 * 60; // 10:00 in minutes
        const end = 18 * 60 + 30; // 18:30 in minutes

        while (start <= end) {
            const h = Math.floor(start / 60);
            const m = start % 60;
            const timeString = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
            slots.push(timeString);
            start += 30;
        }
        return slots;
    }, []);

    // Handlers
    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value.replace(/[^0-9]/g, "");
        let formatted = raw;
        if (raw.length > 3 && raw.length <= 7) {
            formatted = `${raw.slice(0, 3)}-${raw.slice(3)}`;
        } else if (raw.length > 7) {
            formatted = `${raw.slice(0, 3)}-${raw.slice(3, 7)}-${raw.slice(7, 11)}`;
        }
        setPhone(formatted);
    };

    const handleSingleSelection = (item: string, current: string | null, setCurrent: (v: string | null) => void) => {
        if (current === item) {
            setCurrent(null); // Toggle off
        } else {
            setCurrent(item);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles(Array.from(e.target.files));
        }
    };

    const handleSubmit = () => {
        if (!name || !phone || !selectedPart || !selectedGenre || !selectedDate || !selectedTime) {
            alert("필수 항목(이름, 연락처, 부위, 장르, 날짜, 시간)을 모두 입력해주세요.");
            return;
        }

        const formData = {
            name,
            phone,
            part: selectedPart,
            genre: selectedGenre,
            referenceText,
            files: files.map(f => f.name),
            date: selectedDate.toLocaleDateString(),
            time: selectedTime
        };

        console.log("Reservation Request:", formData);
        alert(`[${name}]님, 상담 예약이 접수되었습니다. \n(실제 서버 전송은 구현되지 않았습니다.)`);
        onClose();
    };

    const daysOfWeek = ["일", "월", "화", "수", "목", "금", "토"];

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in pointer-events-auto"
            onClick={onClose}
        >
            <div
                className="glass-panel w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col relative border-white/10"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-white/10 sticky top-0 z-10 bg-black/20 backdrop-blur-md text-white">
                    <h2 className="text-2xl font-bold">Contact / Reservation</h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-white/10 transition-colors"
                    >
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content - Scrollable */}
                <div className="overflow-y-auto p-6 md:p-8 space-y-12 text-gray-200">

                    {/* Notice Section */}
                    <section className="bg-white/5 p-6 rounded-xl border border-white/5">
                        <h3 className="text-sm font-bold text-red-400 uppercase tracking-widest mb-3">Notice</h3>
                        <ul className="space-y-2 text-sm text-gray-400 list-disc list-inside leading-relaxed">
                            <li>본 접수는 <strong>대면상담 예약</strong>입니다. 시술 예약이 아닙니다.</li>
                            <li>상담 결과에 따라 시술이 제한되거나 거절될 수 있습니다.</li>
                            <li><strong>만 19세 미만</strong>은 시술이 불가하며, 대면 상담 시 신분증 확인이 필요합니다.</li>
                            <li>피부상태, 건강상태, 시술 이력에 따라 상담 또는 시술이 제한 될 수 있습니다.</li>
                        </ul>
                    </section>

                    {/* 1. Basic Info (New) */}
                    <section>
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white text-black text-xs">1</span>
                            Basic Info <span className="text-gray-500 text-sm font-normal ml-auto">* Required</span>
                        </h3>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-400 mb-2">Name <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="실명기입"
                                    className="w-full p-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/20 transition-all text-white placeholder-gray-600"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-400 mb-2">Phone <span className="text-red-500">*</span></label>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={handlePhoneChange}
                                    placeholder="010-0000-0000"
                                    maxLength={13}
                                    className="w-full p-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/20 transition-all text-white placeholder-gray-600"
                                />
                            </div>
                        </div>
                    </section>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {/* 2. Area */}
                        <section>
                            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white text-black text-xs">2</span>
                                Area <span className="text-gray-500 text-sm font-normal ml-auto">* Single choice</span>
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {parts.map(part => (
                                    <button
                                        key={part}
                                        onClick={() => handleSingleSelection(part, selectedPart, setSelectedPart)}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${selectedPart === part
                                            ? "bg-white text-black border-white shadow-md"
                                            : "bg-white/5 text-gray-400 border-white/10 hover:border-white/30 hover:text-white"
                                            }`}
                                    >
                                        {part}
                                    </button>
                                ))}
                            </div>
                        </section>

                        {/* 3. Genres */}
                        <section>
                            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white text-black text-xs">3</span>
                                Genres <span className="text-gray-500 text-sm font-normal ml-auto">* Single choice</span>
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {genres.map(genre => (
                                    <button
                                        key={genre}
                                        onClick={() => handleSingleSelection(genre, selectedGenre, setSelectedGenre)}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${selectedGenre === genre
                                            ? "bg-white text-black border-white shadow-md"
                                            : "bg-white/5 text-gray-400 border-white/10 hover:border-white/30 hover:text-white"
                                            }`}
                                    >
                                        {genre}
                                    </button>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* 4. Reference */}
                    <section>
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white text-black text-xs">4</span>
                            Reference
                        </h3>
                        <div className="space-y-4">
                            <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:bg-white/5 transition-colors relative">
                                <input
                                    type="file"
                                    multiple
                                    onChange={handleFileChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                <div className="pointer-events-none">
                                    <svg className="w-10 h-10 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <p className="text-gray-400 text-sm font-medium">Click or Drag images here</p>
                                    {files.length > 0 && (
                                        <p className="text-blue-400 text-sm mt-2">{files.length} filed(s) selected</p>
                                    )}
                                </div>
                            </div>
                            <textarea
                                placeholder="추가적인 설명이나 요청사항을 자유롭게 적어주세요."
                                value={referenceText}
                                onChange={(e) => setReferenceText(e.target.value)}
                                className="w-full p-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent transition-all min-h-[120px] resize-y text-white placeholder:text-gray-600"
                            />
                            <p className="text-xs text-gray-500 text-right">* 레퍼런스는 참고용 이며, 피부 / 부위에 따라 조정 될 수 있습니다.</p>
                        </div>
                    </section>

                    {/* 5. Schedule */}
                    <section>
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white text-black text-xs">5</span>
                            Schedule <span className="text-gray-500 text-sm font-normal ml-auto">Date Selection (2 weeks)</span>
                        </h3>

                        {/* Date Grid */}
                        <div className="grid grid-cols-7 gap-2 mb-6">
                            {/* Days Header */}
                            {daysOfWeek.map(day => (
                                <div key={day} className="text-center text-xs font-bold text-gray-500 py-2">
                                    {day}
                                </div>
                            ))}

                            {/* Empty Slots for alignment */}
                            {Array.from({ length: dates[0].getDay() }).map((_, i) => (
                                <div key={`empty-${i}`} />
                            ))}

                            {/* Date Items */}
                            {dates.map((date, i) => {
                                const isSelected = selectedDate?.toDateString() === date.toDateString();
                                return (
                                    <button
                                        key={i}
                                        onClick={() => {
                                            setSelectedDate(date);
                                            setSelectedTime(null); // Reset time when date changes
                                        }}
                                        className={`
                                            flex flex-col items-center justify-center p-3 rounded-lg transition-all
                                            ${isSelected
                                                ? "bg-white text-black shadow-md transform scale-[1.05]"
                                                : "bg-white/5 text-gray-400 hover:bg-white/10"
                                            }
                                        `}
                                    >
                                        <span className="text-xs mb-1 opacity-60">{date.getMonth() + 1}.</span>
                                        <span className={`text-lg font-bold ${dayOfWeekColor(date.getDay(), isSelected)}`}>
                                            {date.getDate()}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Time Slots (Only show if date selected) */}
                        {selectedDate && (
                            <div className="animate-fade-in">
                                <h4 className="text-sm font-bold text-white mb-3">
                                    Available Time <span className="font-normal text-gray-500">({selectedDate.toLocaleDateString()})</span>
                                </h4>
                                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                                    {timeSlots.filter(time => {
                                        if (!selectedDate) return false;

                                        const now = new Date();
                                        const isToday = selectedDate.toDateString() === now.toDateString();

                                        if (!isToday) return true;

                                        // Calculate cutoff time: Now + 1 hour 45 minutes
                                        const cutoff = new Date(now.getTime() + (1 * 60 + 45) * 60000);

                                        const [hours, minutes] = time.split(':').map(Number);
                                        const slotTime = new Date(selectedDate);
                                        slotTime.setHours(hours, minutes, 0, 0);

                                        return slotTime > cutoff;
                                    }).map(time => (
                                        <button
                                            key={time}
                                            onClick={() => setSelectedTime(time)}
                                            className={`py-2 px-1 rounded-md text-sm font-medium transition-colors border ${selectedTime === time
                                                ? "bg-blue-600 text-white border-blue-600"
                                                : "bg-white/5 text-gray-400 border-white/10 hover:border-white/30 hover:text-white"
                                                }`}
                                        >
                                            {time}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </section>

                </div>

                {/* Footer / Submit */}
                <div className="p-6 border-t border-white/10 bg-black/20 backdrop-blur-md sticky bottom-0 z-10 flex justify-end gap-4">
                    <button
                        onClick={onClose}
                        className="px-6 py-3 text-gray-400 font-bold hover:text-white transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className={`px-8 py-3 bg-white text-black font-bold rounded-lg shadow-lg hover:bg-gray-200 hover:shadow-xl transition-all ${(!name || !phone || !selectedDate || !selectedTime || !selectedPart || !selectedGenre) ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                    >
                        예약하기
                    </button>
                </div>
            </div>
        </div>
    );
}

function dayOfWeekColor(dayIndex: number, isSelected: boolean) {
    if (isSelected) return "text-current"; // Inherit text color if selected (black)
    if (dayIndex === 0) return "text-red-400"; // Sunday
    if (dayIndex === 6) return "text-blue-400"; // Saturday
    return "text-current";
}
