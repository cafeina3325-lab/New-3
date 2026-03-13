/**
 * 랜딩 페이지 최상단 히어로(Hero) 비디오 섹션
 * 
 * DB(Prisma)에서 현재 활성화(isActive=true) 처리된 백그라운드 영상 URL을 페칭하여
 * 메인 화면 전체를 덮는 자동 재생 비디오 레이어를 렌더링합니다.
 * YouTube 링크인 경우 iframe 임베드로 처리하고, 직접 업로드된 파일인 경우 <video> 태그를 사용합니다.
 */

"use client";

import { useState, useEffect } from "react";

export default function Hero() {
    // State
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    // 기본적으로 소리가 꺼진 상태(Muted)로 영상을 자동 재생합니다.
    const [isMuted, setIsMuted] = useState(true);

    // 컴포넌트 마운트 시 API 라우트를 호출해 활성 영상을 서버에서 가져옵니다.
    useEffect(() => {
        fetch("/api/hero")
            .then((res) => res.json())
            .then((data) => {
                if (data.video?.url) {
                    setVideoUrl(data.video.url);
                }
            })
            .catch(() => {
                // 패칭 실패 시 배경 없음 상태 유지
            })
            .finally(() => setIsLoaded(true));
    }, []);

    // 헬퍼 함수: 입력된 문자열이 YouTube 링크 형태일 경우, iframe 출력을 위해 파라미터를 결합하여 반환합니다.
    const getYouTubeEmbedUrl = (url: string) => {
        const match = url.match(
            /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
        );
        if (match) {
            // controls=0, showinfo=0 등으로 UI를 숨기고 loop옵션 부여 (플레이리스트 ID 요구됨)
            return `https://www.youtube.com/embed/${match[1]}?autoplay=1&mute=${isMuted ? 1 : 0}&loop=1&controls=0&showinfo=0&modestbranding=1&playlist=${match[1]}`;
        }
        return null;
    };

    // 현재 전달받은 영상이 YouTube 소스인지 체크하고 임베드 URL을 연산합니다.
    const isYouTube = videoUrl ? /(?:youtube\.com|youtu\.be)/.test(videoUrl) : false;
    const embedUrl = videoUrl && isYouTube ? getYouTubeEmbedUrl(videoUrl) : null;

    return (
        <section className="min-h-screen border-b border-white/10 w-full relative overflow-hidden bg-[#1C1310]">
            {/* 영상이 있을 때만 배경 영상 표시 */}
            {isLoaded && videoUrl && (
                <>
                    {isYouTube && embedUrl ? (
                        <iframe
                            src={embedUrl}
                            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                            style={{ border: "none", transform: "scale(1.2)" }}
                            allow="autoplay; encrypted-media"
                            tabIndex={-1}
                        />
                    ) : (
                        <video
                            src={videoUrl}
                            className="absolute inset-0 w-full h-full object-cover"
                            autoPlay
                            muted={isMuted}
                            loop
                            playsInline
                        />
                    )}
                    {/* 영상 위 오버레이 (텍스트 가독성 확보) */}
                    <div className="absolute inset-0 bg-black/40" />

                    {/* 음소거 토글 버튼 */}
                    <button
                        onClick={() => setIsMuted(!isMuted)}
                        className="absolute bottom-6 right-6 sm:bottom-10 sm:right-10 lg:bottom-16 lg:right-16 z-50 p-2 sm:p-3 lg:p-4 rounded-full bg-black/40 text-white/80 hover:bg-black/60 hover:text-white transition-all backdrop-blur-md transform hover:scale-110"
                        aria-label={isMuted ? "음소거 해제" : "음소거"}
                    >
                        {isMuted ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 xs:w-6 xs:h-6 md:w-7 md:h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                                <line x1="23" y1="9" x2="17" y2="15"></line>
                                <line x1="17" y1="9" x2="23" y2="15"></line>
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 xs:w-6 xs:h-6 md:w-7 md:h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                                <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                                <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
                            </svg>
                        )}
                    </button>
                </>
            )}

            {/* 영상이 없을 때는 기본 bg-[#1C1310] 배경이 그대로 보임 */}
        </section>
    );
}
