"use client";
import React, { useState } from "react";
import Image from "next/image";

const About = () => {
  const [selectedCert, setSelectedCert] = useState<string | null>(null);

  const certificates = [
    {
      title: "React Course Certificate",
      image:
        "https://udemy-certificate.s3.amazonaws.com/image/UC-e38cebd7-e5c9-4c4d-bc92-5e01f8fbdfdf.jpg?v=1733299197000",
      clickable: true,
    },
    {
      title: "Node.js Course Certificate",
      image:
        "https://udemy-certificate.s3.amazonaws.com/image/UC-b3e81ac3-6dff-46df-897e-f833a0f6583e.jpg?v=1736828883000",
      clickable: true,
    },
    {
      title: "Upcoming Certificate",
      image:
        "https://udemy-certificate.s3.amazonaws.com/image/UC-f008d853-c296-4f81-9358-4c9f51df5a01.jpg?v=1755337118000",
      clickable: true,
    },
  ];

  const experiences = [
    {
      year: "2024 - Present",
      role: "Full Stack Developer",
      desc: "Building full stack web applications using React, Node.js, and modern UI/UX principles.",
    },
    {
      year: "2023",
      role: "Front-End Developer Intern",
      desc: "Created responsive and accessible web interfaces and improved performance.",
    },
    {
      year: "2022",
      role: "Freelance Developer",
      desc: "Developed small business websites and e-commerce UI layouts.",
    },
  ];

  return (
    <div className="mx-50">
      <h1 className="text-center text-white p-7 font-black text-lg md:text-2xl">
        About Me
      </h1>

      {/* GRID: 2 COLS × 2 ROWS */}
      <div
        className="
          grid 
          grid-cols-1
          md:grid-cols-2 md:grid-rows-2 
          xl:grid-cols-2 xl:grid-rows-2 
          gap-6 
          place-items-stretch
          px-6 md:px-20 lg:px-32
        "
      >
        {/* IMAGE (Row 1 Col 1) - NO BG */}
        <div className="flex justify-center md:justify-start">
          <Image
            src={"/images/profile.jfif"}
            alt="Profile"
            width={300}
            height={128}
            className="object-cover rounded-b-md"
            style={{ borderBottomLeftRadius: ".5rem" }}
          />
        </div>

        {/* ABOUT TEXT (Row 1 Col 2) */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left gap-4 bg-white/20 p-6 rounded-md w-full h-full max-w-lg">
          <h2 className="text-xl text-white font-bold md:mt-5">
            James Ivan Gabarda
          </h2>
          <h5 className="text-sm font-semibold text-gray-400 -mt-2 mb-2">
            Web Developer
          </h5>
          <p className="text-justify text-gray-300">
            I’m a Full Stack Developer with a deep passion for building dynamic,
            scalable, and visually appealing web applications. From crafting
            pixel-perfect front-ends with React and Tailwind CSS to designing
            powerful back-end systems using Node.js, Express, and MongoDB, I
            thrive on turning complex problems into clean, efficient solutions.
            Inspired by the sleek and immersive design of platforms like
            Netflix, I focus on delivering high-quality user experiences that
            are fast, accessible, and intuitive across all devices.
          </p>
          <div className="pb-5">
            <button className="bg-black/90 p-3 rounded-full text-[10px] px-5 text-white md:bg-[#A30000]/20 md:text-[#A30000]">
              Learn More About Me
            </button>
          </div>
        </div>

        {/* CERTIFICATES (Row 2 Col 1) - MATCH TEXT WIDTH */}
        <div className="flex flex-col items-center justify-center text-center bg-white/20 p-6 rounded-md w-full h-full max-w-lg">
          <h3 className="text-white font-semibold text-lg md:mt-5 mb-2">
            Certificates
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mb-5">
            {certificates.map((cert, idx) => (
              <div
                key={idx}
                className={`relative rounded-lg overflow-hidden shadow-lg ${
                  cert.clickable
                    ? "cursor-pointer hover:scale-105 hover:brightness-110 transition"
                    : "opacity-50 cursor-not-allowed"
                }`}
                onClick={() =>
                  cert.clickable ? setSelectedCert(cert.image) : null
                }
              >
                <Image
                  src={cert.image}
                  alt={cert.title}
                  width={400}
                  height={250}
                  className="w-full h-auto object-contain"
                />
              </div>
            ))}
          </div>
        </div>

        {/* EXPERIENCE TIMELINE (Row 2 Col 2) - MATCH TEXT WIDTH */}
        <div className="flex flex-col items-center text-left text-white bg-white/20 p-6 rounded-md w-full h-full max-w-lg">
          <h3 className="text-white font-semibold text-lg md:mt-5 mb-4 text-center md:text-left">
            Experience Timeline
          </h3>

          <div className="space-y-4 w-full">
            {experiences.map((exp, i) => (
              <div key={i} className="border-l-4 border-[#A30000] pl-4">
                <p className="text-sm text-gray-400">{exp.year}</p>
                <h4 className="font-bold">{exp.role}</h4>
                <p className="text-gray-300 text-sm">{exp.desc}</p>
              </div>
            ))}
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
