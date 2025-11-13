"use client";
import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import "@fontsource/anton";
import "@fontsource/secular-one";
import Image from "next/image";

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
      className={`w-full flex flex-row items-center justify-between fixed top-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-black/70 p-2 shadow-lg" : "bg-transparent"
      } sm:mt-0 h-15`}
    >
      <div className="flex-1 flex items-center h-full">
        <div className="flex items-center justify-center mt-2 ml-3">
          <Image
            src={"/images/logo2.png"}
            alt="Profile"
            width={100}
            height={100}
            className="object-contain"
          />
        </div>
      </div>
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
              className="absolute top-12 w-40 flex flex-col bg-[#000000]/90 rounded shadow-lg sm:hidden overflow-hidden"
            >
              <Link href="/" className="text-white text-[15px] font-bebas px-4 py-2 hover:bg-[#870000]">Home</Link>
              <Link href="#about" className="text-white text-[15px] font-bebas px-4 py-2 hover:bg-[#870000]">About</Link>
              <Link href="#projects" className="text-white text-[15px] font-bebas px-4 py-2 hover:bg-[#870000]">Projects</Link>
              <Link href="#services" className="text-white text-[15px] font-bebas px-4 py-2 hover:bg-[#870000]">Services</Link>
              <Link href="#stack" className="text-white text-[15px] font-bebas px-4 py-2 hover:bg-[#870000]">Stack</Link>
            </motion.nav>
          )}
        </AnimatePresence>
        {/* Desktop nav links */}
        <nav className="hidden sm:flex items-center gap-3 mr-5">
          <Link href="/" className="text-[15px] text-[#A30000] font-bebas hover:underline">Home</Link>
          <Link href="#about" className="text-[15px] text-[#A30000] font-bebas hover:underline">About</Link>
          <Link href="#projects" className="text-[15px] text-[#A30000] font-bebas hover:underline">Projects</Link>
          <Link href="#services" className="text-[15px] text-[#A30000] font-bebas hover:underline">Services</Link>
          <Link href="#stack" className="text-[15px] text-[#A30000] font-bebas hover:underline">Stack</Link>
        </nav>
      </div>
    </div>
  );
};

export default Navbar;
