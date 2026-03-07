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

                const admin = await prisma.admin.findUnique({
                    where: { username: credentials.username as string }
                });

                if (!admin) return null;

                const passwordsMatch = await bcrypt.compare(
                    credentials.password as string,
                    admin.password
                );

                if (passwordsMatch) return { id: admin.id, name: admin.username };

                return null;
            },
        }),
    ],
});
