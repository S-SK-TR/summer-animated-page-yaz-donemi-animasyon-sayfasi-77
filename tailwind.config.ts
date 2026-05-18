import type { Config } from 'tailwindcss'

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#f59e0b',
        secondary: '#fcd34d',
        accent: '#3b82f6',
        glass: 'rgba(255, 255, 255, 0.2)'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif']
      },
      backdropFilter: {
        'none': 'none',
        'blur': 'blur(10px)',
        'blur-sm': 'blur(12px)',
        'blur-md': 'blur(16px)',
        'blur-lg': 'blur(24px)',
        'blur-xl': 'blur(40px)'
      },
      animation: {
        'sun-rotate': 'sunRotate 30s linear infinite',
        'wave': 'wave 3s ease-in-out infinite',
        'bubble-float': 'bubbleFloat 8s ease-in-out infinite'
      },
      keyframes: {
        sunRotate: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' }
        },
        wave: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        bubbleFloat: {
          '0%': { transform: 'translateY(0) scale(0.5)', opacity: '0.7' },
          '50%': { transform: 'translateY(-50px) scale(1)', opacity: '1' },
          '100%': { transform: 'translateY(-100px) scale(0.5)', opacity: '0.7' }
        }
      }
    }
  },
  plugins: []
} as Config