import React from "react";
import Image from "next/image";

const About = () => {
  return (
    <div>
      <h1 className="text-center p-7 font-black text-lg text-white">
        About Me
      </h1>
      <div className="flex flex-col items-center w-full gap-4 bg-gradient-to-b from-[#000000] to-[#A30000] lg:flex-row-reverse lg:items-center lg:justify-center lg:bg-gradient-to-r lg:from-[#000000] lg:to-[#A30000]">
        <Image
          src={"/images/profile.jfif"}
          alt="Profile"
          width={300}
          height={128}
          style={{ borderRadius: "1%" }}
        />
        <div className="flex flex-col items-center w-full max-w-xs mx-auto gap-4 lg:items-start lg:text-left lg:max-w-md lg:mr-8">
          <h1 className="text-xl text-white font-bold text-center lg:text-left">
            James Ivan Gabarda
          </h1>
          <h5 className="text-sm font-semibold text-center text-gray-400 -mt-4 mb-2 lg:text-left">
            Web Developer
          </h5>
          <p className="text-center text-justify text-gray-300 mx-3 lg:text-left lg:mx-0">
            I’m a Full Stack Developer with a deep passion for building dynamic,
            scalable, and visually appealing web applications. From crafting
            pixel-perfect front-ends with React and Tailwind CSS to designing
            powerful back-end systems using Node.js, Express, and MongoDB, I
            thrive on turning complex problems into clean, efficient solutions.
            Inspired by the sleek and immersive design of platforms like
            Netflix, I focus on delivering high-quality user experiences that
            are fast, accessible, and intuitive across all devices.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
