/**
 * 예약(Appointments) 엔드포인트 라우트
 * 
 * 고객 예약 신청 데이터의 CRUD를 처리합니다.
 * 주요 기능:
 * - GET: 관리자 패널의 목록용 전체 예약 파싱
 * - POST: 클라이언트에서 신규 예약 접수 시 ID(`AP-XXXXXX`) 발급 후 저장
 * - PATCH: 처리 상태(대기/확정/취소) 변경, 숨김(isDeleted) 및 영구 보관(isArchived) 처리
 * - DELETE: 개별 항목 삭제 또는 전체 예약 데이터 초기화
 */

import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/db";

// GET: 전체 예약 목록 조회
export async function GET() {
    try {
        const appointments = await prisma.appointment.findMany({
            orderBy: { createdAt: "desc" },
        });
        return NextResponse.json(appointments);
    } catch (error) {
        return NextResponse.json({ error: "예약 목록을 불러오는데 실패했습니다." }, { status: 500 });
    }
}

// POST: 새 예약 생성
export async function POST(request: Request) {
    try {
        const requestBody = await request.json();
        const { name, gender, phone, part, genre, referenceText, referenceReviewId, source, files, date, time } = requestBody;

        if (!name || !phone || !part || !genre || !date || !time) {
            return NextResponse.json({ error: "필수 항목이 누락되었습니다." }, { status: 400 });
        }

        const appointmentId = "AP-" + crypto.randomBytes(3).toString("hex").toUpperCase();

        const newAppointment = await prisma.appointment.create({
            data: {
                id: appointmentId,
                clientName: name,
                gender: gender || null,
                contact: phone,
                part,
                genre,
                service: `${genre} ${part}`,
                referenceText: referenceText || "",
                referenceReviewId: referenceReviewId || "",
                source: source || null,
                files: files || [],
                date,
                time,
                status: "pending",
            },
        });

        return NextResponse.json(newAppointment, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "예약 저장에 실패했습니다." }, { status: 500 });
    }
}

// PATCH: 예약 상태 변경 및 복구
export async function PATCH(request: Request) {
    try {
        const body = await request.json();
        const { id, status, isDeleted, isArchived } = body;

        if (!id) {
            return NextResponse.json({ error: "ID를 지정해주세요." }, { status: 400 });
        }

        const existing = await prisma.appointment.findUnique({ where: { id } });
        if (!existing) {
            return NextResponse.json({ error: "예약을 찾을 수 없습니다." }, { status: 404 });
        }

        // 전달된 필드만 업데이트
        const updateData: Record<string, unknown> = {};
        if (status) updateData.status = status;
        if (isDeleted !== undefined) updateData.isDeleted = isDeleted;
        if (isArchived !== undefined) updateData.isArchived = isArchived;

        const updated = await prisma.appointment.update({
            where: { id },
            data: updateData,
        });

        return NextResponse.json(updated);
    } catch (error) {
        return NextResponse.json({ error: "예약 상태 변경에 실패했습니다." }, { status: 500 });
    }
}

// DELETE: 예약 소프트 삭제 또는 전체 초기화
export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");
        const hardDelete = searchParams.get("hardDelete") === "true";
        const resetAll = searchParams.get("resetAll") === "true";

        // 전체 초기화 처리
        if (resetAll) {
            await prisma.appointment.deleteMany();
            return NextResponse.json({ success: true, message: "모든 예약 데이터가 초기화되었습니다." });
        }

        if (!id) {
            return NextResponse.json({ error: "ID를 지정해주세요." }, { status: 400 });
        }

        const existing = await prisma.appointment.findUnique({ where: { id } });
        if (!existing) {
            return NextResponse.json({ error: "해당 예약을 찾을 수 없습니다." }, { status: 404 });
        }

        if (hardDelete) {
            // 통계까지 삭제하는 완전 삭제
            await prisma.appointment.delete({ where: { id } });
        } else {
            // 소프트 삭제 — 플래그만 변경하여 통계 유지
            await prisma.appointment.update({
                where: { id },
                data: { isDeleted: true },
            });
        }

        return NextResponse.json({
            success: true,
            message: hardDelete ? "예약이 완전히 삭제되었습니다." : "예약이 목록에서 삭제되었습니다.",
        });
    } catch (error) {
        return NextResponse.json({ error: "예약 삭제에 실패했습니다." }, { status: 500 });
    }
}
