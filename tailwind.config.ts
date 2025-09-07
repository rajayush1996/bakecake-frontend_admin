import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}", // optional if you want redundancy
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#fff4ec",
          100: "#ffe6d6",
          200: "#ffc3a3",
          300: "#ffa06f",
          400: "#ff7d3c",
          500: "#ff641e",
          600: "#ff5a1f",
          700: "#e04912",
          800: "#b7380d",
          900: "#8f2b0a",
        },
      },
      borderRadius: {
        "2xl": "1.25rem",
      },
    },
  },
  plugins: [],
};
export default config;
