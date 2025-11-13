import React from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import Stack from "./pages/Stack";
import About from "./pages/About";
import Footer from "./components/Footer";

function Page() {
  return (
    <div className="bg-[#0B0B0B]">
      <div>
        <Navbar />
      </div>
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
