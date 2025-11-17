"use client";
import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { HiComputerDesktop } from "react-icons/hi2";

const projectCards = [
  {
    id: 1,
    title: "Mentra ",
    content: "AI Resume Analyzer and Mentorship Platform",
    image: "/images/mentra.png",
  },
  {
    id: 2,
    title: "Learning Management System",
    content: "LMS for Educational Institutions",
    image: "/images/cms.png",
  },
  {
    id: 3,
    title: "E-commerce & M-commerce Platform",
    content: "Online Shopping Web & Mobile App",
    image: "/images/ecom.png",
  },
];

const Projects = () => {
  const [current, setCurrent] = useState(0);
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setCurrent((prev) => (prev + 1) % projectCards.length);
    }, 3000);
    return () => clearTimeout(timer);
  }, [current]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      <div className="xl:mx-50 lg:mx-20">
        <h1 className="text-[#A30000] p-3 flex items-center gap-2 font-black text-lg text-white">
          <HiComputerDesktop className="text-white-500" />
          Projects
        </h1>
        <div className="flex flex-col items-center justify-center p-4">
          <div className="flex items-center w-full max-w-md relative md:hidden">
            <div className="relative rounded-xl shadow-lg p-4 text-white text-center bg-white/5">
              <motion.div
                key={current}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="w-full flex flex-col items-center justify-center"
              >
                <div className="w-full">
                  <Image
                    src={projectCards[current].image}
                    alt={projectCards[current].title + " Image"}
                    width={1200}
                    height={675}
                    className="block w-full h-auto object-cover rounded"
                  />
                </div>
                <div className="mt-3">
                  <div className="text-base font-semibold mb-1">
                    {projectCards[current].title}
                  </div>
                  <div className="text-sm opacity-80">
                    {projectCards[current].content}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
          <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-6 items-stretch w-full">
            {projectCards.map((project) => (
              <div key={project.id} className="h-full">
                <div className="relative h-full rounded-xl shadow-lg text-white bg-white/5 flex flex-col">
                  <div className="w-full">
                    <Image
                      src={project.image}
                      alt={project.title + " Image"}
                      width={1200}
                      height={675}
                      className="block w-full h-auto object-cover rounded-t"
                    />
                  </div>
                  <div className="p-3 mt-0">
                    <div className="text-base font-semibold mb-1">
                      {project.title}
                    </div>
                    <div className="text-xs opacity-80">{project.content}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="w-full flex justify-end mt-2">
            <a
              href="/pages/projects"
              className="text-[#A30000] font-bold text-sm hover:underline transition-all duration-300"
            >
              View All Projects
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Projects;
