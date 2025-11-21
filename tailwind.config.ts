import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#f59e0b',
        glass: 'rgba(255, 255, 255, 0.25)',
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      animation: {
        'pulse-shadow': 'pulseShadow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'line-draw': 'lineDraw 2s ease-out forwards',
        'float': 'float 3s ease-in-out infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        pulseShadow: {
          '0%, 100%': { boxShadow: '0 10px 30px rgba(245, 158, 11, 0.1)' },
          '50%': { boxShadow: '0 10px 40px rgba(245, 158, 11, 0.3)' },
        },
        lineDraw: {
          '0%': { strokeDashoffset: '1000' },
          '100%': { strokeDashoffset: '0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
export default config