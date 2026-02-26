/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          300: '#E5C76B',
          400: '#D4AF37',
          500: '#C5A028',
          600: '#B8860B',
          700: '#9A7B0A',
        },
      },
    },
  },
  plugins: [],
}
