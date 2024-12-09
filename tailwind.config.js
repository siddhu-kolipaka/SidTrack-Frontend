/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        back: "#16161a",
        heading: "#fffffe",
        txt: "#94a1b2",
        pri: "#7f5af0",
        border: "#010101",
        sec: "#3da9fc",
      },
    },
  },
  plugins: [],
};
