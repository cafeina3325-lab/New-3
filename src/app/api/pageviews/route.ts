/**
 * 페이지뷰(Pageviews) 추적 엔드포인트
 * 
 * 메인 페이지 접속 시 자동으로 호출되어 방문자 로그를 DB(Prisma)에 남기는 역할을 합니다.
 * - POST: 새로운 방문 타임스탬프 기록
 * - GET: 총 방문수, 당월 방문수, 전체 로그(어드민 차트용) 데이터 집계
 * - DELETE: 모든 방문 기록 초기화 (관리자용)
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// POST: 페이지 조회 기록 (DB에 타임스탬프 레코드 삽입)
export async function POST() {
    try {
        await prisma.pageview.create({ data: {} });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "조회수 기록 실패" }, { status: 500 });
    }
}

// GET: 전체 조회수 + 이번 달 조회수 + 전체 로그 반환
export async function GET() {
    try {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        // 전체 개수와 월별 개수를 동시에 조회
        const [total, monthly, logs] = await Promise.all([
            prisma.pageview.count(),
            prisma.pageview.count({
                where: { timestamp: { gte: startOfMonth } },
            }),
            prisma.pageview.findMany({
                orderBy: { timestamp: "asc" },
                select: { timestamp: true },
            }),
        ]);

        return NextResponse.json({
            total,
            monthly,
            logs: logs.map((l) => ({ timestamp: l.timestamp.toISOString() })),
        });
    } catch (error) {
        return NextResponse.json({ error: "조회수 조회 실패" }, { status: 500 });
    }
}

// DELETE: 페이지 조회 기록 초기화
export async function DELETE() {
    try {
        await prisma.pageview.deleteMany();
        return NextResponse.json({ success: true, message: "방문 기록이 초기화되었습니다." });
    } catch (error) {
        return NextResponse.json({ error: "방문 기록 초기화 실패" }, { status: 500 });
    }
}
