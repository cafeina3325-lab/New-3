/**
 * 전용 관리자 계정 생성 스크립트
 * 
 * 실행: node scripts/create-admin.mjs
 */
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const username = 'admin'; // 기본 관리자 아이디
    const password = 'admin-password-1234'; // 기본 비밀번호 (사용자에게 변경 요청 예정)

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const newAdmin = await prisma.admin.upsert({
            where: { username },
            update: { password: hashedPassword },
            create: {
                username,
                password: hashedPassword,
            },
        });
        console.log('✅ 관리자 계정이 생성/업데이트되었습니다:', newAdmin.username);
        console.log('로그인 아이디: admin');
        console.log('로그인 비밀번호:', password);
    } catch (error) {
        console.error('❌ 관리자 계정 생성 중 오류 발생:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
