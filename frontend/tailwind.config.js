/** @type {import('tailwindcss').Config} */
const { nextui } = require('@nextui-org/react');
const { animate } = require('framer-motion');

module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}', './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ludium: '#861CC4',
        ludiumContainer: '#f8ecff',
      },
      keyframes: {
        fade: {
          '0%': { opacity: 0 },
          '100%': { opacity: 100 },
        },
      },
      animation: {
        fadeIn: 'fade 1.5s forwards ease',
      },
    },
  },
  darkMode: 'class',
  plugins: [nextui()],
};
