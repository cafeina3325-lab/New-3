/**
 * 방문 상담 예약 전용 팝업 모달(Contact Overlay) 컴포넌트
 * 
 * 사용자로부터 대면 상담 예약을 위한 기본 정보(이름, 번호), 
 * 희망 타투 장르 및 부위, 참고 레퍼런스 이미지(첨부파일)와 날짜/시간 슬롯을 입력받아 
 * 최종 API POST 요청을 처리합니다.
 */

"use client";

import { useState, useMemo } from "react";
import { GENRES, PARTS } from "@/data/constants";
import { useScheduleOptions } from "@/hooks/useScheduleOptions";

/**
 * 예약 모달에 전달되는 초기(Initial) Props 인터페이스
 * 이벤트나 갤러리 도안 상세보기에서 예약 버튼을 누를 때 특정 필드가 미리 채워지도록 지원합니다.
 */
interface ContactOverlayProps {
    onClose: () => void;
    initialReviewId?: string;
    initialGenre?: string | null;
    initialPart?: string | null;
    initialImage?: string | null;
    initialSource?: string | null;
    initialSourceId?: string | null;
}

// 달력 UI 출력용 요일 배열 (0: 일요일 ~ 6: 토요일)
const DAYS_OF_WEEK = ["일", "월", "화", "수", "목", "금", "토"];

// 주말 색상 강주 유틸리티 함수
function dayOfWeekColor(dayIndex: number) {
    if (dayIndex === 0) return "text-red-500";   // 일요일
    if (dayIndex === 6) return "text-blue-500";  // 토요일
    return "text-current";
}

