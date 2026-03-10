/**
 * 스태프 패널 - 메신저 페이지
 * 
 * 실시간 소통을 위한 메신저 인터페이스를 렌더링합니다.
 */

"use client";

import ChatInterface from "@/components/common/ChatInterface";

export default function StaffMessengerPage() {
    return (
        <div className="space-y-6 sm:space-y-10 pt-4 sm:pt-8 min-h-[80vh]">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">메신저</h1>
                    <p className="text-sm md:text-base text-gray-400 mt-2">다른 스태프 및 관리자와 실시간으로 소통할 수 있습니다.</p>
                </div>
            </div>

            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                <ChatInterface />
            </div>
        </div>
    );
}
