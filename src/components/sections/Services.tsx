"use client";
import React from "react";
import {
  HiOutlineCodeBracket,
  HiOutlineDevicePhoneMobile,
  HiOutlinePaintBrush,
  HiOutlineServerStack,
  HiOutlineRocketLaunch,
  HiOutlineWrenchScrewdriver,
  HiOutlineSquares2X2,
} from "react-icons/hi2";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Stagger, StaggerItem } from "@/components/ui/Reveal";
import { cardClass } from "@/lib/utils";

const SERVICES = [
  {
    icon: HiOutlineCodeBracket,
    title: "Web Development",
    desc: "Modern, responsive websites and web apps built with React, Next.js, and Tailwind CSS.",
  },
  {
    icon: HiOutlineServerStack,
    title: "Backend & APIs",
    desc: "Scalable REST APIs and server logic with Node.js, Express, MongoDB, and SQL.",
  },
  {
    icon: HiOutlineDevicePhoneMobile,
    title: "Mobile Development",
    desc: "Cross-platform mobile apps with React Native and Firebase integration.",
  },
  {
    icon: HiOutlinePaintBrush,
    title: "UI/UX Design",
    desc: "Clean, accessible interfaces designed with usability and performance in mind.",
  },
  {
    icon: HiOutlineRocketLaunch,
    title: "Deployment",
    desc: "CI/CD, hosting, and optimization on Vercel, Netlify, and cloud platforms.",
  },
  {
    icon: HiOutlineWrenchScrewdriver,
    title: "Maintenance",
    desc: "Ongoing support, bug fixes, refactoring, and performance improvements.",
  },
];

const Services = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <SectionHeading
        icon={HiOutlineSquares2X2}
        title="Services"
        subtitle="End-to-end development services to bring your ideas from concept to production."
        center
        className="mb-10"
      />

      <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {SERVICES.map(({ icon: Icon, title, desc }) => (
          <StaggerItem key={title}>
            <div className={`${cardClass} group h-full p-6`}>
              <div className="w-12 h-12 rounded-lg bg-[#A30000]/20 text-[#A30000] flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">{title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
            </div>
          </StaggerItem>
        ))}
      </Stagger>
    </div>
  );
};

export default Services;
