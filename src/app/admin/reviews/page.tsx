/**
 * 관리자 패널 - 리뷰 관리(Reviews) 페이지 라우트
 * 
 * 랜딩 페이지 SectionE(고객 리뷰 모달) 등에 노출될 실사용자 리뷰 내역을
 * 리스트 형태로 조회하고, 부적절한 리뷰를 필터링 및 직접 삭제할 수 있는 페이지입니다.
 * 민감 정보인 원본 이름(Original Name)과 익명 처리된 이름 등을 구분해서 파악할 수 있습니다.
 */

"use client";

import { useEffect, useState } from "react";
import ReviewDetailModal from "@/components/admin/ReviewDetailModal";

export default function AdminReviewsPage() {
    const [reviews, setReviews] = useState<any[]>([]);
    const [search, setSearch] = useState("");
    const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchReviews = async () => {
        try {
            const res = await fetch("/api/reviews");
            if (res.ok) {
                const data = await res.json();
                setReviews(data.reviews || []);
            }
        } catch (error) {
            console.error("Failed to fetch reviews:", error);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    const handleDelete = async (id: string) => {
        if (!process.browser) return;
        if (!window.confirm("정말 이 리뷰를 삭제하시겠습니까?")) return;

        try {
            const res = await fetch(`/api/reviews?id=${id}`, {
                method: "DELETE",
            });
            if (res.ok) {
                alert("리뷰가 정상적으로 삭제되었습니다.");
                fetchReviews(); // 목록 새로고침
            } else {
                alert("리뷰 삭제에 실패했습니다.");
            }
        } catch (error) {
            console.error("Delete Error:", error);
            alert("서버 연결에 실패했습니다.");
        }
    };

    const filteredReviews = reviews.filter((r) => {
        if (!search) return true;
        const q = search.toLowerCase();
        return (
            (r.reviewId && r.reviewId.toLowerCase().includes(q)) ||
            (r.name && r.name.toLowerCase().includes(q)) ||
            (r.originalName && r.originalName.toLowerCase().includes(q))
        );
    });

    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 max-h-none overflow-x-hidden w-full max-w-7xl mx-auto">
            <div>
                <h1 className="text-3xl md:text-4xl font-bold text-[#F3EBE1]">리뷰 관리</h1>
                <p className="text-sm md:text-base text-gray-400 mt-2">고객들이 남긴 웹사이트 리뷰 조회 및 불건전 리뷰 삭제 관리가 가능합니다.</p>
            </div>

            {/* 검색 */}
            <div className="relative w-full md:w-80">
                <input
                    type="text"
                    placeholder="아이디 또는 작성자 검색..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 sm:py-3 text-white placeholder-gray-500 focus:outline-none focus:border-white/30 transition-all font-medium text-sm sm:text-base"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
            </div>

            <div className="bg-[#1C1310] rounded-xl border border-white/10 p-6 overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-400 min-w-max">
                    <thead className="bg-[#2A1D18] text-[#F3EBE1]">
                        <tr>
                            <th className="p-4 rounded-tl-lg">아이디</th>
                            <th className="p-4">작성자</th>
                            <th className="p-4">별점</th>
                            <th className="p-4">이미지</th>
                            <th className="p-4">장르</th>
                            <th className="p-4">리뷰 내용</th>
                            <th className="p-4">연락처</th>
                            <th className="p-4">패스워드(암호화X)</th>
                            <th className="p-4">작성일</th>
                            <th className="p-4 rounded-tr-lg">관리</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredReviews.length > 0 ? (
                            filteredReviews.map((r) => (
                                <tr key={r.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                    <td className="p-4 font-mono text-xs text-gray-300">
                                        {r.reviewId || "-"}
                                    </td>
                                    <td className="p-4 font-medium text-white">
                                        {r.originalName && r.originalName !== r.name ? `${r.originalName} (익명: ${r.name})` : r.originalName || r.name}
                                    </td>
                                    <td className="p-4 text-yellow-500 font-bold">{r.rating}점</td>
                                    <td className="p-4">
                                        {r.imageUrl ? (
                                            <div className="w-10 h-10 rounded bg-white/5 border border-white/10 overflow-hidden group/thumb relative cursor-help">
                                                <img src={r.imageUrl} alt="thumb" className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/thumb:opacity-100 flex items-center justify-center transition-opacity">
                                                    <span className="text-[10px] text-white">🖼️</span>
                                                </div>
                                            </div>
                                        ) : (
                                            <span className="text-gray-600">-</span>
                                        )}
                                    </td>
                                    <td className="p-4">{r.genre || "-"}</td>
                                    <td className="p-4 max-w-xs truncate" title={r.content}>
                                        {r.content}
                                    </td>
                                    <td className="p-4 text-gray-400 text-xs">{r.phone || "-"}</td>
                                    <td className="p-4 text-gray-500 text-xs">{r.password || "-"}</td>
                                    <td className="p-4">
                                        {new Date(r.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => {
                                                    setSelectedReviewId(r.reviewId);
                                                    setIsModalOpen(true);
                                                }}
                                                className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg transition-colors text-xs"
                                            >
                                                보기
                                            </button>
                                            <button
                                                onClick={() => handleDelete(r.id)}
                                                className="px-4 py-2 bg-red-950/50 hover:bg-red-900 border border-red-900/50 text-white rounded-lg transition-colors text-xs"
                                            >
                                                삭제
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={10} className="p-12 text-center text-gray-500">
                                    {search ? "검색 결과가 없습니다." : "현재 등록된 리뷰가 하나도 없습니다."}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* 리뷰 상세 모달 */}
            <ReviewDetailModal
                isOpen={isModalOpen}
                reviewId={selectedReviewId}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedReviewId(null);
                }}
            />
        </div>
    );
}
