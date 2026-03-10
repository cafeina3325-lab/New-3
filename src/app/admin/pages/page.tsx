import React from "react";
import Link from "next/link";

const PAGE_MENUS = [
    { title: "히어로 영상", description: "대시보드 메인 히어로 영상을 관리합니다.", path: "/admin/hero", icon: "🎥" },
    { title: "이벤트", description: "진행 중인 이벤트와 프로모션을 관리합니다.", path: "/admin/event", icon: "🎁" },
    { title: "갤러리", description: "포트폴리오 및 갤러리 이미지를 관리합니다.", path: "/admin/gallery", icon: "🖼️" },
    { title: "리뷰", description: "고객 후기 및 만족도 조사를 관리합니다.", path: "/admin/reviews", icon: "📊" },
];

export default function PagesManagementPage() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-[#F3EBE1] tracking-tighter uppercase">PAGE MANAGEMENT</h1>
                    <p className="text-gray-500 text-sm mt-1">웹사이트의 주요 콘텐츠 섹션을 체계적으로 관리합니다.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {PAGE_MENUS.map((menu) => (
                    <Link
                        key={menu.path}
                        href={menu.path}
                        className="group relative p-8 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all duration-300 flex flex-col items-center text-center space-y-4"
                    >
                        <div className="text-5xl group-hover:scale-110 transition-transform duration-300">{menu.icon}</div>
                        <div>
                            <h3 className="text-xl font-bold text-[#F3EBE1] mb-2">{menu.title}</h3>
                            <p className="text-xs text-gray-400 leading-relaxed font-medium">
                                {menu.description}
                            </p>
                        </div>
                        <div className="pt-4 mt-auto">
                            <span className="text-[10px] font-bold text-orange-400 group-hover:text-orange-300 uppercase tracking-widest border border-orange-400/30 px-3 py-1 rounded-full group-hover:bg-orange-400/10 transition-colors">
                                상세 관리 바로가기 →
                            </span>
                        </div>
                    </Link>
                ))}
            </div>

            {/* 안내 문구 */}
            <div className="p-8 bg-orange-500/5 border border-orange-500/10 rounded-3xl mt-12">
                <div className="flex items-start gap-4">
                    <span className="text-2xl mt-1">💡</span>
                    <div>
                        <h4 className="text-[#F3EBE1] font-bold mb-1 italic">Notice</h4>
                        <p className="text-sm text-gray-400 leading-relaxed">
                            페이지 관리 메뉴는 일반 사용자들이 보게 되는 웹사이트의 주요 구성 요소들을 집약적으로 관리하는 공간입니다.<br />
                            각 카드를 클릭하여 해당 섹션의 정보를 수정하거나 새로운 콘텐츠를 등록할 수 있습니다.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
