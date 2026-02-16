"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

// Define the data structure for categories and their sub-genres
const categoryData: Record<string, string[]> = {
    "Heritage & Scale": ["Irezumi", "Old School", "Tribal"],
    "Contrast & Precision": ["Black & Grey", "Blackwork"],
    "Artistic & Painterly": ["Oriental Art", "Watercolor", "Illustration"],
    "Geometry & Symbol": ["Mandala", "Sak Yant", "Lettering"],
    "ETC.": ["Specialties"]
};

// Data for main category descriptions
const categoryInfo: Record<string, string> = {
    "Heritage & Scale": "역사적인 배경을 지니며, 굵은 선과 뚜렷한 형태로 신체에 묵직한 존재감을 드러내는 장르들입니다.",
    "Contrast & Precision": "검은색 잉크의 농담과 밀도만으로 사물의 입체감과 정교함을 극대화하는 장르들입니다.",
    "Artistic & Painterly": "피부를 캔버스 삼아 붓 터치나 색채의 번짐, 작가의 고유한 화풍을 표현하는 장르들입니다.",
    "Geometry & Symbol": "정교한 대칭이나 섬세한 선명도, 텍스트가 지닌 고유의 의미가 가장 중요한 장르들입니다.",
    "ETC.": "기존의 장르로 분류하기 어렵거나, 미용 및 수정 목적이 강한 특수 타투 분야입니다."
};

type ContentSection = {
    title: string;
    items?: { subtitle?: string; text: string }[];
    list?: { term: string; desc: string }[];
    text?: string;
};

type GenreInfo = {
    desc: string;
    features: string[];
    details?: ContentSection[];
};

