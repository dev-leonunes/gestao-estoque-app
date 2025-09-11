const animatePlugin = require('tailwindcss-animate');

module.exports = {
    content: ['./src/**/*.{js,ts,jsx,tsx}'],
    theme: { extend: {} },
    plugins: [animatePlugin],
}