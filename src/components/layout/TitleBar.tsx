/**
 * 최상단 로고 타이틀바(TitleBar) 컴포넌트
 * 
 * Navbar 좌측 최상단에 고정 렌더링되며, 클릭 시 메인 랜딩 페이지('/')로 라우팅하는
 * 스튜디오 사명 로고 버튼 역할을 수행합니다.
 */

import Link from "next/link";

export default function TitleBar() {
    return (
        <Link
            href="/"
            className="relative z-[60] h-[110px] md:h-[150px] pl-6 md:pl-12 shrink-0 pointer-events-auto flex flex-col items-start justify-center luxury-title-container cursor-pointer bg-transparent transition-all duration-300"
        >
            <div className="luxury-title flex flex-col">
                <span className="text-3xl md:text-5xl lg:text-6xl font-black leading-none">Flying</span>
                <span className="text-2xl md:text-4xl lg:text-5xl font-black leading-none self-end">Studio</span>
            </div>
        </Link>
    );
}
