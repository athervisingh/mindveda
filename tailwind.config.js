module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#2d4f3a',
          light: '#4a7c59',
          accent: '#8a6914'
        }
      }
    },
  },
  plugins: [],
}
