"use client";

import { useEffect, useState, useRef } from "react";
import { GENRES } from "@/data/constants";

/**
 * 스태프 패널 - 이벤트 관리(Event) 페이지 라우트
 * 
 * 관리자 페이지(admin/event/page.tsx)와 UI 구조 및 모달 필드를 완벽하게 동기화했습니다.
 * 스태프 전용 테마를 유지하면서 사용자 경험(UX)을 동일하게 제공합니다.
 */
export default function StaffEventPage() {
    const [items, setItems] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 폼 상태 (Admin과 동일한 구성)
    const [title, setTitle] = useState("");
    const [genre, setGenre] = useState(GENRES[0]);
    const [priceInput, setPriceInput] = useState("");
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const fetchItems = async () => {
        try {
            const res = await fetch("/api/event");
            if (res.ok) {
                const data = await res.json();
                setItems(data.items || []);
            }
        } catch (error) {
            console.error("Failed to fetch events:", error);
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!imagePreview) {
            alert("이벤트 이미지를 첨부해주세요.");
            return;
        }

        setIsSubmitting(true);
        try {
            // 가격 단위 변환 (예: 10 -> 100,000)
            const priceWon = parseFloat(priceInput) * 10000;

            const res = await fetch("/api/event", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title,
                    genre,
                    price: isNaN(priceWon) ? 0 : priceWon,
                    image: imagePreview
                })
            });

            if (res.ok) {
                alert("이벤트가 성공적으로 등록되었습니다.");
                // 폼 초기화
                setTitle("");
                setGenre(GENRES[0]);
                setPriceInput("");
                setImagePreview(null);
                if (fileInputRef.current) fileInputRef.current.value = "";

                setIsModalOpen(false);
                fetchItems();
            } else {
                const err = await res.json();
                alert(`등록 실패: ${err.error}`);
            }
        } catch (error) {
            console.error("Submit Error:", error);
            alert("서버 연결에 실패했습니다.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string, itemTitle: string) => {
        if (!window.confirm(`'${itemTitle}' 이벤트를 정말 삭제하시겠습니까?`)) return;

        try {
            const res = await fetch(`/api/event?id=${id}`, {
                method: "DELETE",
            });
            if (res.ok) {
                alert("삭제되었습니다.");
                fetchItems();
            } else {
                alert("삭제 처리에 실패했습니다.");
            }
        } catch (error) {
            console.error("Delete Error:", error);
            alert("서버 통신 오류가 발생했습니다.");
        }
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-8 sm:space-y-12">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-[#E1E8F3]">Event Management</h1>
                    <p className="text-sm md:text-base text-gray-400 mt-2">이벤트 메인 페이지에 노출될 새로운 이벤트 및 팝업 소식을 관리합니다.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-4 py-2 sm:px-6 sm:py-3 bg-blue-950/80 hover:bg-blue-900 text-white rounded-lg transition-colors font-medium whitespace-nowrap text-sm sm:text-base w-full sm:w-auto"
                >
                    등록 하기
                </button>
            </div>

            {/* 등록 모달 영역 (Admin과 동일한 구조) */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
                    <div className="relative w-full max-w-2xl bg-[#0F1218] border border-white/10 rounded-2xl shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-4 right-4 p-2 text-white/50 hover:text-white transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>

                        <h2 className="text-xl font-medium text-[#E1E8F3] mb-6 border-b border-white/5 pb-4">새 이벤트 공지 업로드</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm text-gray-400">Title (이벤트 제목)</label>
                                <input
                                    type="text"
                                    required
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="예: 4주년 기념 게스트 워크 안내"
                                    className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white focus:border-blue-900/50 outline-none"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm text-gray-400">Genre (장르)</label>
                                <select
                                    value={genre}
                                    onChange={(e) => setGenre(e.target.value)}
                                    className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white focus:border-blue-900/50 outline-none appearance-none"
                                >
                                    {GENRES.map((g) => <option key={g} value={g} className="bg-[#0F1218] text-white">{g}</option>)}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm text-gray-400">Price (가격, 단위: 만 원)</label>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number"
                                            step="0.1"
                                            required
                                            value={priceInput}
                                            onChange={(e) => setPriceInput(e.target.value)}
                                            placeholder="예: 10 입력 시 100,000 / 1.5 입력 시 15,000"
                                            className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white focus:border-blue-900/50 outline-none"
                                        />
                                        <span className="text-white whitespace-nowrap">만 원</span>
                                    </div>
                                    {priceInput && !isNaN(parseFloat(priceInput)) && (
                                        <p className="text-xs text-blue-400/80 px-1">
                                            실제 적용 금액: {(parseFloat(priceInput) * 10000).toLocaleString()} ₩
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm text-gray-400">Image (포스터 및 관련 사진 첨부)</label>
                                <div className="flex items-start gap-4 flex-col sm:flex-row">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        ref={fileInputRef}
                                        onChange={handleImageChange}
                                        className="text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20 transition-all w-full sm:w-auto"
                                    />
                                    {imagePreview ? (
                                        <div className="relative w-32 h-32 rounded overflow-hidden border border-white/10 bg-black shrink-0">
                                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                        </div>
                                    ) : (
                                        <div className="w-32 h-32 rounded border border-white/10 border-dashed bg-white/5 flex items-center justify-center shrink-0">
                                            <span className="text-xs text-gray-500">No Image</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors"
                                >
                                    취소
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-8 py-3 bg-blue-950/80 hover:bg-blue-900 text-white rounded-lg transition-colors disabled:opacity-50"
                                >
                                    {isSubmitting ? "업로드 중..." : "등록하기"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* 목록 영역 (카드 그리드 구조) */}
            <div className="space-y-6">
                <h2 className="text-xl font-medium text-[#E1E8F3] border-b border-white/5 pb-4">진행 중인 이벤트 내역</h2>

                {items.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {items.map((item) => (
                            <div key={item.id} className="group relative bg-[#0F1218] border border-white/10 rounded-2xl overflow-hidden hover:border-blue-900/50 transition-all duration-300 flex flex-col shadow-lg shadow-black/40">
                                {/* 카드 상단 이미지 영역 */}
                                <div className="aspect-[3/4] bg-black/40 relative overflow-hidden">
                                    {item.imageUrl ? (
                                        <img
                                            src={item.imageUrl}
                                            alt={item.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-700 bg-white/5">
                                            <span className="text-4xl mb-2">🖼️</span>
                                            <span className="text-xs uppercase tracking-widest opacity-50 font-bold">No Image</span>
                                        </div>
                                    )}

                                    {/* 장르 배지 (이미지 위 오버레이) */}
                                    <div className="absolute top-4 left-4">
                                        <span className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-[10px] font-bold text-blue-400 border border-blue-500/20 uppercase tracking-widest shadow-xl">
                                            {item.genre || "ETC."}
                                        </span>
                                    </div>
                                </div>

                                {/* 카드 하단 정보 영역 */}
                                <div className="p-5 flex flex-col flex-grow space-y-4">
                                    <div className="space-y-1">
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tight">Title</p>
                                        <h3 className="text-lg font-bold text-[#E1E8F3] line-clamp-1 group-hover:text-blue-400 transition-colors">
                                            {item.title}
                                        </h3>
                                    </div>

                                    <div className="flex items-end justify-between mt-auto">
                                        <div className="space-y-1">
                                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tight">Price</p>
                                            <p className="text-blue-500/90 font-mono text-xl font-bold tracking-tighter">
                                                {item.price ? `${Number(item.price).toLocaleString()} ₩` : '가격표 없음'}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] text-gray-600 font-bold uppercase tracking-tight mb-1">Created</p>
                                            <p className="text-xs text-gray-500">{new Date(item.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>

                                    {/* 삭제 버튼 */}
                                    <button
                                        onClick={() => handleDelete(item.id, item.title)}
                                        className="w-full py-2.5 bg-red-950/30 hover:bg-red-900 border border-red-900/40 text-white rounded-xl text-xs font-bold transition-all mt-2 group-hover:shadow-lg group-hover:shadow-red-950/20"
                                    >
                                        삭제하기
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-32 text-center border-2 border-dashed border-white/5 rounded-3xl bg-white/2">
                        <span className="text-5xl block mb-4 opacity-20">🎁</span>
                        <p className="text-gray-500 font-medium">등록된 이벤트가 없습니다.</p>
                        <p className="text-xs text-gray-600 mt-2">상단 '등록 하기' 버튼을 눌러 소식을 전해보세요.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
