import React from "react";

/**
 * Lightweight animated hero backdrop — drifting coral/red aurora blobs over a
 * faint grid with a vignette. Pure CSS (no WebGL), GPU-friendly, and it
 * respects prefers-reduced-motion via the `.hero-blob` rule in globals.css.
 */
export default function HeroBackground() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-[#0B0B0B]">
      {/* Aurora blobs */}
      <div className="hero-blob absolute -top-1/4 -left-1/5 h-[60vh] w-[60vh] rounded-full bg-[#FF4C4C]/25 blur-[100px]" />
      <div className="hero-blob absolute top-1/4 -right-1/5 h-[55vh] w-[55vh] rounded-full bg-[#FF7F50]/20 blur-[110px] [animation-delay:-7s]" />
      <div className="hero-blob absolute -bottom-1/4 left-1/3 h-[50vh] w-[50vh] rounded-full bg-[#A30000]/30 blur-[120px] [animation-delay:-13s]" />

      {/* Faint grid, faded toward the edges */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.045)_1px,transparent_1px)] bg-[size:46px_46px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_72%)]" />

      {/* Vignette to focus the center */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,#0B0B0B_100%)]" />
    </div>
  );
}
