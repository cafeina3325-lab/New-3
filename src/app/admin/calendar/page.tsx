import React from "react";
import Calendar from "@/components/common/Calendar";

export default function CalendarPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-[#F3EBE1]">CALENDAR</h1>
                    <p className="text-gray-500 text-sm">예약 일정을 한눈에 확인하고 관리합니다.</p>
                </div>
            </div>
            <Calendar theme="admin" />
        </div>
    );
}
