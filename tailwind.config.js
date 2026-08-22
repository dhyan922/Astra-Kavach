/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          green: '#00ff66',
          amber: '#f59e0b',
          dark: '#040806',
          black: '#020403',
          gray: '#1e293b',
          slate: '#0f172a',
          light: '#e2e8f0',
        }
      }
    },
  },
  plugins: [],
}
