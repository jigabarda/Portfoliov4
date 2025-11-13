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

  return (
    <div>
      <h1 className="text-center text-white p-7 font-black text-lg md:text-2xl">
        About Me
      </h1>

      <div className="bg-gradient-to-b from-[#000000] to-[#A30000] md:bg-gradient-to-r w-full">
        {/* Grid Layout */}
        <div
          className="
            grid 
            grid-cols-1 
            md:grid-cols-2 md:grid-rows-2 
            xl:grid-cols-3 xl:grid-rows-1 
            gap-6 
            place-items-center 
            px-6 md:px-20 lg:px-32
          "
        >
          {/* Image Column - Always First */}
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

          {/* Text Column */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left max-w-md gap-4">
            <h2 className="text-xl text-white font-bold md:mt-5">
              James Ivan Gabarda
            </h2>
            <h5 className="text-sm font-semibold text-gray-400 -mt-2 mb-2">
              Web Developer
            </h5>
            <p className="text-justify text-gray-300">
              I’m a Full Stack Developer with a deep passion for building
              dynamic, scalable, and visually appealing web applications. From
              crafting pixel-perfect front-ends with React and Tailwind CSS to
              designing powerful back-end systems using Node.js, Express, and
              MongoDB, I thrive on turning complex problems into clean,
              efficient solutions. Inspired by the sleek and immersive design of
              platforms like Netflix, I focus on delivering high-quality user
              experiences that are fast, accessible, and intuitive across all
              devices.
            </p>
            <div className="pb-5">
              <button className="bg-black/90 p-3 rounded-full text-[10px] px-5 text-white md:bg-[#A30000]/20 md:text-[#A30000]">
                Learn More About Me
              </button>
            </div>
          </div>

          {/* Certificates Section */}
          <div className="flex flex-col items-center justify-center w-full max-w-lg text-center md:col-span-2 xl:col-span-1">
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
        </div>
      </div>

      {/* Modal */}
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
