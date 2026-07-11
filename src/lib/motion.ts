import type { Variants } from "framer-motion";

/**
 * Shared scroll-reveal animation variants. Every section uses these so the
 * in/out motion is identical everywhere.
 *
 * Pair with `viewport` below and `once: false` so elements animate IN when
 * they enter the viewport and animate OUT (back to hidden) when they leave —
 * i.e. reveal on scroll in both directions.
 */

export const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.6, ease: EASE } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: EASE },
  },
};

/** Parent container that staggers its direct children (each using fadeInUp). */
export const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.05 },
  },
};

/** Default viewport config: replay in and out, trigger when ~20% visible. */
export const viewportConfig = { once: false, amount: 0.2 } as const;
