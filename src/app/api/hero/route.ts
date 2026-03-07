/**
 * 히어로(Hero) 영상 관리 API 엔드포인트 (Prisma + Vercel Blob 기반)
 * 
 * 랜딩 페이지 최상단 백그라운드 영상(비디오) 파일을 처리합니다.
 * - GET: 현재 활성화(isActive: true)된 단일 히어로 영상 조회
 * - POST: Multipart FormData 형식으로 수신받은 새 영상 파일(File 객체)을 Blob 스토리지로 직접 업로드하고 기존 영상을 비활성화합니다.
 * - DELETE: 현재 활성화된 영상을 비활성화 상태로 변경 (메인 페이지에 기본 텍스처 폴백 적용 목적)
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { uploadFileToBlob } from "@/lib/blob";

// GET /api/hero - 활성화된 히어로 영상 조회
export async function GET() {
    try {
        const video = await prisma.heroVideo.findFirst({
            where: { isActive: true },
            orderBy: { createdAt: "desc" },
        });
        return NextResponse.json({ video });
    } catch (error: unknown) {
        console.error("Failed to fetch hero video:", error);
        return NextResponse.json({ video: null });
    }
}

// POST /api/hero - 히어로 영상 Blob 업로드 (기존 영상 교체)
export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json(
                { error: "업로드할 파일이 없습니다." },
                { status: 400 }
            );
        }

        // 1. Vercel Blob에 영상 업로드
        const publicUrl = await uploadFileToBlob(file, "hero/");

        // 2. 기존 활성 영상 비활성화 (DB 레코드만 — Blob은 별도 정리)
        await prisma.heroVideo.updateMany({
            where: { isActive: true },
            data: { isActive: false },
        });

        // 3. 새 영상 레코드 생성
        const video = await prisma.heroVideo.create({
            data: {
                url: publicUrl,
                filename: file.name,
                isActive: true,
            },
        });

        return NextResponse.json({ video }, { status: 201 });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "알 수 없는 오류";
        console.error("Hero video upload error:", error);
        return NextResponse.json(
            { error: `업로드 실패: ${message}` },
            { status: 500 }
        );
    }
}

// DELETE /api/hero - 히어로 영상 삭제
export async function DELETE() {
    try {
        // 활성 영상 비활성화 (Blob 파일은 별도 정리 또는 유지)
        await prisma.heroVideo.updateMany({
            where: { isActive: true },
            data: { isActive: false },
        });

        return NextResponse.json({ message: "영상이 삭제되었습니다." });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "알 수 없는 오류";
        console.error("Failed to delete hero video:", error);
        return NextResponse.json(
            { error: `삭제 실패: ${message}` },
            { status: 500 }
        );
    }
}
