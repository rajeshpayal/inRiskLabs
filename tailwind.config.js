/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',      // ✅ App Router
    './components/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',    // Optional, if you're mixing
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
