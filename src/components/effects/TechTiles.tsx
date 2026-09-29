"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { techTiles } from "@/content/stack-icons";

const GAP = 7;
const SIZE = 1.6;
const SPEED = 0.38; // px per ms the reveal wave travels
const EDGE = 36; // px over which a dot fades in behind the wave front
const LIFT = 14; // matches the logo's hover lift, so the wave starts at the logo

type Dot = { x: number; y: number; base: number; ph: number; sp: number; dist: number };

export default function TechTiles() {
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const list = listRef.current;
    if (!list || !matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cleanups: Array<() => void> = [];

    list.querySelectorAll<HTMLLIElement>(".tile").forEach((tile) => {
      const cv = tile.querySelector("canvas");
      const ctx = cv?.getContext("2d");
      if (!cv || !ctx) return;
      let dots: Dot[] = [];
      let w = 0;
      let h = 0;
      let color = "";
      let size = SIZE;
      let boost = 1;
      let running = false;
      let raf = 0;
      let t0 = 0;
      let stopTimer: number | undefined;

      const build = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        w = tile.clientWidth;
        h = tile.clientHeight;
        cv.width = Math.round(w * dpr);
        cv.height = Math.round(h * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        dots = [];
        for (let y = GAP / 2; y < h; y += GAP) {
          const fall = Math.max(0, 1 - y / (h * 0.85));
          for (let x = GAP / 2; x < w; x += GAP) {
            if (Math.random() > 0.2 + fall * 0.8) continue;
            dots.push({
              x, y,
              base: fall * (0.3 + Math.random() * 0.7),
              ph: Math.random() * 6.283,
              sp: 0.8 + Math.random() * 2.4,
              dist: Math.hypot(x - w / 2, y - (h / 2 - LIFT)) + Math.random() * 55,
            });
          }
        }
      };

      const draw = (t: number) => {
        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = color;
        const front = (t - t0) * SPEED;
        for (const d of dots) {
          const p = still ? 1 : Math.min(1, Math.max(0, (front - d.dist) / EDGE));
          if (p <= 0) continue;
          const twinkle = still ? 1 : 0.3 + 0.7 * (0.5 + 0.5 * Math.sin((t / 1000) * d.sp + d.ph));
          const flash = p * (1 - p) * 1.4 * (0.25 + d.base);
          ctx.globalAlpha = Math.min(1, (d.base * twinkle * p + flash) * boost);
          ctx.fillRect(d.x, d.y, size, size);
        }
        ctx.globalAlpha = 1;
        if (running && !still) raf = requestAnimationFrame(draw);
      };

      const onEnter = () => {
        window.clearTimeout(stopTimer);
        const cs = getComputedStyle(cv);
        color = cs.color;
        size = parseFloat(cs.getPropertyValue("--dot-size")) || SIZE;
        boost = parseFloat(cs.getPropertyValue("--dot-alpha")) || 1;
        if (!dots.length || Math.abs(tile.clientWidth - w) > 1) build();
        running = true;
        t0 = performance.now();
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(draw);
      };
      const onLeave = () => {
        stopTimer = window.setTimeout(() => {
          running = false;
          cancelAnimationFrame(raf);
        }, 550);
      };

      tile.addEventListener("mouseenter", onEnter);
      tile.addEventListener("mouseleave", onLeave);
      cleanups.push(() => {
        tile.removeEventListener("mouseenter", onEnter);
        tile.removeEventListener("mouseleave", onLeave);
        cancelAnimationFrame(raf);
        window.clearTimeout(stopTimer);
      });
    });

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return (
    <ul className="tiles" aria-label="Core technologies" ref={listRef}>
      {techTiles.map((t) => (
        <li key={t.name} className="tile reveal" style={{ "--brand": t.brand } as CSSProperties}>
          <canvas className="tile-dots" aria-hidden="true" />
          <svg className="tile-logo" viewBox="0 0 24 24" aria-hidden="true"><path d={t.path} /></svg>
          <span className="tile-name">{t.name}</span>
        </li>
      ))}
    </ul>
  );
}
