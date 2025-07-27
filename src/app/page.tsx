import React from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import Stack from "./pages/Stack";
import About from "./pages/About";
import Footer from "./components/Footer";

const page = () => {
  return (
    <div className="bg-[#0B0B0B]">
      <div>
        <Navbar />
      </div>
      <div>
        <Home />
      </div>
      <div>
        <Projects />
      </div>
      <div>
        <Stack />
      </div>
      <div>
        <About />
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
};

export default page;
