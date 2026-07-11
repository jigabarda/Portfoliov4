"use client";
import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiComputerDesktop,
  HiPhoto,
  HiArrowTopRightOnSquare,
} from "react-icons/hi2";
import { FaArrowRight, FaGithub } from "react-icons/fa6";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Stagger, StaggerItem } from "@/components/ui/Reveal";
import { cardClass } from "@/lib/utils";

const GITHUB = "https://github.com/jigabarda";

// Number of projects shown up front; the rest live behind "View More".
const FEATURED_COUNT = 3;

type ProjectCard = {
  id: number;
  title: string;
  content: string;
  /** Short label shown in the corner, e.g. "Nov 2025". */
  date: string;
  /** A few key technologies rendered as badges. */
  tech: string[];
  /** Source repository (used as the "Code" link). */
  repo: string;
  /** Optional live/deployed URL. When set, a "Live Demo" link is shown. */
  demo?: string;
  /** Screenshot path under /public. Falls back to a placeholder when absent. */
  image?: string;
};

// Ordered newest-first by when each project was built.
const projectCards: ProjectCard[] = [
  {
    id: 1,
    title: "Sellora (Web & Mobile)",
    content:
      "Sales & inventory management platform with analytics, PDF reports, and Supabase auth — plus a companion mobile app.",
    date: "2026",
    tech: ["Next.js", "Supabase", "React Native", "Recharts"],
    repo: "https://github.com/jigabarda/SalesManagementSystem",
  },
  {
    id: 2,
    title: "Broadcast Management System",
    content:
      "Full-stack real-time broadcast system — Rails API, Next.js dashboard, and a React Native app with push notifications.",
    date: "Dec 2025",
    tech: ["Rails", "Next.js", "React Native", "PostgreSQL"],
    repo: "https://github.com/jigabarda/BMS-Web",
  },
  {
    id: 3,
    title: "Mentra",
    content: "AI resume analyzer and mentorship platform.",
    date: "Oct 2025",
    tech: ["Next.js", "OpenAI", "Supabase", "Drizzle"],
    repo: "https://github.com/jigabarda/Mentra",
    image: "/images/mentra.png",
  },
  {
    id: 4,
    title: "Learning Management System",
    content: "LMS for educational institutions.",
    date: "Oct 2025",
    tech: ["Next.js", "Supabase", "Tailwind"],
    repo: "https://github.com/jigabarda/LeaningManagementSystem",
    image: "/images/cms.png",
  },
  {
    id: 5,
    title: "Resort Reservation App",
    content:
      "Mobile booking app for resort reservations with maps, geolocation, and place search.",
    date: "Jul 2025",
    tech: ["React Native", "Expo", "Google Maps"],
    repo: "https://github.com/jigabarda/ResortReservationApp",
  },
  {
    id: 6,
    title: "E-commerce & M-commerce Platform",
    content: "Online shopping web & mobile app.",
    date: "Jul 2025",
    tech: ["React Native", "Expo", "Firebase"],
    repo: "https://github.com/jigabarda/EcommerceApp",
    image: "/images/ecom.png",
  },
  {
    id: 7,
    title: "ProLock",
    content:
      "Python-based NFC/RFID smart lock and access-control system for secure entry management.",
    date: "Sep 2024",
    tech: ["Python", "NFC / RFID"],
    repo: "https://github.com/jigabarda/ProLockv5",
  },
];

/** Renders a project's screenshot, or a styled placeholder until one is added.
 * Every card gets an identical 16:9 media box so the grid stays even; images
 * fill it with object-cover (anchored to the top so page headers stay visible). */
const ProjectMedia = ({
  project,
  className = "",
}: {
  project: ProjectCard;
  className?: string;
}) => (
  <div className="relative aspect-video w-full overflow-hidden bg-white/[0.03]">
    {project.image ? (
      <Image
        src={project.image}
        alt={project.title + " screenshot"}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className={`object-cover object-top ${className}`}
      />
    ) : (
      <div
        className={`flex h-full w-full flex-col items-center justify-center gap-2 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.06)_1px,transparent_0)] bg-[size:18px_18px] text-white/40 ${className}`}
      >
        <HiPhoto className="h-8 w-8" />
        <span className="text-[11px] font-medium uppercase tracking-wider">
          Preview coming soon
        </span>
      </div>
    )}
  </div>
);

/** Small tech-stack badges. */
const TechBadges = ({
  tech,
  className = "",
}: {
  tech: string[];
  className?: string;
}) => (
  <div className={`flex flex-wrap gap-1.5 ${className}`}>
    {tech.map((t) => (
      <span
        key={t}
        className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-medium text-white/60"
      >
        {t}
      </span>
    ))}
  </div>
);

/** A clickable project card. The whole tile opens the detail modal. */
const ProjectTile = ({
  project,
  onOpen,
}: {
  project: ProjectCard;
  onOpen: (p: ProjectCard) => void;
}) => (
  <button
    type="button"
    onClick={() => onOpen(project)}
    aria-label={`View ${project.title}`}
    className={`${cardClass} group h-full w-full text-left text-white flex flex-col overflow-hidden cursor-pointer`}
  >
    <div className="w-full overflow-hidden">
      <ProjectMedia
        project={project}
        className="transition-transform duration-500 group-hover:scale-105"
      />
    </div>
    <div className="flex flex-1 flex-col p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1 truncate text-base font-semibold transition-colors group-hover:text-[#ff5a5a]">
          {project.title}
        </div>
        <span className="shrink-0 pt-0.5 text-[11px] text-white/40">
          {project.date}
        </span>
      </div>
      <div className="mt-1 text-xs opacity-80 line-clamp-2">
        {project.content}
      </div>
      <TechBadges tech={project.tech} className="mt-3" />
    </div>
  </button>
);

