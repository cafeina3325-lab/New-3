import React from "react";
import Calendar from "@/components/common/Calendar";

export default function CalendarPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-[#E1E8F3]">CALENDAR</h1>
                    <p className="text-gray-500 text-sm">팀 전체의 예약 현황을 실시간으로 확인합니다.</p>
                </div>
            </div>
            <Calendar theme="staff" />
        </div>
    );
}
