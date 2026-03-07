/**
 * 전역 페이지 뷰 카운트 추적 컴포넌트
 * 
 * 최상단 레이아웃(또는 각 페이지 진입점)에 마운트되어 
 * 사용자의 페이지 진입 시마다 서버에 조회수(Traffic) 통계 집계 비동기 POST 요청을 보냅니다.
 * 화면에 UI를 렌더링하지 않는 백그라운드 컴포넌트입니다.
 */

"use client";

import { useEffect } from "react";

export default function PageViewTracker() {
    useEffect(() => {
        // 백그라운드에서 조용히 API를 호출하며, 실패해도 서비스에 영향을 주지 않도록 캐치문을 비워둡니다.
        fetch("/api/pageviews", { method: "POST" }).catch(() => { });
    }, []);

    // 시각적 요소가 없으므로 null을 반환합니다.
    return null;
}

