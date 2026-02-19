export default function SectionF() {
    const testimonials = [
        {
            id: 1,
            text: "Amazing work! The design captured our brand perfectly.",
            author: "Jane Doe",
        },
        {
            id: 2,
            text: "Professional and creative. Highly recommended!",
            author: "John Smith",
        },
        {
            id: 3,
            text: "Transformative results for our business.",
            author: "Alice Johnson",
        },
        {
            id: 4,
            text: "The best agency we've worked with.",
            author: "Michael Brown",
        },
        {
            id: 5,
            text: "Truly innovative solutions.",
            author: "Sarah Lee",
        },
    ];

    return (
        <section className="py-24 bg-neutral-950/50 relative overflow-hidden backdrop-blur-sm">
            <div className="container mx-auto px-6 mb-16 text-center">
                <span className="text-gray-500 tracking-widest uppercase text-sm font-medium mb-3 block">Reviews</span>
                <h2 className="text-4xl font-bold text-white">Testimonials</h2>
            </div>

            <div className="container mx-auto px-6 pb-12">
                <div className="flex overflow-x-auto gap-6 snap-x snap-mandatory scrollbar-hide pb-8">
                    {testimonials.map((item) => (
                        <div
                            key={item.id}
                            className="snap-center shrink-0 w-[300px] glass-panel p-8 rounded-xl border-white/5 hover:border-white/20 transition-all duration-300 hover:-translate-y-2"
                        >
                            <div className="mb-6 opacity-30">
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="white">
                                    <path d="M14.017 21L14.017 18C14.017 16.054 15.372 13.622 18.067 13.622L18.067 19.967C18.067 20.523 17.653 21 17.067 21L14.017 21ZM21 21L21 8.5C21 5.739 18.956 2.5 13.017 2.5L13.017 8.5C14.773 8.5 16.067 10.333 16.067 12L7.017 12C6.461 12 6.017 12.449 6.017 13L6.017 21L2.967 21C2.381 21 1.967 20.523 1.967 19.967L1.967 13.622C4.662 13.622 6.017 16.054 6.017 18L6.017 21L7.017 21L21 21Z" />
                                </svg>
                            </div>
                            <p className="text-gray-300 text-lg italic mb-6 leading-relaxed">&quot;{item.text}&quot;</p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-white">
                                    {item.author.charAt(0)}
                                </div>
                                <p className="text-white text-sm font-medium">{item.author}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
