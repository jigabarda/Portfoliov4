"use client";
import React, { useState } from "react";
import Image from "next/image";
import { FaRegCalendar, FaRegEnvelope, FaArrowRight } from "react-icons/fa6";
import { AnimatePresence, motion } from "framer-motion";
import {
  HiOutlineMapPin,
  HiOutlineBriefcase,
  HiOutlineBeaker,
  HiOutlineBookOpen,
  HiOutlineUser,
} from "react-icons/hi2";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Stagger, StaggerItem } from "@/components/ui/Reveal";
import { cardClass, pillGhost } from "@/lib/utils";

const EMAIL = "jagabarda8@gmail.com";
const LINKEDIN = "https://www.linkedin.com/in/james-ivan-gabarda/";

const TECH_STACK: Record<string, string[]> = {
  Frontend: [
    "React",
    "Next.js",
    "Tailwind CSS",
    "TypeScript",
    "JavaScript",
    "Bootstrap",
  ],
  Backend: [
    "Node.js",
    "Express",
    "Rails",
    "Go",
    "PostgreSQL",
    "MongoDB",
    "Supabase",
    "Firebase",
  ],
  Mobile: ["Flutter", "React Native", "Dart"],
  "DevOps & Cloud": ["Docker", "AWS"],
};

const BADGE_COLORS: Record<string, string> = {
  Frontend: "bg-green-500/20 text-green-500",
  Backend: "bg-red-500/20 text-red-500",
  Mobile: "bg-blue-500/20 text-blue-400",
  "DevOps & Cloud": "bg-amber-500/20 text-amber-400",
};

// Categories shown directly on the card; the rest live behind "See more".
const INLINE_CATEGORIES = ["Frontend", "Backend"];

const TechGroup = ({
  category,
  items,
}: {
  category: string;
  items: string[];
}) => (
  <div className="mb-2">
    <h4 className="text-white font-bold mb-2">{category}</h4>
    <div className="flex flex-wrap gap-2">
      {items.map((t, i) => (
        <span
          key={i}
          className={`px-3 py-1 text-xs rounded-full transition-transform duration-300 hover:scale-105 ${
            BADGE_COLORS[category] ?? "bg-white/10 text-white"
          }`}
        >
          {t}
        </span>
      ))}
    </div>
  </div>
);

