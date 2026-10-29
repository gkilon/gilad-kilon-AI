/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'brand-dark': '#203638',
        'brand-beige': '#F4EFE6',
        'brand-accent': '#356B68',
        'brand-muted': '#596765',
        'brand-gold': '#D3A15D',
        'brand-sage': '#A8B7A4',
        'brand-navy': '#203638',
        'brand-paper': '#FFFCF6',
        'brand-touch': '#C96F52',
      },
      fontFamily: {
        sans: ['Assistant', 'sans-serif'],
      },
      animation: {
        fadeIn: 'fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        slideUp: 'slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
