const animatePlugin = require('tailwindcss-animate');

// tailwind.config.js
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}', // Garanta que esta linha existe
    './src/app/**/*.{js,ts,jsx,tsx}',
  ],
  // ... resto da configuração
}