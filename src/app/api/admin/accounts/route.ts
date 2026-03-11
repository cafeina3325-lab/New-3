/**
 * 관리자/스태프 계정 관리 API
 * 
 * GET    - 관리자 및 스태프 계정 목록 조회 (비밀번호 필드 제외)
 * POST   - 새 계정 생성 (role: "admin" | "staff")
 * DELETE - 계정 삭제 (id + role 파라미터)
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

// GET: 전체 계정 목록 조회
export async function GET() {
    try {
        const [admins, staffs] = await Promise.all([
            (prisma as any).admin.findMany({
                select: { id: true, username: true, nickname: true, phone: true, createdAt: true, birthday: true },
                orderBy: { createdAt: "desc" },
            }),
            (prisma as any).staff.findMany({
                select: { id: true, username: true, nickname: true, phone: true, createdAt: true, birthday: true },
                orderBy: { createdAt: "desc" },
            }),
        ]);

        return NextResponse.json({ admins, staffs });
    } catch (error) {
        console.error("계정 조회 오류:", error);
        return NextResponse.json({ error: "계정 목록 조회 실패" }, { status: 500 });
    }
}

// POST: 새 계정 생성
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { username, password, role, nickname } = body;

        if (!username || !password || !role) {
            return NextResponse.json(
                { error: "아이디, 비밀번호, 역할을 모두 입력해 주세요." },
                { status: 400 }
            );
        }

        if (role !== "admin" && role !== "staff") {
            return NextResponse.json(
                { error: "역할은 admin 또는 staff만 가능합니다." },
                { status: 400 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const model = role === "admin" ? (prisma as any).admin : (prisma as any).staff;

        // 중복 체크
        const existing = await model.findUnique({ where: { username } });
        if (existing) {
            return NextResponse.json(
                { error: "이미 존재하는 아이디입니다." },
                { status: 409 }
            );
        }

        const newAccount = await model.create({
            data: { username, password: hashedPassword, nickname: nickname || null },
        });

        return NextResponse.json(
            { id: newAccount.id, username: newAccount.username, role },
            { status: 201 }
        );
    } catch (error) {
        console.error("계정 생성 오류:", error);
        return NextResponse.json({ error: "계정 생성 실패" }, { status: 500 });
    }
}

// DELETE: 계정 삭제
export async function DELETE(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        const role = searchParams.get("role");

        if (!id || !role) {
            return NextResponse.json(
                { error: "id와 role 파라미터가 필요합니다." },
                { status: 400 }
            );
        }

        const model = role === "admin" ? (prisma as any).admin : (prisma as any).staff;

        await model.delete({ where: { id } });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("계정 삭제 오류:", error);
        return NextResponse.json({ error: "계정 삭제 실패" }, { status: 500 });
    }
}
// PATCH: 계정 정보 업데이트
export async function PATCH(req: NextRequest) {
    try {
        const body = await req.json();
        const { id, role, username, password, birthday, currentPassword, nickname, phone } = body;

        if (!id || !role) {
            return NextResponse.json({ error: "필수 정보가 누락되었습니다." }, { status: 400 });
        }

        const model = role === "admin" ? (prisma as any).admin : (prisma as any).staff;

        // 기존 계정 정보 조회
        const existingAccount = await model.findUnique({ where: { id } });
        if (!existingAccount) {
            return NextResponse.json({ error: "계정을 찾을 수 없습니다." }, { status: 404 });
        }

        const updateData: any = {};

        // 1. 아이디 변경 시 중복 체크
        if (username && username !== existingAccount.username) {
            const duplicate = await model.findUnique({ where: { username } });
            if (duplicate) {
                return NextResponse.json({ error: "이미 존재하는 아이디입니다." }, { status: 409 });
            }
            updateData.username = username;
        }

        // 2. 비밀번호 변경 시 현재 비밀번호 검증 (관리자 계정만 필수)
        if (password) {
            if (role === "admin") {
                if (!currentPassword) {
                    return NextResponse.json({ error: "현재 비밀번호를 입력해 주세요." }, { status: 400 });
                }
                const isMatch = await bcrypt.compare(currentPassword, existingAccount.password);
                if (!isMatch) {
                    return NextResponse.json({ error: "현재 비밀번호가 일치하지 않습니다." }, { status: 401 });
                }

                // 새 비밀번호가 현재 비밀번호와 동일한지 체크
                const isSameAsCurrent = await bcrypt.compare(password, existingAccount.password);
                if (isSameAsCurrent) {
                    return NextResponse.json({ error: "현재 비밀번호와 동일한 비밀번호는 사용할 수 없습니다." }, { status: 400 });
                }
            }
            updateData.password = await bcrypt.hash(password, 10);
        }

        // 3. 생일 업데이트
        if (birthday !== undefined) {
            updateData.birthday = birthday;
        }

        // 4. 닉네임 업데이트
        if (nickname !== undefined) {
            updateData.nickname = nickname;
        }

        // 5. 전화번호 업데이트
        if (phone !== undefined) {
            updateData.phone = phone;
        }

        if (Object.keys(updateData).length === 0) {
            return NextResponse.json({ message: "수정할 내용이 없습니다." });
        }

        await model.update({
            where: { id },
            data: updateData,
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("계정 업데이트 오류:", error);
        return NextResponse.json({ error: "계정 업데이트 실패" }, { status: 500 });
    }
}
