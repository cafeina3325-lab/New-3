/**
 * 관리자 패널 - 히어로 영상 관리(Hero Video) 페이지 라우트
 * 
 * 랜딩 페이지 최상단 SectionA에 보여질 백그라운드 영상(MP4, WebM)을
 * Vercel Blob 등 외부 스토리지로 업로드하여 교체 적용하거나 삭제할 수 있는 페이지입니다.
 */

"use client";

import { useState, useEffect, useRef } from "react";

interface HeroVideo {
    id: number;
    url: string;
    filename: string | null;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export default function AdminHeroPage() {
    const [currentVideo, setCurrentVideo] = useState<HeroVideo | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // 현재 등록된 영상 조회
    useEffect(() => {
        fetchCurrentVideo();
    }, []);

    const fetchCurrentVideo = async () => {
        try {
            const res = await fetch("/api/hero");
            const data = await res.json();
            setCurrentVideo(data.video);
        } catch {
            console.error("Failed to fetch hero video");
        } finally {
            setIsLoading(false);
        }
    };

    // 파일 선택 핸들러
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            // 브라우저 미리보기 URL 생성
            if (previewUrl) URL.revokeObjectURL(previewUrl);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
            setMessage(null);
        }
    };

    // 영상 업로드/교체
    const handleSave = async () => {
        if (!selectedFile) {
            setMessage({ type: "error", text: "업로드할 파일을 선택해 주세요." });
            return;
        }

        setIsSaving(true);
        setMessage(null);

        try {
            const formData = new FormData();
            formData.append("file", selectedFile);

            const res = await fetch("/api/hero", {
                method: "POST",
                body: formData,
            });

            if (res.ok) {
                const data = await res.json();
                setCurrentVideo(data.video);
                setSelectedFile(null);
                if (previewUrl) URL.revokeObjectURL(previewUrl);
                setPreviewUrl(null);
                if (fileInputRef.current) fileInputRef.current.value = "";
                setMessage({ type: "success", text: "히어로 영상이 성공적으로 업로드되었습니다." });
            } else {
                const errorData = await res.json();
                setMessage({ type: "error", text: errorData.error || "영상 업로드에 실패했습니다." });
            }
        } catch {
            setMessage({ type: "error", text: "네트워크 오류가 발생했습니다." });
        } finally {
            setIsSaving(false);
        }
    };

    // 영상 삭제
    const handleDelete = async () => {
        if (!confirm("히어로 영상을 삭제하시겠습니까?\n삭제 시 메인 페이지에 기본 배경이 표시됩니다.")) return;

        setIsSaving(true);
        setMessage(null);

        try {
            const res = await fetch("/api/hero", { method: "DELETE" });

            if (res.ok) {
                setCurrentVideo(null);
                setSelectedFile(null);
                if (previewUrl) URL.revokeObjectURL(previewUrl);
                setPreviewUrl(null);
                if (fileInputRef.current) fileInputRef.current.value = "";
                setMessage({ type: "success", text: "영상이 삭제되었습니다. 메인 페이지에 기본 배경이 표시됩니다." });
            } else {
                setMessage({ type: "error", text: "영상 삭제에 실패했습니다." });
            }
        } catch {
            setMessage({ type: "error", text: "네트워크 오류가 발생했습니다." });
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-gray-400 font-medium">데이터를 불러오는 중...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6 sm:space-y-10 pt-4 sm:pt-8 max-w-4xl pb-12">
            {/* 헤더 */}
            <div className="flex flex-col gap-1 sm:gap-2">
                <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">히어로 영상 관리</h1>
                <p className="text-sm md:text-base text-gray-400 mt-2">메인 페이지 상단 히어로 섹션에 표시되는 배경 영상을 관리합니다.</p>
            </div>

            {/* 알림 메시지 */}
            {message && (
                <div className={`p-4 rounded-xl border animate-in fade-in slide-in-from-top-2 duration-300 ${message.type === "success"
                    ? "bg-green-500/10 border-green-500/30 text-green-400"
                    : "bg-red-500/10 border-red-500/30 text-red-400"
                    }`}>
                    <div className="flex items-center gap-3">
                        <span className="text-xl">{message.type === "success" ? "✓" : "⚠"}</span>
                        <p className="font-medium text-sm">{message.text}</p>
                    </div>
                </div>
            )}

            {/* 현재 상태 */}
            <div className="bg-[#140D0B] border border-white/5 rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-2xl overflow-hidden relative">
                <div className="absolute top-0 right-0 p-4 sm:p-8 opacity-10 pointer-events-none">
                    <span className="text-6xl sm:text-8xl">🎥</span>
                </div>

                <h2 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3 relative z-10">
                    <span className="text-xl sm:text-2xl">📺</span>
                    현재 활성화된 영상
                </h2>

                {currentVideo ? (
                    <div className="space-y-6 relative z-10">
                        {/* 상태 배지 */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className="flex items-center gap-2 px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-xs font-bold border border-green-500/20">
                                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                    활성화됨
                                </span>
                            </div>
                            <span className="text-gray-500 text-xs font-medium">
                                최종 업데이트: {new Date(currentVideo.updatedAt).toLocaleString("ko-KR")}
                            </span>
                        </div>

                        {/* 미리보기 */}
                        <div className="aspect-video bg-black rounded-2xl overflow-hidden border border-white/10 shadow-inner group relative">
                            <video
                                key={currentVideo.url}
                                src={currentVideo.url}
                                className="w-full h-full object-cover"
                                controls
                                muted
                                playsInline
                            />
                        </div>

                        {/* 파일 정보 표시 */}
                        <div className="bg-white/5 border border-white/5 p-4 rounded-2xl flex items-center justify-between">
                            <div className="flex flex-col gap-1 overflow-hidden">
                                <span className="text-xs text-gray-500 uppercase tracking-wider font-bold">파일명</span>
                                <span className="text-[#F3EBE1] text-sm truncate font-medium">{currentVideo.filename || "알 수 없는 파일"}</span>
                            </div>
                            <button
                                onClick={() => window.open(currentVideo.url, '_blank')}
                                className="text-xs text-gray-400 hover:text-white transition-colors underline underline-offset-4"
                            >
                                원본 보기
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center relative z-10">
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 shadow-xl border border-white/5">
                            <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <p className="text-gray-400 font-bold text-lg mb-2">활성화된 영상이 없습니다</p>
                        <p className="text-gray-600 text-sm max-w-xs leading-relaxed">
                            메인 페이지에는 스튜디오의 기본 배경 이미지가 표시되고 있습니다. 새 영상을 업로드하여 활성화할 수 있습니다.
                        </p>
                    </div>
                )}
            </div>

            {/* 영상 업로드 폼 */}
            <div className="bg-[#140D0B] border border-white/5 rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-2xl">
                <h2 className="text-lg sm:text-xl font-bold text-white mb-6 sm:mb-8 flex items-center gap-2 sm:gap-3">
                    <span className="text-xl sm:text-2xl">{currentVideo ? "🔄" : "📤"}</span>
                    {currentVideo ? "영상 파일 교체" : "새로운 영상 업로드"}
                </h2>

                <div className="space-y-8">
                    {/* 파일 입력 섹션 */}
                    <div className="group">
                        <label className="block text-sm font-bold text-gray-500 uppercase tracking-widest mb-3">영상 파일 (MP4, WebM)</label>
                        <div className="relative">
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept="video/*"
                                className="hidden"
                                id="video-upload"
                            />
                            <label
                                htmlFor="video-upload"
                                className="flex flex-col items-center justify-center w-full min-h-48 rounded-3xl border-2 border-dashed border-white/10 bg-white/5 hover:bg-white/[0.08] hover:border-white/20 transition-all cursor-pointer group-hover:shadow-lg"
                            >
                                {!selectedFile ? (
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="p-4 bg-white/5 rounded-full text-gray-400 group-hover:text-white transition-colors">
                                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                        </div>
                                        <span className="text-gray-400 font-medium group-hover:text-white transition-colors">파일 선택하기</span>
                                        <p className="text-[10px] text-gray-600 uppercase tracking-tighter">Click to browse your files</p>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center gap-2">
                                        <span className="text-[#F3EBE1] font-bold text-lg">{selectedFile.name}</span>
                                        <span className="text-xs text-gray-500">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</span>
                                        <span className="mt-2 text-xs text-blue-400 underline underline-offset-2">다른 파일 선택</span>
                                    </div>
                                )}
                            </label>
                        </div>
                    </div>

                    {/* 업로드 전 미리보기 */}
                    {previewUrl && (
                        <div className="animate-in zoom-in-95 duration-500">
                            <label className="block text-sm font-bold text-gray-500 uppercase tracking-widest mb-3">업로드 예정 미리보기</label>
                            <div className="aspect-video bg-black rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative">
                                <video
                                    src={previewUrl}
                                    className="w-full h-full object-cover"
                                    controls
                                    muted
                                />
                                <div className="absolute top-4 left-4">
                                    <span className="px-3 py-1 bg-blue-500 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">New Selection</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 액션 버튼 */}
                    <div className="flex items-center gap-4 pt-6 border-t border-white/5">
                        <button
                            onClick={handleSave}
                            disabled={isSaving || !selectedFile}
                            className="flex-1 max-w-md px-10 py-5 bg-[#F3EBE1] text-[#1C1310] font-black text-lg rounded-2xl hover:bg-white hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-20 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-4 shadow-xl"
                        >
                            {isSaving ? (
                                <>
                                    <div className="flex gap-1">
                                        <div className="w-1.5 h-1.5 bg-[#1C1310] rounded-full animate-bounce [animation-delay:-0.3s]" />
                                        <div className="w-1.5 h-1.5 bg-[#1C1310] rounded-full animate-bounce [animation-delay:-0.15s]" />
                                        <div className="w-1.5 h-1.5 bg-[#1C1310] rounded-full animate-bounce" />
                                    </div>
                                    <span className="uppercase tracking-widest italic">Uploading...</span>
                                </>
                            ) : (
                                <>
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                    </svg>
                                    <span className="uppercase tracking-widest">{currentVideo ? "Confirm Replacement" : "Start Upload"}</span>
                                </>
                            )}
                        </button>

                        {currentVideo && !isSaving && (
                            <button
                                onClick={handleDelete}
                                className="px-8 py-5 bg-transparent text-gray-500 hover:text-red-400 font-bold rounded-2xl border border-white/5 hover:border-red-500/20 hover:bg-red-500/5 transition-all flex items-center gap-2"
                                title="이 영상을 목록에서 제거"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                <span className="uppercase tracking-tighter text-xs">Delete</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* 하단 도움말 */}
            <div className="px-8 flex items-center gap-4 text-gray-600">
                <div className="w-1 h-1 bg-gray-700 rounded-full" />
                <p className="text-[10px] uppercase tracking-[0.2em] font-medium italic">High resolution video files may take several minutes to process across global CDNs.</p>
            </div>
        </div>
    );
}
