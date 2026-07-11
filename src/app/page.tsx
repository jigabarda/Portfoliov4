import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Stack from "@/components/sections/Stack";
import Projects from "@/components/sections/Projects";
import Services from "@/components/sections/Services";

function Page() {
  return (
    <div className="bg-[#0B0B0B] scroll-smooth overflow-x-hidden">
      <Navbar />

      <main>
        <section id="home">
          <Hero />
        </section>

        <section id="about" className="scroll-mt-20">
          <About />
        </section>

        <section id="stack" className="scroll-mt-20">
          <Stack />
        </section>

        <section id="projects" className="scroll-mt-20">
          <Projects />
        </section>

        <section id="services" className="scroll-mt-20">
          <Services />
        </section>
      </main>

      <footer id="footer">
        <Footer />
      </footer>
    </div>
  );
}

export default Page;
