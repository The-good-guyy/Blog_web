/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "node_modules/flowbite-react/lib/esm/**/*.js",
  ],
  theme: {
    extend: {
      keyframes: {},
      fontFamily: {
        poppins: ["poppins", "sans-serif"],
        europa: ["europa", "sans-serif"],
      },
      screens: {
        XXsm: "520px",
        Xsm: "440px",
        verySm: "400px",
      },
    },
  },
  plugins: [require("flowbite/plugin"), require("tailwind-scrollbar")],
};
