/**
 * 스태프 패널 - 리뷰 관리 페이지
 * 
 * 고객 리뷰를 조회하고 부적절한 리뷰를 삭제할 수 있습니다.
 */

"use client";

import { useEffect, useState } from "react";

export default function StaffReviewsPage() {
    const [reviews, setReviews] = useState<any[]>([]);
    const [search, setSearch] = useState("");

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

    useEffect(() => { fetchReviews(); }, []);

    const handleDelete = async (id: string) => {
        if (!window.confirm("정말 이 리뷰를 삭제하시겠습니까?")) return;
        try {
            const res = await fetch(`/api/reviews?id=${id}`, { method: "DELETE" });
            if (res.ok) { alert("리뷰가 삭제되었습니다."); fetchReviews(); }
            else { alert("리뷰 삭제에 실패했습니다."); }
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
                <h1 className="text-3xl md:text-4xl font-bold text-[#E1E8F3]">리뷰 관리</h1>
                <p className="text-sm md:text-base text-gray-400 mt-2">고객들이 남긴 리뷰를 조회하고 관리할 수 있습니다.</p>
            </div>

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

            <div className="bg-[#0B0F14] rounded-xl border border-white/10 p-6 overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-400 min-w-max">
                    <thead className="bg-[#151A24] text-[#E1E8F3]">
                        <tr>
                            <th className="p-4 rounded-tl-lg">아이디</th>
                            <th className="p-4">작성자</th>
                            <th className="p-4">별점</th>
                            <th className="p-4">이미지</th>
                            <th className="p-4">장르</th>
                            <th className="p-4">리뷰 내용</th>
                            <th className="p-4">작성일</th>
                            <th className="p-4 rounded-tr-lg">작업</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredReviews.length > 0 ? (
                            filteredReviews.map((r) => (
                                <tr key={r.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                    <td className="p-4 font-mono text-xs text-gray-300">{r.reviewId || "-"}</td>
                                    <td className="p-4 font-medium text-white">
                                        {r.originalName && r.originalName !== r.name ? `${r.originalName} (익명: ${r.name})` : r.originalName || r.name}
                                    </td>
                                    <td className="p-4 text-yellow-500 font-bold">{r.rating}점</td>
                                    <td className="p-4">
                                        {r.imageUrl ? (
                                            <div className="w-10 h-10 rounded bg-white/5 border border-white/10 overflow-hidden">
                                                <img src={r.imageUrl} alt="thumb" className="w-full h-full object-cover" />
                                            </div>
                                        ) : (
                                            <span className="text-gray-600">-</span>
                                        )}
                                    </td>
                                    <td className="p-4">{r.genre || "-"}</td>
                                    <td className="p-4 max-w-xs truncate" title={r.content}>{r.content}</td>
                                    <td className="p-4">{new Date(r.createdAt).toLocaleDateString()}</td>
                                    <td className="p-4">
                                        <button
                                            onClick={() => handleDelete(r.id)}
                                            className="px-4 py-2 bg-red-950/50 hover:bg-red-900 border border-red-900/50 text-white rounded-lg transition-colors text-xs"
                                        >
                                            삭제
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={8} className="p-12 text-center text-gray-500">
                                    {search ? "검색 결과가 없습니다." : "현재 등록된 리뷰가 없습니다."}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
