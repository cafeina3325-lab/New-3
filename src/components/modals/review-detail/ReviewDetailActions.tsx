import React from "react";
import { ReviewDetailMode } from "../../../types/review";

interface ReviewDetailActionsProps {
    mode: ReviewDetailMode;
    setMode: (mode: ReviewDetailMode) => void;
    isSubmitting: boolean;
    verifyPassword: string;
    setVerifyPassword: (val: string) => void;
    deletePassword: string;
    setDeletePassword: (val: string) => void;
    handleUpdate: () => void;
    handleDelete: () => void;
    handleVerifyPassword: () => void;
}

export const ReviewDetailActions: React.FC<ReviewDetailActionsProps> = ({
    mode,
    setMode,
    isSubmitting,
    verifyPassword,
    setVerifyPassword,
    deletePassword,
    setDeletePassword,
    handleUpdate,
    handleDelete,
    handleVerifyPassword,
}) => {
    if (mode === "edit") {
        return (
            <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-4">
                <button onClick={handleUpdate} disabled={isSubmitting} className="px-4 py-2 bg-red-900/80 text-white text-sm rounded hover:bg-red-800 transition-colors disabled:opacity-50">저장</button>
                <button onClick={() => setMode("view")} disabled={isSubmitting} className="px-4 py-2 bg-gray-800 text-white text-sm rounded hover:bg-gray-700 transition-colors">취소</button>
            </div>
        );
    }

    if (mode === "verify") {
        return (
            <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-4">
                <input
                    type="password"
                    placeholder="비밀번호 입력"
                    value={verifyPassword}
                    onChange={(e) => setVerifyPassword(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleVerifyPassword()}
                    className="w-28 sm:w-36 px-3 py-1.5 bg-black/40 border border-white/10 rounded text-sm text-white focus:outline-none focus:border-red-900/50"
                    autoFocus
                />
                <button onClick={handleVerifyPassword} className="px-4 py-2 bg-red-900/80 text-white text-sm rounded hover:bg-red-800 transition-colors">확인</button>
                <button onClick={() => { setMode("view"); setVerifyPassword(""); }} className="px-4 py-2 bg-gray-800 text-white text-sm rounded hover:bg-gray-700 transition-colors">취소</button>
            </div>
        );
    }

    if (mode === "delete") {
        return (
            <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-4">
                <input
                    type="password"
                    placeholder="비밀번호"
                    value={deletePassword}
                    onChange={(e) => setDeletePassword(e.target.value)}
                    className="w-24 sm:w-32 px-3 py-1.5 bg-black/40 border border-red-900/50 rounded text-sm text-white focus:outline-none focus:border-red-500"
                />
                <button onClick={handleDelete} disabled={isSubmitting} className="px-3 py-1.5 bg-red-900 text-white text-sm rounded hover:bg-red-800 transition-colors disabled:opacity-50">삭제</button>
                <button onClick={() => setMode("view")} disabled={isSubmitting} className="px-3 py-1.5 bg-gray-800 text-white text-sm rounded hover:bg-gray-700 transition-colors">취소</button>
            </div>
        );
    }

    return (
        <>
            <button onClick={() => setMode("verify")} className="px-4 py-2 border border-white/20 text-white/80 rounded hover:bg-white/10 hover:text-white transition-colors text-sm md:text-base font-medium">수정</button>
            <button onClick={() => setMode("delete")} className="px-4 py-2 bg-red-950/40 border border-red-900/40 text-red-200 rounded hover:bg-red-900 hover:text-white transition-colors text-sm md:text-base font-medium">삭제</button>
        </>
    );
};
