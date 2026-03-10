import type { NextAuthConfig } from "next-auth";

export const authConfig = {
    pages: {
        signIn: "/login",
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const role = (auth?.user as any)?.role;
            const isOnAdmin = nextUrl.pathname.startsWith("/admin");
            const isOnStaff = nextUrl.pathname.startsWith("/staff");

            // 1. 비로그인 사용자는 /admin, /staff 접근 완전 차단
            if (!isLoggedIn && (isOnAdmin || isOnStaff)) {
                return false; // 자동으로 /login으로 리다이렉트됨
            }

            // 2. 관리자 경로 접근 제어
            if (isOnAdmin) {
                if (role === "admin") return true;
                return Response.redirect(new URL("/staff", nextUrl)); // 스태프는 스태프 페이지로
            }

            // 3. 스태프 경로 접근 제어
            if (isOnStaff) {
                if (role === "admin" || role === "staff") return true;
                return false; // 그 외는 로그인 유도
            }

            // 4. 로그인된 상태에서 로그인/루트 접근 시 자동 리다이렉트
            if (isLoggedIn && (nextUrl.pathname === "/login" || nextUrl.pathname === "/")) {
                const target = role === "admin" ? "/admin" : "/staff";
                return Response.redirect(new URL(target, nextUrl));
            }

            return true;
        },
    },
    providers: [], // Providers will be added in auth.ts
} satisfies NextAuthConfig;
