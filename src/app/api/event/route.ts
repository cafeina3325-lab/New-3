/**
 * 이벤트(Event) 엔드포인트 라우트
 * 
 * 팝업 및 특별 행사 공지를 관리하는 API입니다.
 * POST 요청을 통해 수신된 Base64 형식의 이미지를 Vercel Blob으로 업로드(`uploadBase64ToBlob`)하고,
 * 반환된 URL과 텍스트 정보를 DB(Prisma)에 이벤트 아이템으로 등록합니다.
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { uploadBase64ToBlob } from "@/lib/blob";

// GET: 이벤트 목록 조회 (최신순)
export async function GET() {
    try {
        const items = await prisma.event.findMany({
            orderBy: { createdAt: "desc" },
        });
        return NextResponse.json({ items });
    } catch (error) {
        console.error("Failed to read events:", error);
        return NextResponse.json({ error: "Failed to fetch event items" }, { status: 500 });
    }
}

// POST: 새 이벤트 생성 (base64 이미지 → Blob 업로드)
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { title, genre, price, image } = body;

        if (!image) {
            return NextResponse.json({ error: "Image is required" }, { status: 400 });
        }

        let imageUrl: string | null = null;

        if (image.startsWith("data:image")) {
            imageUrl = await uploadBase64ToBlob(image, "event/");
        }

        const newItem = await prisma.event.create({
            data: {
                title: title || "무제 이벤트",
                genre: genre || "ETC.",
                price: price || 0,
                imageUrl,
            },
        });

        return NextResponse.json({ message: "Event item created", item: newItem }, { status: 201 });
    } catch (error) {
        console.error("Failed to create event item:", error);
        return NextResponse.json({ error: "Failed to save event item" }, { status: 500 });
    }
}

// DELETE: 이벤트 삭제
export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        if (!id) return NextResponse.json({ error: "No ID provided" }, { status: 400 });

        await prisma.event.delete({ where: { id } });
        return NextResponse.json({ message: "Event item deleted" }, { status: 200 });
    } catch (error) {
        console.error("Failed to delete event item:", error);
        return NextResponse.json({ error: "Failed to delete item" }, { status: 500 });
    }
}
