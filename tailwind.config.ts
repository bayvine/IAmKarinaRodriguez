import type { Config } from "tailwindcss";

const config: Config = {
  theme: {
    extend: {
      colors: {
        "pure-white": "#FFFFFF",
        "rose-white": "#FAEBE6",
        night: "#1A1818",
        "disabled-rose-white": "rgb(250 235 230 / 0.3)",
        "accent-bordeaux": "#482122",
        "accent-blue-linen": "#9ABEFF",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Neue Haas Unica", "Helvetica Neue", "sans-serif"],
        display: [
          "var(--font-gambarino)",
          "Iowan Old Style",
          "Times New Roman",
          "serif",
        ],
      },
    },
  },
};

export default config;
