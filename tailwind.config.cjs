module.exports = {
  content: ['./index.html', './src/**/*.{vue,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f2f7ff',
          100: '#dbe8ff',
          200: '#b9d1ff',
          300: '#8ab1ff',
          400: '#5c89ff',
          500: '#355ef6',
          600: '#2345db',
          700: '#1d37b1',
          800: '#1d318b',
          900: '#1d2d6d'
        }
      },
      boxShadow: {
        soft: '0 24px 60px -24px rgba(15, 23, 42, 0.35)'
      }
    }
  },
  plugins: []
}
