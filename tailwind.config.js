/** @type {import('tailwindcss').Config} */

export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      screens: {
        sm: "340px",
        md: "640px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
      backgroundImage: {
        "custom-gradient": "linear-gradient(-225deg, #e3fdf5 50%, #e9d5ff 50%);",
        "custom-gradient-1": "linear-gradient(to top, #a8edea 0%, #fed6e3 100%);",
      },
      boxShadow: {
        "custom-shadow": "0 9px 50px hsla(20, 67%, 75%, 0.31)", // Add your custom shadow here
      },
    },
  },
  plugins: [],
};
