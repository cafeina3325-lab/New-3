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
        { id: 12, title: "ETC.", query: "Specialties" },
    ];

    return (
        <section className="min-h-screen flex flex-col justify-center py-20 bg-neutral-950 w-full relative overflow-hidden">

            <div className="container mx-auto px-6 relative z-10">
                <h2 className="text-3xl font-bold text-center mb-20 text-white">Genres</h2>

                {/* Grid Layout with Vertical Stagger - Restored Layout Logic */}
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
                            className="group block focus:outline-none filter drop-shadow-lg hover:drop-shadow-2xl transition-all duration-300 relative z-0 hover:z-50"
                            style={{ width: '120%' }}
                        >
                            <div
                                className="w-full aspect-[1.1547] bg-white/5 backdrop-blur-md relative items-center justify-center flex overflow-hidden border-0"
                                style={{
                                    // Horizontal Hexagon (Pointy Left/Right)
                                    clipPath: "polygon(0% 50%, 25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%)",
                                    WebkitClipPath: "polygon(0% 50%, 25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%)"
                                }}
                            >
                                {/* Glass Highlight */}
                                <div className="absolute inset-0 bg-white/10 group-hover:bg-white/20 transition-colors duration-300" />
                                <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />

                                {/* Centered Title */}
                                <div className="absolute inset-0 flex items-center justify-center p-4">
                                    <span className="text-base md:text-lg font-bold text-gray-300 group-hover:text-white z-10 text-center transition-colors duration-300 break-keep leading-tight">
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
