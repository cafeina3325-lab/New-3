import Hero from "@/components/sections/Hero";
import SectionB from "@/components/sections/SectionB";
import SectionC from "@/components/sections/SectionC";
import SectionD from "@/components/sections/SectionD";
import SectionE from "@/components/sections/SectionE";
import SectionF from "@/components/sections/SectionF";
import SectionG from "@/components/sections/SectionG";

export default function Home() {
  return (
    <main className="bg-neutral-950 text-white min-h-screen">
      <Hero />
      <SectionB />
      <SectionC />
      <SectionD />
      <SectionE />
      <SectionF />
      <SectionG />
    </main>
  );
}
