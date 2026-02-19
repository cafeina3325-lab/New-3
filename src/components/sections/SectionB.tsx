import Link from "next/link";
import GlassHexagon from "../ui/GlassHexagon";

export default function SectionB() {
    return (
        <section className="py-24 bg-neutral-950 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col md:flex-row items-center gap-16">
                    {/* Visual Side */}
                    <div className="w-full md:w-1/2 flex justify-center">
                        <div className="relative w-full max-w-md aspect-square">
                            <GlassHexagon className="w-full h-full flex items-center justify-center p-8">
                                <span className="text-white/20 text-6xl font-bold">ABOUT</span>
                            </GlassHexagon>
                        </div>
                    </div>

                    {/* Content Side */}
                    <div className="w-full md:w-1/2">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 leading-tight">
                            피부 위에 새겨지는<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-500">
                                영원한 유산
                            </span>
                        </h2>
                        <div className="glass-panel p-8 rounded-2xl border-white/5 space-y-6">
                            <p className="text-gray-300 leading-relaxed text-lg">
                                단순히 그림을 그리는 행위를 넘어, 당신의 고유한 서사를 시각적 언어로 번역합니다.
                                완벽한 위생과 제타투만의 독창적인 예술성이 결합된 프라이빗 스튜디오에서
                                평생을 함께할 마스터피스를 만나보십시오.
                            </p>
                            <div className="pt-4">
                                <Link href="/about">
                                    <button className="px-8 py-3 bg-white text-black font-bold rounded hover:bg-gray-200 transition-colors">
                                        More About Us
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