// Mock data for genre descriptions
const genreInfo: Record<string, GenreInfo> = {
    "Irezumi": {
        desc: "수세기를 이어온 일본의 전통 문신 양식입니다. 단순히 그림을 새기는 것을 넘어, 신체의 흐름을 따라 전신을 감싸는 거대한 서사를 만들어냅니다.",
        features: ["전신을 아우르는 흐름 (Full Body Flow)", "전통적인 소재와 상징", "묵직하고 깊은 발색"],
        details: [
            {
                title: "1. 기원과 역사",
                items: [
                    {
                        subtitle: "고대와 중세: 장식과 형벌의 공존",
                        text: "고대 일본의 조몬 시대에는 종교적 의미나 신분을 나타내기 위해 문신을 새겼으나, 점차 범죄자에게 낙인을 찍는 '경형(刑罰)'의 도구로 변질되었습니다."
                    },
                    {
                        subtitle: "에도 시대: 예술적 전성기",
                        text: "18세기 에도 시대에 화려한 이레즈미의 기틀이 마련되었습니다. 《수호전》 삽화의 유행과 우키요에 화가들의 참여로 단순 표식이 아닌 전신을 캔버스 삼는 '호리모노(Horimono)'라는 예술적 경지로 발전했습니다."
                    },
                    {
                        subtitle: "근대 이후: 음성화와 보존",
                        text: "메이지 유신 이후 야만적인 관습으로 간주되어 금지되었고 야쿠자 등과 연결되며 부정적 인식이 강해졌으나, 그 예술적 가치는 장인들에 의해 명맥이 이어져 왔습니다."
                    }
                ]
            },
            {
                title: "2. 주요 스타일과 특징",
                items: [
                    {
                        subtitle: "부위별 명칭",
                        text: "• 소신보리(전신), 무네와리(가슴 중앙 비움), 누키보리(주제만), 가쿠보리(배경 포함) 등 신체를 덮는 면적과 구도에 따라 독특한 명칭을 가집니다."
                    },
                    {
                        subtitle: "전통 기법: 테보리 (Tebori)",
                        text: "기계를 사용하지 않고 대나무나 금속 막대 끝에 바늘을 달아 손으로 직접 찌르는 전통 방식입니다. 깊은 색감과 질감 표현에 탁월합니다."
                    }
                ]
            },
            {
                title: "3. 주요 도안과 상징적 의미",
                list: [
                    { term: "용 (Ryu)", desc: "지혜, 힘, 보호를 상징하며 물과 하늘을 다스리는 영물" },
                    { term: "잉어 (Koi)", desc: "고난을 극복하고 성공하는 '입신양명', 인내와 용기" },
                    { term: "한야 (Hanya)", desc: "질투와 분노에 가득 찬 여인의 얼굴, 액운을 막는 벽사의 의미" },
                    { term: "봉황 (Hou-ou)", desc: "재탄생, 불멸, 승리, 길조" },
                    { term: "사쿠라/모란", desc: "삶의 덧없음(사쿠라) / 부귀영화(모란)" }
                ]
            },
            {
                title: "4. 현대적 변주와 파생 장르",
                text: "이레즈미는 기술의 발전과 타 문화권과의 교류를 통해 다양한 스타일로 진화하고 있습니다.",
                items: [
                    { subtitle: "전통 이레즈미", text: "에도 시대 우키요에 화풍 계승, 묵직한 가쿠와 엄격한 규칙 준수, 테보리 기법." },
                    { subtitle: "뉴 재패니즈 (New Japanese)", text: "현대적 그래픽 기술 결합, 화려한 색감과 서양식 명암(3D) 도입, 자유로운 구도." },
                    { subtitle: "재패니즈 리얼리즘", text: "전통 소재(용, 잉어)를 사진처럼 극사실적으로 묘사, 상징성보다 시각적 실재감 강조." },
                    { subtitle: "퓨전 스타일", text: "이레즈미 배경에 현대적 캐릭터(애니메이션, 영화 등)를 결합하여 재해석." }
                ]
            }
        ]
    },
    "Old School": {
        desc: "올드스쿨은 서양 타투 문화의 근간을 이룬 상징적인 장르입니다. 정식 명칭인 '아메리칸 트래디셔널'이 시사하듯, 직관적인 형태와 변치 않는 강렬한 색채를 통해 시대를 초월하는 클래식의 시각적 무게감을 증명합니다.",
        features: ["Bold Outlines (굵고 명확한 외곽선)", "Limited Palette (직관적인 원색 사용)", "Whip Shading (거친 명암 질감)"],
        details: [
            {
                title: "1. 기원과 역사 (Origin & History)",
                items: [
                    {
                        subtitle: "해양 문화와의 결합",
                        text: "19세기 후반, 거친 바다를 누비던 선원들이 무사 귀환을 기원하거나 항해의 이정표를 남기기 위해 시작했습니다. 제임스 쿡 선장의 탐험으로 전래된 폴리네시아 타투 문화가 시초입니다."
                    },
                    {
                        subtitle: "세일러 제리(Sailor Jerry)의 혁신",
                        text: "현대 아메리칸 트래디셔널의 시각적 체계를 완성한 노먼 콜린스(Sailor Jerry)는 서양의 직관적 모티프에 일본 이레즈미의 견고한 색채 배열을 결합하여, 두꺼운 외곽선과 원색의 조화를 정립했습니다."
                    }
                ]
            },
            {
                title: "2. 시각적 스타일 및 기술적 특징 (Style & Technique)",
                items: [
                    {
                        subtitle: "볼드 아웃라인 (Bold Outlines)",
                        text: "형태를 명확히 통제하기 위해 극도로 굵고 진한 외곽선을 사용합니다. 이는 세월이 흘러 잉크가 번지는 에이징(Aging) 현상이 와도 도안의 뼈대가 무너지지 않게 합니다."
                    },
                    {
                        subtitle: "제한된 색채 팔레트 (Limited Palette)",
                        text: "과거 기술의 한계로 인해 블랙, 레드, 옐로우, 그린 등 채도가 높은 소수의 원색만을 사용했습니다. 부드러운 혼색을 배제하고 단색을 밀도 있게 채우는 솔리드 기법을 씁니다."
                    },
                    {
                        subtitle: "윕 쉐이딩 (Whip Shading)",
                        text: "타투 머신을 튕겨내듯 그어 거칠고 입자감이 느껴지는 명암을 표현합니다. 이 기법은 특유의 투박하고 빈티지한 매력을 더해줍니다."
                    }
                ]
            },
            {
                title: "3. 주요 도안과 상징적 의미 (Key Motifs & Symbolism)",
                list: [
                    { term: "닻 (Anchor)", desc: "거친 파도 속 흔들리지 않는 신념과 안정, 고향으로의 안전한 귀환" },
                    { term: "제비 (Swallow)", desc: "5,000해리 항해의 증명, 영혼을 천국으로 인도하는 구원의 의미" },
                    { term: "범선 (Clipper Ship)", desc: "미지의 세계를 향한 모험심, 험난한 인생의 파도를 헤쳐 나가는 개척 정신" },
                    { term: "단검 (Dagger)", desc: "배신에 대한 경계, 내면의 정의, 위협으로부터의 보호" },
                    { term: "장미 (Rose)", desc: "완벽한 사랑, 삶과 죽음의 이중성(단검/해골과 결합 시)" }
                ]
            },
            {
                title: "4. 파생 장르 및 현대적 진화 (Evolution & Sub-genres)",
                items: [
                    {
                        subtitle: "뉴스쿨 (New School)",
                        text: "올드스쿨의 뼈대는 유지하되, 만화적이고 입체적인 왜곡(Caricature)과 형광색 등 화려한 색감을 더해 유머러스하고 역동적인 분위기를 연출합니다."
                    },
                    {
                        subtitle: "네오 트레디셔널 (Neo-Traditional)",
                        text: "올드스쿨의 변치 않는 물리적 강인함에 현대적인 일러스트의 화려하고 정교한 기법을 입혀 예술적으로 결합된 하이엔드 장르 형태입니다."
                    }
                ]
            }
        ]
    },
    "Tribal": {
        desc: "트라이벌은 인류 타투 역사의 가장 오래된 원형이자, 잉크의 원초적인 흑백 대비를 통해 신체의 기하학적 흐름을 극대화하는 장르입니다. 단순한 시각적 장식을 넘어 고대 부족의 정신적 유산과 현대적인 정밀함이 교차하는 압도적인 무게감을 지니고 있습니다.",
        features: ["Ancient & Primitive (인류 역사상 가장 오래된 원형)", "Geometric Flow (신체 근육을 따르는 기하학적 흐름)", "Solid Black (압도적인 흑백 대비)"],
        details: [
            {
                title: "1. 기원과 역사 (Origin & History)",
                items: [
                    {
                        subtitle: "사회적 증명과 통과 의례",
                        text: "고대 부족 사회에서 타투는 성인식이자 계급과 신분을 나타내는 명확한 시각적 식별표(Identity)였습니다."
                    },
                    {
                        subtitle: "영적 보호와 전투적 위장",
                        text: "악령을 쫓는 부적(Talisman)이자, 전장에서 적에게 위압감을 주고 자연에 동화되기 위한 생존형 위장(Camouflage)이었습니다."
                    },
                    {
                        subtitle: "현대 타투로의 유입과 진화",
                        text: "1990년대 부족 고유의 문양을 현대적 미학으로 다듬어낸 '모던 트라이벌(Modern Tribal)'이 대중문화와 결합하며 전 세계적인 열풍을 일으켰습니다."
                    }
                ]
            },
            {
                title: "2. 지역별 고유 스타일과 상징 (Regional Styles & Symbols)",
                list: [
                    { term: "폴리네시안 (Polynesian)", desc: "날카로운 기하학적 패턴의 밀도 높은 결합. 인내와 존엄을 상징" },
                    { term: "마오리 (Maori / Ta Moko)", desc: "얼굴과 신체 근육을 따라 흐르는 '코루(소용돌이)' 문양. 역동적인 곡선미" },
                    { term: "켈틱 (Celtic)", desc: "시작과 끝이 없는 '켈틱 매듭'. 생명과 우주의 영원한 순환 상징" },
                    { term: "하이다 (Haida)", desc: "두껍고 유려한 '폼라인' 곡선 구조. 까마귀, 범고래 등 토템 동물의 그래픽적 도식화" }
                ]
            },
            {
                title: "3. 기술적 미학과 스튜디오의 정밀함 (Technical Aesthetics)",
                items: [
                    {
                        subtitle: "솔리드 블랙 패킹 (Solid Black Packing)",
                        text: "빈틈이나 얼룩 없이 진피층에 잉크를 100% 밀도로 채워 넣는 기술입니다. 시간이 지나도 색이 빠지지 않도록 완벽하게 통제해야 하는 하이엔드 기술력의 척도입니다."
                    },
                    {
                        subtitle: "아나토미 기반의 실루엣 (Anatomical Silhouette)",
                        text: "뼈대와 근육의 움직임을 정확히 계산하여 도안을 배치함으로써, 인체가 움직일 때 타투가 함께 살아 숨 쉬는 듯한 압도적인 역동성을 구현합니다."
                    }
                ]
            },
            {
                title: "4. 파생 장르 및 현대적 변주 (Sub-genres & Modern Evolution)",
                items: [
                    {
                        subtitle: "사이버 시길리즘 (Cyber Sigilism)",
                        text: "두꺼운 면을 해체하고 얇고 예리한 선으로 변형하여, 디지털 회로나 가시덤불처럼 보이게 구성한 현대적 장르입니다. 고대의 주술적 감각과 미래 지향적 미학이 공존합니다."
                    }
                ]
            }
        ]
    },
    "Black & Grey": {
        desc: "블랙앤그레이는 오직 검은색 잉크와 증류수만을 사용하여, 사진을 보는 듯한 극사실적인 묘사와 부드러운 명암(Shading)을 구현하는 장르입니다. 형태의 입체감과 빛의 흐름을 통제하는 타투이스트의 고도화된 소묘 능력이 결과물의 수준을 결정합니다.",
        features: ["Smooth Shading (부드러운 명암 단계)", "Realistic Texture (사실적인 질감 묘사)", "Chicano Heritage (치카노 문화의 유산)"],
        details: [
            {
                title: "1. 기원과 역사 (Origin & History)",
                items: [
                    {
                        subtitle: "제약이 만들어낸 혁신",
                        text: "1970~80년대 미국 캘리포니아 교도소 수감자들의 '치카노' 문화에서 탄생했습니다. 색상 잉크가 없는 환경에서 기타 줄 모터와 검은색 잉크만으로 정교한 그림을 그리는 기법이 고안되었습니다."
                    },
                    {
                        subtitle: "파인 아트(Fine Art)로의 승화",
                        text: "잭 루디(Jack Rudy) 등 1세대 아티스트들이 옥중 기술을 단일 바늘(Single Needle) 기법과 결합하여, 세계에서 가장 정교하고 사실적인 타투 장르로 완성시켰습니다."
                    }
                ]
            },
            {
                title: "2. 시각적 스타일과 기술적 특징 (Visual Style & Technique)",
                items: [
                    {
                        subtitle: "워시 기법 (Wash Technique)",
                        text: "검은색 잉크 원액에 증류수를 단계별로 혼합하여 다양한 톤의 잉크(Grey Wash)를 만들고, 연필 소묘처럼 부드러운 그라데이션을 묘사합니다."
                    },
                    {
                        subtitle: "소프트 쉐이딩 (Soft Shading)",
                        text: "잉크가 뭉치거나 바늘 자국이 남지 않도록, 피부 표면에 잉크를 안개처럼 흩뿌리듯 겹겹이 쌓아 올려 극도로 부드러운 질감을 구현합니다."
                    },
                    {
                        subtitle: "하이라이트와 여백 (Highlighting & Negative Space)",
                        text: "가장 밝은 부분은 하얀색 잉크 대신 피부 본연의 여백을 남겨 대비를 극대화하며, 꼭 필요한 극소수의 하이라이트에만 흰색 잉크를 점찍듯 사용합니다."
                    }
                ]
            },
            {
                title: "3. 주요 소재와 상징적 의미 (Key Motifs & Symbolism)",
                items: [
                    {
                        subtitle: "초상화 (Portrait) & 종교적 도상",
                        text: "가족이나 존경하는 인물의 사진, 성모 마리아나 천사 등을 오차 없이 옮겨 담아 영원한 기억, 헌사, 구원, 신앙을 상징합니다."
                    },
                    {
                        subtitle: "바니타스 (Vanitas) & 치카노 (Chicano)",
                        text: "해골, 시계 등으로 삶의 유한함(메멘토 모리)을 표현하거나, 장미, 나침반, 눈물 흘리는 여인 등 멕시코계 미국인들의 삶의 애환과 가족애를 담습니다."
                    }
                ]
            },
            {
                title: "4. 현대적 흐름 (Modern Trends)",
                items: [
                    {
                        subtitle: "마이크로 리얼리즘 & 초현실주의 융합",
                        text: "동전 크기 면적에 수만 번의 터치를 넣는 정밀 묘사(Micro Realism)나, 시계가 녹아내리는 등 꿈결 같은 구도를 디자인하는 초현실주의(Surrealism)로 발전하고 있습니다."
                    }
                ]
            }
        ]
    },
    "Blackwork": {
        desc: "블랙워크는 명암을 부드럽게 푸는 대신, 오직 100% 농도의 짙은 검은색 면과 선의 강렬한 대비를 통해 시각적 파괴력과 그래픽적인 조형미를 극대화하는 장르입니다.",
        features: ["Solid Black (압도적인 블랙의 밀도)", "High Contrast (강렬한 대비)", "Graphic Structure (그래픽적 조형미)"],
        details: [
            {
                title: "1. 기원과 역사 (Origin & History)",
                items: [
                    {
                        subtitle: "형태미의 독립",
                        text: "고대 폴리네시아나 아즈텍의 원시적인 문신에서 주술적 의미는 덜어내고, '피부 위에 얹혀진 짙은 검은색 잉크'가 주는 원초적인 강렬함과 미학만을 추출하여 발전시켰습니다."
                    },
                    {
                        subtitle: "현대 타투의 뼈대",
                        text: "20세기 후반, 일러스트, 지오메트릭, 다크 아트 등 다양한 시각 예술이 타투에 접목되면서 색상을 배제하고 형태의 본질에 집중하는 거대한 줄기로 자리 잡았습니다."
                    }
                ]
            },
            {
                title: "2. 시각적 스타일과 기술적 특징 (Visual Style & Technique)",
                items: [
                    {
                        subtitle: "솔리드 블랙 패킹 (Solid Black Packing)",
                        text: "검은색 잉크 원액을 물에 희석하지 않고 피부 진피층에 100% 밀도로 꽉 채워 넣는 기술입니다. 얼룩이나 빈틈이 생기지 않도록 일정한 압력을 유지해야 하는 고난도의 기본기입니다."
                    },
                    {
                        subtitle: "도트와 윕 쉐이딩 (Dot & Whip Shading)",
                        text: "검은색 점을 촘촘히 찍거나(도트워크), 타투 머신을 빠르게 튕겨내듯 그어(윕 쉐이딩) 거칠고 입자감이 느껴지는 질감으로 명암을 표현합니다."
                    },
                    {
                        subtitle: "네거티브 스페이스 (Negative Space)",
                        text: "검은색 잉크가 채워진 묵직한 면과, 잉크가 묻지 않은 피부 본연의 밝은 여백이 강렬하게 충돌하는 시각적 대비를 디자인의 주요 요소로 활용합니다."
                    }
                ]
            },
            {
                title: "3. 주요 소재와 상징적 의미 (Key Motifs & Symbolism)",
                items: [
                    {
                        subtitle: "다크 아트 (Dark Art)",
                        text: "까마귀, 악마, 뿔, 오컬트 기호 등을 거친 질감으로 표현하여, 인간 내면의 그림자, 반항심, 죽음에 대한 미학을 강렬하게 드러냅니다."
                    },
                    {
                        subtitle: "중세 판화 (Woodcut / Engraving)",
                        text: "중세 유럽의 목판화처럼 두껍고 거친 선들을 교차시켜 질감을 묘사하는 고전적인 스타일로, 학술적이고 빈티지한 무게감을 상징합니다."
                    },
                    {
                        subtitle: "기하학과 오너먼트 (Geometry & Ornament)",
                        text: "만다라나 수학적 도형을 짙은 검은 면과 결합하여, 차갑고 지적인 구조미와 완벽한 대칭이 주는 심리적 안정감을 상징합니다."
                    }
                ]
            },
            {
                title: "4. 현대적 흐름 (Modern Trends)",
                items: [
                    {
                        subtitle: "화이트 온 블랙 (White on Black)",
                        text: "블랙아웃 시술 후 피부가 완전히 아문 뒤, 그 새카만 바탕 위에 하얀색 잉크로 정교한 문양을 다시 새겨 넣는 최상위 기술의 트렌드입니다."
                    }
                ]
            }
        ]
    },
    "Oriental Art": {
        desc: "오리엔탈 아트는 동양 고유의 철학과 미학을 신체 위에 구현하는 장르입니다. 붓이 지나간 자리의 거친 질감과 먹물이 번지는 부드러운 농담을 타투 머신으로 정교하게 재현하며, 단순히 그림을 채워 넣는 것을 넘어 비어있는 공간의 의미를 존중하는 하이엔드 예술입니다.",
        features: ["Brushwork & Texture (붓 터치의 질감)", "Negative Space (여백의 미)", "Oriental Philosophy (동양적 철학)"],
        details: [
            {
                title: "1. 기원과 역사 (Origin & History)",
                items: [
                    {
                        subtitle: "정신적 수양과 기록",
                        text: "종이 위에 먹의 농담만으로 자연과 사물을 묘사하던 전통 회화 방식에서 출발했습니다. 이는 단순한 시각적 묘사를 넘어, 그리는 이의 내면과 정신을 담아내는 수양의 과정이었습니다."
                    },
                    {
                        subtitle: "현대 타투와의 융합",
                        text: "서구권 중심의 타투 씬에 동양의 정적인 미학이 소개되면서, 거친 외곽선이나 강렬한 원색 대신 붓 터치의 질감과 은은한 명암을 강조하는 독자적인 장르로 확립되었습니다."
                    }
                ]
            },
            {
                title: "2. 주요 스타일과 기법 (Key Styles & Techniques)",
                items: [
                    {
                        subtitle: "브러시 워크 (Brushwork / 붓 터치)",
                        text: "타투 바늘을 붓처럼 사용하여 획의 시작은 강하고 끝은 흩어지는 비백(붓끝이 갈라져 여백이 생기는 현상)을 완벽하게 묘사하는 기법입니다."
                    },
                    {
                        subtitle: "워시 앤 블리드 (Wash & Bleed / 번짐 효과)",
                        text: "한지 위에 먹물이 서서히 스며들고 번지는 듯한 부드러운 그라데이션을 잉크의 희석률 조절을 통해 피부의 진피층에 안전하게 구현합니다."
                    },
                    {
                        subtitle: "여백의 미 (Negative Space)",
                        text: "도안으로 피부를 가득 채우지 않고, 의도적으로 비워둔 피부 본연의 면적을 구름, 바람, 혹은 무한한 공간으로 해석하게 만드는 고도의 화면 구성 방식입니다."
                    }
                ]
            },
            {
                title: "3. 기술적 미학과 시각적 특징 (Technical Aesthetics)",
                items: [
                    {
                        subtitle: "무게감의 대비",
                        text: "새카만 먹색(Solid Black)이 주는 묵직한 질량감과 희석된 잉크(Grey Wash)가 주는 투명함이 극단적으로 대비되며 깊이감을 창출합니다."
                    },
                    {
                        subtitle: "오방색과 단청의 활용",
                        text: "기본적으로 흑백의 수묵 톤을 유지하되, 한국 전통 건축이나 공예에서 볼 수 있는 진한 붉은색, 푸른색, 황색 등을 포인트 컬러로 사용하여 시각적인 강렬함을 더합니다."
                    }
                ]
            },
            {
                title: "4. 주요 도안 요소와 상징적 의미 (Key Motifs & Symbolism)",
                list: [
                    { term: "한국 호랑이 (Tiger)", desc: "용맹하면서도 때로는 해학적인 모습, 악귀를 쫓는 벽사의 의미" },
                    { term: "사군자 (Four Gracious Plants)", desc: "매화, 난초, 국화, 대나무. 추위와 세속에 물들지 않는 굳건한 지조와 절개, 고결한 인품" },
                    { term: "소나무와 학 (Pine & Crane)", desc: "십장생의 대표 요소. 변치 않는 푸름과 천년의 수명, 맑고 깨끗한 기운" },
                    { term: "전통 장신구 및 기물", desc: "노리개, 하회탈, 기와장식, 청자 등 고유의 조형미를 지닌 오브제" }
                ]
            },
            {
                title: "5. 파생 장르 및 현대적 흐름 (Sub-genres & Modern Trends)",
                items: [
                    {
                        subtitle: "파인라인 오리엔탈 (Fine-line Oriental)",
                        text: "굵은 붓 터치 대신 단 한 가닥의 얇은 바늘만을 사용하여 수묵화의 풍경이나 도상을 아주 작고 세밀하게 묘사하는 현대적 스타일입니다."
                    },
                    {
                        subtitle: "추상 수묵 (Abstract Ink)",
                        text: "구체적인 형태를 배제하고 먹물이 튀고 번지는 현상이나 역동적인 붓 터치의 흔적만을 추상적인 조형물처럼 신체에 두르는 아방가르드한 장르입니다."
                    },
                    {
                        subtitle: "네오 오리엔탈 (Neo Oriental)",
                        text: "전통 수묵화 기법 위에 기하학적인 도형을 결합하거나 현대적인 타이포그래피를 섞어 과거와 미래가 혼재된 세련된 분위기를 연출합니다."
                    }
                ]
            }
        ]
    },
    "Watercolor": {
        desc: "수채화 타투는 종이 위에 칠해진 수채화 물감 특유의 맑고 투명한 질감을 피부 위에 완벽하게 재현하는 현대적인 장르입니다. 정형화된 틀을 벗어나 색채의 자유로운 흐름과 감정선을 표현하는 데 특화되어 있습니다.",
        features: ["Outline-less (경계 없는 색채 흐름)", "Splatter & Wash (물감의 번짐과 흩뿌림)", "Emotional Expression (감성적 서사)"],
        details: [
            {
                title: "1. 기원과 역사 (Origin & History)",
                items: [
                    {
                        subtitle: "기술의 발전과 장르의 탄생",
                        text: "과거의 투박한 장비로는 물감의 번짐을 표현하는 데 한계가 있었으나, 21세기 정밀 타투 머신과 잉크 기술의 발전으로 독립된 예술 장르로 만개했습니다."
                    },
                    {
                        subtitle: "회화적 표현의 확장",
                        text: "기존 타투의 '진하고 강렬한' 이미지에서 벗어나, 순수 미술의 회화적인 기법을 신체로 가져오고자 하는 아티스트들의 실험 정신에서 출발했습니다."
                    }
                ]
            },
            {
                title: "2. 시각적 스타일과 기술적 특징 (Visual Style & Technique)",
                items: [
                    {
                        subtitle: "아웃라인의 부재 (Outline-less)",
                        text: "검은색 외곽선을 과감히 생략하거나 최소화하고, 오직 색의 농담과 번짐만으로 형태를 규정하는 고도의 조색 기술이 요구됩니다."
                    },
                    {
                        subtitle: "스플래터와 워시 (Splatter & Wash)",
                        text: "붓을 털어 물감이 튄 듯한 '스플래터'와, 물을 머금은 붓이 지나가며 투명하게 번지는 '워시' 기법을 바늘로 정밀하게 묘사합니다."
                    },
                    {
                        subtitle: "에이징 제어 설계 (Aging Control)",
                        text: "검은색 선이 없어 번짐 위험이 크기에, 보색 대비를 활용하거나 중심부에 높은 밀도의 색상을 주입하여 세월이 흘러도 형태가 유지되도록 설계합니다."
                    }
                ]
            },
            {
                title: "3. 주요 소재와 상징적 의미 (Key Motifs & Symbolism)",
                items: [
                    {
                        subtitle: "자연물 (꽃, 동물, 새)",
                        text: "만개하는 꽃잎이나 날아오르는 새의 역동성을 물감의 번짐 효과로 표현하여 생명력과 자유를 상징합니다."
                    },
                    {
                        subtitle: "우주와 은하수 (Galaxy)",
                        text: "다채로운 색상이 경계 없이 섞이는 기법을 활용하여 우주의 신비로움과 몽환적인 내면세계를 묘사합니다."
                    },
                    {
                        subtitle: "추상적 색채 (Abstract Splash)",
                        text: "특정한 형태 없이 색감의 흩어짐 자체를 즐기며, 얽매이지 않는 감정의 해방과 예술적 낭만을 의미합니다."
                    }
                ]
            },
            {
                title: "4. 현대적 흐름 (Modern Trends)",
                items: [
                    {
                        subtitle: "지오메트릭/라인워크와의 결합",
                        text: "얇고 정교한 검은색 기하학 도형이나 라인워크 뼈대 위에 수채화 색감을 얹어, 형태를 단단하게 잡아주고 에이징 시에도 디자인이 무너지지 않도록 보완합니다."
                    }
                ]
            }
        ]
    },
    "Illustration": {
        desc: "일러스트 타투는 동화책의 삽화, 연필 스케치, 혹은 작가의 고유한 시각 디자인 화풍을 피부로 고스란히 옮겨오는 장르입니다. 타투이스트 개개인의 독창적인 펜선 질감과 스토리텔링이 곧 장르 자체가 되는 가장 자유롭고 예술적인 영역입니다.",
        features: ["Unique Art Style (독창적인 작가 화풍)", "Storytelling (개인적 서사)", "Analog Texture (아날로그 질감 구현)"],
        details: [
            {
                title: "1. 기원과 역사 (Origin & History)",
                items: [
                    {
                        subtitle: "서브컬처와 시각 디자인의 융합",
                        text: "20세기 후반, 현대 미술과 그래픽 디자인을 전공한 아티스트들이 대거 유입되면서 시작되었습니다. 기성 도안이 아닌 고객의 이야기를 삽화 형태로 스케치하여 새기기 시작했습니다."
                    }
                ]
            },
            {
                title: "2. 시각적 스타일과 기술적 특징 (Visual Style & Technique)",
                items: [
                    {
                        subtitle: "해칭 및 크로스해칭 (Hatching & Cross-hatching)",
                        text: "얇은 선을 촘촘히 긋거나 교차시켜 명암과 입체감을 표현하는 펜 드로잉 기법으로, 피부 위에 종이 질감의 아날로그적 따뜻함을 구현합니다."
                    },
                    {
                        subtitle: "다양한 화풍의 재현",
                        text: "거친 연필 스케치, 마커펜 느낌, 동판화 질감 형 등 작가가 의도하는 아날로그 도구의 질감을 타투 바늘로 정밀하게 묘사합니다."
                    },

                    {
                        subtitle: "평면적 색채 구성 (Flat Color)",
                        text: "부드러운 입체감보다 팝아트나 빈티지 포스터처럼 평면적이고 선명한 색상을 채워 넣어 그래픽적인 느낌을 강조하기도 합니다."
                    }
                ]
            },
            {
                title: "3. 주요 소재와 상징적 의미 (Key Motifs & Symbolism)",
                items: [
                    {
                        subtitle: "동화적 판타지와 초현실주의",
                        text: "몽환적인 숲, 말하는 동물, 중세 성 등 현실과 환상이 섞인 형태를 통해 순수함이나 기묘한 상상력을 표현합니다."
                    },
                    {
                        subtitle: "개별적 스토리텔링",
                        text: "반려묘, 인상 깊은 영화 장면, 좌우명 등 고객과 아티스트가 함께 만들어낸 세상에 하나뿐인 개인의 서사를 담아냅니다."
                    }
                ]
            },
            {
                title: "4. 현대적 흐름 (Modern Trends)",
                items: [
                    {
                        subtitle: "마이크로 일러스트 (Micro Illustration)",
                        text: "아주 작은 면적 안에 얇은 선(Fine-line)으로 극도의 디테일을 밀어 넣는 장르입니다. 현대인들이 부담 없이 즐길 수 있는 미니멀하고 세련된 악세서리처럼 소비됩니다."
                    }
                ]
            }
        ]
    },
    "Mandala": {
        desc: "만다라는 힌두교와 불교의 우주관을 형상화한 기하학적 문양을 바탕으로, 1mm의 오차도 허용하지 않는 극도의 정밀함이 요구되는 하이엔드 타투 장르입니다. 중심점에서 바깥으로 반복 전개되는 완벽한 대칭 구조를 통해 우주의 질서와 내면의 평화를 시각적으로 증명합니다.",
        features: ["Radial Symmetry (방사형 중심 대칭)", "Dotwork (점묘법을 통한 질감 표현)", "Precision (수학적 정밀함과 균형)"],
        details: [
            {
                title: "1. 기원과 역사 (Origin & History)",
                items: [
                    {
                        subtitle: "수행의 시각화",
                        text: "원은 우주를, 내부 문양은 신들의 궁전을 의미합니다. 고대 인도에서 수행자들이 내면의 질서를 세우기 위해 그렸던 성스러운 도표에서 출발했습니다."
                    },
                    {
                        subtitle: "모래 만다라와 제행무상",
                        text: "티베트 불교에서는 색색의 모래로 만든 거대한 만다라를 강물에 흘려보내는 의식을 통해 '모든 형태는 영원하지 않다'는 철학을 각인시킵니다."
                    },
                    {
                        subtitle: "현대 타투로의 진화",
                        text: "종교적 의식을 넘어, 타투이스트들의 점묘법(Dotwork) 기술과 결합하여 신체의 굴곡 위에서 기하학적 미학의 정수를 보여주는 예술로 승화되었습니다."
                    }
                ]
            },
            {
                title: "2. 기술적 미학과 시각적 특징 (Technical Aesthetics)",
                items: [
                    {
                        subtitle: "방사형 중심 대칭 (Radial Symmetry)",
                        text: "단 하나의 중심점에서 360도로 뻗어 나갑니다. 피부의 신축성을 고려하여 완벽한 비율과 간격을 유지해야 하므로 철저한 도안 설계 능력이 요구됩니다."
                    },
                    {
                        subtitle: "도트워크 (Dotwork)",
                        text: "선을 긋는 대신 미세한 점을 수만 번 찍어 명암과 질감을 표현합니다. 피부 손상을 최소화하고 잉크 번짐을 통제하여 벨벳 같은 입체감을 구축합니다."
                    },
                    {
                        subtitle: "아나토미 기반의 왜곡 제어",
                        text: "평면의 정원을 입체적인 신체 위에 얹을 때 발생하는 왜곡을 계산하여, 움직임 속에서도 원형과 대칭이 무너지지 않도록 조율하는 것이 핵심입니다."
                    }
                ]
            },
            {
                title: "3. 주요 도안 요소와 상징적 의미 (Motifs & Symbolism)",
                list: [
                    { term: "중심점 (The Center)", desc: "자아의 본질이자 우주의 근원적 시작점" },
                    { term: "꽃잎 (Petals)", desc: "진흙 속에서도 피어나는 정신적 개화, 자비, 아름다움" },
                    { term: "삼각형 (Triangles)", desc: "상향은 창조와 에너지를, 하향은 지성, 수용성, 깊은 지혜를 의미" },
                    { term: "사각형 (Squares)", desc: "지수화풍(땅, 물, 불, 바람)과 현실 세계의 견고함과 안정" },
                    { term: "종 (Bell) 및 금강저", desc: "무지함을 깨뜨리는 통찰력과 정신의 맑음을 깨우는 소리" }
                ]
            },
            {
                title: "4. 파생 및 연관 장르 (Sub-genres & Related Styles)",
                items: [
                    {
                        subtitle: "오너먼털 (Ornamental)",
                        text: "만다라의 기하학적 요소를 장신구처럼 재해석하여 샹들리에나 레이스 패턴과 결합, 가슴 중앙이나 굴곡진 부위에 우아하게 배치합니다."
                    },
                    {
                        subtitle: "메헨디 (Mehndi / Henna)",
                        text: "인도/중동의 헤나 아트에서 영감을 받아, 만다라 주변에 덩굴 식물이나 페이즐리 문양을 유기적으로 결합한 에스닉 스타일입니다."
                    }
                ]
            }
        ]
    },
    "Lettering": {
        desc: "레터링은 신체에 문자를 새겨 개인의 철학과 서사를 가장 직관적으로 선언하는 장르입니다. 단순한 기록의 의미를 넘어, 문자의 조형적 아름다움을 피부 위에 영구적으로 건축하는 타이포그래피(Typography) 미학의 정수이며, 전 세계적으로 가장 보편적이면서도 세밀한 기술력을 요하는 하이엔드 작업입니다.",
        features: ["Typography Aesthetics (조형적 아름다움)", "Personal Narrative (개인의 철학과 서사)", "Technical Precision (세밀한 기술력)"],
        details: [
            {
                title: "1. 기원과 역사 (Origin & History)",
                items: [
                    {
                        subtitle: "고대의 식별과 신념의 증명",
                        text: "고대 서구 사회에서 문신은 신분을 나타내는 표식이자, 종교적 수행자들이 자신의 굳건한 신념을 몸에 새기는 신성한 기록 매체로 사용되었습니다."
                    },
                    {
                        subtitle: "현대적 정체성의 확립",
                        text: "20세기 치카노 문화와 군인들의 기록 문화를 거치며, 레터링은 삶의 방향성을 피부에 각인하는 주체적인 자기 선언의 수단으로 자리 잡았습니다."
                    }
                ]
            },
            {
                title: "2. 주요 서체 스타일 (Key Typography Styles)",
                items: [
                    {
                        subtitle: "파인라인 레터링 (Fine Line Lettering)",
                        text: "극도로 얇은 바늘을 사용하여 펜촉의 섬세함을 구현합니다. 필기체의 유려한 곡선을 활용하며 미니멀하고 우아한 분위기를 자아냅니다."
                    },
                    {
                        subtitle: "고딕 및 블랙레터 (Gothic / Blackletter)",
                        text: "중세 유럽의 고문서에서 유래한 묵직하고 장엄한 서체입니다. 수직적이고 날카로운 직선 형태를 강조하여 강인한 권위나 무게감을 표현합니다."
                    },
                    {
                        subtitle: "핸드라이팅 (Handwriting)",
                        text: "디지털 폰트가 아닌 실제 손글씨의 필압과 미세한 떨림까지 오차 없이 복원하는 비스포크 스타일로, 감성적 가치가 매우 높습니다."
                    }
                ]
            },
            {
                title: "3. 파생 및 연관 장르 (Sub-genres & Extended Arts)",
                items: [
                    {
                        subtitle: "치카노 레터링 (Chicano Lettering)",
                        text: "폰트의 뼈대에 화려한 장식선(Swash)과 그림자 명암(Shading)을 결합하여 3D 입체감을 부여하는 하이엔드 기법입니다. 그래피티와 궤를 같이하며 화려한 추상화 형태를 띱니다."
                    },
                    {
                        subtitle: "캘리그라피 (Calligraphy)",
                        text: "딥펜이나 거친 붓의 질감, 잉크 튀김(Splatter) 현상까지 사실적으로 묘사하는 장르입니다. 획의 굵기 변화와 속도감을 피부 위에 역동적으로 재현합니다."
                    }
                ]
            },
            {
                title: "4. 기술적 정밀함과 아나토미 설계 (Technical Precision & Anatomy)",
                items: [
                    {
                        subtitle: "가독성과 에이징 제어 (Readability & Aging Control)",
                        text: "세월이 흘러 잉크가 미세하게 팽창해도 글자가 뭉쳐 보이지 않도록, 자간과 획의 여백을 완벽하게 역산하여 설계하는 통제력이 요구됩니다."
                    },
                    {
                        subtitle: "아나토미 기반의 구도 (Anatomical Placement)",
                        text: "직선적인 문장 배열이 둥근 인체 굴곡 위에서 시각적 왜곡을 일으키지 않도록, 근육과 뼈의 형태에 따라 자연스럽게 흐르도록 배치해야 합니다."
                    }
                ]
            }
        ]
    },
    "Sak Yant": {
        desc: "싹얀은 태국을 비롯한 동남아시아의 불교와 힌두교, 고대 애니미즘(민간 신앙)이 결합하여 탄생한 신성한 기하학 타투입니다. 단순한 피부 위의 그림을 넘어, 개인의 육체와 정신을 보호하는 강력한 영적 부적(Talisman)으로 기능하는 가장 철학적인 장르입니다.",
        features: ["Sacred Geometry (신성 기하학)", "Buddhist Mantra (불교 만트라)", "Protection & Luck (보호와 행운의 부적)"],
        details: [
            {
                title: "1. 기원과 역사 (Origin & History)",
                items: [
                    {
                        subtitle: "전사들의 영적 방어막",
                        text: "고대 동남아시아의 전사들이 전쟁터에서 화살과 칼날로부터 스스로를 지키기 위해 몸에 새긴 주술적인 문자와 기호에서 유래했습니다."
                    },
                    {
                        subtitle: "사원의 의식과 승려",
                        text: "전통적으로 승려나 아잔(Ajarn)들에 의해 시술되며, 잉크에 특수 재료를 섞고 시술 후 주문을 불어넣는 의식(Blessing)을 거쳐야만 비로소 힘을 발휘한다고 믿었습니다."
                    }
                ]
            },
            {
                title: "2. 시각적 스타일과 기술적 특징 (Visual Style & Technique)",
                items: [
                    {
                        subtitle: "얀트라와 카타의 결합",
                        text: "신들이 머무는 우주적 구조를 뜻하는 기하학 도형 '얀트라'와, 고대 크메르 문자로 쓰인 신성한 주문 '카타'가 정밀하게 결합된 형태입니다."
                    },
                    {
                        subtitle: "우날롬 (Unalome)",
                        text: "모든 도안의 꼭대기에 배치되는 기호로, 혼란스러운 세속의 번뇌(나선)를 뚫고 깨달음의 경지(직선)에 도달한다는 불교적 우주관을 상징합니다."
                    },
                    {
                        subtitle: "전통 수작업과 현대적 복원",
                        text: "본래 대나무나 금속 막대로 찌르는 전통 방식이었으나, 현대 하이엔드 스튜디오에서는 타투 머신을 사용하여 특유의 수학적 배열과 선명도를 오차 없이 완벽하게 복원합니다."
                    }
                ]
            },
            {
                title: "3. 주요 소재와 상징적 의미 (Key Motifs & Symbolism)",
                list: [
                    { term: "하태우 (Hah Taew)", desc: "5줄 싹얀. 부당한 형벌 보호, 악운 방지, 흑마술 방어, 행운, 매력 상징" },
                    { term: "까오ยอด (Gao Yord)", desc: "수미산의 9개 봉우리. 강력한 절대적 보호의 부적이며 가장 먼저 새기는 것이 규칙" },
                    { term: "뺏팃 (Paed Tidt)", desc: "8방향. 우주의 8방향에서 들어오는 모든 위험과 악령으로부터 보호" },
                    { term: "수에아 (Suea)", desc: "쌍호랑이. 무한한 권력, 권위, 두려움 없음을 상징" }
                ]
            },
            {
                title: "4. 현대적 흐름 (Modern Trends)",
                items: [
                    {
                        subtitle: "하이엔드 기하학 타투로의 편입",
                        text: "과거 종교적 의식으로만 소비되던 싹얀이, 정밀한 선의 배열과 이국적인 크메르 문자 디자인 덕분에 전 세계적인 하이엔드 타투 장르로 인정받고 있습니다."
                    },
                    {
                        subtitle: "정신적 수양의 아이콘",
                        text: "단순한 미신적 부적이 아니라, 내면을 다스리고 외부의 스트레스(액운)로부터 멘탈을 보호하겠다는 굳건한 자기 암시이자 '정신적 수양'의 상징으로 소비됩니다."
                    }
                ]
            }
        ]
    },
    "Specialties": {
        desc: "기존의 장르로 분류하기 어렵거나, 미용 및 수정 목적, 혹은 가볍게 즐길 수 있는 특수 타투 분야들을 소개합니다.",
        features: ["Diverse Styles (다양한 스타일)", "Cover & Repair (커버 및 복원)", "Temporary Art (헤나 등 일시적 예술)"],
        details: [
            {
                title: "1. 캐주얼 & 포인트 (Casual & Point)",
                items: [
                    {
                        subtitle: "두들타투 (Doodle Tattoo)",
                        text: "마치 펜으로 무심하게 낙서한 듯한 자유로운 선의 흐름을 강조하는 장르입니다. 정형화된 규칙이나 완벽한 대칭을 벗어나, 고객의 즉흥적인 감각이나 아티스트의 고유한 스케치 느낌을 피부 위에 툭 얹어내듯 살려내는 것이 특징입니다."
                    },
                    {
                        subtitle: "미니타투 (Mini Tattoo)",
                        text: "동전 크기 이하의 작은 면적에 단순한 기호, 레터링, 미니멀한 그림을 새기는 포인트 장르입니다. 크기는 작지만 좁은 면적에 잉크를 정밀하게 주입해야 하므로, 훗날 선이 뭉치거나 번지는 현상(Aging)을 완벽하게 통제하는 섬세한 바늘 컨트롤 기술력이 요구됩니다."
                    },
                    {
                        subtitle: "헤나 (Henna)",
                        text: "식물성 천연 염료를 사용하여 피부 표피층에만 색을 입히는 일시적인 바디 아트입니다. 바늘을 사용하지 않아 통증이 수반되지 않으며, 보통 1~2주 후 자연스럽게 지워집니다. 영구적인 타투를 시술받기 전 도안의 위치나 크기를 미리 테스트해 보거나, 특정 기간 동안의 패션 스타일링을 목적으로 활용하기에 적합합니다."
                    }
                ]
            },
            {
                title: "2. 커버 & 스페셜 (Cover & Special)",
                items: [
                    {
                        subtitle: "블랙암 (Black Arm)",
                        text: "팔 전체를 다른 도안 없이 새카만 검은색 잉크로 빈틈없이 덮어버리는 압도적인 스타일입니다. 잉크의 얼룩(Patchiness) 없이 100%의 밀도를 균일하게 채워 넣는 솔리드 블랙 패킹(Solid Black Packing) 기술의 정수를 보여줍니다. 완벽한 커버업의 궁극적인 수단이자, 그 자체로 전위적이고 묵직한 현대 예술로 기능합니다."
                    },
                    {
                        subtitle: "커버업 (Cover-up)",
                        text: "기존의 마음에 들지 않는 타투나 상처 흉터 위에 새로운 디자인을 덮어 완벽하게 가리는 고난도 복원 작업입니다. 단순한 덮어쓰기가 아니라, 기존 잉크의 농도, 피부 상태, 색채의 명도 대비를 치밀하게 역산하여 완전히 새로운 도안의 구도를 설계해야 합니다. 스튜디오의 해부학적 이해도와 오랜 경험치가 가장 적나라하게 증명되는 분야입니다."
                    },
                    {
                        subtitle: "터치업 (Touch-up)",
                        text: "기존 타투의 뼈대와 형태는 유지하면서, 세월이 흘러 흐려진 선을 다시 선명하게 잡고 색상이나 명암을 보완하여 완성도를 끌어올리는 밀도 보강 작업입니다. 오래되어 빛바랜 타투에 화이트 하이라이트를 추가하거나 거친 디테일을 다듬어 새롭게 생명력을 불어넣습니다."
                    }
                ]
            }
        ]
    }
};

