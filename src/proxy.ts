import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

const { auth } = NextAuth(authConfig);

// Next.js 16의 새로운 proxy 컨벤션을 따르며, 
// authConfig에 정의된 권한 규칙에 따라 요청을 가로채거나 허용합니다.
export function proxy(request: any) {
    return auth(request);
}

export const config = {
    // API, 정적 파일 등을 제외한 모든 경로 보호
    matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
