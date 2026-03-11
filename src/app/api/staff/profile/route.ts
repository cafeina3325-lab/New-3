/**
 * 스태프 프로필 관리 API
 * - GET: 프로필 정보 조회
 * - PATCH: 닉네임/생일/전화번호 변경
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

// GET: 내 프로필 정보 조회
export async function GET() {
    try {
        const session = await auth();
        if (!session || !session.user || (session.user as any).role !== "staff") {
            return NextResponse.json({ error: "권한이 없습니다." }, { status: 401 });
        }

        const username = session.user.name as string;
        const staff = await (prisma as any).staff.findUnique({
            where: { username },
            select: { username: true, nickname: true, birthday: true, phone: true },
        });

        if (!staff) {
            return NextResponse.json({ error: "계정을 찾을 수 없습니다." }, { status: 404 });
        }

        return NextResponse.json(staff);
    } catch (error) {
        console.error("프로필 조회 오류:", error);
        return NextResponse.json({ error: "프로필 조회에 실패했습니다." }, { status: 500 });
    }
}

// PATCH: 프로필 정보 업데이트 (닉네임, 생일, 전화번호)
export async function PATCH(req: NextRequest) {
    try {
        const session = await auth();

        if (!session || !session.user || (session.user as any).role !== "staff") {
            return NextResponse.json({ error: "권한이 없습니다." }, { status: 401 });
        }

        const body = await req.json();
        const { newNickname, birthday, phone } = body;

        const currentUsername = session.user.name as string;
        const updateData: any = {};

        if (newNickname !== undefined) {
            if (newNickname && newNickname.trim().length < 2) {
                return NextResponse.json(
                    { error: "닉네임은 최소 2자 이상이어야 합니다." },
                    { status: 400 }
                );
            }
            updateData.nickname = newNickname.trim() || null;
        }

        if (birthday !== undefined) {
            updateData.birthday = birthday.trim() || null;
        }

        if (phone !== undefined) {
            updateData.phone = phone.trim() || null;
        }

        if (Object.keys(updateData).length === 0) {
            return NextResponse.json({ message: "변경사항이 없습니다." });
        }

        await (prisma as any).staff.update({
            where: { username: currentUsername },
            data: updateData,
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("프로필 변경 오류:", error);
        return NextResponse.json({ error: "프로필 변경에 실패했습니다." }, { status: 500 });
    }
}

