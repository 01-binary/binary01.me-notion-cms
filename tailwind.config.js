/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/components/**/*.{jsx,tsx}', './pages/**/*.{jsx,tsx}'],
  theme: {
    extend: {
      keyframes: {
        'octocat-wave': {
          '0%, 12.5%': { transform: 'rotate(0)' },
          '2.5%, 7.5%': { transform: 'rotate(-25deg)' },
          '5%, 10%': { transform: 'rotate(10deg)' },
        },
      },
      animation: {
        'octocat-wave': 'octocat-wave 7s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
