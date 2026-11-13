import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: '#102A43',
        deepNavy: '#071B2E',
        medicalBlue: '#2878C7',
        cyan: '#57C7E8',
        paleBlue: '#EAF5FC',
        canvas: '#F7FAFC',
        ink: '#243B53',
        muted: '#627D98',
        border: '#DCE7EF',
      },
      fontFamily: {
        display: ['Manrope', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        arabic: ['Cairo', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config
