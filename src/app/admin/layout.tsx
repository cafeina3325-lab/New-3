/**
 * 관리자 패널(Admin Dashboard) 전용 레이아웃 컴포넌트
 * 
 * 모든 `/admin/*` 하위 경로에 공통으로 적용되는 레이아웃입니다.
 * 서버사이드에서 세션을 검증하여 비로그인 사용자를 차단합니다.
 */

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    // 비로그인 → 로그인 페이지로
    if (!session || !session.user) {
        redirect("/login");
    }

    // admin이 아닌 경우 → 스태프 페이지로
    if ((session.user as any).role !== "admin") {
        redirect("/staff");
    }

    return (
        <div className="flex h-screen bg-[#1C1310] font-sans selection:bg-white/10 selection:text-white overflow-hidden">
            {/* Admin 전용 좌측 메뉴 바 영역 */}
            <AdminSidebar />

            {/* 메인 콘텐츠 영역 */}
            <main className="flex-1 overflow-y-auto bg-black/20 relative">
                {/* 상단 블러 효과 */}
                <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#1C1310] to-transparent pointer-events-none z-10" />

                <div className="p-4 xs:p-6 sm:p-8 lg:p-12 relative z-0">
                    {children}
                </div>
            </main>
        </div>
    );
}
