import React from "react";
import Link from "next/link";

const PAGE_MENUS = [
    { title: "이벤트", description: "진행 중인 이벤트와 프로모션을 관리합니다.", path: "/staff/event", icon: "🎁" },
    { title: "갤러리", description: "포트폴리오 및 갤러리 이미지를 관리합니다.", path: "/staff/gallery", icon: "🖼️" },
    { title: "리뷰", description: "고객 후기 및 만족도 조사를 관리합니다.", path: "/staff/reviews", icon: "📊" },
];

export default function StaffPagesManagementPage() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-[#E1E8F3] tracking-tighter uppercase">PAGE MANAGEMENT</h1>
                    <p className="text-gray-500 text-sm mt-1">웹사이트의 주요 콘텐츠 섹션을 관리합니다.</p>
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
                            <h3 className="text-xl font-bold text-[#E1E8F3] mb-2">{menu.title}</h3>
                            <p className="text-xs text-gray-400 leading-relaxed font-medium">
                                {menu.description}
                            </p>
                        </div>
                        <div className="pt-4 mt-auto">
                            <span className="text-[10px] font-bold text-blue-400 group-hover:text-blue-300 uppercase tracking-widest border border-blue-400/30 px-3 py-1 rounded-full group-hover:bg-blue-400/10 transition-colors">
                                상세 관리 바로가기 →
                            </span>
                        </div>
                    </Link>
                ))}
            </div>

            {/* 안내 문구 */}
            <div className="p-8 bg-blue-500/5 border border-blue-500/10 rounded-3xl mt-12">
                <div className="flex items-start gap-4">
                    <span className="text-2xl mt-1">💡</span>
                    <div>
                        <h4 className="text-[#E1E8F3] font-bold mb-1 italic">Staff Notice</h4>
                        <p className="text-sm text-gray-400 leading-relaxed">
                            이 페이지는 스태프 권한으로 웹사이트의 이벤트를 등록하거나 갤러리를 관리할 수 있는 공간입니다.<br />
                            정확한 정보를 입력하여 고객들에게 최신 정보를 제공해 주세요.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
