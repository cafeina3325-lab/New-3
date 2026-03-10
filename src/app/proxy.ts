import NextAuth from "next-auth"
import { authConfig } from "@/auth.config"

import { NextRequest } from "next/server"

const { auth } = NextAuth(authConfig)

export function proxy(request: any) {
    return (auth as any)(request)
}

export const config = {
    matcher: [
        "/((?!api/|_next/static|_next/image|favicon.ico).*)"
    ]
}
