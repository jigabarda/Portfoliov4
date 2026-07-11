"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const NAV_ITEMS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "stack", label: "Stack" },
  { id: "projects", label: "Projects" },
  { id: "services", label: "Services" },
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);

      for (const { id } of NAV_ITEMS) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= 150 && rect.bottom >= 150) {
          setActiveSection(id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Smooth scroll with manual animation to ensure consistent behavior
  const scrollToSection = (id: string) => {
    setMenuOpen(false);
    setActiveSection(id);

    const section = document.getElementById(id);
    if (!section) return;

    const navEl = document.getElementById("site-navbar");
    const navbarHeight = navEl ? navEl.offsetHeight : 0;

    const target =
      window.scrollY + section.getBoundingClientRect().top - navbarHeight;

    const start = window.scrollY;
    const change = target - start;
    const duration = 800; // ms
    const startTime = performance.now();

    const easeInOutCubic = (t: number) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeInOutCubic(progress);
      window.scrollTo({ top: start + change * eased, left: 0 });
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  };

  return (
    <nav
      id="site-navbar"
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/10 backdrop-blur-md shadow-lg py-1.5"
          : "bg-transparent py-3"
      }`}
    >
      <div className="flex items-center justify-between max-w-6xl mx-auto px-4 sm:px-6">
        {/* Logo */}
        <button
          type="button"
          aria-label="Back to top"
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => scrollToSection("home")}
        >
          <Image
            src="/images/logo2.png"
            alt="James Ivan Gabarda logo"
            width={100}
            height={100}
            priority
            className="object-contain w-20 h-auto sm:w-24"
          />
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {NAV_ITEMS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => scrollToSection(id)}
              className={`text-[15px] font-semibold relative group transition duration-300 cursor-pointer ${
                activeSection === id ? "text-[#A30000]" : "text-white"
              }`}
            >
              {label}
              <span
                className={`absolute left-1/2 -bottom-1 -translate-x-1/2 h-0.5 bg-[#A30000] rounded transition-all duration-500 ${
                  activeSection === id ? "w-6" : "w-0 group-hover:w-10"
                }`}
              ></span>
            </button>
          ))}
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          className="md:hidden flex flex-col justify-center items-center w-9 h-9 p-1 gap-[3px]"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span
            className={`block w-6 h-[3px] bg-[#A30000] rounded transition-all duration-300 ${
              menuOpen ? "translate-y-[6px] rotate-45" : ""
            }`}
          ></span>
          <span
            className={`block w-6 h-[3px] bg-[#A30000] rounded transition-all duration-300 ${
              menuOpen ? "opacity-0" : ""
            }`}
          ></span>
          <span
            className={`block w-6 h-[3px] bg-[#A30000] rounded transition-all duration-300 ${
              menuOpen ? "-translate-y-[6px] -rotate-45" : ""
            }`}
          ></span>
        </button>
      </div>

      {/* Mobile Dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden mx-4 mt-2 bg-black/90 backdrop-blur-md rounded-lg shadow-lg"
          >
            <div className="flex flex-col py-2">
              {NAV_ITEMS.map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => scrollToSection(id)}
                  className={`text-left text-[15px] px-5 py-3 transition hover:bg-[#870000] ${
                    activeSection === id ? "text-[#A30000]" : "text-white"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
