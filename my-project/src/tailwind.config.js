// tailwind.config.js
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      keyframes: {
        glow: {
          "0%, 100%": { boxShadow: "0 0 8px rgba(59,130,246,0.6)" },
          "50%": { boxShadow: "0 0 16px rgba(59,130,246,1)" },
        },
      },
      animation: {
        glow: "glow 2s infinite ease-in-out",
      },
    },
  },
  plugins: [],
};
