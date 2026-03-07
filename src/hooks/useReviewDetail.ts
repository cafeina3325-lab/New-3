import { useState, useEffect, useRef } from "react";
import { Review, ReviewDetailMode } from "../types/review";

export const useReviewDetail = (
    isOpen: boolean,
    review: Review | null,
    onClose: () => void,
    onSuccess?: () => void
) => {
    const [mode, setMode] = useState<ReviewDetailMode>("view");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Edit states
    const [editName, setEditName] = useState("");
    const [editIsAnonymous, setEditIsAnonymous] = useState(false);
    const [editPhone, setEditPhone] = useState("");
    const [editGenre, setEditGenre] = useState("");
    const [editContent, setEditContent] = useState("");
    const [editRating, setEditRating] = useState(5);
    const [editImagePreview, setEditImagePreview] = useState<string | null>(null);

    // Password verification states
    const [verifyPassword, setVerifyPassword] = useState("");
    const [deletePassword, setDeletePassword] = useState("");

    const fileInputRef = useRef<HTMLInputElement>(null);

    const displayMaskedName = (originalName: string) => {
        if (!originalName) return "";
        if (originalName.length === 1) return originalName + "*";
        return originalName.substring(0, 1) + "*".repeat(originalName.length - 1);
    };

    useEffect(() => {
        if (!isOpen || !review) {
            resetStates();
            return;
        }

        setMode("view");
        setEditName(review.originalName || review.name || "");
        setEditIsAnonymous(review.originalName ? review.name !== review.originalName : false);
        setEditPhone(review.phone || "");
        setEditGenre(review.genre || "");
        setEditContent(review.content || "");
        setEditRating(review.rating || 5);
        setEditImagePreview(review.imageUrl || null);
    }, [isOpen, review]);

    const resetStates = () => {
        setMode("view");
        setVerifyPassword("");
        setDeletePassword("");
        setIsSubmitting(false);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setEditImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleVerifyPassword = () => {
        if (!verifyPassword) {
            alert("비밀번호를 입력해주세요.");
            return;
        }
        if (review?.password !== verifyPassword) {
            alert("비밀번호가 일치하지 않습니다.");
            return;
        }
        setMode("edit");
    };

    const handleUpdate = async () => {
        if (!review) return;
        setIsSubmitting(true);

        const finalName = editIsAnonymous ? displayMaskedName(editName) : editName;

        try {
            const res = await fetch("/api/reviews", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: review.id,
                    name: finalName,
                    originalName: editName,
                    phone: editPhone,
                    content: editContent,
                    rating: editRating,
                    genre: editGenre,
                    password: verifyPassword,
                    image: editImagePreview !== review.imageUrl ? editImagePreview : undefined
                }),
            });

            if (res.ok) {
                alert("리뷰가 성공적으로 수정되었습니다.");
                setMode("view");
                onClose();
                if (onSuccess) onSuccess();
            } else {
                const err = await res.json();
                alert(`수정 실패: ${err.error || "알 수 없는 오류"}`);
            }
        } catch (error) {
            console.error("Update Review Error:", error);
            alert("서 서버 연결에 실패했습니다.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!review) return;
        if (!deletePassword) {
            alert("삭제용 비밀번호를 입력해주세요.");
            return;
        }
        if (review.password !== deletePassword) {
            alert("비밀번호가 일치하지 않습니다.");
            return;
        }
        if (!window.confirm("정말 이 리뷰를 삭제하시겠습니까?")) return;

        setIsSubmitting(true);
        try {
            const res = await fetch(`/api/reviews?id=${review.id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                alert("리뷰가 정상적으로 삭제되었습니다.");
                onClose();
                if (onSuccess) onSuccess();
            } else {
                const err = await res.json();
                alert(`삭제 실패: ${err.error || "알 수 없는 오류"}`);
            }
        } catch (error) {
            console.error("Delete Review Error:", error);
            alert("서버 연결에 실패했습니다.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        // Mode
        mode,
        setMode,
        isSubmitting,

        // Edit states
        editName,
        setEditName,
        editIsAnonymous,
        setEditIsAnonymous,
        editPhone,
        setEditPhone,
        editGenre,
        setEditGenre,
        editContent,
        setEditContent,
        editRating,
        setEditRating,
        editImagePreview,
        setEditImagePreview,

        // Password states
        verifyPassword,
        setVerifyPassword,
        deletePassword,
        setDeletePassword,

        // Refs & Handlers
        fileInputRef,
        displayMaskedName,
        handleImageChange,
        handleVerifyPassword,
        handleUpdate,
        handleDelete,
    };
};
