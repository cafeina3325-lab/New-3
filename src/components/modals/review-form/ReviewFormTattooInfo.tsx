import React from "react";

interface ReviewFormTattooInfoProps {
    imagePreview: string | null;
    fileInputRef: React.RefObject<HTMLInputElement | null>;
    handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    genre: string;
    setGenre: (val: string) => void;
}

const GENRES = ["Irezumi", "Old School", "Tribal", "Black & Grey", "Blackwork", "Oriental Art", "Watercolor", "Illustration", "Mandala", "Sak Yant", "Lettering", "ETC."];

export const ReviewFormTattooInfo: React.FC<ReviewFormTattooInfoProps> = ({
    imagePreview, fileInputRef, handleImageUpload, genre, setGenre
}) => {
    return (
        <>
            {/* Photo */}
            <div className="space-y-1">
                <label className="text-xs md:text-base text-gray-400 font-medium flex items-center justify-between">
                    <span>Tattoo Photo</span>
                    <span className="text-xs md:text-base text-gray-500 font-normal ml-1">선택사항</span>
                </label>
                <div onClick={() => fileInputRef.current?.click()} className="w-full h-32 border-2 border-dashed border-white/10 rounded-lg bg-black/20 flex flex-col items-center justify-center cursor-pointer hover:border-red-900/50 transition-colors overflow-hidden group relative">
                    {imagePreview ? (
                        <>
                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                <span className="text-white text-xs md:text-base font-bold">사진 변경</span>
                            </div>
                        </>
                    ) : (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/40 mb-2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                            <span className="text-xs md:text-base text-white/40">클릭하여 이미지 업로드</span>
                        </>
                    )}
                    <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
                </div>
            </div>

            {/* Genre */}
            <div className="space-y-1">
                <label className="text-xs md:text-base text-gray-400 font-medium flex items-center justify-between">
                    <span>Genre</span>
                    <span className="text-xs md:text-base text-gray-500 font-normal ml-1">선택사항</span>
                </label>
                <select value={genre} onChange={(e) => setGenre(e.target.value)} className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white focus:outline-none focus:border-red-900/50 transition-colors text-xs md:text-base">
                    <option value="" className="bg-[#1a1412] text-white/50">선택하지 않음</option>
                    {GENRES.map(g => <option key={g} value={g} className="bg-[#1a1412]">{g}</option>)}
                </select>
            </div>
        </>
    );
};
