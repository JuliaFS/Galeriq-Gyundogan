/** @type {import('tailwindcss').Config} */

export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      clipPath:{
        'custom-rect': 'polygon(0 10%, 100% 20%, 90% 100%, 10% 90%)',
      }
    },
  },
  plugins: [],
}

