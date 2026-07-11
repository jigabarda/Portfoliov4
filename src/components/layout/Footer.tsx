"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { HiArrowUp } from "react-icons/hi2";
import { Reveal } from "@/components/ui/Reveal";

const EMAIL = "jagabarda8@gmail.com";

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "Projects", href: "#projects" },
  { label: "Stack", href: "#stack" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
];

const SOCIAL_LINKS = [
  { label: "Facebook", href: "https://www.facebook.com/Jeyms.Aybannnnnn" },
  { label: "Instagram", href: "https://www.instagram.com/jeymzayban/" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/james-ivan-gabarda/" },
];

const Footer = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="text-white px-6 sm:px-8 py-10 border-t border-white/10 bg-gradient-to-b from-transparent to-[#A30000]/5">
      <Reveal className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto text-sm">
        {/* Logo */}
        <div className="flex items-center justify-center sm:justify-start">
          <Image
            src="/images/logo2.png"
            alt="James Ivan Gabarda logo"
            width={150}
            height={150}
            className="w-32 h-auto"
          />
        </div>

        {/* Navigation */}
        <div>
          <h4 className="text-[#A30000] font-semibold mb-2">Navigation</h4>
          <ul className="space-y-1">
            {NAV_LINKS.map(({ label, href }) => (
              <li key={label}>
                <a href={href} className="hover:text-[#A30000] transition">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Follow Me */}
        <div>
          <h4 className="text-[#A30000] font-semibold mb-2">Follow Me</h4>
          <ul className="space-y-1">
            {SOCIAL_LINKS.map(({ label, href }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#A30000] transition"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Let's Connect */}
        <div>
          <h4 className="text-[#A30000] font-semibold mb-2">Let&rsquo;s Connect</h4>
          <a
            href={`mailto:${EMAIL}`}
            className="mb-2 inline-block underline break-all hover:text-[#A30000] transition"
          >
            {EMAIL}
          </a>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const data = new FormData(e.currentTarget);
              const from = String(data.get("email") || "");
              window.location.href = `mailto:${EMAIL}?subject=Portfolio inquiry&body=From: ${from}`;
            }}
            className="mt-2 flex flex-col gap-2"
          >
            <label htmlFor="footer-email" className="sr-only">
              Your email
            </label>
            <input
              id="footer-email"
              name="email"
              type="email"
              required
              placeholder="Your email"
              className="bg-black border border-white/40 focus:border-[#A30000] outline-none text-white px-3 py-2 rounded w-full transition"
            />
            <button
              type="submit"
              className="bg-[#A30000] hover:bg-[#870000] transition text-white px-3 py-2 rounded font-semibold"
            >
              Get in touch
            </button>
          </form>
        </div>
      </Reveal>

      {/* Divider & Bottom */}
      <div className="border-t border-white/20 mt-10 pt-4 text-center text-xs text-gray-400 max-w-6xl mx-auto">
        <p>© 2025 JigStack. All rights reserved.</p>
      </div>

      {/* Scroll Up Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            type="button"
            aria-label="Scroll to top"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-6 right-6 z-40 bg-white text-[#A30000] p-3 rounded-full shadow-lg transition-colors hover:bg-[#A30000] hover:text-white"
          >
            <HiArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Footer;
