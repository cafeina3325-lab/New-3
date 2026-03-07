import React from "react";

interface StarRatingProps {
    rating: number;
    maxRating?: number;
    onRatingChange?: (rating: number) => void;
    isEditable?: boolean;
    size?: number;
}

export const StarRating: React.FC<StarRatingProps> = ({
    rating,
    maxRating = 5,
    onRatingChange,
    isEditable = false,
    size = 18,
}) => {
    return (
        <div className="flex items-center gap-0.5">
            {Array.from({ length: maxRating }).map((_, i) => (
                <button
                    key={i}
                    type="button"
                    disabled={!isEditable}
                    onClick={() => onRatingChange?.(i + 1)}
                    className={`${isEditable ? "cursor-pointer" : "cursor-default"}`}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={size}
                        height={size}
                        viewBox="0 0 24 24"
                        fill={i < rating ? "#eab308" : "none"}
                        stroke={i < rating ? "#eab308" : "#4b5563"}
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                </button>
            ))}
        </div>
    );
};
