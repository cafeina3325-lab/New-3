"use client";

import Link from "next/link";
import { useState } from "react";
import ContactOverlay from "./ContactOverlay";

export default function NavMenu() {
    const [isContactOpen, setIsContactOpen] = useState(false);

    const menuItems = [
        { name: "About", path: "/about" },
        { name: "Genres", path: "/genres" },
        { name: "Gallery", path: "/gallery" },
        { name: "Process", path: "/process" },
        { name: "FAQ", path: "/faq" },
    ];

    return (
        <>
            <nav className="flex-1 h-[100px] bg-gray-200 pointer-events-auto flex items-center justify-end px-8">
                <ul className="flex space-x-8 mr-12">
                    {menuItems.map((item) => (
                        <li key={item.name}>
                            <Link
                                href={item.path}
                                className="text-xl font-medium text-gray-800 hover:text-gray-600 transition-colors"
                            >
                                {item.name}
                            </Link>
                        </li>
                    ))}
                </ul>

                {/* Contact Button */}
                <button
                    onClick={() => setIsContactOpen(true)}
                    className="px-6 py-3 bg-gray-800 text-white font-bold rounded hover:bg-gray-700 transition"
                >
                    Contact
                </button>
            </nav>

            {/* Contact Overlay */}
            {isContactOpen && <ContactOverlay onClose={() => setIsContactOpen(false)} />}
        </>
    );
}
