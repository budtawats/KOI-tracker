/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        koi: {
          red: '#E53E3E',
          'red-dark': '#C53030',
          'red-light': '#FFF5F5',
          gold: '#D69E2E',
          navy: '#1A202C',
          slate: '#2D3748',
          cream: '#FDFBF7',
          paper: '#F7FAFC',
          border: '#E2E8F0',
          indigo: '#2B4C7E'
        }
      },
      fontFamily: {
        sans: ['Prompt', 'Sarabun', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05), 0 2px 6px -1px rgba(0, 0, 0, 0.03)',
        'card': '0 10px 30px -5px rgba(0, 0, 0, 0.07)',
        'float': '0 20px 40px -10px rgba(229, 62, 62, 0.15)',
      }
    },
  },
  plugins: [],
}
