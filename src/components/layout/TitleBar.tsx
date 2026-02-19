import Link from "next/link";

export default function TitleBar() {
    return (
        <Link
            href="/"
            className="relative z-50 w-[170px] md:w-[325px] h-[100px] md:h-[120px] shrink-0 pointer-events-auto flex flex-col items-center justify-center transition-all duration-300 group"
        >
            {/* Glass Background */}
            <div className="absolute inset-0 bg-white/5 backdrop-blur-md border-r border-b border-white/10 group-hover:bg-white/10 transition-colors" />

            {/* Text Content */}
            <span className="relative z-10 text-white font-bold text-xl md:text-2xl leading-tight tracking-wider">Flying</span>
            <span className="relative z-10 text-gray-300 font-bold text-xl md:text-2xl leading-tight tracking-wider group-hover:text-white transition-colors">Studio</span>
        </Link>
    );
}
