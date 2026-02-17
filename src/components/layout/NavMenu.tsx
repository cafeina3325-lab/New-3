import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import ContactOverlay from "./ContactOverlay";

export default function NavMenu({ isHamburgerMode }: { isHamburgerMode?: boolean }) {
    const [isContactOpen, setIsContactOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);
    const navRef = useRef<HTMLElement>(null);

    const menuItems = [
        { name: "About", path: "/about" },
        {
            name: "Genres",
            path: "/genres",
            subItems: [
                { name: "Irezumi", path: "/genres?genre=Irezumi" },
                { name: "Old School", path: "/genres?genre=Old School" },
                { name: "Tribal", path: "/genres?genre=Tribal" },
                { name: "Black & Grey", path: "/genres?genre=Black %26 Grey" },
                { name: "Blackwork", path: "/genres?genre=Blackwork" },
                { name: "Oriental Art", path: "/genres?genre=Oriental Art" },
                { name: "Watercolor", path: "/genres?genre=Watercolor" },
                { name: "Illustration", path: "/genres?genre=Illustration" },
                { name: "Mandala", path: "/genres?genre=Mandala" },
                { name: "Sak Yant", path: "/genres?genre=Sak Yant" },
                { name: "Lettering", path: "/genres?genre=Lettering" },
                { name: "ETC.", path: "/genres?genre=Specialties" },
            ]
        },
        {
            name: "Gallery",
            path: "/gallery",
            subItems: [
                { name: "Portfolio", path: "/gallery?tab=Portfolio" },
                { name: "Event", path: "/gallery?tab=Event" },
            ]
        },
        { name: "Process", path: "/process" },
        { name: "FAQ", path: "/faq" },
    ];

    // Close menu when route changes or contact opens
    const handleContactClick = () => {
        setIsMenuOpen(false);
        setIsContactOpen(true);
    };

    // Outside click detection
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (navRef.current && !navRef.current.contains(event.target as Node)) {
                // If menu is open and in hamburger mode, close it
                if (isMenuOpen && isHamburgerMode) {
                    setIsMenuOpen(false);
                }
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isMenuOpen, isHamburgerMode]);

    // Determine if we should show the full nav bar
    // Show if NOT in hamburger mode OR if in hamburger mode AND menu is open
    const showNavBar = !isHamburgerMode || (isHamburgerMode && isMenuOpen);

    return (
        <>
            <nav
                ref={navRef}
                className={`
                    transition-all duration-500 ease-in-out pointer-events-auto 
                    lg:flex-1 lg:flex lg:items-center lg:justify-end lg:px-12
                    fixed lg:static top-[80px] md:top-[100px] lg:top-auto left-0 h-[calc(100vh-80px)] md:h-[calc(100vh-100px)] lg:h-full w-[200px] md:w-[325px] lg:w-auto 
                    glass-premium lg:backdrop-blur-none lg:bg-transparent lg:border-none lg:shadow-none z-40 flex flex-col lg:flex-row pt-8 lg:pt-0
                    overflow-y-auto lg:overflow-y-visible
                    ${showNavBar ? '[clip-path:inset(0_0_0_0)] lg:[clip-path:none] opacity-100' : '[clip-path:inset(0_0_100%_0)] opacity-0 lg:h-0 lg:opacity-0 lg:overflow-hidden lg:[clip-path:none]'}
                `}
            >
                {/* Navigation Items */}
                <div className={`flex flex-col lg:flex-row items-start lg:items-center w-full lg:w-auto ${showNavBar ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>
                    <ul className="flex flex-col lg:flex-row space-y-6 lg:space-y-0 lg:space-x-12 lg:mr-10 w-full lg:w-auto pb-20 lg:pb-0 pl-8 lg:pl-0">
                        {menuItems.map((item) => (
                            <li key={item.name} className="relative group lg:h-full flex flex-col lg:flex-row lg:items-center item-start w-full lg:w-auto">
                                <div className="flex items-center justify-between w-full lg:w-auto">
                                    <Link
                                        href={item.path}
                                        className="text-base lg:text-lg font-medium text-white/90 hover:text-white transition-colors py-2 lg:py-4 block w-full lg:w-auto"
                                        onClick={(e) => {
                                            if (isHamburgerMode && item.subItems) {
                                                e.preventDefault();
                                                setOpenSubMenu(openSubMenu === item.name ? null : item.name);
                                            } else if (isHamburgerMode) {
                                                setIsMenuOpen(false);
                                            }
                                        }}
                                    >
                                        {item.name}
                                    </Link>
                                    {/* Mobile Toggle Chevron */}
                                    {item.subItems && isHamburgerMode && (
                                        <button
                                            className="p-2 lg:hidden outline-none focus:outline-none text-white/70"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setOpenSubMenu(openSubMenu === item.name ? null : item.name);
                                            }}
                                        >
                                            <svg
                                                className={`w-5 h-5 transition-transform duration-300 ${openSubMenu === item.name ? 'rotate-180' : ''}`}
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>
                                    )}
                                </div>

                                {/* Dropdown Menu */}
                                {item.subItems && (
                                    <div className={`
                                        lg:absolute lg:top-full lg:left-1/2 lg:-translate-x-1/2 lg:pt-4 
                                        static w-full pl-4 lg:pl-0
                                        lg:opacity-0 lg:invisible lg:group-hover:opacity-100 lg:group-hover:visible 
                                        transition-all duration-300 ease-out z-50
                                        ${openSubMenu === item.name ? 'block' : 'hidden'} lg:block
                                    `}>
                                        <div className="bg-transparent lg:bg-[#0f1a24]/95 lg:backdrop-blur-md rounded-lg overflow-hidden min-w-[180px] border-l-2 lg:border lg:border-white/10 border-white/20 shadow-xl">
                                            <ul className="py-2">
                                                {item.subItems.map((subItem) => (
                                                    <li key={subItem.name}>
                                                        <Link
                                                            href={subItem.path}
                                                            className="block px-4 lg:px-6 py-2 lg:py-3 text-xs lg:text-sm text-gray-300 hover:bg-white/10 lg:hover:bg-[#d4b996]/20 hover:text-white lg:hover:text-[#d4b996] transition-colors whitespace-nowrap"
                                                            onClick={() => isHamburgerMode && setIsMenuOpen(false)}
                                                        >
                                                            {subItem.name}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>

                    <div className="mt-8 lg:mt-0 w-full lg:w-auto flex justify-center lg:block">
                        <button
                            onClick={handleContactClick}
                            className="px-8 py-3 lg:px-6 lg:py-2 bg-[#d4b996] text-black font-bold rounded hover:bg-[#c0a07a] transition-all w-auto lg:w-auto shadow-lg hover:shadow-[#d4b996]/30 hover:-translate-y-0.5"
                        >
                            Contact
                        </button>
                    </div>
                </div>
            </nav>

            {/* Backdrop for Mobile */}
            {isHamburgerMode && isMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden animate-fade-in"
                    onClick={() => setIsMenuOpen(false)}
                />
            )}

            {/* Hamburger Button - Visible only when in Hamburger Mode AND Menu is Closed */}
            {isHamburgerMode && !isMenuOpen && (
                <button
                    onClick={(e) => {
                        e.stopPropagation(); // Prevent immediate closing due to outside click logic bubbling
                        setIsMenuOpen(true);
                    }}
                    className="fixed top-[100px] md:top-[120px] left-[85px] md:left-[162.5px] -translate-x-1/2 lg:fixed lg:top-8 lg:right-8 lg:left-auto lg:translate-x-0 z-50 pointer-events-auto w-[170px] md:w-[325px] h-7 lg:w-14 lg:h-14 bg-black text-white drop-shadow-md lg:drop-shadow-none lg:shadow-lg lg:rounded-full hover:bg-gray-800 transition-all animate-fade-in flex items-center justify-center [clip-path:polygon(0%_0%,_100%_0%,_100%_70%,_50%_100%,_0%_70%)] lg:[clip-path:none]"
                    aria-label="Open Menu"
                >
                    <svg className="w-4 h-4 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            )}

            {/* Contact Overlay */}
            {isContactOpen && <ContactOverlay onClose={() => setIsContactOpen(false)} />}
        </>
    );
}
