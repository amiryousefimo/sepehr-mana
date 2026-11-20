/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: '#203B35',
          dark: '#172D29',
          light: '#2C4F47',
        },
        ivory: {
          warm: '#F1EEE5',
          surface: '#FAF9F5',
        },
        terracotta: {
          DEFAULT: '#D97852',
          dark: '#B85E39',
          light: '#E59273',
        },
        amber: {
          DEFAULT: '#D5AA59',
          dark: '#B88F40',
          light: '#E2C281',
        },
        mutedGreen: '#789184',
        slateGreen: '#75847B',
        darkText: '#252D29',
        borderMuted: '#DEDCD3',
      },
      fontFamily: {
        sans: ['Sahel', 'Sahel VF', 'system-ui', 'sans-serif'],
        farsiDigits: ['Sahel FD', 'Sahel', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'card': '12px',
        'card-lg': '14px',
      },
      lineHeight: {
        'farsi-tight': '1.35',
        'farsi-snug': '1.5',
        'farsi-normal': '1.65',
        'farsi-relaxed': '1.8',
      },
    },
  },
  plugins: [],
}
