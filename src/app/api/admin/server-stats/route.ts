/**
 * 서버 통계(Server Stats) API 라우트
 * 
 * Vercel Blob 스토리지 내 저장된 모든 에셋(이미지, 영상 등) 리스트를 조회하고,
 * 폴더 카테고리(gallery, reviews, event, hero 등) 별 누적 파일 용량과 개수를 집계하여
 * 관리자 패널(대시보드)에 제공하는 엔드포인트입니다.
 */

import { NextResponse } from "next/server";
import { list } from "@vercel/blob";

const BLOB_TOKEN =
    process.env.BLOB_READ_WRITE_TOKEN ||
    process.env.FLYING_READ_WRITE_TOKEN ||
    process.env.FLING_READ_WRITE_TOKEN ||
    "";

export async function GET() {
    try {
        if (!BLOB_TOKEN) {
            return NextResponse.json({ error: "Blob token not found" }, { status: 500 });
        }

        // 1. Vercel Blob 파일 리스트 전체 조회
        const { blobs } = await list({ token: BLOB_TOKEN });

        // 2. 카테고리별 용량 집계
        const breakdown: Record<string, number> = {
            "gallery/": 0,
            "reviews/": 0,
            "event/": 0,
            "hero/": 0,
            "others": 0
        };

        let totalSizeBytes = 0;

        const keys = Object.keys(breakdown).filter(key => key !== "others");
        blobs.forEach(blob => {
            totalSizeBytes += blob.size;

            const matchedKey = keys.find(key => blob.pathname.startsWith(key));
            if (matchedKey) {
                breakdown[matchedKey] += blob.size;
            } else {
                breakdown["others"] += blob.size;
            }
        });

        // 3. 페이지당 예상 전송량 계산 (모든 활성 에셋 크기의 합 / 추정치)
        // 기본적으로 한 페이지 로드 시 필요한 정적 에셋(이미지 등)의 평균 크기를 짐작하기 위함
        const totalFiles = blobs.length;
        const avgAssetSize = totalFiles > 0 ? totalSizeBytes / totalFiles : 0;

        return NextResponse.json({
            totalSizeBytes,
            breakdown,
            avgAssetSize,
            fileCount: totalFiles
        });
    } catch (error) {
        console.error("Server stats error:", error);
        return NextResponse.json({ error: "서버 통계 조회 실패" }, { status: 500 });
    }
}
