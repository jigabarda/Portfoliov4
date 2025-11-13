"use client";
import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const projectCards = [
  { id: 1, title: "Project One", content: "Project 1", image: "/vercel.svg" },
  { id: 2, title: "Project Two", content: "Project 2", image: "/vercel.svg" },
  { id: 3, title: "Project Three", content: "Project 3", image: "/globe.svg" },
  { id: 4, title: "Project Four", content: "Project 4", image: "/window.svg" },
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
      <div className="xl:mx-40 lg:mx-10">
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
        <h1 className="text-center p-7 font-black text-lg text-white">
          Projects
        </h1>
        <div className="flex flex-col items-center justify-center p-4">
          <div className="flex items-center w-full max-w-md relative md:hidden">
            <div className="relative rounded-xl shadow-lg p-6 text-white flex-1 text-center bg-white/5 min-h-[220px]">
              <motion.div
                key={current}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="w-full flex flex-col items-center justify-center"
              >
                <div className="flex flex-col items-center mb-2">
                  <Image
                    src={projectCards[current].image}
                    alt={projectCards[current].title + " Image"}
                    width={80}
                    height={80}
                    className="mx-auto mb-2 object-contain"
                  />
                </div>
                <div className="text-base font-semibold mb-2">
                  {projectCards[current].content}
                </div>
              </motion.div>
              <div className="absolute left-4 bottom-4 text-sm text-white/80 font-bold tracking-wide">
                {projectCards[current].title}
              </div>
            </div>
          </div>
          <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {projectCards.map((project) => (
              <div
                key={project.id}
                className="relative rounded-xl shadow-lg p-6 text-white text-center bg-white/5 min-h-[220px] flex flex-col items-center"
              >
                <div className="flex flex-col items-center mb-2">
                  <Image
                    src={project.image}
                    alt={project.title + " Image"}
                    width={80}
                    height={80}
                    className="mx-auto mb-2 object-contain"
                  />
                </div>
                <div className="text-base font-semibold mb-2">
                  {project.content}
                </div>
                <div className="absolute left-4 bottom-4 text-sm text-white/80 font-bold tracking-wide">
                  {project.title}
                </div>
              </div>
            ))}
          </div>
          <div className="w-full flex justify-end mt-2">
            <a
              href="#"
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
