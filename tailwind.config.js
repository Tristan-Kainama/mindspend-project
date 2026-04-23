// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // ADD THIS SECTION:
      borderRadius: {
        '3xl': '24px', // Standard for the cards
        '5xl': '40px', // Custom for the blue header
      },
    },
  },
  plugins: [],
}