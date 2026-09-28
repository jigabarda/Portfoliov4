import Footer from "@/components/layout/Footer";
import Nav from "@/components/layout/Nav";
import ExperienceStrip from "@/components/sections/ExperienceStrip";
import Hero from "@/components/sections/Hero";
import RevealObserver from "@/components/ui/RevealObserver";

export default function Page() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <ExperienceStrip />
      </main>
      <Footer />
      <RevealObserver />
    </>
  );
}
