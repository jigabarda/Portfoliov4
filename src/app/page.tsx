import React from "react";
import Navbar from "./about/page";
import Home from "./home/page";
import Projects from "./projects/page";
import Stack from "./stacks/page";
import About from "./about/page";
import Footer from "./components/Footer";

function Page() {
  return (
    <div className="bg-[#0B0B0B] scroll-smooth">
      <Navbar />

      <div id="home">
        <Home />
      </div>

      <div id="projects">
        <Projects />
      </div>

      <div id="stack">
        <Stack />
      </div>

      <div id="about">
        <About />
      </div>

      <div id="footer">
        <Footer />
      </div>
    </div>
  );
}

export default Page;
