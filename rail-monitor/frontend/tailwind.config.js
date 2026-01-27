/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // <--- ADICIONE ESTA LINHA IMPORTANTE
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        rail: {
          dark: '#0f172a',    // Slate 900
          light: '#f8fafc',   // Slate 50
          primary: '#3b82f6', // Blue 500
        }
      }
    },
  },
  plugins: [],
}