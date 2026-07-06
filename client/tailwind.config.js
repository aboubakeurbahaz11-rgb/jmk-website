/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          300: '#ffe566',
          400: '#ffd700',
          500: '#f5c518',
          600: '#e6b800',
          700: '#c9a200',
        },
        dark: {
          900: '#080808',
          800: '#0f0f0f',
          700: '#1a1a1a',
          600: '#242424',
          500: '#2e2e2e',
          400: '#3a3a3a',
        }
      },
      fontFamily: {
        arabic: ['Cairo', 'Tajawal', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-in-out',
        'fade-up': 'fadeUp 0.7s ease-out',
        'pulse-gold': 'pulseGold 2s infinite',
        'shimmer': 'shimmer 2s infinite',
        'float': 'float 3s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
        'glow': 'glow 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGold: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(245, 197, 24, 0.4)' },
          '50%': { boxShadow: '0 0 20px 10px rgba(245, 197, 24, 0.1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%, 100%': { textShadow: '0 0 10px rgba(245,197,24,0.5)' },
          '50%': { textShadow: '0 0 25px rgba(245,197,24,0.9), 0 0 50px rgba(245,197,24,0.4)' },
        }
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #f5c518 0%, #ffd700 50%, #e6b800 100%)',
        'dark-gradient': 'linear-gradient(135deg, #080808 0%, #1a1a1a 100%)',
      }
    },
  },
  plugins: [],
}
