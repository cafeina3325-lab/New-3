import Link from "next/link";

export default function TitleBar() {
    return (
        <Link href="/" className="w-[325px] h-[120px] bg-gray-400 shrink-0 pointer-events-auto flex flex-col items-center justify-center hover:bg-gray-500 transition-colors cursor-pointer">
            <span className="text-white font-bold text-2xl leading-tight">Flying</span>
            <span className="text-white font-bold text-2xl leading-tight">Studio</span>
        </Link>
    );
}
