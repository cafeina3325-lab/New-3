import Link from "next/link";

export default function TitleBar() {
    return (
        <div className="relative z-50 h-full flex items-center">
            <Link
                href="/"
                className="group relative flex items-center justify-center cursor-pointer h-[60px] md:h-[80px] w-auto aspect-[340/80] filter drop-shadow-[0_0_15px_rgba(212,185,150,0.5)]"
            >
                {/* Fixed Aspect Ratio SVG Background */}
                <svg
                    className="absolute inset-0 w-full h-full"
                    viewBox="0 0 340 80"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        <linearGradient id="gold-gradient-v" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#eaccb0" />
                            <stop offset="50%" stopColor="#d4b996" />
                            <stop offset="100%" stopColor="#bd9f78" />
                        </linearGradient>
                    </defs>

                    {/* The Shape: Square Left, Rounded Arrow Right */}
                    <path
                        d="M 0 1 H 285 Q 295 1 302 8 L 334 33 Q 340 40 334 47 L 302 72 Q 295 79 285 79 H 0 V 1 Z"
                        fill="url(#gold-gradient-v)"
                        stroke="white"
                        strokeWidth="1.5"
                    />
                </svg>

                {/* Text Content - Centered */}
                <span className="relative z-10 font-black text-xl md:text-3xl tracking-tighter uppercase text-[#1a1a1a] pr-10 pt-1">
                    Flying Studio
                </span>
            </Link>
        </div>
    );
}
