import React from "react";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="text-white px-8 py-10">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto text-sm">
        {/* Logo */}
        <div className="flex-1 flex items-center h-full">
          <div className="flex items-center justify-center -ml-4">
            <Image
              src={"/images/logo2.png"}
              alt="Profile"
              width={150}
              height={150}
            />
          </div>
        </div>

        {/* Navigation & Follow Me (2 columns on mobile) */}
        <div className="col-span-2 md:col-span-1 ">
          <div className="grid grid-cols-2 md:gap-30">
            {/* Navigation */}
            <div>
              <h4 className="text-[#A30000] font-semibold mb-2">Navigation</h4>
              <ul className="space-y-1">
                <li>Home</li>
                <li>Projects</li>
                <li>Stack</li>
                <li>About</li>
                <li>Contact</li>
              </ul>
            </div>
            {/* Follow Me */}
            <div>
              <h4 className="text-[#A30000] font-semibold mb-2 md:whitespace-nowrap">
                Follow Me
              </h4>
              <ul className="space-y-1">
                <li>Facebook</li>
                <li>Instagram</li>
                <li>LinkedIn</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Let's Connect */}
        <div className=" md:ml-20 md:whitespace-nowrap">
          <h4 className="text-[#A30000] font-semibold mb-2 ">Let’s Connect</h4>
          <p className="mb-2 underline">jagabarda8@gmail.com</p>
          <input
            type="email"
            placeholder="Your email"
            className="bg-black border border-white text-white px-3 py-1 w-full md:w-50 lg:w-50"
          />
        </div>
      </div>

      {/* Divider & Bottom */}
      <div className="border-t border-white mt-10 pt-4 text-center text-xs">
        <p>© 2025 JigStack. All rights reserved.</p>
      </div>

      {/* Scroll Up Button */}
      <div className="fixed bottom-6 right-6">
        <button className="bg-white text-[#A30000] p-3 rounded-full hover:bg-[#A30000] hover:text-white transition">
          ▲
        </button>
      </div>
    </footer>
  );
};

export default Footer;
