/**
 * 애플리케이션 최상위 단일 레이아웃(Root Layout)
 * 
 * Next.js App 라우터 구조에서 모든 페이지를 감싸는 절대적인 진입점입니다.
 * 웹폰트(Geist) 로드, 글로벌 CSS 파일 적용, SEO용 메타데이터 정의 및
 * <html>, <body> 표준 태그 구조를 렌더링합니다.
 */

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// --- Font Configuration ---
// 가독성을 위한 기본 산세리프(San-serif) 영문 폰트
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// 코딩 혹은 고정폭(Monospace) 스타일 영문 폰트
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// --- Metadata Configuration ---
// SEO 최적화 및 브라우저 탭, 소셜 스니펫에 노출될 기본 프로젝트 명세
export const metadata: Metadata = {
  title: "Flying Studio",
  description: "Bespoke Tattoo Studio in Korea",
};

/**
 * RootLayout 메인 래퍼(Wrapper) 컴포넌트
 * @param children - 하위 페이지 컴포넌트들이 주입될 슬롯
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      {/* 폰트 CSS 변수 선언 및 텍스트 렌더링 품질을 높이는 안티앨리어싱(antialiased) 적용 */}
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* 모든 개별 페이지(.tsx) 혹은 하위 레이아웃 내용이 이곳에 주입됩니다. */}
        {children}
      </body>
    </html>
  );
}
