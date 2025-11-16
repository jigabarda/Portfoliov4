"use client";
import React, { useState } from "react";
import Image from "next/image";
import { FaRegCalendar, FaRegEnvelope, FaArrowRight } from "react-icons/fa6";
import { motion } from "framer-motion";
import {
  HiOutlineMapPin,
  HiOutlineBriefcase,
  HiOutlineBeaker,
  HiOutlineBookOpen,
} from "react-icons/hi2";

const About = () => {
  const [selectedCert, setSelectedCert] = useState<string | null>(null);

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

  const techStack = {
    Frontend: ["React", "Next.js", "Tailwind CSS", "TypeScript", "Bootstrap"],
    Backend: ["Node.js", "Express", "MongoDB", "Supabase", "Firebase"],
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      <div className="mx-6 lg:mx-20 xl:mx-50 2xl:mx-100">
        <div className="absolute left-0 w-full overflow-hidden leading-[0]">
          <svg
            className="relative block w-[calc(109%+1.3px)] h-[46px]"
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39
                   C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35
                   A600.21,600.21,0,0,0,321.39,56.44Z"
              className="fill-[#A30000]"
            ></path>
          </svg>
        </div>

        {/* GRID LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 auto-rows-auto items-stretch">
          {/* ROW 1: PROFILE */}
          <div className="bg-white/5 rounded-md flex justify-center items-center lg:col-span-1 mt-20">
            <Image
              src="/images/profile2.jpg"
              alt="Profile"
              width={300}
              height={300}
              className="rounded-md object-contain w-auto h-auto"
            />
          </div>

          {/* BASIC INFO */}
          <div className="bg-white/5 p-6 rounded-md flex flex-col gap-3 lg:col-span-2 mt-20">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl text-white font-bold">
                James Ivan Gabarda
              </h2>
              <Image
                src="https://cdn-icons-png.flaticon.com/512/7641/7641727.png"
                alt="Icon"
                width={15}
                height={15}
              />
            </div>

            <p className="text-gray-300 text-sm flex items-center gap-2">
              <HiOutlineMapPin className="text-white-500" />
              Metro Manila, Philippines
            </p>

            <h4 className="text-md font-semibold text-white">
              Full Stack Developer | Freelancer
            </h4>

            <div className="flex gap-3 mt-3 text-sm">
              <button className="bg-blue-500/20 text-blue-500 flex px-3 py-2 items-center gap-2 rounded-md">
                <FaRegCalendar />
                Schedule Meeting
                <FaArrowRight />
              </button>
              <button className="bg-white/10 text-white flex px-3 py-2 items-center gap-2 rounded-md">
                <FaRegEnvelope />
                Send Email
              </button>
            </div>
          </div>

          {/* ABOUT ME */}
          <div className="bg-white/5 p-6 rounded-md lg:col-span-2">
            <h3 className="text-white font-semibold flex items-center gap-2 text-lg mb-3">
              <HiOutlineBriefcase />
              About
            </h3>

            <p className="text-gray-300 text-sm text-justify">
              I’m a Full Stack Developer experienced in building modern web and
              mobile applications using React, Next.js, Tailwind CSS, Node.js,
              MySQL, and MongoDB. I work on developing scalable interfaces,
              implementing backend logic and RESTful APIs, and integrating
              third-party services for efficient and data-driven solutions. My
              background includes freelance full-stack projects, React Native
              mobile development with Firebase, and backend feature development
              during my internship. <br /> <br />I focus on clean architecture,
              maintainable code, and performance optimization. Currently, I’m
              expanding my expertise in Python-based backend development and
              deepening my skills in MongoDB, while also exploring Web3 and AI
              development to build smarter, future-ready applications.
            </p>
          </div>

          {/* EXPERIENCE */}
          <div className="bg-white/5 p-6 rounded-md">
            <h3 className="text-white font-semibold text-md mb-4 flex items-center gap-2">
              <HiOutlineBriefcase />
              Experience Timeline
            </h3>

            <div className="space-y-4">
              {experiences.map((exp, i) => (
                <div key={i} className="border-l-4 border-[#A30000] pl-4">
                  <p className="text-sm font-bold text-white">{exp.role}</p>
                  <h4 className="text-xs text-gray-400">{exp.year}</h4>
                </div>
              ))}
            </div>
          </div>

          {/* TECH STACK */}
          <div className="bg-white/5 p-6 rounded-md lg:col-span-1">
            <h3 className="text-white font-semibold text-lg flex items-center gap-2 mb-2">
              <HiOutlineBeaker />
              Tech Stack
            </h3>

            {Object.entries(techStack).map(([category, items], idx) => (
              <div key={idx} className="mb-2">
                <h4 className="text-white font-bold mb-2">{category}</h4>
                <div className="flex flex-wrap gap-2">
                  {items.map((t, i) => (
                    <span
                      key={i}
                      className={`px-3 py-1 text-xs rounded-full ${
                        category === "Frontend"
                          ? "bg-green-500/20 text-green-500"
                          : "bg-red-500/20 text-red-500"
                      }`}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* CERTIFICATES */}
          <div className="bg-white/5 p-6 rounded-md lg:col-span-2">
            <h3 className="text-white font-semibold flex items-center gap-2 text-lg mb-4">
              <HiOutlineBookOpen />
              Certificates
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {certificates.map((cert, idx) => (
                <div
                  key={idx}
                  className="relative rounded-lg overflow-hidden shadow-lg cursor-pointer hover:scale-105 transition"
                  onClick={() => setSelectedCert(cert.image)}
                >
                  <Image
                    src={cert.image}
                    alt={cert.title}
                    width={400}
                    height={250}
                    className="w-full h-auto object-contain rounded"
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-center mt-4">
              <a
                href="/pages/certificates"
                className="text-white bg-[#A30000]/30 px-4 py-2 rounded-full text-sm hover:bg-[#A30000]/50 transition"
              >
                View More
              </a>
            </div>
          </div>
        </div>

        {/* MODAL */}
        {selectedCert && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="relative max-w-3xl w-full">
              <button
                onClick={() => setSelectedCert(null)}
                className="absolute top-2 right-2 bg-white rounded-full px-3 py-1 text-black font-bold shadow"
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
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default About;
