/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // Enable class-based dark mode
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    // Gradient classes for ExploreByPurpose component
    'from-blue-500',
    'to-blue-600',
    'from-green-500',
    'to-green-600',
    'from-orange-500',
    'to-orange-600',
    'from-purple-500',
    'to-purple-600',
    'from-indigo-500',
    'to-indigo-600',
    'from-yellow-500',
    'to-yellow-600',
    'from-cyan-500',
    'to-cyan-600',
    'from-teal-500',
    'to-teal-600',
    'from-gray-600',
    'to-gray-700',
    'from-emerald-500',
    'to-emerald-600',
    'from-pink-500',
    'to-pink-600',
    'from-violet-500',
    'to-violet-600',
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
      fontFamily: {
        'heading': ['Playfair Display', 'Merriweather', 'serif'],
        'body': ['Merriweather', 'Roboto', 'serif'],
        'sans': ['Merriweather', 'Roboto', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

