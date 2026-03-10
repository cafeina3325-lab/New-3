import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const reviewId = searchParams.get("reviewId");

        if (!reviewId) {
            return NextResponse.json({ error: "리뷰 ID가 필요합니다." }, { status: 400 });
        }

        const review = await prisma.review.findUnique({
            where: { reviewId },
        });

        if (!review) {
            return NextResponse.json({ error: "해당 리뷰를 찾을 수 없습니다." }, { status: 404 });
        }

        return NextResponse.json({ review });
    } catch (error) {
        console.error("리뷰 조회 오류:", error);
        return NextResponse.json({ error: "리뷰 정보를 가져오는데 실패했습니다." }, { status: 500 });
    }
}
