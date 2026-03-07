/**
 * 프로젝트 전역 상수(Constants) 데이터 정의
 * 
 * 내비게이션 구성, 필터 옵션 등 여러 컴포넌트에서 공통으로 재사용되는 
 * 정적인 기준 데이터 구조체 배열들을 중앙 집중식으로 관리합니다.
 */

/**
 * 내비게이션 메뉴 아이템의 타입 정의
 */
export type MenuItem = {
    name: string; // 화면에 노출될 메뉴 이름
    path: string; // 이동할 로컬 라우팅 경로
    subItems?: { name: string; path: string; }[]; // 드롭다운용 하위 메뉴 (선택사항)
};

/**
 * 전역 GNB(Global Navigation Bar) 및 Footer 등에서 공용으로 출력되는 메인 메뉴 목록
 */
export const MENU_ITEMS: MenuItem[] = [
    { name: "소개", path: "/about" },
    { name: "이벤트", path: "/event" },
    { name: "갤러리", path: "/gallery" },
    { name: "진행과정", path: "/process" },
    { name: "FAQ", path: "/faq" },
];

/**
 * 스튜디오 자체적으로 다루는 타투 장르(Category)의 공식 기준 목록
 * 갤러리/리뷰 필터링 및 관리자 페이지에서의 선택 리스트로 쓰입니다.
 */
export const GENRES = [
    "Irezumi", "Old School", "Tribal", "Black & Grey", "Blackwork",
    "Oriental Art", "Watercolor", "Illustration", "Mandala", "Sak Yant", "Lettering", "ETC."
];

/**
 * 고객의 신체 부위(Anatomy)를 분류하는 공식 영문 기준 목록
 * 예약 접수 폼, 모달, 포트폴리오 메타데이터 입력 시 공통 드롭다운으로 쓰입니다.
 */
export const PARTS = [
    "Head", "Face", "Neck", "Shoulder", "Chest",
    "Belly", "Back", "Arm", "Leg", "Hand", "Foot"
];
