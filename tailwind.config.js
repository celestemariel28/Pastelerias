/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pastelPink: '#FFD0DE', 
        darkPink: '#FFE9EF',
      },
    },
  },
  plugins: [],
}