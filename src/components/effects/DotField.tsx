"use client";

import { useEffect, useRef } from "react";

const GAP = 14;
const SIZE = 1.5;
const FRAME_MS = 40; // ~25fps is plenty for a slow twinkle

type Dot = { x: number; y: number; m: number; ph: number; sp: number };

/** Ambient dot grid, densest in the top-right corner. Colour and strength come from CSS tokens. */
export default function DotField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    const ctx = cv?.getContext("2d");
    if (!cv || !ctx) return;

    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let dots: Dot[] = [];
    let w = 0;
    let h = 0;
    let raf = 0;
    let last = 0;
    let visible = false;
    let resizeTimer: number | undefined;

    const build = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = cv.clientWidth;
      h = cv.clientHeight;
      if (!w || !h) return;
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      dots = [];
      for (let y = GAP / 2; y < h; y += GAP) {
        for (let x = GAP / 2; x < w; x += GAP) {
          const dx = (w - x) / Math.max(w, 900);
          const dy = y / Math.max(h, 600);
          let m = Math.max(0, 1 - Math.sqrt(dx * dx + dy * dy * 1.6) / 0.8);
          m *= m;
          if (m <= 0.01 || Math.random() > 0.3 + m * 0.7) continue;
          dots.push({ x, y, m, ph: Math.random() * 6.283, sp: 0.25 + Math.random() * 0.9 });
        }
      }
    };

    const draw = (t: number) => {
      if (!still) raf = requestAnimationFrame(draw);
      if (!still && t - last < FRAME_MS) return;
      last = t;
      const cs = getComputedStyle(cv);
      const max = parseFloat(cs.getPropertyValue("--dotfield-alpha")) || 0.3;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = cs.color;
      for (const d of dots) {
        const tw = still ? 1 : 0.35 + 0.65 * (0.5 + 0.5 * Math.sin((t / 1000) * d.sp + d.ph));
        ctx.globalAlpha = max * d.m * tw;
        ctx.fillRect(d.x, d.y, SIZE, SIZE);
      }
      ctx.globalAlpha = 1;
    };

    const start = () => {
      cancelAnimationFrame(raf);
      if (still) draw(0);
      else raf = requestAnimationFrame(draw);
    };

    build();
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else cancelAnimationFrame(raf);
    });
    io.observe(cv);
    const ro = new ResizeObserver(() => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        build();
        if (visible) start();
      }, 120);
    });
    ro.observe(cv);
    const mo = still ? new MutationObserver(() => draw(0)) : null;
    mo?.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(resizeTimer);
      io.disconnect();
      ro.disconnect();
      mo?.disconnect();
    };
  }, []);

  return <canvas ref={ref} className="dotfield" aria-hidden="true" />;
}
