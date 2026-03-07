import React from "react";

interface ReviewFormUserInfoProps {
    name: string;
    setName: (val: string) => void;
    isAnonymous: boolean;
    setIsAnonymous: (val: boolean) => void;
    phone: string;
    setPhone: (val: string) => void;
    password: string;
    setPassword: (val: string) => void;
    displayMaskedName: (name: string) => string;
}

export const ReviewFormUserInfo: React.FC<ReviewFormUserInfoProps> = ({
    name, setName, isAnonymous, setIsAnonymous, phone, setPhone, password, setPassword, displayMaskedName
}) => {
    return (
        <>
            {/* Name & Anonymous */}
            <div className="space-y-1">
                <label className="text-xs md:text-base text-gray-400 font-medium">Name <span className="text-red-400">*</span></label>
                <div className="flex md:flex-row items-stretch md:items-center gap-3">
                    <input
                        type="text" required value={name} onChange={(e) => setName(e.target.value)}
                        placeholder="Your Name"
                        className="flex-1 px-3 py-2 md:px-4 md:py-3 bg-black/40 border border-white/10 rounded-lg text-white focus:outline-none focus:border-red-900/50 transition-colors text-xs md:text-base"
                    />
                    <div className="flex items-center justify-center md:justify-start gap-2 px-3 py-2 md:py-3 bg-black/40 border border-white/10 rounded-lg shrink-0">
                        <input
                            type="checkbox" id="anonymous" checked={isAnonymous}
                            onChange={(e) => setIsAnonymous(e.target.checked)}
                            className="w-4 h-4 accent-red-900"
                        />
                        <label htmlFor="anonymous" className="text-xs md:text-base text-white/80 cursor-pointer select-none">익명</label>
                    </div>
                </div>
                {isAnonymous && name && (
                    <p className="text-xs md:text-base text-red-400/80 pl-1">리뷰에는 &apos;{displayMaskedName(name)}&apos; 님으로 표시됩니다.</p>
                )}
            </div>

            {/* Phone */}
            <div className="space-y-1">
                <label className="text-xs md:text-base text-gray-400 flex items-center justify-between font-medium">
                    <span>Phone</span>
                    <span className="text-xs md:text-base text-gray-500 font-normal">선택사항 · 관리자 확인 및 수정 시 표시</span>
                </label>
                <input
                    type="tel" value={phone}
                    onChange={(e) => {
                        const raw = e.target.value.replace(/[^0-9]/g, "");
                        let formatted = raw;
                        if (raw.length > 3 && raw.length <= 7) formatted = `${raw.slice(0, 3)}-${raw.slice(3)}`;
                        else if (raw.length > 7) formatted = `${raw.slice(0, 3)}-${raw.slice(3, 7)}-${raw.slice(7, 11)}`;
                        setPhone(formatted);
                    }}
                    placeholder="010-0000-0000" maxLength={13}
                    className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-white focus:outline-none focus:border-red-900/50 transition-colors text-xs md:text-base font-mono"
                />
            </div>

            {/* Password */}
            <div className="space-y-1">
                <label className="text-xs md:text-base text-gray-400 flex items-center justify-between font-medium">
                    <span>Password <span className="text-red-400">*</span></span>
                    <span className="text-xs md:text-base text-gray-500 font-normal">수정 및 삭제 시 보호용</span>
                </label>
                <input
                    type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                    placeholder="비밀번호 4자리 이상"
                    className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-white focus:outline-none focus:border-red-900/50 transition-colors text-xs md:text-base"
                />
            </div>
        </>
    );
};
