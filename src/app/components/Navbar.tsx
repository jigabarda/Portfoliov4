"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setMenuOpen(false);
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? "bg-black/70 backdrop-blur-md shadow-lg py-2"
          : "bg-transparent py-4"
      }`}
    >
      <div className="flex items-center justify-between max-w-6xl mx-auto px-6">
        {/* Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => scrollToSection("home")}
        >
          <Image
            src="/images/logo2.png"
            alt="Logo"
            width={100}
            height={100}
            className="object-contain"
          />
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {/* Get in Touch Button */}
          {/* <button
            type="button"
            className="bg-[#A30000] px-4 py-2 text-[15px] rounded-sm text-white"
            onClick={() => scrollToSection("footer")}
          >
            Get in touch
          </button> */}

          {/* Mobile Menu Button */}
          <button
            type="button"
            aria-label="Toggle menu"
            className="sm:hidden flex flex-col justify-center items-center w-8 h-8 p-1 gap-[3px]"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span className="block w-full h-[3px] bg-[#A30000] rounded"></span>
            <span className="block w-full h-[3px] bg-[#A30000] rounded"></span>
            <span className="block w-full h-[3px] bg-[#A30000] rounded"></span>
          </button>

          {/* Mobile Dropdown */}
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "200px" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4 }}
                className="absolute top-14 right-6 w-40 bg-black/90 rounded shadow-lg sm:hidden overflow-hidden flex flex-col"
              >
                {[
                  { id: "home", label: "Home" },
                  { id: "projects", label: "Projects" },
                  { id: "about", label: "About" },
                  { id: "services", label: "Services" },
                ].map(({ id, label }) => (
                  <button
                    key={id}
                    onClick={() => scrollToSection(id)}
                    className="text-white text-[15px] px-4 py-2 hover:bg-[#870000] text-left"
                  >
                    {label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Desktop Nav */}
          <nav className="hidden sm:flex items-center gap-6 mr-3">
            {[
              { id: "home", label: "Home" },
              { id: "about", label: "About" },
              { id: "projects", label: "Projects" },
              { id: "services", label: "Services" },
              { id: "stack", label: "Stack" },
            ].map(({ id, label }) => (
              <button
                key={id}
                onClick={() => scrollToSection(id)}
                className="text-[15px] text-[#A30000] relative group transition duration-300 cursor-pointer"
              >
                {label}

                <span className="absolute left-1/2 -bottom-1 -translate-x-1/2 w-0 h-0.5 bg-[#A30000] rounded transition-all duration-500 group-hover:w-6"></span>
              </button>
            ))}
          </nav>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