export default function ContactOverlay({
    onClose,
    initialReviewId = "",
    initialGenre = null,
    initialPart = null,
    initialImage = null,
    initialSource = null,
    initialSourceId = null
}: ContactOverlayProps) {
    // Form State
    // 입력값을 관리하는 상태 변수들 (이름, 전화번호, 선택한 부위/장르, 추가 레퍼런스 텍스트, 예약일 및 예약시간, 첨부 파일)
    const [name, setName] = useState("");
    const [gender, setGender] = useState<"male" | "female" | null>(null);
    const [phone, setPhone] = useState("");
    const [selectedPart, setSelectedPart] = useState<string | null>(initialPart);
    const [selectedGenre, setSelectedGenre] = useState<string | null>(initialGenre);
    const [referenceText, setReferenceText] = useState("");
    const [referenceReviewId, setReferenceReviewId] = useState(initialReviewId);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [files, setFiles] = useState<File[]>([]);

    // 훅 호출을 통해 예약 가능한 요일 및 시간 배열을 가져옵니다.
    const { dates, timeSlots } = useScheduleOptions();

    // Derived State
    // 조건 필터링: 현재 시간 기준, 당일 예약은 최소 1시간 45분 이후의 시간대 슬롯만 활성화되도록 필터링합니다.
    const availableTimeSlots = useMemo(() => {
        if (!selectedDate) return [];

        return timeSlots.filter(time => {
            const now = new Date();
            const isToday = selectedDate.toDateString() === now.toDateString();

            // 당일이 아니라면 모든 시간 오픈
            if (!isToday) return true;

            // Calculate cutoff time: Now + 1 hour 45 minutes
            const cutoff = new Date(now.getTime() + (1 * 60 + 45) * 60000);

            const [hours, minutes] = time.split(':').map(Number);
            const slotTime = new Date(selectedDate);
            slotTime.setHours(hours, minutes, 0, 0);

            // 해당 슬롯 시간이 컷오프 타임보다 이후일 때만 예약 가능
            return slotTime > cutoff;
        });
    }, [selectedDate, timeSlots]);

    // 검증 로직: 필수 항목(이름, 성별, 번호, 날짜, 시간, 부위, 장르)이 모두 채워졌는지 확인하는 boolean 값
    const isFormValid = name && gender && phone && selectedDate && selectedTime && selectedPart && selectedGenre;

    // Handlers
    // 연락처 입력 시 자동으로 하이픈(-) 포맷팅을 적용하는 핸들러
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

    // 장르와 부위 선택 시 클릭한 아이템을 반영하고 재클릭 시 선택 해제하는 공통 단일 선택 핸들러
    const handleSingleSelection = (item: any, current: any, setCurrent: (v: any) => void) => {
        if (current === item) {
            setCurrent(null); // Toggle off
        } else {
            setCurrent(item);
        }
    };

    // 파일 선택 시 상태에 파일 배열을 저장하는 핸들러
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles(Array.from(e.target.files));
        }
    };

    // 달력에서 특정 날짜 클릭 시 해당 날짜를 설정하고 이전에 선택해둔 시간은 초기화하는 핸들러
    const handleDateSelect = (date: Date) => {
        setSelectedDate(date);
        setSelectedTime(null); // Reset time when date changes
    };

    // 예약 양식 제출 버튼 동작: 입력값 검증 후 API로 전송합니다.
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!isFormValid) {
            alert("필수 항목(이름, 성별, 연락처, 부위, 장르, 날짜, 시간)을 모두 입력해주세요.");
            return;
        }

        setIsSubmitting(true);

        try {
            // 참고 리뷰 ID 입력 시 유효성 검증
            if (referenceReviewId.trim()) {
                const checkRes = await fetch(`/api/reviews?reviewId=${referenceReviewId.trim()}`);
                if (checkRes.ok) {
                    const checkData = await checkRes.json();
                    if (!checkData.exists) {
                        alert("입력하신 '참고 리뷰 ID'가 존재하지 않습니다. 다시 확인해주세요.");
                        setIsSubmitting(false);
                        return;
                    }
                }
            }

            // 사용자가 첨부한 File 객체들을 Base64 데이터 스트링으로 직렬화하는 헬퍼 함수
            const fileToBase64 = (file: File): Promise<string> => {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = () => resolve(reader.result as string);
                    reader.onerror = error => reject(error);
                });
            };

            // 선택된 모든 파일을 순차적으로 Base64로 변환대기
            let base64Files = await Promise.all(files.map(fileToBase64));

            // 이벤트나 갤러리 페이지에서 전달받은 초기 레퍼런스 이미지가 있다면 배열 맨 앞에 병합
            if (initialImage) {
                base64Files = [initialImage, ...base64Files];
            }

            const formData = {
                name,
                gender,
                phone,
                part: selectedPart,
                genre: selectedGenre,
                referenceText,
                referenceReviewId,
                source: initialSource, // 출처 정보 추가 (event, gallery, null)
                sourceId: initialSourceId,
                files: base64Files, // 파일명 대신 데이터 URL 전송
                date: `${selectedDate!.getFullYear()}-${String(selectedDate!.getMonth() + 1).padStart(2, '0')}-${String(selectedDate!.getDate()).padStart(2, '0')}`,
                time: selectedTime
            };

            const res = await fetch('/api/appointments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || '예약 저장 실패');
            }

            alert(`[${name}]님, 상담 예약이 접수되었습니다.`);
            onClose();
        } catch (error: any) {
            alert(`예약 접수 중 오류가 발생했습니다: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Render
    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in pointer-events-auto"
            onClick={onClose}
        >
            <div
                className="bg-[#1C1310] border border-white/10 w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col relative"
                onClick={(e) => e.stopPropagation()} // 내부 클릭 시 오버레이(배경) 닫힘 전파 방지
            >
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-white/10 bg-[#1C1310] sticky top-0 z-10">
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#F3EBE1]">Contact / Reservation</h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-white/10 transition-colors"
                    >
                        {/* 닫기 X 아이콘 SVG */}
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content - Scrollable */}
                {/* 모달 내부에서 내용이 길어지면 드래그/스크롤될 수 있도록 오버플로우 관리되는 영역 */}
                <div className="overflow-y-auto p-6 md:p-8 space-y-12">

                    {/* Notice Section */}
                    {/* 안내문: 상담 예약 정책, 미성년자 불가 등 유의사항 블록 */}
                    <section className="bg-[#2A1D18] p-6 rounded-xl border border-white/5">
                        <h3 className="text-sm md:text-base lg:text-lg font-bold text-red-400 uppercase tracking-widest mb-3">Notice</h3>
                        <ul className="space-y-2 text-sm md:text-base lg:text-lg text-[#D4C4BD] list-disc list-inside leading-relaxed word-keep-all">
                            <li>본 접수는 <strong>대면상담 예약</strong>입니다. 시술 예약이 아닙니다.</li>
                            <li>상담 결과에 따라 시술이 제한되거나 거절될 수 있습니다.</li>
                            <li><strong>만 19세 미만</strong>은 시술이 불가하며, 대면 상담 시 신분증 확인이 필요합니다.</li>
                            <li>피부상태, 건강상태, 시술 이력에 따라 상담 또는 시술이 제한 될 수 있습니다.</li>
                        </ul>
                    </section>

                    {/* 1. Basic Info (New) */}
                    <section>
                        <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-[#F3EBE1] tracking-wide mb-6 flex items-center gap-2">
                            <span className="flex items-center justify-center w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 rounded-full bg-[#E5D9D2] text-[#1C1310] text-xs md:text-sm lg:text-base font-black">1</span>
                            Basic Info <span className="text-gray-500 text-xs md:text-sm lg:text-base font-normal ml-auto">* Required</span>
                        </h3>
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm md:text-base lg:text-lg font-bold text-[#D4C4BD] mb-2 tracking-wide">Name <span className="text-red-400">*</span></label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="실명기입"
                                        className="w-full p-4 bg-[#1C1310] text-[#F3EBE1] text-sm md:text-base lg:text-lg border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E5D9D2] placeholder:text-gray-500 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm md:text-base lg:text-lg font-bold text-[#D4C4BD] mb-2 tracking-wide">Gender <span className="text-red-400">*</span></label>
                                    <div className="flex gap-2 h-[58px]">
                                        <button
                                            onClick={() => setGender('male')}
                                            className={`flex-1 rounded-xl text-sm md:text-base lg:text-lg font-bold transition-all border ${gender === 'male'
                                                ? "bg-[#E5D9D2] text-[#1C1310] border-transparent shadow-md"
                                                : "bg-[#1C1310] text-[#D4C4BD] border-white/10 hover:border-white/30 hover:text-[#F3EBE1]"
                                                }`}
                                        >
                                            남성
                                        </button>
                                        <button
                                            onClick={() => setGender('female')}
                                            className={`flex-1 rounded-xl text-sm md:text-base lg:text-lg font-bold transition-all border ${gender === 'female'
                                                ? "bg-[#E5D9D2] text-[#1C1310] border-transparent shadow-md"
                                                : "bg-[#1C1310] text-[#D4C4BD] border-white/10 hover:border-white/30 hover:text-[#F3EBE1]"
                                                }`}
                                        >
                                            여성
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm md:text-base lg:text-lg font-bold text-[#D4C4BD] mb-2 tracking-wide">Phone <span className="text-red-400">*</span></label>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={handlePhoneChange}
                                    placeholder="010-0000-0000"
                                    maxLength={13}
                                    className="w-full p-4 bg-[#1C1310] text-[#F3EBE1] text-sm md:text-base lg:text-lg border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E5D9D2] placeholder:text-gray-500 transition-all"
                                />
                            </div>
                        </div>
                    </section>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {/* 2. Area */}
                        {/* 배열을 매핑하여 타투 부위 선택형 버튼 리스트 생성 */}
                        <section>
                            <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-[#F3EBE1] tracking-wide mb-4 flex items-center gap-2">
                                <span className="flex items-center justify-center w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 rounded-full bg-[#E5D9D2] text-[#1C1310] text-xs md:text-sm lg:text-base font-black">2</span>
                                Area <span className="text-gray-500 text-xs md:text-sm lg:text-base font-normal ml-auto">* Single choice</span>
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {PARTS.map(part => (
                                    <button
                                        key={part}
                                        onClick={() => handleSingleSelection(part, selectedPart, setSelectedPart)}
                                        className={`px-4 py-2 rounded-lg text-sm md:text-base lg:text-lg font-medium transition-all border ${selectedPart === part
                                            ? "bg-[#E5D9D2] text-[#1C1310] border-transparent shadow-md font-bold"
                                            : "bg-[#1C1310] text-[#D4C4BD] border-white/10 hover:border-white/30 hover:text-[#F3EBE1]"
                                            }`}
                                    >
                                        {part}
                                    </button>
                                ))}
                            </div>
                        </section>

                        {/* 3. Genres */}
                        {/* 배열을 매핑하여 장르 선택형 버튼 리스트 생성 */}
                        <section>
                            <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-[#F3EBE1] tracking-wide mb-4 flex items-center gap-2">
                                <span className="flex items-center justify-center w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 rounded-full bg-[#E5D9D2] text-[#1C1310] text-xs md:text-sm lg:text-base font-black">3</span>
                                Genres <span className="text-gray-500 text-xs md:text-sm lg:text-base font-normal ml-auto">* Single choice</span>
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {GENRES.map(genre => (
                                    <button
                                        key={genre}
                                        onClick={() => handleSingleSelection(genre, selectedGenre, setSelectedGenre)}
                                        className={`px-4 py-2 rounded-lg text-sm md:text-base lg:text-lg font-medium transition-all border ${selectedGenre === genre
                                            ? "bg-[#E5D9D2] text-[#1C1310] border-transparent shadow-md font-bold"
                                            : "bg-[#1C1310] text-[#D4C4BD] border-white/10 hover:border-white/30 hover:text-[#F3EBE1]"
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
                        <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-[#F3EBE1] tracking-wide mb-4 flex items-center gap-2">
                            <span className="flex items-center justify-center w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 rounded-full bg-[#E5D9D2] text-[#1C1310] text-xs md:text-sm lg:text-base font-black">4</span>
                            Reference
                        </h3>
                        <div className="space-y-4">
                            {/* 파일 업로드 폼(드래그 앤 드롭 유도 UI 포함) 영역 설정 */}
                            <div className="border border-dashed border-white/20 rounded-xl p-8 text-center bg-[#1C1310] hover:bg-white/5 transition-colors relative">
                                <input
                                    type="file"
                                    multiple
                                    onChange={handleFileChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                <div className="pointer-events-none">
                                    <svg className="w-10 h-10 text-gray-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <p className="text-gray-400 text-sm md:text-base lg:text-lg font-medium">Click or Drag images here</p>
                                    {files.length > 0 && (
                                        <p className="text-[#F3EBE1] text-sm md:text-base mt-2">{files.length} filed(s) selected</p>
                                    )}
                                </div>
                            </div>

                            {/* 선택된 이벤트 이미지 미리보기 (있는 경우) */}
                            {initialImage && (
                                <div className="p-4 bg-white/5 rounded-xl border border-white/10 flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-lg overflow-hidden border border-white/20 bg-black flex-shrink-0">
                                        <img src={initialImage} alt="Selected Reference" className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <p className="text-white text-sm md:text-base font-bold">
                                            {initialSource === "gallery" ? "갤러리 도안 선택됨" : "이벤트 도안 선택됨"}
                                        </p>
                                        <p className="text-gray-500 text-xs md:text-sm mt-1">이 이미지가 예약 정보에 자동으로 포함됩니다.</p>
                                    </div>
                                </div>
                            )}

                            <textarea
                                placeholder="추가적인 설명이나 요청사항을 자유롭게 적어주세요."
                                value={referenceText}
                                onChange={(e) => setReferenceText(e.target.value)}
                                className="w-full p-4 bg-[#1C1310] text-[#F3EBE1] text-sm md:text-base lg:text-lg border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E5D9D2] focus:border-transparent transition-all min-h-[120px] resize-y placeholder:text-gray-400"
                            />
                            <div className="relative">
                                <label className="block text-xs md:text-sm lg:text-base font-bold text-gray-500 mb-2 uppercase tracking-tight">참고 리뷰 ID (선택사항)</label>
                                <input
                                    type="text"
                                    placeholder="예: RV-XXXXXX (리뷰 작성 시 부여된 고유 ID)"
                                    value={referenceReviewId}
                                    onChange={(e) => setReferenceReviewId(e.target.value.toUpperCase())}
                                    className="w-full p-4 bg-[#1C1310] text-[#F3EBE1] border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E5D9D2] placeholder:text-gray-500 transition-all font-mono text-sm md:text-base lg:text-lg uppercase"
                                />
                            </div>
                            <p className="text-xs md:text-sm lg:text-base text-gray-500 text-right word-keep-all">* 레퍼런스는 참고용 이며, 피부 / 부위에 따라 조정 될 수 있습니다.</p>
                        </div>
                    </section>

                    {/* 5. Schedule */}
                    {/* 날짜/시간 선택 달력 및 슬롯 UI */}
                    <section>
                        <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-[#F3EBE1] tracking-wide mb-6 flex items-center gap-2">
                            <span className="flex items-center justify-center w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 rounded-full bg-[#E5D9D2] text-[#1C1310] text-xs md:text-sm lg:text-base font-black">5</span>
                            Schedule <span className="text-gray-500 text-xs md:text-sm lg:text-base font-normal ml-auto">Date Selection (2 weeks)</span>
                        </h3>

                        {/* Date Grid */}
                        {/* 향후 14일간의 날짜를 그리드 형식으로 나열 */}
                        <div className="grid grid-cols-7 gap-2 mb-6">
                            {/* Days Header */}
                            {DAYS_OF_WEEK.map(day => (
                                <div key={day} className="text-center text-xs md:text-sm lg:text-base font-bold text-gray-400 py-2">
                                    {day}
                                </div>
                            ))}

                            {/* Empty Slots for alignment (시작 요일을 맞추기 위한 로직) */}
                            {Array.from({ length: dates[0].getDay() }).map((_, i) => (
                                <div key={`empty-${i}`} />
                            ))}

                            {/* Date Items (실제 생성된 날짜 버튼들 매핑) */}
                            {dates.map((date, i) => {
                                const isSelected = selectedDate?.toDateString() === date.toDateString();
                                return (
                                    <button
                                        key={i}
                                        onClick={() => handleDateSelect(date)}
                                        className={`
                                            flex flex-col items-center justify-center p-3 rounded-lg transition-all border
                                            ${isSelected
                                                ? "bg-[#E5D9D2] text-[#1C1310] border-[#E5D9D2] shadow-md transform scale-[1.05]"
                                                : "bg-[#1C1310] text-[#D4C4BD] border-white/5 hover:bg-[#2A1D18]"
                                            }
                                        `}
                                    >
                                        <span className="text-xs md:text-sm mb-1 opacity-60">{date.getMonth() + 1}.</span>
                                        <span className={`text-base md:text-lg lg:text-xl font-bold ${dayOfWeekColor(date.getDay())}`}>
                                            {date.getDate()}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Time Slots (Only show if date selected) */}
                        {/* 날짜가 골라지면 그 하단에 해당 일자에 가능한 시간 슬롯 버튼들을 출력 */}
                        {selectedDate && (
                            <div className="animate-fade-in">
                                <h4 className="text-base md:text-lg lg:text-xl font-bold text-[#F3EBE1] mb-3 mt-6 border-t border-white/10 pt-6">
                                    Available Time <span className="font-normal text-gray-500 text-sm md:text-base lg:text-lg">({selectedDate.toLocaleDateString()})</span>
                                </h4>
                                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                                    {availableTimeSlots.map(time => (
                                        <button
                                            key={time}
                                            onClick={() => setSelectedTime(time)}
                                            className={`py-2 px-1 rounded-md text-sm md:text-base lg:text-lg font-medium transition-colors border ${selectedTime === time
                                                ? "bg-[#E5D9D2] text-[#1C1310] border-[#E5D9D2] font-bold"
                                                : "bg-[#1C1310] text-gray-400 border-white/10 hover:border-white/30 hover:text-[#F3EBE1]"
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
                {/* 하단 고정: 제출 버튼과 취소 버튼 컨테이너 */}
                <div className="p-6 border-t border-white/10 bg-[#1C1310] sticky bottom-0 z-10 flex justify-end gap-4">
                    <button
                        onClick={onClose}
                        className="px-6 py-3 text-gray-500 text-sm md:text-base lg:text-lg font-bold hover:text-[#D4C4BD] transition-colors"
                    >
                        Cancel
                    </button>
                    {/* isFormValid 여부에 따라 예약 버튼이 투명해지거나 클릭 거부(cursor-not-allowed) 처리됨 */}
                    <button
                        onClick={handleSubmit}
                        className={`px-8 py-3 bg-[#E5D9D2] text-[#1C1310] text-sm md:text-base lg:text-lg font-bold tracking-wide rounded-lg shadow-lg hover:bg-white hover:shadow-xl transition-all ${!isFormValid ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                    >
                        예약하기
                    </button>
                </div>
            </div>
        </div>
    );
}
