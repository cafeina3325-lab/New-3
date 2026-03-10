import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

export const { auth, signIn, signOut, handlers } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            async authorize(credentials) {
                if (!credentials?.username || !credentials?.password) return null;

                const username = credentials.username as string;
                const password = credentials.password as string;

                // 1. 관리자 확인
                const admin = await (prisma as any).admin.findUnique({ where: { username } });
                if (admin) {
                    const match = await bcrypt.compare(password, admin.password);
                    if (match) return { id: admin.id, name: admin.username, role: "admin" };
                }

                // 2. 스태프 확인
                const staff = await (prisma as any).staff.findUnique({ where: { username } });
                if (staff) {
                    const match = await bcrypt.compare(password, staff.password);
                    if (match) return { id: staff.id, name: staff.username, role: "staff" };
                }

                return null;
            },
        }),
    ],
    callbacks: {
        ...authConfig.callbacks,
        async jwt({ token, user }) {
            if (user) {
                token.role = (user as any).role;
                token.id = (user as any).id;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).role = token.role;
                (session.user as any).id = token.id;
            }
            return session;
        }
    }
});
