// 파일 요약: 포트폴리오 갤러리 및 메인 화면 마키(Marquee) 애니메이션에서 사용될 이미지 더미 데이터를 정의한 파일입니다.

// 타입 정의: 단일 포트폴리오 작업물의 구조체입니다.
export interface PortfolioItem {
    id: string;      // 고유 식별자
    image: string;   // 이미지 경로
    genre: string;   // 해당 작업물의 타투 장르 분류
    author: string;  // 작업 아티스트
}

// 정적 데이터 배열: 각 장르별 마키 애니메이션 흐름 및 갤러리 아이템 렌더링을 위해 최소 2~3세트씩 제공되는 더미 데이터 모음입니다.
export const PORTFOLIO_DATA: PortfolioItem[] = [
    { id: "iz1", image: "/Section E/irezumi.png", genre: "Irezumi", author: "Artist A" },
    { id: "os1", image: "/Section E/oldschool.png", genre: "Old School", author: "Artist B" },
    { id: "tr1", image: "/Section E/tribal.png", genre: "Tribal", author: "Artist C" },
    { id: "bg1", image: "/Section E/black-and-gray.png", genre: "Black & Grey", author: "Artist D" },
    { id: "bw1", image: "/Section E/blackwork.png", genre: "Blackwork", author: "Artist E" },
    { id: "oa1", image: "/Section E/oriental art.png", genre: "Oriental Art", author: "Artist F" },
    { id: "wc1", image: "/Section E/watercolor.png", genre: "Watercolor", author: "Artist G" },
    { id: "il1", image: "/Section E/illustration.png", genre: "Illustration", author: "Artist H" },
    { id: "md1", image: "/Section E/mandala.png", genre: "Mandala", author: "Artist I" },
    { id: "sy1", image: "/Section E/sak-yant.png", genre: "Sak Yant", author: "Artist J" },
    { id: "lt1", image: "/Section E/lettering.png", genre: "Lettering", author: "Artist K" },
    { id: "et1", image: "/Section E/etc.png", genre: "ETC.", author: "Artist L" },
    // 추가 더미 데이터 (마키 애니메이션의 자연스러운 루프를 위해 각 장르별로 중복 포함)
    { id: "iz2", image: "/Section E/irezumi.png", genre: "Irezumi", author: "Artist A" },
    { id: "os2", image: "/Section E/oldschool.png", genre: "Old School", author: "Artist B" },
    { id: "tr2", image: "/Section E/tribal.png", genre: "Tribal", author: "Artist C" },
    { id: "bg2", image: "/Section E/black-and-gray.png", genre: "Black & Grey", author: "Artist D" },
    { id: "bw2", image: "/Section E/blackwork.png", genre: "Blackwork", author: "Artist E" },
    { id: "oa2", image: "/Section E/oriental art.png", genre: "Oriental Art", author: "Artist F" },
    { id: "wc2", image: "/Section E/watercolor.png", genre: "Watercolor", author: "Artist G" },
    { id: "il2", image: "/Section E/illustration.png", genre: "Illustration", author: "Artist H" },
    { id: "md2", image: "/Section E/mandala.png", genre: "Mandala", author: "Artist I" },
    { id: "sy2", image: "/Section E/sak-yant.png", genre: "Sak Yant", author: "Artist J" },
    { id: "lt2", image: "/Section E/lettering.png", genre: "Lettering", author: "Artist K" },
    { id: "et2", image: "/Section E/etc.png", genre: "ETC.", author: "Artist L" },
];
