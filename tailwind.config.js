/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef7fb',
          100: '#fdeef8',
          200: '#fbddf2',
          300: '#f8c5e8',
          400: '#f4a0d8',
          500: '#F78BD2', // Main pink
          600: '#e66bb8',
          700: '#d14a9e',
          800: '#b13a84',
          900: '#93326e',
        },
        secondary: {
          50: '#fefef8',
          100: '#fefdee',
          200: '#fefbd8',
          300: '#fef8b8',
          400: '#fdf294',
          500: '#FCDE59', // Main yellow
          600: '#e6c84a',
          700: '#c9a93a',
          800: '#a68a30',
          900: '#8a7129',
        },
        accent: {
          50: '#f0fdfd',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#5CE1E7', // Main cyan
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
      },
    },
  },
  plugins: [],
} 