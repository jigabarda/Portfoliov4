"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);

      const sectionIds = ["home", "about", "stack", "projects", "services"];
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= 150 && rect.bottom >= 150) {
          setActiveSection(id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Smooth scroll with offset
  const scrollToSection = (id: string) => {
    setMenuOpen(false);
    setActiveSection(id);

    const section = document.getElementById(id);
    if (!section) return;

    // Wait for next frame to ensure element exists
    requestAnimationFrame(() => {
      const navbarHeight = 90; // adjust if needed
      const top =
        window.scrollY + section.getBoundingClientRect().top - navbarHeight;

      window.scrollTo({ top, behavior: "smooth" });
    });
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/10 backdrop-blur-md shadow-lg py-2"
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

        <div className="flex items-center gap-4">
          {/* Mobile Menu Toggle */}
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
                transition={{ duration: 0.35 }}
                className="absolute top-14 right-6 w-40 bg-black/90 rounded shadow-lg sm:hidden overflow-hidden flex flex-col"
              >
                {[
                  { id: "home", label: "Home" },
                  { id: "projects", label: "Projects" },
                  { id: "about", label: "About" },
                  { id: "services", label: "Services" },
                  { id: "stack", label: "Stack" },
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

          {/* Desktop Navigation */}
          <nav className="hidden sm:flex items-center gap-6 mr-3">
            {[
              { id: "home", label: "Home" },
              { id: "about", label: "About" },
              { id: "stack", label: "Stack" },
              { id: "projects", label: "Projects" },
              { id: "services", label: "Services" },
            ].map(({ id, label }) => (
              <button
                key={id}
                onClick={() => scrollToSection(id)}
                className={`
                  text-[15px] font-normal relative group transition duration-300 cursor-pointer
                  ${activeSection === id ? "text-[#A30000]" : "text-white"}
                `}
              >
                {label}
                <span
                  className={`
                    absolute left-1/2 -bottom-1 -translate-x-1/2 h-0.5 bg-[#A30000] rounded transition-all duration-500
                    ${activeSection === id ? "w-6" : "w-0 group-hover:w-6"}
                  `}
                ></span>
              </button>
            ))}
          </nav>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