const GenresContent = () => {
    const mainCategories = Object.keys(categoryData);
    const searchParams = useSearchParams();
    const genreParam = searchParams.get('genre');

    // State
    const [activeMainTab, setActiveMainTab] = useState(mainCategories[0]);
    const [activeSubTab, setActiveSubTab] = useState(categoryData[mainCategories[0]][0]);

    // Handle initial genre navigation
    useEffect(() => {
        if (genreParam) {
            const foundCategory = Object.entries(categoryData).find(([_, subGenres]) =>
                subGenres.includes(genreParam)
            );
            if (foundCategory) {
                setActiveMainTab(foundCategory[0]);
                setActiveSubTab(genreParam);
            }
        }
    }, [genreParam]);

    // Update sub-tab when main tab changes
    useEffect(() => {
        if (!categoryData[activeMainTab].includes(activeSubTab)) {
            setActiveSubTab(categoryData[activeMainTab][0]);
        }
    }, [activeMainTab, activeSubTab]);

    const currentGenre = genreInfo[activeSubTab] || {
        desc: "해당 장르에 대한 상세 설명이 준비 중입니다.",
        features: ["준비 중", "준비 중", "준비 중"],
        details: []
    };

    return (
        <div className="container mx-auto px-6 max-w-6xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-12 text-center text-gray-900">Genres</h1>

            {/* Main Tabs (Categories) */}
            <div className="flex flex-col items-center mb-10">
                <div className="flex flex-wrap justify-center gap-4 mb-6">
                    {mainCategories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveMainTab(cat)}
                            className={`px-6 py-3 rounded-full text-sm md:text-base font-bold transition-all duration-300 border ${activeMainTab === cat
                                ? "bg-gray-900 text-white border-gray-900 shadow-md"
                                : "bg-white text-gray-500 border-gray-200 hover:border-gray-400 hover:text-gray-900"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
                {/* Category Description */}
                <p className="text-gray-500 text-center max-w-2xl text-sm md:text-base leading-relaxed break-keep">
                    {categoryInfo[activeMainTab]}
                </p>
            </div>

            {/* Sub Tabs (Specific Genres) */}
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 mb-16 border-b border-gray-100 pb-6 px-4">
                {categoryData[activeMainTab].map((sub) => (
                    <button
                        key={sub}
                        onClick={() => setActiveSubTab(sub)}
                        className={`text-base md:text-lg font-medium transition-colors relative pb-2 ${activeSubTab === sub
                            ? "text-gray-900 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-gray-900"
                            : "text-gray-400 hover:text-gray-600"
                            }`}
                    >
                        {sub}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="flex flex-col lg:flex-row gap-12 items-start animation-fade-in bg-gray-50 p-8 md:p-12 rounded-xl border border-gray-100">
                {/* Left: Main Content & Details */}
                <div className="lg:w-3/5">
                    <div className="mb-10">
                        <span className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2 block">{activeMainTab}</span>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">{activeSubTab}</h2>
                        <p className="text-lg text-gray-700 leading-loose word-keep-all mb-8">
                            {currentGenre.desc}
                        </p>
                    </div>

                    {/* Detailed Sections (if available) - e.g. for Irezumi */}
                    {currentGenre.details && currentGenre.details.map((section, idx) => (
                        <div key={idx} className="mb-10 border-t border-gray-200 pt-8 last:mb-0">
                            <h3 className="text-2xl font-bold text-gray-900 mb-6">{section.title}</h3>
                            {section.text && <p className="text-gray-700 mb-6 leading-relaxed">{section.text}</p>}

                            <div className="space-y-6">
                                {/* Sub-items (Subtitle + Text) */}
                                {section.items && section.items.map((item, i) => (
                                    <div key={i}>
                                        <h4 className="text-lg font-bold text-gray-800 mb-2">{item.subtitle}</h4>
                                        <p className="text-gray-600 leading-relaxed text-sm md:text-base word-keep-all">
                                            {item.text}
                                        </p>
                                    </div>
                                ))}

                                {/* Definition List (Term + Desc) */}
                                {section.list && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {section.list.map((li, i) => (
                                            <div key={i} className="bg-white p-4 rounded border border-gray-100">
                                                <span className="font-bold text-gray-900 block mb-1">{li.term}</span>
                                                <span className="text-sm text-gray-600 block">{li.desc}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Right: Key Features (Sticky) */}
                <div className="lg:w-2/5 w-full bg-white p-8 rounded-lg border border-gray-100 shadow-sm lg:sticky lg:top-32">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-3">Key Characteristics</h3>
                    <ul className="space-y-4">
                        {currentGenre.features.map((feature, idx) => (
                            <li key={idx} className="flex items-start gap-3 text-gray-600">
                                <span className="mt-1.5 w-1.5 h-1.5 bg-gray-900 rounded-full shrink-0" />
                                <span>{feature}</span>
                            </li>
                        ))}
                    </ul>

                    {/* Additional Info Box for Irezumi context or generic */}
                    {activeSubTab === "Irezumi" && (
                        <div className="mt-8 pt-6 border-t border-gray-100">
                            <p className="text-xs text-gray-500 leading-relaxed">
                                * 이레즈미는 단순한 문신을 넘어 일본의 민담, 불교적 세계관, 자연관이 집약된 하나의 종합 예술입니다.
                                현대에는 전통 방식뿐만 아니라 다양한 파생 장르로 확장되고 있습니다.
                            </p>
                        </div>
                    )}

                    {/* View Gallery Button */}
                    <div className="mt-8 pt-6 border-t border-gray-100">
                        <Link
                            href={`/gallery?tab=Portfolio&filter=Genre&item=${encodeURIComponent(activeSubTab === "ETC." ? "Specialties" : activeSubTab)}`}
                            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gray-900 text-white rounded-xl shadow-lg hover:bg-black hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 group"
                        >
                            <span className="font-bold text-sm tracking-wide">VIEW {activeSubTab.toUpperCase()} GALLERY</span>
                            <div className="bg-white/20 p-1.5 rounded-full group-hover:bg-white/30 transition-colors">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default function GenresPage() {
    return (
        <main className="pt-[120px] min-h-screen bg-white pb-20">
            <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
                <GenresContent />
            </Suspense>
        </main>
    );
}
