"use client";

import { useEffect } from "react";

type RevealWindow = Window & { __revealFailsafe?: number };

/**
 * Adds `.is-in` to each `.reveal` element as it enters the viewport (once).
 * Hiding only happens while <html> has `.reveal-on`, which the boot script sets.
 */
export default function RevealObserver() {
  useEffect(() => {
    const root = document.documentElement;
    if (!root.classList.contains("reveal-on")) return;
    window.clearTimeout((window as RevealWindow).__revealFailsafe);

    const targets = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    for (const el of targets) {
      const siblings = Array.from(el.parentElement?.children ?? []).filter((c) => c.classList.contains("reveal"));
      if (siblings.length > 1) el.style.setProperty("--d", `${Math.min(siblings.indexOf(el), 6) * 0.07}s`);
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.12 },
    );
    for (const el of targets) io.observe(el);
    return () => io.disconnect();
  }, []);

  return null;
}
