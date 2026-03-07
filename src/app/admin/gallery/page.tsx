/**
 * 관리자 패널 - 갤러리 관리(Gallery) 페이지 라우트
 * 
 * 랜딩 페이지의 SectionB(아티스트 포트폴리오 마키)와 주요 포트폴리오 섹션에
 * 슬라이드로 노출될 타투 작업 결과물(이미지, 장르, 부위)을
 * 새로 등록(Create), 조회(Read), 수정(Update), 삭제(Delete)하는 시스템입니다.
 */

"use client";

import { useEffect, useState, useRef } from "react";

import { GENRES, PARTS } from "@/data/constants";

export default function AdminGalleryPage() {
    const [items, setItems] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);

    // 폼 상태
    const [title, setTitle] = useState("");
    const [genre, setGenre] = useState(GENRES[0]);
    const [part, setPart] = useState(PARTS[0]);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const fetchItems = async () => {
        try {
            const res = await fetch("/api/gallery");
            if (res.ok) {
                const data = await res.json();
                setItems(data.items || []);
            }
        } catch (error) {
            console.error("Failed to fetch gallery:", error);
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
            alert("이미지를 첨부해주세요.");
            return;
        }

        setIsSubmitting(true);
        try {
            const method = editId ? "PUT" : "POST";
            const reqBody = editId ? {
                id: editId, title, genre, part, image: imagePreview
            } : {
                title, genre, part, image: imagePreview
            };

            const res = await fetch("/api/gallery", {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(reqBody)
            });

            if (res.ok) {
                alert(`갤러리에 성공적으로 ${editId ? "수정" : "등록"}되었습니다.`);
                // 폼 초기화
                setTitle("");
                setGenre(GENRES[0]);
                setPart(PARTS[0]);
                setImagePreview(null);
                setEditId(null);
                if (fileInputRef.current) fileInputRef.current.value = "";

                setIsModalOpen(false); // 모달 닫기

                // 목록 갱신
                fetchItems();
            } else {
                const err = await res.json();
                alert(`처리 실패: ${err.error}`);
            }
        } catch (error) {
            console.error("Submit Error:", error);
            alert("서버 연결에 실패했습니다.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEditClick = (item: any) => {
        setEditId(item.id);
        setTitle(item.title);
        setGenre(item.genre || GENRES[0]);
        setPart(item.part || PARTS[0]);
        setImagePreview(item.imageUrl);
        setIsModalOpen(true);
    };

    const handleCreateClick = () => {
        setEditId(null);
        setTitle("");
        setGenre(GENRES[0]);
        setPart(PARTS[0]);
        setImagePreview(null);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string, itemTitle: string) => {
        if (!window.confirm(`'${itemTitle}' 작업물을 정말 삭제하시겠습니까?`)) return;

        try {
            const res = await fetch(`/api/gallery?id=${id}`, {
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
                    <h1 className="text-3xl md:text-4xl font-bold text-[#F3EBE1]">Gallery Management</h1>
                    <p className="text-sm md:text-base text-gray-400 mt-2">갤러리 메인 페이지에 노출될 새로운 작업 이미지를 등록하고 관리합니다.</p>
                </div>
                <button
                    onClick={handleCreateClick}
                    className="px-4 py-2 sm:px-6 sm:py-3 bg-red-950/80 hover:bg-red-900 text-white rounded-lg transition-colors font-medium whitespace-nowrap text-sm sm:text-base w-full sm:w-auto"
                >
                    등록 하기
                </button>
            </div>

            {/* 등록/수정 모달 영역 */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
                    <div className="relative w-full max-w-2xl bg-[#1a1412] border border-white/10 rounded-2xl shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-4 right-4 p-2 text-white/50 hover:text-white transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>

                        <h2 className="text-xl font-medium text-[#F3EBE1] mb-6 border-b border-white/5 pb-4">
                            {editId ? "작업물 정보 수정" : "새 작업물 업로드"}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm text-gray-400">Title (제목)</label>
                                <input
                                    type="text"
                                    required
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="예: 뱀과 모란 타투"
                                    className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white focus:border-red-900/50 outline-none"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm text-gray-400">Genre (장르)</label>
                                    <select
                                        value={genre}
                                        onChange={(e) => setGenre(e.target.value)}
                                        className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white focus:border-red-900/50 outline-none appearance-none"
                                    >
                                        {GENRES.map((g) => <option key={g} value={g} className="bg-[#1a1412] text-white">{g}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-gray-400">Part (시술 부위)</label>
                                    <select
                                        value={part}
                                        onChange={(e) => setPart(e.target.value)}
                                        className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white focus:border-red-900/50 outline-none appearance-none"
                                    >
                                        {PARTS.map((p) => <option key={p} value={p} className="bg-[#1a1412] text-white">{p}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm text-gray-400">Image (작업 사진 첨부)</label>
                                <div className="flex items-start gap-4 flex-col sm:flex-row">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        ref={fileInputRef}
                                        onChange={handleImageChange}
                                        className="text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20 transition-all w-full sm:w-auto"
                                    />
                                    {imagePreview && (
                                        <div className="relative w-32 h-32 rounded overflow-hidden border border-white/10 bg-black shrink-0">
                                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
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
                                    className="px-8 py-3 bg-red-950/80 hover:bg-red-900 text-white rounded-lg transition-colors disabled:opacity-50"
                                >
                                    {isSubmitting ? "처리 중..." : (editId ? "수정하기" : "등록하기")}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* 목록 영역 */}
            <div className="bg-[#1C1310] rounded-xl border border-white/10 p-6 overflow-x-auto">
                <h2 className="text-xl font-medium text-[#F3EBE1] mb-6">등록된 갤러리 내역</h2>
                <table className="w-full text-left text-sm text-gray-400 min-w-max">
                    <thead className="bg-[#2A1D18] text-[#F3EBE1]">
                        <tr>
                            <th className="p-4 rounded-tl-lg w-24">미리보기</th>
                            <th className="p-4">제목(Title)</th>
                            <th className="p-4">장르(Genre)</th>
                            <th className="p-4">부위(Part)</th>
                            <th className="p-4">등록일</th>
                            <th className="p-4 rounded-tr-lg w-20">작업</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.length > 0 ? (
                            items.map((item) => (
                                <tr key={item.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                    <td className="p-4">
                                        <div className="w-16 h-16 rounded overflow-hidden bg-black/50 border border-white/5">
                                            {item.imageUrl && (
                                                <img src={item.imageUrl} alt="thumb" className="w-full h-full object-cover" />
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-4 font-medium text-white">{item.title}</td>
                                    <td className="p-4">{item.genre}</td>
                                    <td className="p-4">{item.part}</td>
                                    <td className="p-4">{new Date(item.createdAt).toLocaleDateString()}</td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleEditClick(item)}
                                                className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 hover:text-white rounded text-xs transition-colors"
                                            >
                                                수정
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item.id, item.title)}
                                                className="px-3 py-1.5 bg-red-950/50 hover:bg-red-900 border border-red-900/50 text-white rounded text-xs transition-colors"
                                            >
                                                삭제
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="p-12 text-center text-gray-500">
                                    등록된 작업 이미지가 없습니다. 상단 폼을 통해 첫 작품을 등록해주세요.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
