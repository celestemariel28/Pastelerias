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
          light: '#f8d6e0',
          DEFAULT: '#E91E63',
          dark: '#D81B60',
        },
      },
    },
  },
  plugins: [],
};