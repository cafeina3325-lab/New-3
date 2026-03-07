import { useState, useRef } from "react";

export const useReviewModal = (onClose: () => void, onSuccess?: () => void) => {
    const [name, setName] = useState("");
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [rating, setRating] = useState(5);
    const [genre, setGenre] = useState("");
    const [content, setContent] = useState("");
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const displayMaskedName = (originalName: string) => {
        if (!originalName) return "";
        if (originalName.length === 1) return originalName + "*";
        return originalName.substring(0, 1) + "*".repeat(originalName.length - 1);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const resetForm = () => {
        setName("");
        setIsAnonymous(false);
        setPassword("");
        setPhone("");
        setRating(5);
        setGenre("");
        setContent("");
        setImagePreview(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = {
            name: isAnonymous ? displayMaskedName(name) : name,
            originalName: name,
            password,
            phone,
            rating,
            genre,
            content,
            image: imagePreview,
        };

        try {
            const res = await fetch("/api/reviews", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                alert("소중한 리뷰가 즉시 게시되었습니다!");
                resetForm();
                onClose();
                if (onSuccess) onSuccess();
            } else {
                const err = await res.json();
                alert(`오류: ${err.error || "리뷰 등록을 실패했습니다."}`);
            }
        } catch (error) {
            console.error("Submit Error:", error);
            alert("서버 연결에 실패했습니다.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        // States
        name,
        setName,
        isAnonymous,
        setIsAnonymous,
        password,
        setPassword,
        phone,
        setPhone,
        rating,
        setRating,
        genre,
        setGenre,
        content,
        setContent,
        imagePreview,
        isSubmitting,

        // Refs & Handlers
        fileInputRef,
        displayMaskedName,
        handleImageUpload,
        handleSubmit,
    };
};
