/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f2ff',
          100: '#b3d9ff',
          200: '#80bfff',
          300: '#4da6ff',
          400: '#1a8cff',
          500: '#0073e6',
          600: '#0259bb', // rgb(2, 89, 187) - Main brand color
          700: '#014699',
          800: '#013377',
          900: '#002055',
        },
      },
    },
  },
  plugins: [],
}

