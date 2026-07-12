import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#fffaf4",
        parchment: "#f5ead8",
        ink: "#172033",
        rose: "#f6c6cf",
        lavender: "#ddd7f2",
        gold: "#f2c66d",
        sage: "#bfd6bd",
        clay: "#c46f55",
        coral: "#e76f51",
        sky: "#8dc9dd",
        mint: "#cae5d0",
        plum: "#5f4b8b",
      },
      fontFamily: {
        display: ["var(--font-sans)", "ui-sans-serif", "system-ui"],
        editorial: ["var(--font-editorial)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui"],
      },
      boxShadow: {
        book: "0 24px 70px rgba(39, 50, 74, 0.16)",
        soft: "0 18px 45px rgba(39, 50, 74, 0.10)",
      },
    },
  },
  plugins: [],
};

export default config;
