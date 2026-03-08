// 애플리케이션의 메인 홈 페이지 컴포넌트입니다.
import Hero from "@/components/sections/Hero";
import SectionB from "@/components/sections/SectionB";
import SectionC from "@/components/sections/SectionC";
import SectionD from "@/components/sections/SectionD";
import SectionE from "@/components/sections/SectionE";
import PageViewTracker from "@/components/PageViewTracker";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function Home() {
    return (
        <main className="bg-[#1C1310] text-[#F3EBE1] min-h-screen">
            <Navbar />
            <PageViewTracker />
            <Hero />
            <SectionB />
            <SectionC />
            <SectionD />
            <SectionE />
            <Footer />
        </main>
    );
}
