// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  // Ensure Tailwind scans all relevant source files
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // warm vivid orange like the shot
        brand: {
          50:  '#fff4ec',
          100: '#ffe6d6',
          200: '#ffc3a3',
          300: '#ffa06f',
          400: '#ff7d3c',
          500: '#ff641e',
          600: '#ff5a1f', // primary
          700: '#e04912',
          800: '#b7380d',
          900: '#8f2b0a',
        },
      },
      borderRadius: {
        '2xl': '1.25rem',
      },
    },
  },
  plugins: [],
};
export default config;
