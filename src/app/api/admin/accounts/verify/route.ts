import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { id, role, password } = body;

        if (!id || !role || !password) {
            return NextResponse.json({ error: "필수 정보가 누락되었습니다." }, { status: 400 });
        }

        const model = role === "admin" ? (prisma as any).admin : (prisma as any).staff;
        const account = await model.findUnique({ where: { id } });

        if (!account) {
            return NextResponse.json({ error: "계정을 찾을 수 없습니다." }, { status: 404 });
        }

        const isMatch = await bcrypt.compare(password, account.password);

        return NextResponse.json({ isMatch });
    } catch (error) {
        console.error("비밀번호 검증 오류:", error);
        return NextResponse.json({ error: "검증 실패" }, { status: 500 });
    }
}
