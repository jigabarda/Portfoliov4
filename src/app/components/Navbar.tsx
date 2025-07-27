"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "@fontsource/anton";
import "@fontsource/secular-one";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`w-full flex items-center justify-between fixed top-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-white/10 p-2 shadow-lg" : "bg-transparent"
      } sm:mt-0`}
    >
      <h1 className="text-[#E50914] text-[15px] font-black drop-shadow-[0_2px_2px_rgba(0,0,0,0.25)] font-secular-one uppercase">
        JIGSTACK
      </h1>
      <div className="flex items-center gap-4">
        <button className="bg-[#A30000] p-2 text-[15px] rounded-sm text-white">
          Get in touch
        </button>
        {/* Mobile hamburger menu icon */}
        <button
          className="sm:hidden flex flex-col justify-center items-center w-8 h-8 p-1 gap-[3px]"
          aria-label="Open menu"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className="block w-full h-[3px] bg-[#A30000] rounded"></span>
          <span className="block w-full h-[3px] bg-[#A30000] rounded"></span>
          <span className="block w-full h-[3px] bg-[#A30000] rounded"></span>
        </button>
        {/* Mobile dropdown menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "200px" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="absolute top-12 right-4 w-40 flex flex-col bg-[#A30000] rounded shadow-lg sm:hidden overflow-hidden"
            >
              <a
                href="#home"
                className="text-white text-[15px] font-bebas px-4 py-2 hover:bg-[#870000]"
              >
                Home
              </a>
              <a
                href="#about"
                className="text-white text-[15px] font-bebas px-4 py-2 hover:bg-[#870000]"
              >
                About
              </a>
              <a
                href="#projects"
                className="text-white text-[15px] font-bebas px-4 py-2 hover:bg-[#870000]"
              >
                Projects
              </a>
              <a
                href="#services"
                className="text-white text-[15px] font-bebas px-4 py-2 hover:bg-[#870000]"
              >
                Services
              </a>
              <a
                href="#stack"
                className="text-white text-[15px] font-bebas px-4 py-2 hover:bg-[#870000]"
              >
                Stack
              </a>
            </motion.nav>
          )}
        </AnimatePresence>
        {/* Desktop nav links */}
        <nav className="hidden sm:flex items-center gap-3">
          <a
            href="#home"
            className="text-[15px] text-[#A30000] font-bebas hover:underline"
          >
            Home
          </a>
          <a
            href="#about"
            className="text-[15px] text-[#A30000] font-bebas hover:underline"
          >
            About
          </a>
          <a
            href="#projects"
            className="text-[15px] text-[#A30000] font-bebas hover:underline"
          >
            Projects
          </a>
          <a
            href="#services"
            className="text-[15px] text-[#A30000] font-bebas hover:underline"
          >
            Services
          </a>
          <a
            href="#stack"
            className="text-[15px] text-[#A30000] font-bebas hover:underline"
          >
            Stack
          </a>
        </nav>
      </div>
    </div>
  );
};

export default Navbar;
