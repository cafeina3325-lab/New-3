/**
 * 어드민-스태프 통합 메신저 API
 * 
 * GET  - 예전 메시지 목록 조회 (최근 50개)
 * POST - 새 메시지 전송 (세션 정보 기반)
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

// GET: 메시지 목록 조회
export async function GET() {
    try {
        const session = await auth();
        if (!session || !session.user) {
            return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
        }

        const messages = await (prisma as any).chatMessage.findMany({
            take: 50,
            orderBy: { createdAt: "asc" },
        });

        return NextResponse.json(messages);
    } catch (error) {
        console.error("채팅 메시지 조회 오류:", error);
        return NextResponse.json({ error: "메시지 조회 실패" }, { status: 500 });
    }
}

// POST: 새 메시지 전송
export async function POST(req: NextRequest) {
    try {
        const session = await auth();
        if (!session || !session.user) {
            return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
        }

        const { content } = await req.json();
        if (!content || !content.trim()) {
            return NextResponse.json({ error: "메시지 내용을 입력하세요." }, { status: 400 });
        }

        const user = session.user as any;

        const newMessage = await (prisma as any).chatMessage.create({
            data: {
                senderId: user.id || "unknown",
                username: user.name || "Unknown",
                role: user.role || "unknown",
                content: content.trim(),
            },
        });

        return NextResponse.json(newMessage, { status: 201 });
    } catch (error) {
        console.error("메시지 전송 오류:", error);
        return NextResponse.json({ error: "메시지 전송 실패" }, { status: 500 });
    }
}
