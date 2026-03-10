/**
 * 클라이언트 리뷰(Reviews) 엔드포인트 라우트
 * 
 * 고객이 남긴 타투샵 방문 후기 데이터를 생성, 조회, 수정, 삭제하는 엔드포인트입니다.
 * - POST: 익명 작성(OriginalName과 Name 분리 배포), 텍스트/이미지 내용 저장, 고객 비밀번호 등록 기반
 * - PATCH: 수정 시 비밀번호(password) 일치 여부를 검증하고 리뷰를 업데이트
 * - DELETE: 관리자 패널용 리뷰 직접 삭제
 */

import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/db";
import { uploadBase64ToBlob } from "@/lib/blob";

// GET: 리뷰 목록 조회 또는 특정 리뷰 ID 존재 여부 확인
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const reviewId = searchParams.get("reviewId");

        // 만약 reviewId 쿼리가 있다면 해당 리뷰가 존재하는지 확인 (Public)
        if (reviewId) {
            const review = await prisma.review.findUnique({
                where: { reviewId },
                select: { id: true }
            });
            return NextResponse.json({ exists: !!review });
        }

        const reviews = await prisma.review.findMany({
            orderBy: { createdAt: "desc" },
        });
        return NextResponse.json({ reviews });
    } catch (error) {
        console.error("Failed to read reviews:", error);
        return NextResponse.json({ error: "Failed to read reviews" }, { status: 500 });
    }
}

// POST: 새 리뷰 생성 (base64 이미지 → Blob 업로드)
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, originalName, password, rating, genre, content, image } = body;

        let imageUrl: string | null = null;

        // base64 이미지가 전달된 경우 Blob에 업로드
        if (image && image.startsWith("data:image")) {
            imageUrl = await uploadBase64ToBlob(image, "reviews/");
        }

        const newReview = await prisma.review.create({
            data: {
                reviewId: `RV-${crypto.randomBytes(3).toString("hex").toUpperCase()}`,
                name,
                originalName: originalName || name,
                password,
                phone: body.phone || "",
                rating,
                genre,
                content,
                imageUrl,
            },
        });

        return NextResponse.json({ message: "Review created successfully", review: newReview }, { status: 201 });
    } catch (error) {
        console.error("Failed to create review:", error);
        return NextResponse.json({ error: "Failed to create review" }, { status: 500 });
    }
}

// DELETE: 리뷰 삭제
export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        if (!id) return NextResponse.json({ error: "No review ID provided" }, { status: 400 });

        await prisma.review.delete({ where: { id } });
        return NextResponse.json({ message: "Review deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Failed to delete review:", error);
        return NextResponse.json({ error: "Failed to delete review" }, { status: 500 });
    }
}

// PATCH: 리뷰 수정 (비밀번호 확인 후 업데이트)
export async function PATCH(req: Request) {
    try {
        const body = await req.json();
        const { id, name, originalName, phone, rating, genre, content, password, image } = body;

        if (!id) return NextResponse.json({ error: "No review ID provided" }, { status: 400 });

        const existing = await prisma.review.findUnique({ where: { id } });
        if (!existing) {
            return NextResponse.json({ error: "Review not found" }, { status: 404 });
        }

        // 비밀번호 확인
        if (existing.password !== password) {
            return NextResponse.json({ error: "Password mismatch" }, { status: 401 });
        }

        let imageUrl = existing.imageUrl;

        // base64 이미지가 전달된 경우 Blob 재업로드
        if (image && image.startsWith("data:image")) {
            imageUrl = await uploadBase64ToBlob(image, "reviews/");
        }

        const updated = await prisma.review.update({
            where: { id },
            data: {
                name: name !== undefined ? name : existing.name,
                originalName: originalName !== undefined ? originalName : existing.originalName,
                phone: phone !== undefined ? phone : existing.phone,
                rating: rating !== undefined ? rating : existing.rating,
                genre: genre !== undefined ? genre : existing.genre,
                content: content !== undefined ? content : existing.content,
                imageUrl,
            },
        });

        return NextResponse.json({ message: "Review updated successfully", review: updated }, { status: 200 });
    } catch (error) {
        console.error("Failed to update review:", error);
        return NextResponse.json({ error: "Failed to update review" }, { status: 500 });
    }
}
