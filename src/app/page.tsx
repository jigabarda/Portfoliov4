import React from "react";
import Navbar from "./components/Navbar";
import Home from "./home/page";
import Projects from "./projects/page";
import Stack from "./stacks/page";
import About from "./components/About";
import Footer from "./components/Footer";
import Services from "./services/page";

function Page() {
  return (
    <div className="bg-[#0B0B0B] scroll-smooth">
      <Navbar />

      <section id="home">
        <Home />
      </section>

      <section id="about">
        <About />
      </section>

      <section id="stack">
        <Stack />
      </section>

      <section id="projects">
        <Projects />
      </section>

      <section id="services">
        <Services />
      </section>

      <section id="footer">
        <Footer />
      </section>
    </div>
  );
}

export default Page;
