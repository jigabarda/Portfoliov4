"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

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
  "https://www.svgrepo.com/show/373966/php.svg",
  "https://www.svgrepo.com/show/452091/python.svg",
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
  "https://www.svgrepo.com/show/373966/php.svg",
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
    <div className="flex flex-col gap-6 items-center justify-center w-full py-10">
      {/* <h1 className="text-center p-4 font-black text-lg text-white">
        Tech Stack
      </h1> */}
      <div className="overflow-hidden w-full py-2">
        <div
          ref={trackRef1}
          className="flex gap-8 items-center will-change-transform min-w-max"
        >
          {[...img1, ...img1].map((img, i) => {
            const whiteBgSvgs = [
              "https://www.svgrepo.com/show/376337/node-js.svg",
              "https://www.svgrepo.com/show/354512/vercel.svg",
              "https://www.svgrepo.com/show/473592/dotnet.svg",
              "https://www.svgrepo.com/show/512317/github-142.svg",
              "https://www.svgrepo.com/show/303232/mongodb-logo.svg",
            ];
            const isWhiteBg = whiteBgSvgs.includes(img);
            return (
              <span
                key={i}
                className={
                  isWhiteBg ? "bg-white p-1 inline-flex" : "inline-flex"
                }
              >
                <Image
                  src={img}
                  alt="stack icon"
                  width={48}
                  height={48}
                  className="h-12 w-12 object-contain select-none"
                  draggable={false}
                />
              </span>
            );
          })}
        </div>
      </div>
      <div className="overflow-hidden w-full py-2">
        <div
          ref={trackRef2}
          className="flex gap-8 items-center will-change-transform min-w-max"
        >
          {[...img2, ...img2].map((img, i) => {
            const whiteBgSvgs = [
              "https://www.svgrepo.com/show/376337/node-js.svg",
              "https://www.svgrepo.com/show/354512/vercel.svg",
              "https://www.svgrepo.com/show/473592/dotnet.svg",
              "https://www.svgrepo.com/show/512317/github-142.svg",
              "https://www.svgrepo.com/show/303232/mongodb-logo.svg",
            ];
            const isWhiteBg = whiteBgSvgs.includes(img);
            return (
              <span
                key={i}
                className={
                  isWhiteBg ? "bg-white p-1 inline-flex" : "inline-flex"
                }
              >
                <Image
                  src={img}
                  alt="stack icon"
                  width={48}
                  height={48}
                  className="h-12 w-12 object-contain select-none"
                  draggable={false}
                />
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Stack;
