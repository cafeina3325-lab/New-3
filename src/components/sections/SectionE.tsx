import Link from "next/link";

export default function SectionE() {
    // Define the specific list of genres
    const genres = [
        { id: 1, title: "Irezumi", query: "Irezumi" },
        { id: 2, title: "Old School", query: "Old School" },
        { id: 3, title: "Tribal", query: "Tribal" },
        { id: 4, title: "Black & Grey", query: "Black & Grey" },
        { id: 5, title: "Blackwork", query: "Blackwork" },
        { id: 6, title: "Oriental Art", query: "Oriental Art" },
        { id: 7, title: "Watercolor", query: "Watercolor" },
        { id: 8, title: "Illustration", query: "Illustration" },
        { id: 9, title: "Mandala", query: "Mandala" },
        { id: 10, title: "Sak Yant", query: "Sak Yant" },
        { id: 11, title: "Lettering", query: "Lettering" },
        { id: 12, title: "ETC.", query: "Specialties" }, // Map ETC. to Specialties
    ];

    return (
        <section className="min-h-screen flex flex-col justify-center py-20 w-full">
            <div className="container mx-auto px-6">
                <h2 className="text-3xl font-bold text-center mb-20 text-white">Genres</h2>

                {/* Grid Layout with Vertical Stagger - 3 Cols (Mobile/Tablet) / 4 Cols (Desktop/Large) 
                    Logic:
                    - Mobile/Tablet (Def, sm, md): 3 Columns. Middle column (3n+2) translates down 50%.
                    - Desktop/Large (lg, xl, 2xl): 4 Columns. Even columns (2, 4...) translate down 50%.
                    - Using translate-y-1/2 ensures perfect geometric alignment regardless of hexagon size.
                */}
                <div className={`
                    grid grid-cols-3 lg:grid-cols-4 
                    gap-x-4 gap-y-10 lg:gap-y-14 
                    max-w-4xl mx-auto place-items-center pb-20
                    
                    /* Mobile/Tablet Stagger (3-Col Middle Down) */
                    [&>*:nth-child(3n+2)]:translate-y-1/2
                    
                    /* Desktop/Large Stagger Override */
                    lg:[&>*:nth-child(3n+2)]:translate-y-0      /* Reset 3-Col Stagger */
                    lg:[&>*:nth-child(even)]:!translate-y-1/2   /* Apply 4-Col Even Stagger */
                `}>
                    {genres.map((genre) => (
                        <Link
                            key={genre.id}
                            href={`/genres?genre=${encodeURIComponent(genre.query)}`}
                            className="group block focus:outline-none filter drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] hover:drop-shadow-[0_20px_20px_rgba(0,0,0,0.7)] transition-all duration-300 relative z-0 hover:z-50"
                            style={{ width: '120%' }} // Adjusted overlap (130% -> 120%)
                        >
                            <div
                                className="w-full aspect-[1.1547] glass-premium relative items-center justify-center flex overflow-hidden"
                                style={{
                                    // Horizontal Hexagon (Pointy Left/Right)
                                    clipPath: "polygon(0% 50%, 25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%)",
                                    WebkitClipPath: "polygon(0% 50%, 25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%)"
                                }}
                            >
                                {/* Background/Image Placeholder */}
                                <div className="absolute inset-0 bg-white/5 group-hover:bg-white/20 transition-colors duration-300" />

                                {/* Centered Title */}
                                <div className="absolute inset-0 flex items-center justify-center p-4">
                                    <span className="text-base md:text-lg font-bold text-white z-10 text-center transition-colors duration-300 break-keep leading-tight drop-shadow-md">
                                        {genre.title}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
