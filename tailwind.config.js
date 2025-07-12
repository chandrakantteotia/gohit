/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  // darkMode: 'class',
  darkMode: false, 
  theme: {
    extend: {
      animation: {
        'fade-in-up': 'fade-in-up 0.8s ease-out forwards',
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s infinite',
        'infinite-scroll': 'infinite-scroll linear infinite',
        'fadeIn': 'fadeIn 0.3s ease-in-out',
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(10px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        glow: '0 0 20px rgba(59, 130, 246, 0.5)',
        'glow-lg': '0 0 40px rgba(59, 130, 246, 0.3)',
      },
      colors: {
        slate: {
          850: '#1e293b',
          950: '#0f172a',
        },
      },
    },
  },
  plugins: [],
};
