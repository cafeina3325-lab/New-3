export default function Hero() {
    return (
        <section className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-neutral-950">
            {/* Background Effects */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-purple-900/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10 text-center">
                <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-white/50 animate-fade-in-up">
                    FLYING STUDIO
                </h1>
                <p className="text-xl md:text-2xl text-gray-400 font-light tracking-widest uppercase mb-12 animate-fade-in-up delay-100">
                    The Architecture of Ink
                </p>
                <div className="flex justify-center gap-6 animate-fade-in-up delay-200">
                    <div className="glass-panel px-8 py-4 rounded-full border-white/10 hover:bg-white/5 transition cursor-pointer">
                        <span className="text-white font-medium">Explore Gallery</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
