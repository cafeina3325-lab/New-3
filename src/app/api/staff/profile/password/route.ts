import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function PATCH(req: NextRequest) {
    try {
        const session = await auth();

        if (!session || !session.user || (session.user as any).role !== "staff") {
            return NextResponse.json({ error: "권한이 없습니다." }, { status: 401 });
        }

        const body = await req.json();
        const { newPassword } = body;

        if (!newPassword || newPassword.trim().length < 4) {
            return NextResponse.json(
                { error: "비밀번호는 최소 4자 이상이어야 합니다." },
                { status: 400 }
            );
        }

        const username = session.user.name as string;
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await (prisma as any).staff.update({
            where: { username },
            data: { password: hashedPassword },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("비밀번호 변경 오류:", error);
        return NextResponse.json({ error: "비밀번호 변경에 실패했습니다." }, { status: 500 });
    }
}
