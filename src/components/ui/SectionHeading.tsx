"use client";
import React from "react";
import { motion } from "framer-motion";
import type { IconType } from "react-icons";
import { fadeInUp, viewportConfig } from "@/lib/motion";
import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  icon?: IconType;
  title: string;
  subtitle?: string;
  center?: boolean;
  className?: string;
};

/**
 * Consistent section header used across every section: an optional brand icon
 * chip, a title, an animated accent underline, and an optional subtitle.
 */
export function SectionHeading({
  icon: Icon,
  title,
  subtitle,
  center = false,
  className,
}: SectionHeadingProps) {
  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      whileInView="show"
      viewport={viewportConfig}
      className={cn(center ? "text-center" : "text-left", className)}
    >
      <div
        className={cn(
          "flex items-center gap-3",
          center && "justify-center"
        )}
      >
        {Icon && (
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#A30000]/20 text-[#A30000]">
            <Icon className="h-5 w-5" />
          </span>
        )}
        <h2 className="text-2xl font-black text-white sm:text-3xl">{title}</h2>
      </div>

      <span
        className={cn(
          "mt-3 block h-1 w-16 rounded-full bg-[#A30000]",
          center && "mx-auto"
        )}
      />

      {subtitle && (
        <p
          className={cn(
            "mt-3 max-w-2xl text-sm text-gray-400 sm:text-base",
            center && "mx-auto"
          )}
        >
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
