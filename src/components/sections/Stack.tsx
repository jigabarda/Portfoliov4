"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { HiOutlineBeaker } from "react-icons/hi2";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

const WHITE_BG_SVGS = [
  "https://www.svgrepo.com/show/376337/node-js.svg",
  "https://www.svgrepo.com/show/354512/vercel.svg",
  "https://www.svgrepo.com/show/473592/dotnet.svg",
  "https://www.svgrepo.com/show/512317/github-142.svg",
  "https://www.svgrepo.com/show/303232/mongodb-logo.svg",
  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg",
  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
];

const StackIcon = ({ src }: { src: string }) => (
  <span
    className={`inline-flex rounded transition-transform duration-300 hover:scale-125 ${
      WHITE_BG_SVGS.includes(src) ? "bg-white p-1" : ""
    }`}
  >
    <Image
      src={src}
      alt="stack icon"
      width={48}
      height={48}
      className="h-9 w-9 sm:h-12 sm:w-12 object-contain select-none"
      draggable={false}
    />
  </span>
);

const img1 = [
  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
  "https://www.svgrepo.com/show/374167/vite.svg",
  "https://www.svgrepo.com/show/354431/tailwindcss-icon.svg",
  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg",
  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
  "https://www.svgrepo.com/show/354512/vercel.svg",
  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/netlify/netlify-original.svg",
  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
  "https://www.svgrepo.com/show/376337/node-js.svg",
  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
  "https://www.svgrepo.com/show/512317/github-142.svg",
  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bitbucket/bitbucket-original.svg",
  "https://www.svgrepo.com/show/331760/sql-database-generic.svg",
  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg",
  "https://www.svgrepo.com/show/473592/dotnet.svg",
  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/npm/npm-original-wordmark.svg",
  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postman/postman-original.svg",
  "https://www.svgrepo.com/show/353622/c-sharp.svg",
  "https://www.svgrepo.com/show/303232/mongodb-logo.svg",
  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg",
  "https://www.svgrepo.com/show/452091/python.svg",
  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg",
  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/rails/rails-plain-wordmark.svg",
  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original-wordmark.svg",
  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg",
  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dart/dart-original.svg",
];

const img2 = [
  "https://www.svgrepo.com/show/512317/github-142.svg",
  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bitbucket/bitbucket-original.svg",
  "https://www.svgrepo.com/show/331760/sql-database-generic.svg",
  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg",
  "https://www.svgrepo.com/show/473592/dotnet.svg",
  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/npm/npm-original-wordmark.svg",
  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postman/postman-original.svg",
  "https://www.svgrepo.com/show/353622/c-sharp.svg",
  "https://www.svgrepo.com/show/303232/mongodb-logo.svg",
  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg",
  "https://www.svgrepo.com/show/452091/python.svg",
  "https://www.svgrepo.com/show/331642/webflow.svg",
  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
  "https://www.svgrepo.com/show/374167/vite.svg",
  "https://www.svgrepo.com/show/354431/tailwindcss-icon.svg",
  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg",
  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
  "https://www.svgrepo.com/show/354512/vercel.svg",
  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/netlify/netlify-original.svg",
  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
  "https://www.svgrepo.com/show/376337/node-js.svg",
  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg",
  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/rails/rails-plain-wordmark.svg",
  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original-wordmark.svg",
  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg",
  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dart/dart-original.svg",
];

const Stack = () => {
  const trackRef1 = useRef<HTMLDivElement>(null);
  const trackRef2 = useRef<HTMLDivElement>(null);
  const [scrollWidth1, setScrollWidth1] = useState(0);
  const [scrollWidth2, setScrollWidth2] = useState(0);

  useEffect(() => {
    if (trackRef1.current) {
      const timeout = setTimeout(() => {
        setScrollWidth1(trackRef1.current!.scrollWidth);
      }, 0);
      return () => clearTimeout(timeout);
    }
  }, []);

  useEffect(() => {
    if (!scrollWidth1) return;
    let frame: number;
    let pos = -scrollWidth1 / 2;
    const speed = 0.5;
    const resetPoint = 0;
    const animate = () => {
      pos += speed;
      if (trackRef1.current) {
        trackRef1.current.style.transform = `translateX(${pos}px)`;
        if (pos >= resetPoint) {
          pos = -scrollWidth1 / 2;
        }
      }
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [scrollWidth1]);

  useEffect(() => {
    if (trackRef2.current) {
      const timeout = setTimeout(() => {
        setScrollWidth2(trackRef2.current!.scrollWidth);
      }, 0);
      return () => clearTimeout(timeout);
    }
  }, []);

  useEffect(() => {
    if (!scrollWidth2) return;
    let frame: number;
    let pos = 0;
    const speed = -0.5;
    const resetPoint = scrollWidth2 / 2;
    const animate = () => {
      pos += speed;
      if (trackRef2.current) {
        trackRef2.current.style.transform = `translateX(${pos}px)`;
        if (pos <= -resetPoint) {
          pos = 0;
        }
      }
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [scrollWidth2]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <SectionHeading
        icon={HiOutlineBeaker}
        title="Tech Stack"
        subtitle="The languages, frameworks, and tools I use to ship products."
        center
        className="mb-10"
      />

      <Reveal className="flex flex-col gap-6 items-center justify-center w-full [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        <div className="overflow-hidden w-full py-2">
          <div
            ref={trackRef1}
            className="flex gap-5 sm:gap-8 items-center will-change-transform min-w-max"
          >
            {[...img1, ...img1].map((img, i) => (
              <StackIcon key={i} src={img} />
            ))}
          </div>
        </div>
        <div className="overflow-hidden w-full py-2">
          <div
            ref={trackRef2}
            className="flex gap-5 sm:gap-8 items-center will-change-transform min-w-max"
          >
            {[...img2, ...img2].map((img, i) => (
              <StackIcon key={i} src={img} />
            ))}
          </div>
        </div>
      </Reveal>
    </div>
  );
};

export default Stack;
