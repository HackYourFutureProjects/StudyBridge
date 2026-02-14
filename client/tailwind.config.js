/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: '#0f0e13',
        'dark-secondary': '#141219',
        'dark-tertiary': '#1a1820',
        primary: '#7286ff',
        'primary-light': '#8b4fe0',
      },
      boxShadow: {
        'md': '0px 1px 2px 0px rgba(184,200,224,0.22)',
      },
      borderRadius: {
        '45px': '45px',
      },
    },
  },
  plugins: [],
}
