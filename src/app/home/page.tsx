"use client";
import React, { useState } from "react";
import { useCVModal } from "../components/CVModalProvider";
import { Montserrat } from "next/font/google";
import { motion, AnimatePresence } from "framer-motion";

const SOCIAL_LINKS = {
  linkedin: "https://www.linkedin.com/in/james-ivan-gabarda/",
  instagram: "https://www.instagram.com/jeymzayban/",
  facebook: "https://www.facebook.com/Jeyms.Aybannnnnn",
  twitter: "https://x.com/yaybann",
};

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-montserrat",
  display: "swap",
});

const Home = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const { openCV } = useCVModal();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 1 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className={
        montserrat.variable + " font-sans bg-gradient-home h-full pb-30"
      }
    >
      <div className="lg:mx-5 xl:mx-20">
        <div className="text-white text-center mx-7 font-sans">
          <h1 className="pt-25 lg:pt-30 text-2xl md:text-4xl lg:text-5xl font-black font-sans">
            Hey There, <br />
            I&apos;m James Ivan Gabarda
          </h1>
          <h5 className="font-sans md:text-xl lg:text-xl text-gray-400">
            Full Stack Web Developer
          </h5>
          <p className="mt-5 font-sans md:text-xl lg:text-2xl lg:mx-25">
            Welcome to my portfolio! Explore my creative journey through web
            development and UI/UX design, where ideas come to life.
          </p>
        </div>
        {/* Socials */}
        <div className="flex space-x-4 mt-8 justify-center font-sans">
          <a
            href={SOCIAL_LINKS.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            title="LinkedIn"
            className="border border-white w-10 h-10 rounded-full text-white flex cursor-pointer items-center justify-center text-sm hover:bg-[#FFFFFF]/10 hover:text-[#0077B5] hover:border-[#0077B5] transition-all duration-300 ease-in-out font-sans"
          >
            <i className="fab fa-linkedin font-sans"></i>
          </a>
          <a
            href={SOCIAL_LINKS.instagram}
            target="_blank"
            rel="noopener noreferrer"
            title="Instagram"
            className="border border-white w-10 h-10 rounded-full text-white flex cursor-pointer items-center justify-center text-sm hover:bg-[#FFFFFF]/10 hover:text-[#E4405F] hover:border-[#E4405F] transition-all duration-300 ease-in-out font-sans"
          >
            <i className="fab fa-instagram font-sans"></i>
          </a>
          <a
            href={SOCIAL_LINKS.facebook}
            target="_blank"
            rel="noopener noreferrer"
            title="Facebook"
            className="border border-white w-10 h-10 rounded-full text-white flex cursor-pointer items-center justify-center text-sm hover:bg-[#FFFFFF]/10 hover:text-[#1877F2] hover:border-[#1877F2] transition-all duration-300 ease-in-out font-sans"
          >
            <i className="fab fa-facebook font-sans"></i>
          </a>
          <a
            href={SOCIAL_LINKS.twitter}
            target="_blank"
            rel="noopener noreferrer"
            title="Twitter"
            className="border border-white w-10 h-10 rounded-full text-white flex cursor-pointer items-center justify-center text-sm hover:bg-[#FFFFFF]/10 hover:text-[#1DA1F2] hover:border-[#1DA1F2] transition-all duration-300 ease-in-out font-sans"
          >
            <i className="fab fa-twitter font-sans"></i>
          </a>
        </div>
        {/* Download CV Button with Dropdown */}
        <div className="flex justify-center mt-4 font-sans">
          <div className="relative inline-block text-left">
            <button
              className="bg-[#0B0B0B] cursor-pointer text-sm text-white px-5 py-2 rounded-full font-semibold shadow hover:bg-white hover:text-black transition-all duration-300 flex items-center gap-2"
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
                    href="https://drive.google.com/uc?export=download&id=1OAOo1or-43SouLq4X8w46iinsyb2e7I6"
                    download
                    className="block px-6 py-3 text-base text-white hover:bg-white/5 hover:text-white rounded-t-xl transition-colors duration-500 cursor-pointer"
                  >
                    Download
                  </a>
                  <button
                    onClick={openCV}
                    className="block w-full text-left px-6 py-3 text-base text-white hover:bg-white/5 hover:text-white rounded-b-xl transition-colors duration-500 cursor-pointer"
                  >
                    View
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        {/* Global CV Modal handled by CVModalProvider */}
      </div>
    </motion.div>
  );
};

export default Home;
