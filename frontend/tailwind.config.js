/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0b0b0f',
        primary: '#ff4da6',
        secondary: '#ff99cc',
        'accent-glow': 'rgba(255, 77, 166, 0.5)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'pink-glow': '0 0 15px rgba(255, 77, 166, 0.4), 0 0 30px rgba(255, 77, 166, 0.2)',
        'pink-glow-lg': '0 0 25px rgba(255, 77, 166, 0.6), 0 0 50px rgba(255, 77, 166, 0.3)',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '.7' },
        }
      }
    },
  },
  plugins: [],
}
