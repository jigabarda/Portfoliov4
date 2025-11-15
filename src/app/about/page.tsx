"use client";
import React, { useState } from "react";
import Image from "next/image";
import { FaMapMarkerAlt, FaCalendar, FaEnvelope } from "react-icons/fa";

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
      year: "Appnado IT Solutions June 2025 - Present",
      role: "Full Stack Developer",
    },
    {
      year: "Pru Life UK March 2025 - June 2025",
      role: "Full Stack Web Developer Intern",
    },
    {
      year: "Self Employed November 2023 - May 2025",
      role: "Freelance Developer",
    },
  ];

  const techStack = {
    Frontend: ["React", "Next.js", "Tailwind CSS", "TypeScript"],
    Backend: ["Node.js", "Express", "MongoDB", "Supabase"],
  };

  return (
    <div className="mx-6 lg:mx-20 xl:mx-50 2xl:mx-100">
      <h1 className="text-center text-white p-4 font-black text-lg md:text-2xl">
        About Me
      </h1>

      {/* GRID FOR LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 auto-rows-auto items-stretch">
        {/* ROW 1: PROFILE */}
        <div className="bg-white/5 rounded-md flex justify-center items-center lg:col-span-1">
          <Image
            src="/images/profile2.jpg"
            alt="Profile"
            width={300}
            height={300}
            className="rounded-md object-contain w-auto h-auto"
          />
        </div>

        {/* BASIC INFO */}
        <div className="bg-white/5 p-4 rounded-md flex flex-col gap-3 lg:col-span-2">
          {/* Name with icon */}
          <div className="flex items-center gap-2">
            <h2 className="text-xl text-white font-bold">James Ivan Gabarda</h2>
            <Image
              src="https://cdn-icons-png.flaticon.com/512/7641/7641727.png"
              alt="Icon"
              width={15}
              height={15}
            />
          </div>

          <h4 className="text-sm text-gray-400">
            Full Stack Developer | Freelancer
          </h4>

          <p className="text-gray-300 text-sm flex items-center gap-2">
            <FaMapMarkerAlt className="text-white-500" />
            Metro Manila, Philippines
          </p>

          <div className="flex gap-3 mt-3 text-sm">
            <button className="bg-blue-500/20 text-blue-500 flex px-3 py-2 items-center gap-2 rounded-md">
              <FaCalendar className="text-white-500" />
              Schedule Meeting
            </button>
            <button className="bg-white/10 text-white flex px-3 py-2 items-center gap-2 rounded-md">
              <FaEnvelope className="text-white-500" />
              Send Email
            </button>
          </div>
        </div>

        {/* ROW 2: ABOUT ME (col-span-2) */}
        <div className="bg-white/5 p-4 rounded-md lg:col-span-2">
          <h3 className="text-white font-semibold text-lg mb-3">About Me</h3>
          <p className="text-gray-300 text-sm text-justify">
            I’m a Full Stack Developer with a deep passion for creating scalable
            and immersive digital experiences. I focus on clean architecture,
            accessibility, performance, and seamless UI/UX across devices.
          </p>
        </div>

        {/* ROW 2: EXPERIENCE TIMELINE (col-span-1) */}
        <div className="bg-white/5 p-4 rounded-md">
          <h3 className="text-white font-semibold text-md mb-4">
            Experience Timeline
          </h3>
          <div className="space-y-4">
            {experiences.map((exp, i) => (
              <div key={i} className="border-l-4 border-[#A30000] pl-4">
                <p className="text-xs text-gray-400">{exp.year}</p>
                <h4 className="font-bold text-sm text-white">{exp.role}</h4>
              </div>
            ))}
          </div>
        </div>

        {/* ROW 3: TECH STACK (col-span-1) */}
        <div className="bg-white/5 p-4 rounded-md lg:col-span-1">
          <h3 className="text-white font-semibold text-lg mb-2">Tech Stack</h3>
          {Object.entries(techStack).map(([category, items], idx) => (
            <div key={idx} className="mb-4">
              <h4 className="text-white font-bold mb-2">{category}</h4>
              <div className="flex flex-wrap gap-2">
                {items.map((t, i) => (
                  <span
                    key={i}
                    className={`px-3 py-1 text-xs rounded-full ${
                      category === "Frontend"
                        ? "bg-green-500/20 text-green-500"
                        : category === "Backend"
                        ? "bg-red-500/20 text-red-500"
                        : "bg-white/20 border-white/30"
                    }`}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* ROW 3: CERTIFICATES (col-span-2) */}
        <div className="bg-white/5 p-4 rounded-md lg:col-span-2">
          <h3 className="text-white font-semibold text-lg mb-4">
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
  );
};

export default About;
