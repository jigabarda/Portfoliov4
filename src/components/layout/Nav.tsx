"use client";

import { useEffect, useState } from "react";
import { Menu, Moon, Sun } from "@/components/icons";
import { NAV_LINKS, site } from "@/content/site";
import { applyTheme, currentTheme, type Theme } from "@/lib/theme";

/** Every section the highlight should know about; ones without a nav link clear it. */
const TRACKED = ["home", "projects", "services", "process", "about", "stack", "testimonials", "contact"];

/** `home` is the path the section links point at: "" on the home page itself, "/" on other pages. */
export default function Nav({ home = "" }: { home?: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [next, setNext] = useState<Theme | null>(null);

  useEffect(() => {
    setNext(currentTheme() === "dark" ? "light" : "dark");
  }, []);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    for (const id of TRACKED) {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    }
    return () => io.disconnect();
  }, []);

  const toggleTheme = (event: React.MouseEvent<HTMLButtonElement>) => {
    const target = currentTheme() === "dark" ? "light" : "dark";
    applyTheme(target, event.currentTarget);
    setNext(target === "dark" ? "light" : "dark");
  };

  return (
    <header className="nav" id="nav">
      <div className="wrap nav-inner">
        <a className="brand" href={`${home}#home`} aria-label="JigStack, back to top">{site.brand}</a>

        <nav className="nav-links" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <a key={link.id} href={`${home}#${link.id}`} aria-current={active === link.id ? "true" : undefined}>
              {link.label}
            </a>
          ))}
        </nav>

        <div className="nav-actions">
          <button className="icon-btn" type="button" onClick={toggleTheme} aria-label={next ? `Switch to ${next} theme` : "Switch theme"}>
            <Moon />
            <Sun />
          </button>
          <a className="btn btn-primary btn-sm" href={`${home}#contact`}>{site.navCta}</a>
          <button
            className="icon-btn menu-btn"
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <Menu />
          </button>
        </div>
      </div>

      <div className="mobile-menu" id="mobile-menu" hidden={!menuOpen}>
        <div className="wrap">
          {NAV_LINKS.map((link) => (
            <a key={link.id} href={`${home}#${link.id}`} onClick={() => setMenuOpen(false)}>{link.label}</a>
          ))}
        </div>
      </div>

      <span className="progress" aria-hidden="true" />
    </header>
  );
}
