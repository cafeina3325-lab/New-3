"use client";

import Link from "next/link";
import { useState } from "react";
import ContactOverlay from "./ContactOverlay"; // Ensure correct import path

export default function Footer() {
    const [isContactOpen, setIsContactOpen] = useState(false);

    const menuItems = [
        { name: "About", path: "/about" },
        { name: "Genres", path: "/genres" },
        { name: "Gallery", path: "/gallery" },
        { name: "Process", path: "/process" },
        { name: "FAQ", path: "/faq" },
    ];

    return (
        <footer className="glass-premium text-gray-300 py-16 border-t border-white/10 mt-20">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* 1. Left Column: Brand & Social & Contact */}
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-white tracking-tight">Flying Studio</h2>
                        <div className="flex space-x-4">
                            {/* Kakao Button */}
                            <button className="w-10 h-10 rounded-lg bg-[#FAE100] text-[#371D1E] flex items-center justify-center hover:shadow-[0_0_15px_#FAE100] transition duration-300">
                                {/* Kakao Icon */}
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 3c-5.523 0-10 3.582-10 8 0 2.872 1.884 5.397 4.777 6.776-.324 1.182-1.055 4.314-1.258 4.965-.247.788.291.874.607.662 2.651-1.777 5.438-3.649 6.293-4.184.516.096 1.058.181 1.581.181 5.523 0 10-3.582 10-8s-4.477-8-10-8z" />
                                </svg>
                            </button>
                            {/* Facebook Button */}
                            <button className="w-10 h-10 rounded-lg bg-[#3b5998] text-white flex items-center justify-center hover:shadow-[0_0_15px_#3b5998] transition duration-300">
                                {/* Facebook Icon */}
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                                </svg>
                            </button>
                            {/* Instagram Button */}
                            <button className="w-10 h-10 rounded-lg bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 text-white flex items-center justify-center hover:shadow-[0_0_15px_#E1306C] transition duration-300">
                                {/* Instagram Icon */}
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" strokeWidth="2" />
                                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" strokeWidth="2" />
                                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                        </div>
                        <button
                            onClick={() => setIsContactOpen(true)}
                            className="px-6 py-2 border border-white/30 text-gray-300 rounded hover:border-white hover:text-white hover:bg-white/10 transition"
                        >
                            Contact Us
                        </button>
                    </div>

                    {/* 2. Center-Left Column: Nav Menu */}
                    <div>
                        <h3 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">Menu</h3>
                        <ul className="space-y-3">
                            {menuItems.map((item) => (
                                <li key={item.name}>
                                    <Link href={item.path} className="hover:text-white transition-colors">
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* 3. Right Column: Business Info (Spans 2 columns on large screens) */}
                    <div className="lg:col-span-2 flex flex-col lg:items-end text-sm leading-relaxed">
                        <div className="text-left">
                            <h3 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">Information</h3>
                            <div className="flex flex-col space-y-2 text-gray-400">
                                <p><span className="font-bold text-gray-500 mr-2">OWNER</span> Hong Gil Dong</p>
                                <p><span className="font-bold text-gray-500 mr-2">LICENSE</span> 123-45-67890</p>
                                <p><span className="font-bold text-gray-500 mr-2">MANAGER</span> Kim Cheol Su</p>
                                <p><span className="font-bold text-gray-500 mr-2">ADDRESS</span> Incheon, Namdong-gu, Guwol-dong 1234-5, 2F</p>
                                <p><span className="font-bold text-gray-500 mr-2">HOURS</span> 11:00 - 20:00 (Mon - Sat)</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom: Copyright */}
                <div className="border-t border-white/10 pt-8 text-center text-sm text-gray-500">
                    <p>&copy; 2026 Flying Studio. All rights reserved.</p>
                </div>
            </div>

            {/* Contact Overlay */}
            {isContactOpen && <ContactOverlay onClose={() => setIsContactOpen(false)} />}
        </footer>
    );
}
