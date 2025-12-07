"use client";
import React, { useState } from "react";
import { useCVModal } from "../components/CVModalProvider";
import { Montserrat } from "next/font/google";
import { motion, AnimatePresence } from "framer-motion";
import LiquidEther from "../components/LiquidEther";

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
      className={montserrat.variable + " font-sans h-full pb-30"}
    >
      {/* HOME SECTION */}
      <div className="relative h-screen w-full overflow-hidden">
        {/* 🔮 LIQUID ETHER BACKGROUND */}
        <div className="absolute inset-0 -z-10">
          <LiquidEther
            colors={["#FF7F50", "#FFA3A3", "#FF4C4C"]}
            mouseForce={20}
            cursorSize={100}
            isViscous={false}
            viscous={30}
            iterationsViscous={32}
            iterationsPoisson={32}
            resolution={0.5}
            isBounce={false}
            autoDemo={true}
            autoSpeed={0.5}
            autoIntensity={2.2}
            takeoverDuration={0.25}
            autoResumeDelay={3000}
            autoRampDuration={0.6}
          />
        </div>

        {/* ⭐ CENTERED CONTENT */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-7 z-10">
          {/* TITLE */}
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-black">
            Hey There, <br />
            I&apos;m James Ivan Gabarda
          </h1>

          <h5 className="mt-2 md:text-xl text-gray-400">
            Full Stack Developer
          </h5>

          {/* DESCRIPTION */}
          <p className="mt-5 md:text-xl lg:text-2xl max-w-3xl">
            Welcome to my portfolio! Explore my creative journey through web
            development and UI/UX design, where ideas come to life.
          </p>

          {/* SOCIAL ICONS — with aria-label FIX */}
          <div className="flex space-x-4 mt-8">
            <a
              href={SOCIAL_LINKS.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="border border-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/10 hover:text-[#0077B5] hover:border-[#0077B5] transition-all"
            >
              <i className="fab fa-linkedin"></i>
            </a>

            <a
              href={SOCIAL_LINKS.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="border border-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/10 hover:text-[#E4405F] hover:border-[#E4405F] transition-all"
            >
              <i className="fab fa-instagram"></i>
            </a>

            <a
              href={SOCIAL_LINKS.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="border border-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/10 hover:text-[#1877F2] hover:border-[#1877F2] transition-all"
            >
              <i className="fab fa-facebook"></i>
            </a>

            <a
              href={SOCIAL_LINKS.twitter}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
              className="border border-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/10 hover:text-[#1DA1F2] hover:border-[#1DA1F2] transition-all"
            >
              <i className="fab fa-twitter"></i>
            </a>
          </div>

          {/* CV DROPDOWN BUTTON */}
          <div className="mt-6">
            <div className="relative inline-block text-left">
              <button
                className="bg-white/3 text-sm text-white px-5 py-2 rounded-full font-semibold shadow-sm shadow-white/50 hover:bg-white duration-500 cursor-pointer hover:text-black transition flex items-center gap-2"
                onClick={() => setShowDropdown((prev) => !prev)}
              >
                Download CV <span>|</span>
                <span className={showDropdown ? "rotate-180" : ""}>▼</span>
              </button>

              <AnimatePresence>
                {showDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.25 }}
                    className="absolute left-1/2 -translate-x-1/2 mt-2 w-40 rounded-xl shadow-2xl bg-[#0B0B0B] z-10"
                  >
                    <a
                      href="https://drive.google.com/uc?export=download&id=1OAOo1or-43SouLq4X8w46iinsyb2e7I6"
                      download
                      className="block px-6 py-3 text-base text-white hover:bg-white/10 rounded-t-xl transition"
                    >
                      Download
                    </a>

                    <button
                      onClick={openCV}
                      className="block w-full text-left px-6 py-3 text-base text-white hover:bg-white/10 rounded-b-xl transition"
                    >
                      View
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Home;
