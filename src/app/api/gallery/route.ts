/**
 * 갤러리(Gallery) 엔드포인트 라우트
 * 
 * 포트폴리오 갤러리 이미지들의 업로드 및 정보를 관리합니다.
 * - POST/PUT: Base64 형태의 이미지를 받아 `uploadBase64ToBlob`을 통해 외부 스토리지(Blob)에 저장하고 URL을 포함한 메타데이터를 DB(Prisma)에 남깁니다.
 * - GET/DELETE: 목록 조회 및 삭제 제공
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { uploadBase64ToBlob } from "@/lib/blob";

// GET: 갤러리 목록 조회 (최신순)
export async function GET() {
    try {
        const items = await prisma.galleryItem.findMany({
            orderBy: { createdAt: "desc" },
        });
        return NextResponse.json({ items });
    } catch (error) {
        console.error("Failed to read gallery:", error);
        return NextResponse.json({ error: "Failed to fetch gallery items" }, { status: 500 });
    }
}

// POST: 갤러리 아이템 생성 (base64 이미지 → Blob 업로드)
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { title, genre, part, image } = body;

        console.log("[Gallery POST] 요청 수신:", { title, genre, part, hasImage: !!image, imageLength: image?.length });

        if (!image) {
            return NextResponse.json({ error: "Image is required" }, { status: 400 });
        }

        let imageUrl: string | null = null;

        if (image.startsWith("data:")) {
            if (!image.startsWith("data:image")) {
                // data:video/... 등 이미지가 아닌 형식 처리
                console.error("[Gallery POST] 지원하지 않는 미디어 형식:", image.substring(0, 50));
                return NextResponse.json({ error: "이미지 파일만 업로드할 수 있습니다." }, { status: 400 });
            }
            try {
                imageUrl = await uploadBase64ToBlob(image, "gallery/");
            } catch (uploadError: any) {
                console.error("[Gallery POST] Blob 업로드 실패:", uploadError.message);
                return NextResponse.json(
                    { error: `이미지 업로드 실패: ${uploadError.message}` },
                    { status: 500 }
                );
            }
        }

        console.log("[Gallery POST] DB 저장 시작:", { title, genre, part, imageUrl });

        const newItem = await prisma.galleryItem.create({
            data: {
                title: title || "무제",
                genre: genre || "기타",
                part: part || "기타",
                imageUrl,
            },
        });

        console.log("[Gallery POST] 등록 완료:", newItem.id);
        return NextResponse.json({ message: "Gallery item created", item: newItem }, { status: 201 });
    } catch (error: any) {
        console.error("[Gallery POST] 처리 실패:", error.message, error.stack);
        return NextResponse.json({ error: `Failed to save gallery item: ${error.message}` }, { status: 500 });
    }
}

// PUT: 갤러리 아이템 수정 (새 이미지가 base64인 경우만 Blob 재업로드)
export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const { id, title, genre, part, image } = body;

        if (!id) {
            return NextResponse.json({ error: "Item ID is required for update" }, { status: 400 });
        }

        const existing = await prisma.galleryItem.findUnique({ where: { id } });
        if (!existing) {
            return NextResponse.json({ error: "Item not found" }, { status: 404 });
        }

        let imageUrl = existing.imageUrl;

        // base64 이미지가 새로 전달된 경우에만 Blob 업로드
        if (image && image.startsWith("data:image")) {
            imageUrl = await uploadBase64ToBlob(image, "gallery/");
        }

        const updated = await prisma.galleryItem.update({
            where: { id },
            data: {
                title: title || existing.title,
                genre: genre || existing.genre,
                part: part || existing.part,
                imageUrl,
            },
        });

        return NextResponse.json({ message: "Gallery item updated", item: updated }, { status: 200 });
    } catch (error) {
        console.error("Failed to update gallery item:", error);
        return NextResponse.json({ error: "Failed to update item" }, { status: 500 });
    }
}

// DELETE: 갤러리 아이템 삭제
export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        if (!id) return NextResponse.json({ error: "No ID provided" }, { status: 400 });

        await prisma.galleryItem.delete({ where: { id } });
        return NextResponse.json({ message: "Gallery item deleted" }, { status: 200 });
    } catch (error) {
        console.error("Failed to delete gallery item:", error);
        return NextResponse.json({ error: "Failed to delete item" }, { status: 500 });
    }
}
