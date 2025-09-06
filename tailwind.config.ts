import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#6366f1', // Indigo-500
          light: '#818cf8',   // Indigo-400
          dark: '#4f46e5',    // Indigo-600
        },
        accent: {
          DEFAULT: '#ec4899', // Pink-500
          light: '#f472b6',   // Pink-400
          dark: '#db2777',    // Pink-600
        },
        neutral: {
          DEFAULT: '#1e293b', // Slate-800
          light: '#64748b',   // Slate-500
          dark: '#0f172a',    // Slate-900
        },
        success: {
          DEFAULT: '#10b981', // Emerald-500
          light: '#34d399',
          dark: '#059669',
        },
        warning: {
          DEFAULT: '#f59e0b', // Amber-500
          light: '#fbbf24',
          dark: '#d97706',
        },
        error: {
          DEFAULT: '#ef4444', // Red-500
          light: '#f87171',
          dark: '#dc2626',
        },
      },
    },
  },
  plugins: [],
};
export default config;
