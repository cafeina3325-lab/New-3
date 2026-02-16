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
        <section className="py-20 bg-white w-full">
            <div className="container mx-auto px-6">
                <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Genres</h2>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {genres.map((genre) => (
                        <Link
                            key={genre.id}
                            href={`/genres?genre=${encodeURIComponent(genre.query)}`}
                            className="group w-full aspect-square bg-gray-100 rounded-lg overflow-hidden relative hover:shadow-lg transition-all duration-300 focus:outline-none block"
                        >
                            {/* Background/Image Placeholder */}
                            <div className="absolute inset-0 bg-gray-200 group-hover:bg-gray-300 transition-colors duration-300" />

                            {/* Centered Title */}
                            <div className="absolute inset-0 flex items-center justify-center p-4">
                                <span className="text-xl font-bold text-gray-800 group-hover:text-black z-10 text-center">
                                    {genre.title}
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
