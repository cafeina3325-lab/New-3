export default function Hero() {
    return (
        <section className="relative min-h-screen w-full flex flex-col justify-center items-center overflow-hidden">
            {/* Background Texture */}
            <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay"></div>

            {/* Content */}
            <div className="relative z-10 text-center px-6">
                <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 text-[var(--color-off-white)]">
                    <span className="block mb-2 text-[var(--color-gold-500)] text-2xl md:text-3xl font-medium tracking-widest uppercase opacity-80">Premium Tattoo Studio</span>
                    FLYING STUDIO
                </h1>
                <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-400 font-light leading-relaxed mb-10">
                    깊이 있는 잉크, 정교한 디테일, 그리고 당신만의 서사.<br className="hidden md:block" />
                    타협하지 않는 하이엔드 타투의 정수를 경험하세요.
                </p>

                {/* CTA Button with Hexagon Accent */}
                <button className="hexagon-accent px-10 py-4 text-[var(--color-gold-500)] font-bold tracking-widest uppercase hover:bg-[var(--color-gold-500)] hover:text-black transition-all duration-500">
                    Explore Gallery
                </button>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-50">
                <svg className="w-6 h-6 text-[var(--color-gold-500)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
            </div>
        </section>
    );
}
