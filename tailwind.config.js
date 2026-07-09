/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0f2431',
        paper: '#f5f0e6',
        accent: '#0a7d6b',
        danger: '#b5462e',
        gold: '#c8862a',
      },
      boxShadow: {
        soft: '0 20px 48px rgba(15, 36, 49, 0.08)',
      },
    },
  },
  plugins: [],
}

