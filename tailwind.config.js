/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        slate: {
          950: '#020617',
          900: '#0f172a',
          800: '#1e293b',
          700: '#334155',
          600: '#475569',
          500: '#64748b',
          400: '#94a3b8',
          200: '#e2e8f0',
        },
        cyan: {
          400: '#22d3ee',
          300: '#67e8f9',
        },
        blue: {
          400: '#60a5fa',
          300: '#93c5fd',
        },
        purple: {
          600: '#9333ea',
          400: '#c084fc',
        },
      },
    },
  },
  plugins: [],
}
