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
        if (!selectedPart || !selectedGenre || !selectedDate || !selectedTime) {
            alert("필수 항목(부위, 장르, 날짜, 시간)을 모두 선택해주세요.");
            return;
        }

        const formData = {
            part: selectedPart,
            genre: selectedGenre,
            referenceText,
            files: files.map(f => f.name),
            date: selectedDate.toLocaleDateString(),
            time: selectedTime
        };

        console.log("Reservation Request:", formData);
        alert("상담 예약이 접수되었습니다. \n(실제 서버 전송은 구현되지 않았습니다.)");
        onClose();
    };

    const daysOfWeek = ["일", "월", "화", "수", "목", "금", "토"];

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in pointer-events-auto"
            onClick={onClose}
        >
            <div
                className="bg-white w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col relative"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-white sticky top-0 z-10">
                    <h2 className="text-2xl font-bold text-gray-900">Contact / Reservation</h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                    >
                        <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content - Scrollable */}
                <div className="overflow-y-auto p-6 md:p-8 space-y-12">

                    {/* Notice Section */}
                    <section className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                        <h3 className="text-sm font-bold text-red-500 uppercase tracking-widest mb-3">Notice</h3>
                        <ul className="space-y-2 text-sm text-gray-600 list-disc list-inside leading-relaxed">
                            <li>본 접수는 <strong>대면상담 예약</strong>입니다. 시술 예약이 아닙니다.</li>
                            <li>상담 결과에 따라 시술이 제한되거나 거절될 수 있습니다.</li>
                            <li><strong>만 19세 미만</strong>은 시술이 불가하며, 대면 상담 시 신분증 확인이 필요합니다.</li>
                            <li>피부상태, 건강상태, 시술 이력에 따라 상담 또는 시술이 제한 될 수 있습니다.</li>
                        </ul>
                    </section>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {/* 1. Area */}
                        <section>
                            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-black text-white text-xs">1</span>
                                Area <span className="text-gray-400 text-sm font-normal ml-auto">* Single choice</span>
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {parts.map(part => (
                                    <button
                                        key={part}
                                        onClick={() => handleSingleSelection(part, selectedPart, setSelectedPart)}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${selectedPart === part
                                            ? "bg-gray-900 text-white border-gray-900 shadow-md"
                                            : "bg-white text-gray-500 border-gray-200 hover:border-gray-400 hover:text-gray-900"
                                            }`}
                                    >
                                        {part}
                                    </button>
                                ))}
                            </div>
                        </section>

                        {/* 2. Genres */}
                        <section>
                            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-black text-white text-xs">2</span>
                                Genres <span className="text-gray-400 text-sm font-normal ml-auto">* Single choice</span>
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {genres.map(genre => (
                                    <button
                                        key={genre}
                                        onClick={() => handleSingleSelection(genre, selectedGenre, setSelectedGenre)}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${selectedGenre === genre
                                            ? "bg-gray-900 text-white border-gray-900 shadow-md"
                                            : "bg-white text-gray-500 border-gray-200 hover:border-gray-400 hover:text-gray-900"
                                            }`}
                                    >
                                        {genre}
                                    </button>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* 3. Reference */}
                    <section>
                        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-black text-white text-xs">3</span>
                            Reference
                        </h3>
                        <div className="space-y-4">
                            <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors relative">
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
                                    <p className="text-gray-500 text-sm font-medium">Click or Drag images here</p>
                                    {files.length > 0 && (
                                        <p className="text-blue-600 text-sm mt-2">{files.length} filed(s) selected</p>
                                    )}
                                </div>
                            </div>
                            <textarea
                                placeholder="추가적인 설명이나 요청사항을 자유롭게 적어주세요."
                                value={referenceText}
                                onChange={(e) => setReferenceText(e.target.value)}
                                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all min-h-[120px] resize-y text-gray-900 placeholder:text-gray-400"
                            />
                            <p className="text-xs text-gray-400 text-right">* 레퍼런스는 참고용 이며, 피부 / 부위에 따라 조정 될 수 있습니다.</p>
                        </div>
                    </section>

                    {/* 4. Schedule */}
                    <section>
                        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-black text-white text-xs">4</span>
                            Schedule <span className="text-gray-400 text-sm font-normal ml-auto">Date Selection (2 weeks)</span>
                        </h3>

                        {/* Date Grid */}
                        <div className="grid grid-cols-7 gap-2 mb-6">
                            {/* Days Header */}
                            {daysOfWeek.map(day => (
                                <div key={day} className="text-center text-xs font-bold text-gray-400 py-2">
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
                                                ? "bg-gray-900 text-white shadow-md transform scale-[1.05]"
                                                : "bg-gray-50 text-gray-600 hover:bg-gray-200"
                                            }
                                        `}
                                    >
                                        <span className="text-xs mb-1 opacity-60">{date.getMonth() + 1}.</span>
                                        <span className={`text-lg font-bold ${dayOfWeekColor(date.getDay())}`}>
                                            {date.getDate()}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Time Slots (Only show if date selected) */}
                        {selectedDate && (
                            <div className="animate-fade-in">
                                <h4 className="text-sm font-bold text-gray-900 mb-3">
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
                                                : "bg-white text-gray-600 border-gray-200 hover:border-gray-400 hover:text-gray-900"
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
                <div className="p-6 border-t border-gray-100 bg-white sticky bottom-0 z-10 flex justify-end gap-4">
                    <button
                        onClick={onClose}
                        className="px-6 py-3 text-gray-500 font-bold hover:text-gray-800 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className={`px-8 py-3 bg-black text-white font-bold rounded-lg shadow-lg hover:bg-gray-800 hover:shadow-xl transition-all ${(!selectedDate || !selectedTime || !selectedPart || !selectedGenre) ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                    // disabled={!selectedDate || !selectedTime} // Optional: strictly disable
                    >
                        예약하기
                    </button>
                </div>
            </div>
        </div>
    );
}

function dayOfWeekColor(dayIndex: number) {
    if (dayIndex === 0) return "text-red-500"; // Sunday
    if (dayIndex === 6) return "text-blue-500"; // Saturday
    return "text-current";
}
