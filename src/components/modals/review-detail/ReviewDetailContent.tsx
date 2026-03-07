import React from "react";

interface ReviewDetailContentProps {
    isEditing: boolean;
    content: string;
    editContent: string;
    setEditContent: (val: string) => void;
}

export const ReviewDetailContent: React.FC<ReviewDetailContentProps> = ({
    isEditing,
    content,
    editContent,
    setEditContent,
}) => {
    return (
        <div className="mb-10 min-h-[100px]">
            {isEditing ? (
                <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    rows={6}
                    className="w-full bg-black/40 border border-white/10 rounded-lg p-4 text-gray-200 focus:outline-none focus:border-red-900/50 resize-none font-handwriting text-lg md:text-xl lg:text-2xl"
                />
            ) : (
                <p className="text-gray-200 text-lg md:text-xl leading-relaxed whitespace-pre-wrap font-handwriting">
                    &ldquo;{content}&rdquo;
                </p>
            )}
        </div>
    );
};
