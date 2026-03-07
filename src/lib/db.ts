/**
 * PrismaClient 싱글턴 인스턴스 설정
 * 
 * Next.js 개발 환경(HMR - Hot Module Replacement)에서 파일 변화 시
 * 데이터베이스 연결(Connection) 인스턴스가 중복 생성되어 
 * 연결 한도를 초과하는 문제를 방지하기 위한 전역 캐싱 코드입니다.
 */

import { PrismaClient } from "@prisma/client";

// Node.js의 globalThis 객체에 prisma 속성을 추가할 수 있도록 임시 캐스팅
const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

// 이미 캐시된 PrismaClient 인스턴스가 있다면 재사용하고, 없다면 새로 생성합니다.
export const prisma = globalForPrisma.prisma ?? new PrismaClient();

// 개발 환경에서는 새로 생성된 인스턴스를 전역 객체에 저장하여 캐싱합니다.
// 프로덕션 빌드에서는 불필요하므로 저장하지 않습니다.
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
