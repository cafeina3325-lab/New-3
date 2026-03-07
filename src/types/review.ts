export interface Review {
    id: string;
    reviewId?: string; // 예약 폼 연동용 ID
    name: string;
    originalName: string;
    password: string;
    phone: string;
    rating: number;
    genre: string;
    content: string;
    imageUrl?: string;
    createdAt: string;
}

export type ReviewDetailMode = "view" | "edit" | "verify" | "delete";
