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
          light: 'var(--color-primary-light)',
          DEFAULT: 'var(--color-primary)',
          dark: 'var(--color-primary-dark)',
          clear: 'var(--color-primary-clear)',
          'clear-bg': 'var(--color-primary-clear-bg)',
          'clear-b': 'var(--color-primary-clear-b)',
          'categoria-bg': 'var(--color-primary-categoria-bg)',
        },
      },
    },
  },
  plugins: [],
};