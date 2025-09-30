/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        red: {
          400: '#ff6b7a',
          500: '#ff3b4a',
          600: '#ea1d2c',
          700: '#c41020',
        }
      }
    },
  },
  plugins: [],
}