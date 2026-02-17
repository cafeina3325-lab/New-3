"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

// Data Definitions
const genres = [
    "Irezumi", "Old School", "Tribal", "Black & Grey", "Blackwork",
    "Oriental Art", "Watercolor", "Illustration", "Mandala", "Sak Yant", "Lettering", "ETC."
];

const parts = [
    "Head", "Face", "Neck", "Shoulder", "Chest",
    "Belly", "Back", "Arm", "Leg", "Hand", "Foot"
];

function GalleryContent() {
    const searchParams = useSearchParams();

    // State
    const [activeTab, setActiveTab] = useState<"Portfolio" | "Event">("Portfolio");
    const [portfolioFilterType, setPortfolioFilterType] = useState<"Genre" | "Parts">("Genre");
    const [selectedGenre, setSelectedGenre] = useState<string | null>(null); // null means "All"
    const [selectedParts, setSelectedParts] = useState<string[]>([]);

    // Initialize state from URL query params
    useEffect(() => {
        const tabParam = searchParams.get("tab");
        const filterParam = searchParams.get("filter");
        const itemParam = searchParams.get("item");

        if (tabParam === "Event") {
            setActiveTab("Event");
        } else {
            setActiveTab("Portfolio");
        }

        if (filterParam === "Parts") {
            setPortfolioFilterType("Parts");
            if (itemParam && itemParam !== "All") {
                setSelectedParts([itemParam]);
            }
        } else {
            setPortfolioFilterType("Genre");
            if (itemParam) {
                // Map Specialties to ETC. if coming from Genres page
                const mappedItem = itemParam === "Specialties" ? "ETC." : itemParam;
                if (genres.includes(mappedItem)) {
                    setSelectedGenre(mappedItem);
                } else if (mappedItem === "All") {
                    setSelectedGenre(null);
                }
            }
        }
    }, [searchParams]);

    const filterItems = portfolioFilterType === "Genre" ? genres : parts;

    // Helper to determine if an item is selected
    const isSelected = (item: string) => {
        if (portfolioFilterType === "Genre") {
            return item === selectedGenre;
        } else {
            return selectedParts.includes(item);
        }
    };

    // Helper to handle filter clicks
    const handleFilterClick = (item: string) => {
        if (portfolioFilterType === "Genre") {
            // Toggle Logic for Genre
            if (selectedGenre === item) {
                setSelectedGenre(null); // Deselect -> All
            } else {
                setSelectedGenre(item);
            }
        } else {
            // Multi-select logic for Parts
            if (selectedParts.includes(item)) {
                setSelectedParts(selectedParts.filter(p => p !== item));
            } else {
                setSelectedParts([...selectedParts, item]);
            }
        }
    };

    const isAllSelected = portfolioFilterType === "Genre" ? selectedGenre === null : selectedParts.length === 0;

    return (
        <main className="pt-[120px] min-h-screen bg-[var(--color-green-900)] text-[var(--color-off-white)] pb-20 selection:bg-[var(--color-gold-500)] selection:text-black">
            <div className="container mx-auto px-6">
                <h1 className="text-4xl md:text-5xl font-bold mb-12 text-center text-[var(--color-off-white)]">Gallery</h1>

                {/* Main Tab Navigation */}
                <div className="flex justify-center mb-12 border-b border-white/10">
                    <div className="flex gap-8">
                        <button
                            onClick={() => setActiveTab("Portfolio")}
                            className={`pb-4 text-lg font-medium transition-all relative ${activeTab === "Portfolio"
                                ? "text-white after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-white"
                                : "text-gray-400 hover:text-gray-200"
                                }`}
                        >
                            Portfolio
                        </button>
                        <button
                            onClick={() => setActiveTab("Event")}
                            className={`pb-4 text-lg font-medium transition-all relative ${activeTab === "Event"
                                ? "text-white after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-white"
                                : "text-gray-400 hover:text-gray-200"
                                }`}
                        >
                            Event
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="animate-fade-in">
                    {activeTab === "Portfolio" ? (
                        <div className="space-y-12">
                            {/* Portfolio Filter Controls */}
                            <div className="flex flex-col items-center gap-8">
                                {/* Filter Type Toggle */}
                                <div className="flex glass-premium p-1 rounded-full">
                                    <button
                                        onClick={() => setPortfolioFilterType("Genre")}
                                        className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${portfolioFilterType === "Genre"
                                            ? "bg-white text-black shadow-sm"
                                            : "text-gray-400 hover:text-white"
                                            }`}
                                    >
                                        By Genre
                                    </button>
                                    <button
                                        onClick={() => setPortfolioFilterType("Parts")}
                                        className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${portfolioFilterType === "Parts"
                                            ? "bg-white text-black shadow-sm"
                                            : "text-gray-400 hover:text-white"
                                            }`}
                                    >
                                        By Parts
                                    </button>
                                </div>

                                {/* Filter Items List */}
                                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 w-full max-w-5xl px-4">
                                    {filterItems.map((item) => (
                                        <button
                                            key={item}
                                            onClick={() => handleFilterClick(item)}
                                            className={`px-2 py-3 rounded-lg text-sm font-medium transition-all border ${isSelected(item)
                                                ? "bg-white text-black border-white shadow-md transform scale-[1.02]"
                                                : "glass-premium text-gray-400 border-white/10 hover:border-white/30 hover:text-white hover:shadow-sm"
                                                }`}
                                        >
                                            {item}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Portfolio Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {/* Placeholder Items for Portfolio - Filtering logic simulated */}
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <div key={i} className="aspect-square glass-premium rounded-lg relative group overflow-hidden cursor-pointer border border-white/10">
                                        <div className="absolute inset-0 flex items-center justify-center text-gray-500 group-hover:bg-white/5 transition-colors flex-col gap-2">
                                            <span className="font-medium text-gray-300">Work {i + 1}</span>
                                            <span className="text-xs text-gray-600 group-hover:text-gray-400 transition-colors">
                                                {portfolioFilterType === "Genre"
                                                    ? (isAllSelected ? "All Genres" : selectedGenre)
                                                    : (isAllSelected ? "All Parts" : selectedParts.join(", "))
                                                }
                                            </span>
                                        </div>
                                        {/* Hover Overlay */}
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-end p-6 opacity-0 group-hover:opacity-100">
                                            <span className="text-white font-bold">Project Name {i + 1}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        /* Event Content */
                        <div className="flex flex-col items-center justify-center py-20 glass-premium rounded-2xl border border-white/10 border-dashed">
                            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-6 text-gray-400">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">진행 중인 이벤트가 없습니다</h3>
                            <p className="text-gray-400 text-center max-w-md">
                                현재 예정된 이벤트나 전시 소식이 없습니다.<br />
                                새로운 소식이 있으면 이곳에 업데이트될 예정입니다.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}

export default function GalleryPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <GalleryContent />
        </Suspense>
    );
}
