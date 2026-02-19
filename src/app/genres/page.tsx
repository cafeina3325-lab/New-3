"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import GlassHexagon from "@/components/ui/GlassHexagon";

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

// Mock data for genre descriptions (Data content kept same as original)
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
        desc: "블랙워크는 쉐이딩(명암)보다 '검은색 라인(선)'과 '면' 그 자체의 조형미에 집중하는 현대적이고 그래픽적인 장르입니다. 일러스트레이션, 판화, 기하학적 패턴 등 다양한 예술 양식을 잉크로 재해석하여 명료하고 감각적인 스타일을 구축합니다.",
        features: ["Bold & Solid (대담하고 견고한 흑색)", "Graphic Composition (그래픽적인 구도)", "Versatility (다양한 예술 양식의 수용)"],
        details: [
            {
                title: "1. 특징 및 정의 (Definition)",
                text: "전통적인 장르(이레즈미, 올드스쿨)를 제외하고, 검은색 잉크를 주조로 하는 대부분의 현대적 스타일을 포괄합니다. 명암을 매끄럽게 넣기보다 점(Dot), 선(Line), 면(Fill)의 물리적 질감을 강조합니다."
            },
            {
                title: "2. 주요 하위 스타일 (Sub-styles)",
                items: [
                    {
                        subtitle: "라인워크 (Linework)",
                        text: "면을 채우지 않고 오직 선의 굵기 변화와 교차만으로 형태를 묘사합니다. 섬세하고 감성적인 드로잉 느낌을 줍니다."
                    },
                    {
                        subtitle: "도트워크 (Dotwork)",
                        text: "수만 개의 점을 찍어 밀도를 조절하는 점묘법입니다. 기계적인 그라데이션과는 다른 독특한 입자감과 깊이감을 만듭니다."
                    },
                    {
                        subtitle: "지오메트릭 (Geometric)",
                        text: "신성 기하학, 만다라, 플라워 오브 라이프 등 수학적으로 완벽한 도형의 반복과 대칭을 통해 시각적 균형미를 극대화합니다."
                    },
                    {
                        subtitle: "다크 아트 (Dark Art / Ocult)",
                        text: "오컬트, 신화, 고딕 호러 등의 어두운 소재를 에칭(동판화) 기법처럼 거칠고 펜 선이 살아있는 텍스처로 표현합니다."
                    }
                ]
            }
        ]
    },
    "Oriental Art": {
        desc: "오리엔탈 아트는 동양화의 고유한 미학인 '여백의 미'와 '먹의 농담'을 타투로 구현한 장르입니다. 화선지에 먹이 번지듯 자연스럽고 우아한 흐름을 피부 위에 연출하여 한 폭의 수묵화 같은 정적인 아름다움을 선사합니다.",
        features: ["Brush Stroke (붓 터치 질감)", "Ink Wash Effect (먹 번짐 효과)", "Negative Space (여백의 미)"],
        details: [
            {
                title: "1. 시각적 특징 (Visual Characteristics)",
                items: [
                    {
                        subtitle: "수묵화적 질감 (Ink Wash Painting)",
                        text: "타투 머신의 타격을 붓질처럼 조절하여, 실제 먹물이 종이에 스며들고 번지는 듯한 '발묵' 효과를 묘사합니다."
                    },
                    {
                        subtitle: "캘리그라피 (Calligraphy)",
                        text: "서예의 힘 있는 필체나 흘림체를 결합하여, 글자와 그림이 조화를 이루는 문인화적인 구도를 잡습니다."
                    }
                ]
            },
            {
                title: "2. 주요 소재 (Key Subjects)",
                text: "매난국죽(사군자), 소나무, 호랑이, 산수화, 연꽃 등 동양의 고전적인 소재들을 주로 다루며, 화려함보다는 고요하고 깊이 있는 기품을 추구합니다."
            }
        ]
    },
    "Watercolor": {
        desc: "수채화 타투는 맑은 물감을 머금은 붓이 지나간 듯, 경계선 없이 색이 자연스럽게 섞이고 번지는 회화적 기법을 타투에 적용한 스타일입니다. 검은 외곽선의 제약에서 벗어나 자유롭고 몽환적인 감성을 표현합니다.",
        features: ["No Outline (외곽선의 부재)", "Color Blending (색채의 자연스러운 혼합)", "Dreamy Atmosphere (몽환적 감성)"],
        details: [
            {
                title: "1. 테크닉 설명 (Technique)",
                items: [
                    {
                        subtitle: "스플래터 (Splatter) & 블렌딩",
                        text: "물감이 튀거나(Splatter) 물에 젖어 퍼지는 효과를 내기 위해 잉크의 농도를 묽게 조절하여 여러 색상을 레이어링합니다."
                    },
                    {
                        subtitle: "추상적 표현",
                        text: "정형화된 형태보다는 색채가 주는 감정적인 느낌과 분위기에 집중합니다."
                    }
                ]
            },
            {
                title: "2. 주의사항 (Note)",
                text: "검은색 윤곽선이 없기 때문에 시간이 지나면 잉크 퍼짐으로 인해 형태가 흐릿해질 수 있습니다. 따라서 높은 대비(Contrast)를 주거나 일부 라인워크를 결합하는 방식이 보완적으로 사용되기도 합니다."
            }
        ]
    },
    "Illustration": {
        desc: "일러스트레이션 타투는 타투이스트 개인의 독창적인 작화 스타일(Drawing Style)을 그대로 피부에 옮기는, '작가주의' 성향이 강한 장르입니다. 동화책 삽화, 펜 드로잉, 낙서(Doodle) 등 형식을 규정할 수 없는 자유로운 예술 세계입니다.",
        features: ["Unique Art Style (독창적인 작화)", "Storytelling (이야기가 있는 도안)", "Freedom of Expression (형식의 자유)"],
        details: [
            {
                title: "1. 특징",
                text: "특정한 전통이나 규칙에 얽매이지 않고, 아티스트가 종이에 그리는 그림 스타일을 타투 머신으로 그대로 재현합니다. 따라서 아티스트 선정이 결과물의 스타일을 결정하는 가장 중요한 요소입니다."
            }
        ]
    },
    "Mandala": {
        desc: "만다라는 산스크리트어로 '원(Circle)'을 의미하며, 우주의 진리와 깨달음을 형상화한 불교/힌두교 미술에서 유래했습니다. 중심에서 밖으로 뻗어 나가는 완벽한 대칭 구조는 시각적 균형미와 더불어 정신적 평온을 줍니다.",
        features: ["Perfect Symmetry (완벽한 대칭)", "Geometric Precision (기하학적 정밀도)", "Spiritual Healing (영적 치유와 명상)"],
        details: [
            {
                title: "1. 구조와 의미",
                items: [
                    {
                        subtitle: "중심과 확산",
                        text: "모든 패턴은 하나의 중심점에서 시작되어 끊임없이 확장됩니다. 이는 자아의 발견과 우주와의 연결을 상징합니다."
                    },
                    {
                        subtitle: "장식적 미학 (Jewelry)",
                        text: "현대 타투에서는 점묘나 라인워크를 결합하여 마치 피부 위에 보석 장식을 한 듯한 화려한 장식미를 강조하기도 합니다."
                    }
                ]
            }
        ]
    },
    "Sak Yant": {
        desc: "삭얀은 태국, 캄보디아 등 동남아시아 승려들이 전통적인 대나무 바늘(Sak Mai)로 새겨주던 주술적 문신입니다. 고대 크메르 문자와 기하학적 형상을 조합하여 착용자에게 보호, 행운, 힘을 부여한다고 믿습니다.",
        features: ["Sacred Geometry (신성한 기하학)", "Magical Protection (주술적 보호)", "Bamboo Style (전통적 느낌의 라인)"],
        details: [
            {
                title: "1. 의미와 기능",
                text: "단순한 장식이 아니며, 각 문양마다 '총알을 막아준다', '매력을 높여준다', '건강을 지켜준다'는 등의 고유한 주술적 효능이 깃들어 있다는 믿음을 바탕으로 합니다. (하누만, 호랑이, 5줄 얀트라 등이 대표적)"
            }
        ]
    },
    "Lettering": {
        desc: "레터링은 자신의 신념, 소중한 이름, 기억하고 싶은 명언 등 '텍스트' 자체를 디자인하여 새기는 장르입니다. 글씨체(Font)의 선택에 따라 클래식함부터 현대적인 세련미까지 다양한 분위기를 연출할 수 있습니다.",
        features: ["Typography Design (타이포그래피)", "Personal Meaning (개인적 의미 부여)", "Versatility (다양한 부위 가능)"],
        details: [
            {
                title: "1. 주요 스타일",
                items: [
                    {
                        subtitle: "치카노 레터링",
                        text: "화려한 곡선과 장식이 들어간 캘리그라피 스타일."
                    },
                    {
                        subtitle: "세리프/산세리프",
                        text: "깔끔하고 모던한 고딕체나 명조체 계열."
                    },
                    {
                        subtitle: "손글씨",
                        text: "가족의 필체나 아티스트의 자연스러운 핸드라이팅."
                    }
                ]
            }
        ]
    },
    "Specialties": {
        desc: "스페셜티는 전통적인 장르 구분보다는 특수한 목적이나 부위에 특화된 타투를 의미합니다. 미용 목적, 흉터 커버, 혹은 신체의 특정 부위를 활용한 위트 있는 작업 등을 포함합니다.",
        features: ["Purpose-Driven (특수 목적)", "Correction & Cover (수정 및 커버)", "Unique Placement (특수 부위)"],
        details: [
            {
                title: "1. 주요 분야",
                list: [
                    { term: "반영구 화장", desc: "눈썹, 아이라인, 입술 등의 미용 문신" },
                    { term: "흉터 커버업", desc: "수술 자국이나 상처를 타투로 가려 심미적으로 보완" },
                    { term: "두피 타투 (SMP)", desc: "탈모 부위에 모근 형태의 점을 찍어 밀도 보강" },
                    { term: "UV 타투", desc: "블랙라이트(자외선) 조명에서만 빛나는 특수 잉크 사용" },
                    { term: "미니/감성 타투", desc: "작고 귀여운 소재를 얇은 라인으로 심플하게 표현" }
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
            <h1 className="text-4xl md:text-5xl font-bold mb-12 text-center text-white">Genres</h1>

            {/* Main Tabs (Categories) */}
            <div className="flex flex-col items-center mb-10">
                <div className="flex flex-wrap justify-center gap-4 mb-6">
                    {mainCategories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveMainTab(cat)}
                            className={`px-6 py-3 rounded-full text-sm md:text-base font-bold transition-all duration-300 border ${activeMainTab === cat
                                ? "bg-white text-black border-white shadow-lg shadow-white/10"
                                : "bg-white/5 text-gray-400 border-white/10 hover:border-white/30 hover:text-white"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Sub Tabs (Genres) */}
                <div className="flex flex-wrap justify-center gap-2 max-w-4xl p-4 glass-panel rounded-2xl border-white/5">
                    {categoryData[activeMainTab].map((genre) => (
                        <button
                            key={genre}
                            onClick={() => setActiveSubTab(genre)}
                            className={`px-4 py-2 rounded-lg text-sm transition-all duration-300 ${activeSubTab === genre
                                ? "bg-white text-black font-bold shadow-md"
                                : "text-gray-400 hover:text-white hover:bg-white/5"
                                }`}
                        >
                            {genre}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Display */}
            <div className="animate-fade-in space-y-12">
                {/* Description Box */}
                <div className="glass-panel p-8 md:p-12 rounded-3xl text-center border-white/10">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-400">
                        {activeSubTab}
                    </h2>
                    <p className="text-lg text-gray-300 leading-loose max-w-3xl mx-auto word-keep-all">
                        {currentGenre.desc}
                    </p>
                </div>

                {/* Features (3 Hexagons) */}
                <div className="flex flex-col md:flex-row justify-center gap-8 md:gap-12">
                    {currentGenre.features.map((feature, idx) => (
                        <div key={idx} className="flex justify-center">
                            <div
                                className="w-64 aspect-[1/1.1547] bg-white/5 backdrop-blur-md relative flex flex-col items-center justify-center p-6 text-center group hover:scale-105 transition-transform duration-500 shadow-lg"
                                style={{
                                    clipPath: "polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%)",
                                    WebkitClipPath: "polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%)"
                                }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
                                <span className="text-2xl font-bold text-gray-500 mb-3 group-hover:text-white transition-colors duration-500 relative z-10">{idx + 1}</span>
                                <p className="text-gray-300 font-medium word-keep-all leading-tight relative z-10 group-hover:text-white transition-colors">
                                    {feature}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Details (Accordion) */}
                {currentGenre.details && (
                    <div className="space-y-6 max-w-4xl mx-auto">
                        {currentGenre.details.map((section, idx) => (
                            <div key={idx} className="glass-panel p-8 rounded-2xl border-white/5 hover:border-white/20 transition-colors">
                                <h3 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">
                                    {section.title}
                                </h3>

                                <div className="space-y-6">
                                    {section.text && (
                                        <p className="text-gray-300 leading-relaxed word-keep-all">{section.text}</p>
                                    )}

                                    {section.items && (
                                        <div className="grid gap-6">
                                            {section.items.map((item, itemIdx) => (
                                                <div key={itemIdx}>
                                                    {item.subtitle && (
                                                        <h4 className="font-bold text-white mb-2 text-lg">
                                                            {item.subtitle}
                                                        </h4>
                                                    )}
                                                    <p className="text-gray-400 leading-relaxed word-keep-all">
                                                        {item.text}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {section.list && (
                                        <ul className="grid gap-4">
                                            {section.list.map((item, listIdx) => (
                                                <li key={listIdx} className="flex flex-col md:flex-row gap-2 md:gap-4 p-4 rounded-lg bg-white/5 border border-white/5">
                                                    <span className="font-bold text-white whitespace-nowrap min-w-32">{item.term}</span>
                                                    <span className="text-gray-400">{item.desc}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="h-20" /> {/* Bottom spacer */}
        </div>
    );
};

export default function GenresPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-neutral-950 text-white">Loading...</div>}>
            <main className="pt-[120px] min-h-screen bg-neutral-950 pb-20">
                <GenresContent />
            </main>
        </Suspense>
    );
}