const About = () => {
  const [selectedCert, setSelectedCert] = useState<string | null>(null);
  const [showAllStack, setShowAllStack] = useState(false);

  const certificates = [
    {
      title: "React Course Certificate",
      image:
        "https://udemy-certificate.s3.amazonaws.com/image/UC-e38cebd7-e5c9-4c4d-bc92-5e01f8fbdfdf.jpg?v=1733299197000",
    },
    {
      title: "Node.js Course Certificate",
      image:
        "https://udemy-certificate.s3.amazonaws.com/image/UC-b3e81ac3-6dff-46df-897e-f833a0f6583e.jpg?v=1736828883000",
    },
    {
      title: "Upcoming Certificate",
      image:
        "https://udemy-certificate.s3.amazonaws.com/image/UC-f008d853-c296-4f81-9358-4c9f51df5a01.jpg?v=1755337118000",
    },
  ];

  const experiences = [
    {
      year: "LEAD Management Pte Ltd | December 2025 - Present",
      role: "Software Engineer",
    },
    {
      year: "Appnado IT Solutions | June 2025 - Present",
      role: "Full Stack Developer",
    },
    {
      year: "Pru Life UK | March 2025 - June 2025",
      role: "Full Stack Web Developer Intern",
    },
    {
      year: "Self Employed November | 2023 - May 2025",
      role: "Freelance Developer",
    },
    {
      year: "Wrote my first line of code | September 2019",
      role: "Hello World! 👋🏻",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <SectionHeading
        icon={HiOutlineUser}
        title="About Me"
        subtitle="A quick look at who I am, what I build, and the tools I reach for."
        className="mb-8"
      />

      {/* BENTO GRID */}
      <Stagger className="grid grid-cols-1 lg:grid-cols-3 gap-4 auto-rows-auto items-stretch">
        {/* PROFILE */}
        <StaggerItem className="lg:col-span-1">
          <div
            className={`${cardClass} relative h-64 sm:h-80 lg:h-full lg:min-h-[300px] overflow-hidden`}
          >
            <Image
              src="/images/profile2.jpg"
              alt="Portrait of James Ivan Gabarda"
              fill
              sizes="(max-width: 1024px) 100vw, 33vw"
              className="object-cover"
            />
          </div>
        </StaggerItem>

        {/* BASIC INFO */}
        <StaggerItem className="lg:col-span-2">
          <div
            className={`${cardClass} h-full p-5 sm:p-6 flex flex-col gap-3`}
          >
            <div className="flex items-center gap-2">
              <h3 className="text-xl sm:text-2xl text-white font-bold">
                James Ivan Gabarda
              </h3>
              <Image
                src="https://cdn-icons-png.flaticon.com/512/7641/7641727.png"
                alt="Verified"
                width={15}
                height={15}
              />
            </div>

            <p className="text-gray-300 text-sm flex items-center gap-2">
              <HiOutlineMapPin className="shrink-0" />
              Metro Manila, Philippines
            </p>

            <h4 className="text-md font-semibold text-white">
              Full Stack Developer | Freelancer
            </h4>

            <div className="flex flex-wrap gap-2 text-sm">
              <a
                href={LINKEDIN}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-all duration-300 hover:-translate-y-0.5 flex px-3 py-2 items-center gap-2 rounded-md"
              >
                <FaRegCalendar />
                Schedule Meeting
                <FaArrowRight />
              </a>
              <a
                href={`mailto:${EMAIL}`}
                className="bg-white/10 text-white hover:bg-white/20 transition-all duration-300 hover:-translate-y-0.5 flex px-3 py-2 items-center gap-2 rounded-md"
              >
                <FaRegEnvelope />
                Send Email
              </a>
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-between gap-2 sm:items-stretch">
              <div className="bg-white/5 border border-white/10 p-4 rounded-md sm:w-2/3">
                <p className="text-white text-xs leading-relaxed">
                  <span className="font-bold text-[#A30000]">
                    Currently learning:
                  </span>{" "}
                  Web3, AI development
                  <br />
                  <span className="font-bold text-[#A30000]">Building: </span>
                  Personal AI assistant with Node.js <br />
                  <span className="font-bold text-[#A30000]">Exploring: </span>
                  Performance-driven UI architecture
                </p>
              </div>
              <div className="text-white bg-white/5 border border-white/10 p-4 rounded-md sm:w-1/3 flex flex-col justify-center">
                <h4 className="font-bold text-xl text-[#A30000]">10+</h4>
                <p className="text-xs">Projects Completed</p>
              </div>
            </div>
          </div>
        </StaggerItem>

        {/* ABOUT ME TEXT */}
        <StaggerItem className="lg:col-span-2">
          <div className={`${cardClass} h-full p-5 sm:p-6`}>
            <h3 className="text-white font-semibold flex items-center gap-2 text-lg mb-3">
              <HiOutlineBriefcase />
              About
            </h3>

            <p className="text-gray-300 text-sm text-justify leading-relaxed">
              I&rsquo;m a Full Stack Developer experienced in building modern web
              and mobile applications using React, Next.js, Tailwind CSS,
              Node.js, MySQL, and MongoDB. I work on developing scalable
              interfaces, implementing backend logic and RESTful APIs, and
              integrating third-party services for efficient and data-driven
              solutions. My background includes freelance full-stack projects,
              React Native mobile development with Firebase, and backend feature
              development during my internship. <br /> <br />I focus on clean
              architecture, maintainable code, and performance optimization.
              Currently, I&rsquo;m expanding my expertise in Python-based backend
              development and deepening my skills in MongoDB, while also
              exploring Web3 and AI development to build smarter, future-ready
              applications.
            </p>
          </div>
        </StaggerItem>

        {/* EXPERIENCE */}
        <StaggerItem className="lg:col-span-1">
          <div className={`${cardClass} h-full p-5 sm:p-6`}>
            <h3 className="text-white font-semibold text-md mb-4 flex items-center gap-2">
              <HiOutlineBriefcase />
              Experience Timeline
            </h3>

            <div className="space-y-4">
              {experiences.map((exp, i) => (
                <div
                  key={i}
                  className="border-l-4 border-[#A30000] pl-4 transition-all duration-300 hover:pl-5"
                >
                  <p className="text-sm font-bold text-white">{exp.role}</p>
                  <h4 className="text-xs text-gray-400">{exp.year}</h4>
                </div>
              ))}
            </div>
          </div>
        </StaggerItem>

        {/* TECH STACK */}
        <StaggerItem className="lg:col-span-1">
          <div className={`${cardClass} h-full p-5 sm:p-6`}>
            <h3 className="text-white font-semibold text-lg flex items-center gap-2 mb-2">
              <HiOutlineBeaker />
              Tech Stack
            </h3>

            {INLINE_CATEGORIES.map((category) => (
              <TechGroup
                key={category}
                category={category}
                items={TECH_STACK[category]}
              />
            ))}

            <button
              type="button"
              onClick={() => setShowAllStack(true)}
              className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[#A30000] transition-all duration-300 hover:gap-2"
            >
              View more
              <FaArrowRight className="h-3 w-3" />
            </button>
          </div>
        </StaggerItem>

        {/* CERTIFICATES */}
        <StaggerItem className="lg:col-span-2">
          <div className={`${cardClass} h-full p-5 sm:p-6`}>
            <h3 className="text-white font-semibold flex items-center gap-2 text-lg mb-4">
              <HiOutlineBookOpen />
              Certificates
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {certificates.map((cert, idx) => (
                <button
                  key={idx}
                  type="button"
                  aria-label={`View ${cert.title}`}
                  className="group relative rounded-lg overflow-hidden shadow-lg cursor-pointer border border-white/10 transition-all duration-300 hover:border-[#A30000]/50"
                  onClick={() => setSelectedCert(cert.image)}
                >
                  <Image
                    src={cert.image}
                    alt={cert.title}
                    width={400}
                    height={250}
                    className="w-full h-auto object-contain rounded transition-transform duration-500 group-hover:scale-105"
                  />
                </button>
              ))}
            </div>

            <div className="flex justify-center mt-4">
              <a
                href={LINKEDIN}
                target="_blank"
                rel="noopener noreferrer"
                className={pillGhost}
              >
                View More
              </a>
            </div>
          </div>
        </StaggerItem>
      </Stagger>

      {/* MODAL */}
      <AnimatePresence>
        {selectedCert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedCert(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-3xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedCert(null)}
                aria-label="Close certificate preview"
                className="absolute top-2 right-2 bg-white rounded-full px-3 py-1 text-black font-bold shadow transition hover:bg-[#A30000] hover:text-white"
              >
                ✕
              </button>

              <Image
                src={selectedCert}
                alt="Certificate"
                width={1000}
                height={700}
                className="w-full h-auto rounded-lg object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FULL TECH STACK MODAL */}
      <AnimatePresence>
        {showAllStack && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowAllStack(false)}
            role="dialog"
            aria-modal="true"
            aria-label="Full tech stack"
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 20 }}
              transition={{ duration: 0.25 }}
              className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-2xl border border-white/10 bg-[#0B0B0B] p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold text-lg flex items-center gap-2">
                  <HiOutlineBeaker />
                  Tech Stack
                </h3>
                <button
                  onClick={() => setShowAllStack(false)}
                  aria-label="Close tech stack"
                  className="rounded-full bg-white/10 w-8 h-8 flex items-center justify-center text-white transition hover:bg-[#A30000]"
                >
                  ✕
                </button>
              </div>

              {Object.entries(TECH_STACK).map(([category, items]) => (
                <TechGroup key={category} category={category} items={items} />
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default About;
