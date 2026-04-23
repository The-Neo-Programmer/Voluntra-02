import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0F766E',
          hover: '#115E59',
          soft: '#CCFBF1',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          secondary: '#F9FAFB',
        },
        sidebar: {
          DEFAULT: '#111827',
          active: '#1F2937',
        },
        status: {
          success: { DEFAULT: '#15803D', bg: '#DCFCE7' },
          warning: { DEFAULT: '#B45309', bg: '#FEF3C7' },
          danger: { DEFAULT: '#B91C1C', bg: '#FEE2E2' },
          info: { DEFAULT: '#1D4ED8', bg: '#DBEAFE' },
          pending: { DEFAULT: '#6B7280', bg: '#F3F4F6' },
        }
      },
    },
  },
  plugins: [],
};
export default config;
