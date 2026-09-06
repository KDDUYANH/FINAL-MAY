import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        may: {
          rosegold: "#B76E79",
          rosegoldLight: "#D49B9F",
          blush: "#FADCD9",
          blushLight: "#FDF0ED",
          surface: "#FDF7F7",
          champagne: "#FFF5EB",
          dark: "#2D1D1F",
          muted: "#7D6B6E",
          border: "#EADAD8",
          card: "#FFFFFF",
        },
      },
      fontFamily: {
        serif: ["Cinzel", "Playfair Display", "serif"],
        sans: ["Plus Jakarta Sans", "Inter", "sans-serif"],
      },
      boxShadow: {
        soft: "0 4px 20px -2px rgba(183, 110, 121, 0.08)",
        card: "0 2px 10px rgba(45, 29, 31, 0.04)",
        float: "0 8px 30px rgba(45, 29, 31, 0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
