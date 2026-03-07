/**
 * Vercel Blob 스토리지 업로드 헬퍼 모듈
 * 
 * Base64로 인코딩된 이미지/비디오 데이터 URL이나 브라우저의 전역 File 객체를
 * 안전하고 유일한 파일명으로 변환하여 Vercel Blob 클라우드 스토리지로 업로드합니다.
 * 성공적으로 업로드된 뒤 생성된 외부 접근용 호스팅(공개) URL 스트링을 반환합니다.
 */

import { put } from "@vercel/blob";
import crypto from "crypto";

// 실행 환경변수에서 Blob 읽기/쓰기 토큰값을 확보합니다.
// 과거 환경변수 설정 이슈를 방지하고자 기존 오타 및 프로젝트별 하위 호환성을 지원합니다.
const BLOB_TOKEN =
    process.env.BLOB_READ_WRITE_TOKEN ||
    process.env.FLYING_READ_WRITE_TOKEN ||
    process.env.FLING_READ_WRITE_TOKEN ||
    "";

/**
 * Base64 포맷의 Data URL 문자열을 파싱하여 Vercel Blob에 파일로 업로드
 * 
 * @param dataUrl - "data:image/png;base64,..."와 같이 포맷팅된 문자열 데이터
 * @param prefix  - 클라우드 저장소 내 디렉토리 구분을 위한 접두사 (예: "event/", "gallery/")
 * @returns {Promise<string>} 업로드가 완료된 파일의 영구적이고 퍼블릭한 브라우저 접근 URL
 */
export async function uploadBase64ToBlob(
    dataUrl: string,
    prefix: string
): Promise<string> {
    // 1. 입력된 Data URL에서 MIME 타입과 실제 base64 페이로드 부분 분리
    const matches = dataUrl.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
        throw new Error("유효하지 않은 base64 data URL 형식입니다.");
    }

    const mimeType = matches[1];
    const extension = mimeType.split("/")[1] || "bin";

    // 2. Base64 페이로드를 서버 시스템이 인식할 수 있는 순수 바이트(Buffer) 형태로 변환
    const buffer = Buffer.from(matches[2], "base64");

    // 3. 파일 덮어쓰기 방지 및 보안을 위해 타임스탬프와 무작위 난수를 결합하여 고유 파일명 생성
    const uniqueName = `${prefix}${Date.now()}-${crypto.randomBytes(4).toString("hex")}.${extension}`;

    // 4. Vercel Blob SDK를 통해 전송 실행 ('public' 옵션으로 어디서든 이미지 노출 허용)
    const blob = await put(uniqueName, buffer, {
        access: "public",
        token: BLOB_TOKEN,
        contentType: mimeType,
    });

    return blob.url;
}

/**
 * 표준 HTML File 객체(또는 Web API ArrayBuffer)를 Vercel Blob에 파일로 직접 업로드
 * 
 * 주로 폼 데이터나 Drag & Drop 인풋을 통해 얻은 바이너리 파일 자체를 그대로 전송할 때 사용합니다.
 * 
 * @param file     - 브라우저 등에서 전달받은 Web API File 객체
 * @param prefix   - 클라우드 저장 경로 분류 접두사 (예: "hero/")
 * @returns {Promise<string>} 생성 완료된 Blob 호스팅 공개 접속 URL
 */
export async function uploadFileToBlob(
    file: File,
    prefix: string
): Promise<string> {
    // 1. 전송할 수 있는 기초 스트림 청크(ArrayBuffer -> Node Buffer) 구조로 캐스팅
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 2. 충돌되지 않는 난수 접미어 생성
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    // 3. 사용자가 올린 원본 파일명에서 시스템 오류를 일으킬 특수문자를 전부 치환해 안전한 이름으로 교정
    const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "");
    const uniqueName = `${prefix}${uniqueSuffix}-${safeName}`;

    // 4. 안전한 바이트 배열 스트림을 API로 송출
    const blob = await put(uniqueName, buffer, {
        access: "public",
        token: BLOB_TOKEN,
        // 클라이언트에서 File의 MIME 정보를 파악할 수 없을 경우 기본 옥텟 스트림 타입 명시
        contentType: file.type || "application/octet-stream",
    });

    return blob.url;
}
