/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        dark: {
          50: '#f0f5ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
        bg: {
          base: '#0f1419',
          container: '#1a2332',
          elevated: '#1f2a3c',
          muted: '#141b26',
        },
        border: {
          DEFAULT: '#2a3a50',
          light: '#3a4a60',
        },
        text: {
          primary: '#e0e7ff',
          secondary: '#a0aec0',
          tertiary: '#718096',
          muted: '#4a5568',
        },
      },
      fontFamily: {
        sans: ['"Source Han Sans CN"', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', '"Noto Sans"', 'Helvetica', 'Arial', 'sans-serif'],
      },
      spacing: {
        '128': '32rem',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};
