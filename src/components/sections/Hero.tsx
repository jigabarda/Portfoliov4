"use client";
import React, { useEffect, useState } from "react";
import { useCVModal } from "@/components/providers/CVModalProvider";
import { Montserrat } from "next/font/google";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaLinkedinIn,
  FaInstagram,
  FaFacebookF,
  FaXTwitter,
} from "react-icons/fa6";
import { HiChevronDown, HiArrowDownTray } from "react-icons/hi2";
import HeroBackground from "@/components/effects/HeroBackground";
import { fadeInUp, staggerContainer } from "@/lib/motion";
import { pillGhost } from "@/lib/utils";

const SOCIAL_LINKS = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/james-ivan-gabarda/",
    icon: FaLinkedinIn,
    hover: "hover:text-[#0077B5] hover:border-[#0077B5]",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/jeymzayban/",
    icon: FaInstagram,
    hover: "hover:text-[#E4405F] hover:border-[#E4405F]",
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/Jeyms.Aybannnnnn",
    icon: FaFacebookF,
    hover: "hover:text-[#1877F2] hover:border-[#1877F2]",
  },
  {
    label: "Twitter",
    href: "https://x.com/yaybann",
    icon: FaXTwitter,
    hover: "hover:text-white hover:border-white",
  },
];

const ROLES = [
  "Software Engineer",
  "Freelance Developer",
  "UI/UX Enthusiast",
];

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-montserrat",
  display: "swap",
});

/** Vertically-cycling job title under the name. */
function RoleRotator() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setIndex((prev) => (prev + 1) % ROLES.length),
      2600
    );
    return () => clearInterval(id);
  }, []);

  return (
    <span className="inline-flex h-[1.5em] items-center overflow-hidden align-bottom">
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          initial={{ y: "110%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-110%", opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="font-semibold text-[#ff8a8a]"
        >
          {ROLES[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

const Hero = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const { openCV } = useCVModal();

  return (
    <div className={montserrat.variable + " font-sans"}>
      <div className="relative h-[100svh] min-h-[600px] w-full overflow-hidden">
        <HeroBackground />

        {/* CENTERED CONTENT */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="relative z-10 flex h-full flex-col items-center justify-center px-5 text-center text-white sm:px-8"
        >
          {/* Availability badge */}
          <motion.span
            variants={fadeInUp}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium text-gray-200 backdrop-blur-sm sm:text-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
            </span>
            Available for work
          </motion.span>

          {/* TITLE */}
          <motion.h1
            variants={fadeInUp}
            className="text-3xl font-black leading-tight sm:text-4xl lg:text-5xl xl:text-6xl"
          >
            Hey There, <br />
            I&apos;m{" "}
            <span className="bg-gradient-to-r from-white via-[#ffb3b3] to-[#A30000] bg-clip-text text-transparent">
              James Ivan Gabarda
            </span>
          </motion.h1>

          {/* Rotating role */}
          <motion.div
            variants={fadeInUp}
            className="mt-3 text-base text-gray-400 sm:text-lg md:text-xl"
          >
            <RoleRotator />
          </motion.div>

          {/* DESCRIPTION */}
          <motion.p
            variants={fadeInUp}
            className="mt-4 max-w-md text-sm text-gray-300 sm:mt-5 sm:max-w-xl sm:text-base md:text-lg lg:max-w-2xl lg:text-xl"
          >
            Welcome to my portfolio! Explore my creative journey through web
            development and UI/UX design, where ideas come to life.
          </motion.p>

          {/* SOCIAL ICONS */}
          <motion.div
            variants={fadeInUp}
            className="mt-6 flex gap-3 sm:mt-8 sm:gap-4"
          >
            {SOCIAL_LINKS.map(({ label, href, icon: Icon, hover }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className={`flex h-10 w-10 items-center justify-center rounded-full border border-white transition-all duration-300 hover:-translate-y-1 hover:bg-white/10 ${hover}`}
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </motion.div>

          {/* CTA BUTTONS */}
          <motion.div
            variants={fadeInUp}
            className="mt-8 flex flex-col items-center gap-3 sm:flex-row"
          >
            {/* Primary: Download CV dropdown */}
            <div className="relative inline-block text-left">
              <button
                className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-black shadow-lg shadow-white/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-white/30"
                onClick={() => setShowDropdown((prev) => !prev)}
                aria-expanded={showDropdown}
                aria-haspopup="menu"
              >
                <HiArrowDownTray className="h-4 w-4" />
                Download CV
                <span
                  aria-hidden
                  className={`transition-transform duration-300 ${
                    showDropdown ? "rotate-180" : ""
                  }`}
                >
                  ▼
                </span>
              </button>

              <AnimatePresence>
                {showDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.25 }}
                    role="menu"
                    className="absolute left-1/2 z-20 mt-2 w-40 -translate-x-1/2 overflow-hidden rounded-xl border border-white/10 bg-[#0B0B0B] shadow-2xl"
                  >
                    <a
                      href="https://drive.google.com/uc?export=download&id=1OAOo1or-43SouLq4X8w46iinsyb2e7I6"
                      download
                      className="block px-6 py-3 text-base text-white transition hover:bg-white/10"
                    >
                      Download
                    </a>
                    <button
                      onClick={openCV}
                      className="block w-full px-6 py-3 text-left text-base text-white transition hover:bg-white/10"
                    >
                      View
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Secondary: View Projects */}
            <a href="#projects" className={pillGhost}>
              View Projects
            </a>
          </motion.div>
        </motion.div>

        {/* SCROLL CUE */}
        <motion.a
          href="#about"
          aria-label="Scroll to About"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-white/70 transition hover:text-white"
        >
          <motion.span
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            className="block"
          >
            <HiChevronDown className="h-7 w-7" />
          </motion.span>
        </motion.a>
      </div>
    </div>
  );
};

export default Hero;
