/**
 * 스태프 패널(Staff Dashboard) 전용 레이아웃 컴포넌트
 * 
 * 모든 `/staff/*` 하위 경로에 공통으로 적용되는 레이아웃입니다.
 * 서버사이드에서 세션을 검증하여 비로그인 사용자를 차단합니다.
 */

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import StaffSidebar from "@/components/staff/StaffSidebar";

export default async function StaffLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    // 비로그인 → 로그인 페이지로
    if (!session || !session.user) {
        redirect("/login");
    }

    // admin과 staff만 접근 가능
    const role = (session.user as any).role;
    if (role !== "admin" && role !== "staff") {
        redirect("/login");
    }

    return (
        <div className="flex h-screen bg-[#10131C] font-sans selection:bg-white/10 selection:text-white overflow-hidden">
            {/* Staff 전용 좌측 메뉴 바 영역 */}
            <StaffSidebar />

            {/* 메인 콘텐츠 영역 */}
            <main className="flex-1 overflow-y-auto bg-black/20 relative">
                {/* 상단 블러 효과 */}
                <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#10131C] to-transparent pointer-events-none z-10" />

                <div className="p-4 xs:p-6 sm:p-8 lg:p-12 relative z-0">
                    {children}
                </div>
            </main>
        </div>
    );
}
