"use client";
import React, { useState } from "react";
import { Montserrat } from "next/font/google";
import { motion, AnimatePresence } from "framer-motion";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-montserrat",
  display: "swap",
});

const Home = () => {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div
      className={
        montserrat.variable + " font-sans bg-gradient-home h-full pb-30"
      }
    >
      <div>
        <div className="text-white text-center mx-7 font-sans">
          <h1 className="pt-25 text-2xl font-black font-sans">
            Hey There, <br />
            I&apos;m James Ivan Gabarda
          </h1>
          <h5 className="font-sans">Web Developer</h5>
          <p className="mt-5 font-sans">
            Welcome to my portfolio! Explore my creative journey through web
            development and UI/UX design, where ideas come to life.
          </p>
        </div>
        {/* Socials */}
        <div className="flex space-x-4 mt-8 justify-center font-sans">
          <button
            title="LinkedIn"
            className="border border-white w-10 h-10 rounded-full text-white flex items-center justify-center text-sm hover:bg-[#E8F4FB] hover:text-[#0077B5] hover:border-[#0077B5] transition-all duration-300 ease-in-out font-sans"
          >
            <i className="fab fa-linkedin font-sans"></i>
          </button>
          <button
            title="Instagram"
            className="border border-white w-10 h-10 rounded-full text-white flex items-center justify-center text-sm hover:bg-[#FDE8ED] hover:text-[#E4405F] hover:border-[#E4405F] transition-all duration-300 ease-in-out font-sans"
          >
            <i className="fab fa-instagram font-sans"></i>
          </button>
          <button
            title="Facebook"
            className="border border-white w-10 h-10 rounded-full text-white flex items-center justify-center text-sm hover:bg-[#E7F3FF] hover:text-[#1877F2] hover:border-[#1877F2] transition-all duration-300 ease-in-out font-sans"
          >
            <i className="fab fa-facebook font-sans"></i>
          </button>
          <button
            title="Twitter"
            className="border border-white w-10 h-10 rounded-full text-white flex items-center justify-center text-sm hover:bg-[#E5F6FD] hover:text-[#1DA1F2] hover:border-[#1DA1F2] transition-all duration-300 ease-in-out font-sans"
          >
            <i className="fab fa-twitter font-sans"></i>
          </button>
        </div>
        {/* Download CV Button with Dropdown */}
        <div className="flex justify-center mt-4 font-sans">
          <div className="relative inline-block text-left">
            <button
              className="bg-[#0B0B0B] text-sm text-white px-5 py-2 rounded-full font-semibold shadow hover:bg-white hover:text-black transition-all duration-300 flex items-center gap-2"
              onClick={() => setShowDropdown((prev) => !prev)}
              id="cv-dropdown-btn"
            >
              Download CV <span className="ml-1">|</span>{" "}
              <span
                className={
                  showDropdown
                    ? "rotate-180 transition-transform duration-200"
                    : "transition-transform duration-200"
                }
              >
                ▼
              </span>
            </button>
            {/* Redesigned Dropdown with Framer Motion */}
            <AnimatePresence>
              {showDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="absolute left-1/2 -translate-x-1/2 mt-2 w-40 rounded-xl shadow-2xl bg-[#0B0B0B] z-10"
                >
                  <a
                    href="/cv.pdf"
                    download
                    className="block px-6 py-3 text-base text-white hover:bg-white/5 hover:text-white rounded-t-xl transition-colors duration-500 cursor-pointer"
                  >
                    Download
                  </a>
                  <a
                    href="/cv.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block px-6 py-3 text-base text-white hover:bg-white/5 hover:text-white rounded-b-xl transition-colors duration-500 cursor-pointer"
                  >
                    View
                  </a>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
