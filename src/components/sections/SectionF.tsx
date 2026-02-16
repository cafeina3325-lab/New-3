export default function SectionF() {
    const testimonials = [
        {
            id: 1,
            image: "bg-gray-300",
            text: "Amazing work! The design captured our brand perfectly.",
            author: "Jane Doe",
        },
        {
            id: 2,
            image: "bg-gray-400",
            text: "Professional and creative. Highly recommended!",
            author: "John Smith",
        },
        {
            id: 3,
            image: "bg-gray-300",
            text: "Transformative results for our business.",
            author: "Alice Johnson",
        },
        {
            id: 4,
            image: "bg-gray-400",
            text: "The best agency we've worked with.",
            author: "Michael Brown",
        },
        {
            id: 5,
            image: "bg-gray-300",
            text: "Truly innovative solutions.",
            author: "Sarah Lee",
        },
    ];

    return (
        <section className="py-20 bg-gray-100 w-full overflow-hidden">
            <div className="container mx-auto px-6 mb-12">
                <h2 className="text-3xl font-bold text-center text-gray-900">Testimonials</h2>
            </div>

            {/* Horizontal Scroll Container */}
            <div className="flex overflow-x-auto pb-10 px-6 gap-8 snap-x snap-mandatory scrollbar-hide">
                {testimonials.map((item) => (
                    <div
                        key={item.id}
                        className="flex-shrink-0 w-[280px] bg-white p-4 shadow-lg transform rotate-1 hover:rotate-0 transition-transform duration-300 snap-center"
                    >
                        {/* Polaroid Image Area */}
                        <div className={`w-full h-[240px] ${item.image} mb-4 flex items-center justify-center text-gray-500`}>
                            <span className="text-sm">Image</span>
                        </div>

                        {/* Polaroid Caption Area */}
                        <div className="text-center">
                            <p className="text-gray-800 font-handwriting text-lg italic mb-2">&quot;{item.text}&quot;</p>
                            <p className="text-gray-600 text-sm">- {item.author}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
