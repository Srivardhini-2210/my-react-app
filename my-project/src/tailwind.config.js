/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Scan all React files in src folder
  ],
  theme: {
    extend: {
      colors: {
        // Optional custom colors
        primary: {
          DEFAULT: "#2563eb", // Blue-600
          dark: "#1e40af", // Blue-800
        },
        secondary: {
          DEFAULT: "#e5e7eb", // Gray-200
          dark: "#d1d5db", // Gray-300
        },
      },
    },
  },
  plugins: [],
};
