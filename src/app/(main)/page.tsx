// 파일 요약: 애플리케이션의 메인 홈 페이지 컴포넌트입니다.
// 여러 섹션(Hero, SectionB~E)을 조합하여 랜딩 페이지 전체를 구성합니다.

import Hero from "@/components/sections/Hero";
import SectionB from "@/components/sections/SectionB";
import SectionC from "@/components/sections/SectionC";
import SectionD from "@/components/sections/SectionD";
import SectionE from "@/components/sections/SectionE";
import PageViewTracker from "@/components/PageViewTracker";

// 함수 요약: 홈 페이지 뷰를 렌더링하는 메인 컴포넌트
// 역할: 각 Section 컴포넌트를 차례대로 배치하여 전체 페이지 구조를 생성합니다.
export default function Home() {
  return (
    // 메인 배경색과 기본 텍스트 색상을 설정하여 전체 테마를 구성합니다.
    <main className="bg-[#1C1310] text-[#F3EBE1] min-h-screen">
      <PageViewTracker />
      <Hero />
      <SectionB />
      <SectionC />
      <SectionD />
      <SectionE />
    </main>
  );
}
