import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge conditional class names and resolve Tailwind conflicts. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Shared design tokens so every section uses the same surface / hover /
 * button treatment. Keeping these in one place is what makes the UI feel
 * like a single system.
 */
export const BRAND = "#A30000";

/** Standard card surface: subtle glass panel that lifts and glows on hover. */
export const cardClass =
  "bg-white/5 rounded-xl border border-white/10 transition-all duration-300 hover:-translate-y-1 hover:border-[#A30000]/50 hover:bg-white/[0.07] hover:shadow-lg hover:shadow-[#A30000]/10";

/** Same surface but without the lift — for static info panels inside a card. */
export const panelClass =
  "bg-white/5 rounded-xl border border-white/10 transition-colors duration-300";

/** Primary pill button. */
export const pillPrimary =
  "inline-flex items-center gap-2 rounded-full bg-[#A30000] px-5 py-2 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#870000] hover:shadow-lg hover:shadow-[#A30000]/30";

/** Secondary/ghost pill button. */
export const pillGhost =
  "inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-2 text-sm font-semibold text-white transition-all duration-300 hover:border-white hover:bg-white/10";
