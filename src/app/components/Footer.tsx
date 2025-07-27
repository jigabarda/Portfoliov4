import React from "react";

const Footer = () => {
  return (
    <footer className="bg-black text-white px-8 py-10">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto text-sm">
        {/* Logo */}
        <div>
          <h1 className="text-2xl font-extrabold footer-logo">JIGSTACK</h1>
        </div>

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
          <h4 className="text-[#A30000] font-semibold mb-2">Follow Me</h4>
          <ul className="space-y-1">
            <li>Facebook</li>
            <li>Instagram</li>
            <li>LinkedIn</li>
          </ul>
        </div>

        {/* Let's Connect */}
        <div>
          <h4 className="text-[#A30000] font-semibold mb-2">Let’s Connect</h4>
          <p className="mb-2 underline">jagabarda8@gmail.com</p>
          <input
            type="email"
            placeholder="Your email"
            className="bg-black border border-white text-white px-3 py-1 w-full"
          />
        </div>
      </div>

      {/* Divider & Bottom */}
      <div className="border-t border-white mt-10 pt-4 text-center text-xs">
        <p>© 2025 JigStack. All rights reserved.</p>
      </div>

      {/* Scroll Up Button */}
      <div className="fixed bottom-6 right-6">
        <button className="bg-white text-[#A30000] p-2 rounded-full hover:bg-[#A30000] hover:text-white transition">
          ↑
        </button>
      </div>
    </footer>
  );
};

export default Footer;
