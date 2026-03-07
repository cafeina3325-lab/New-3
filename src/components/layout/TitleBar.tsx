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
            className="relative z-[60] w-[170px] h-[100px] sm:w-[170px] sm:h-[100px] md:w-[325px] md:h-[120px] bg-gray-400 shrink-0 pointer-events-auto flex flex-col items-center justify-center hover:bg-gray-500 transition-colors cursor-pointer"
        >
            <span className="text-white font-bold text-2xl leading-tight">Flying</span>
            <span className="text-white font-bold text-2xl leading-tight">Studio</span>
        </Link>
    );
}
