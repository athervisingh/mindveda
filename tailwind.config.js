module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#5B3E8A',
          light: '#8C6FCF',
          accent: '#DABF7A'
        }
      }
    },
  },
  plugins: [],
}
