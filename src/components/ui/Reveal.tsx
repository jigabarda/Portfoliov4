"use client";
import React from "react";
import { motion, type Variants } from "framer-motion";
import { fadeInUp, staggerContainer, viewportConfig } from "@/lib/motion";
import { cn } from "@/lib/utils";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  variants?: Variants;
  delay?: number;
};

/** Single element that reveals (in and out) as it enters/leaves the viewport. */
export function Reveal({
  children,
  className,
  variants = fadeInUp,
  delay = 0,
}: RevealProps) {
  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={viewportConfig}
      transition={delay ? { delay } : undefined}
    >
      {children}
    </motion.div>
  );
}

/** Container that staggers the reveal of its <StaggerItem> children. */
export function Stagger({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      variants={staggerContainer}
      initial="hidden"
      whileInView="show"
      viewport={viewportConfig}
    >
      {children}
    </motion.div>
  );
}

/** Child of <Stagger>; inherits animation state from the parent container. */
export function StaggerItem({
  children,
  className,
  variants = fadeInUp,
}: RevealProps) {
  return (
    <motion.div className={cn(className)} variants={variants}>
      {children}
    </motion.div>
  );
}
