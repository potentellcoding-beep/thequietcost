/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#101214",
        ember: "#bc4f3c",
        sand: "#f4ede3",
        fog: "#d7d0c6",
        rust: "#813628",
      },
      fontFamily: {
        sans: ["Manrope", "sans-serif"],
        serif: ["Cormorant Garamond", "serif"],
      },
      boxShadow: {
        glow: "0 30px 80px rgba(129, 54, 40, 0.22)",
      },
      backgroundImage: {
        grain:
          "radial-gradient(circle at top, rgba(188,79,60,0.18), transparent 35%), radial-gradient(circle at 85% 15%, rgba(255,255,255,0.08), transparent 22%), linear-gradient(180deg, #14171a 0%, #101214 45%, #171b1f 100%)",
      },
      keyframes: {
        riseIn: {
          from: { opacity: "0", transform: "translateY(36px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        floatCover: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      animation: {
        rise: "riseIn 0.9s ease-out both",
        float: "riseIn 1s ease-out both, floatCover 6s ease-in-out infinite 1s",
      },
    },
  },
  plugins: [],
};