const Projects = () => {
  const [current, setCurrent] = useState(0);
  const [showAll, setShowAll] = useState(false);
  const [selected, setSelected] = useState<ProjectCard | null>(null);

  const featured = projectCards.slice(0, FEATURED_COUNT);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setCurrent((prev) => (prev + 1) % featured.length);
    }, 3000);
    return () => clearTimeout(timer);
  }, [current, featured.length]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <SectionHeading
        icon={HiComputerDesktop}
        title="Projects"
        subtitle="A selection of things I've designed and built recently."
        className="mb-8"
      />

      <div className="flex flex-col items-center justify-center">
        {/* Mobile carousel (featured only) */}
        <div className="flex items-center w-full max-w-md relative md:hidden">
          <div className={`${cardClass} p-4 text-white text-center w-full`}>
            <motion.button
              type="button"
              onClick={() => setSelected(featured[current])}
              key={current}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="w-full flex flex-col items-center justify-center cursor-pointer"
              aria-label={`View ${featured[current].title}`}
            >
              <div className="w-full overflow-hidden rounded">
                <ProjectMedia project={featured[current]} className="rounded" />
              </div>
              <div className="mt-3 w-full">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-base font-semibold">
                    {featured[current].title}
                  </span>
                  <span className="text-[11px] text-white/40">
                    {featured[current].date}
                  </span>
                </div>
                <div className="text-sm opacity-80 mt-1">
                  {featured[current].content}
                </div>
                <TechBadges
                  tech={featured[current].tech}
                  className="justify-center mt-3"
                />
              </div>
            </motion.button>

            {/* Carousel dots */}
            <div className="flex justify-center gap-2 mt-4">
              {featured.map((p, i) => (
                <button
                  key={p.id}
                  aria-label={`Show ${p.title}`}
                  onClick={() => setCurrent(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    current === i ? "w-5 bg-[#A30000]" : "w-2 bg-white/30"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Desktop / tablet grid (featured only) */}
        <Stagger className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-6 items-stretch w-full">
          {featured.map((project) => (
            <StaggerItem key={project.id} className="h-full">
              <ProjectTile project={project} onOpen={setSelected} />
            </StaggerItem>
          ))}
        </Stagger>

        {/* View more */}
        <div className="w-full flex justify-center mt-8">
          <button
            type="button"
            onClick={() => setShowAll(true)}
            className="group inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-2 text-sm font-semibold text-white transition-all duration-300 hover:border-[#A30000] hover:bg-white/10"
          >
            View More Projects
            <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>
      </div>

      {/* ALL PROJECTS GALLERY MODAL */}
      <AnimatePresence>
        {showAll && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center bg-black/80 p-4 backdrop-blur-sm sm:items-center"
            onClick={() => setShowAll(false)}
            role="dialog"
            aria-modal="true"
            aria-label="All projects"
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 20 }}
              transition={{ duration: 0.25 }}
              className="relative flex max-h-[88vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0B0B0B] shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-white/10 p-5">
                <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
                  <HiComputerDesktop />
                  All Projects
                </h3>
                <button
                  onClick={() => setShowAll(false)}
                  aria-label="Close projects"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-[#A30000]"
                >
                  ✕
                </button>
              </div>

              <div className="grid gap-5 overflow-y-auto p-5 sm:grid-cols-2 lg:grid-cols-3">
                {projectCards.map((project) => (
                  <ProjectTile
                    key={project.id}
                    project={project}
                    onOpen={setSelected}
                  />
                ))}
              </div>

              <div className="flex justify-center border-t border-white/10 p-4">
                <a
                  href={GITHUB}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 text-sm font-bold text-[#A30000] transition-all duration-300 hover:gap-3"
                >
                  View all on GitHub
                  <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PROJECT DETAIL MODAL */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-start justify-center bg-black/85 p-4 backdrop-blur-sm sm:items-center"
            onClick={() => setSelected(null)}
            role="dialog"
            aria-modal="true"
            aria-label={selected.title}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 20 }}
              transition={{ duration: 0.25 }}
              className="relative max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/10 bg-[#0B0B0B] shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelected(null)}
                aria-label="Close project"
                className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-[#A30000]"
              >
                ✕
              </button>

              <ProjectMedia project={selected} />

              <div className="p-6">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-xl font-bold text-white">
                    {selected.title}
                  </h3>
                  <span className="shrink-0 pt-1 text-xs text-white/40">
                    {selected.date}
                  </span>
                </div>

                <p className="mt-3 text-sm leading-relaxed text-gray-300">
                  {selected.content}
                </p>

                <TechBadges tech={selected.tech} className="mt-4" />

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  {selected.demo && (
                    <a
                      href={selected.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full bg-[#A30000] px-5 py-2 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#870000] hover:shadow-lg hover:shadow-[#A30000]/30"
                    >
                      <HiArrowTopRightOnSquare className="h-4 w-4" />
                      Live Demo
                    </a>
                  )}
                  <a
                    href={selected.repo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-2 text-sm font-semibold text-white transition-all duration-300 hover:border-white hover:bg-white/10"
                  >
                    <FaGithub className="h-4 w-4" />
                    View Code
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Projects;
