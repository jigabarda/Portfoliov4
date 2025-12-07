/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundSize: {
        "200%": "200% 200%",
      },
      keyframes: {
        gradientMove: {
          "0%": { "background-position": "0% 50%" },
          "50%": { "background-position": "100% 50%" },
          "100%": { "background-position": "0% 50%" },
        },
      },
      animation: {
        "gradient-move": "gradientMove 4s ease infinite",
      },
      backgroundImage: {
        "white-gradient":
          "linear-gradient(270deg, rgba(255,255,255,0.1), rgba(255,255,255,0.5), rgba(255,255,255,0.1))",
      },
    },
  },
  plugins: [],
};
