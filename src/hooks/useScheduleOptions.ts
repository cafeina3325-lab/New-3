import { useMemo, useState, useEffect } from "react";

// 커스텀 훅: 상담 예약이 가능한 향후 날짜(14일)와 시간대 슬롯을 생성합니다.
export function useScheduleOptions() {
    const [holidays, setHolidays] = useState<string[]>([]);

    // 서버에서 휴무 데이터 가져오기
    useEffect(() => {
        const fetchHolidays = async () => {
            try {
                const res = await fetch("/api/appointments");
                if (res.ok) {
                    const data = await res.json();
                    // status가 'holiday'이고 삭제되지 않은 날짜들만 추출
                    const holidayDates = data
                        .filter((apt: any) => apt.status === 'holiday' && !apt.isDeleted)
                        .map((apt: any) => apt.date.replace(/[\.\/]/g, '-').replace(/\s/g, '').replace(/-$/, ''));
                    setHolidays(holidayDates);
                }
            } catch (error) {
                console.error("Failed to fetch holidays:", error);
            }
        };
        fetchHolidays();
    }, []);

    // 시간대 슬롯 생성: 오전 10시부터 오후 6시 30분까지 30분 단위의 문자열 배열을 생성합니다.
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

    // 캘린더 날짜 생성: 오늘부터 또는 당일 마감 시 내일부터 14일간의 Date 객체 배열을 생성합니다.
    const dates = useMemo(() => {
        const result = [];
        const today = new Date();

        // 당일 예약 가능한 시간이 예외조건(최소 1시간 45분 이후)을 뚫고 남아있는지 확인
        let hasAvailableTimeToday = false;
        const now = new Date();

        // 17시(오후 5시) 기준 마감: 이 시간이 넘으면 당일의 어떤 슬롯도 열리지 않게 막음
        if (now.getHours() < 17) {
            const cutoff = new Date(now.getTime() + (1 * 60 + 45) * 60000);
            hasAvailableTimeToday = timeSlots.some(time => {
                const [hours, minutes] = time.split(':').map(Number);
                const slotTime = new Date(today);
                slotTime.setHours(hours, minutes, 0, 0);
                return slotTime > cutoff;
            });
        }

        // 예약 가능한 시간이 없으면 당일 표기를 건너뛰고 시작점을 1일(내일)로 설정
        const startDateOffset = hasAvailableTimeToday ? 0 : 1;

        return Array.from({ length: 14 }, (_, i) => {
            const d = new Date(today);
            d.setDate(today.getDate() + startDateOffset + i);
            return d;
        });
    }, [timeSlots]);

    return { dates, timeSlots, holidays };
}
