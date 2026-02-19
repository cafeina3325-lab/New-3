"use client";

import { useEffect, useState } from "react";
import TitleBar from "./TitleBar";
import NavMenu from "./NavMenu";

export default function Navbar() {
    const [isHamburgerMode, setIsHamburgerMode] = useState(true);

    useEffect(() => {
        const handleScroll = () => {
            const isSmallScreen = window.innerWidth < 1024;
            const sectionTarget = document.getElementById("section-b");
            if (sectionTarget) {
                const rect = sectionTarget.getBoundingClientRect();
                // Main Page: Switch when Section B's top reaches the header area OR if on small screen
                setIsHamburgerMode(rect.top <= 120 || isSmallScreen);
            } else {
                // Sub Pages: Switch when scrolled down more than 200px OR if on small screen
                setIsHamburgerMode(window.scrollY > 200 || isSmallScreen);
            }
        };

        window.addEventListener("scroll", handleScroll);
        window.addEventListener("resize", handleScroll);
        // Initial check
        handleScroll();

        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", handleScroll);
        };
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <header className="fixed top-0 left-0 w-full z-50 flex items-start pointer-events-none">
            <TitleBar />
            <NavMenu isHamburgerMode={isHamburgerMode} />

            {/* Scroll To Top Button */}
            {isHamburgerMode && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-8 right-8 z-50 p-4 bg-black text-white rounded-full shadow-lg hover:bg-gray-800 transition-all animate-fade-in pointer-events-auto"
                    aria-label="Scroll to Top"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                </button>
            )}
        </header>
    );
}
