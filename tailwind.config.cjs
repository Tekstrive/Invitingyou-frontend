/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          mirage: "#16232A", // Primary Base (replaces Black)
          black: "#16232A", // Alias for back-compat

          orange: "#FF5B04", // Blaze Orange (Primary Accent)
          gold: "#FF5B04", // Alias for back-compat
          cyan: "#FF5B04", // Alias for back-compat

          sea: "#075056", // Deep Sea Green
          sage: "#075056", // Alias for back-compat

          sand: "#E4EEF0", // Wild Sand (Background)
          cream: "#E4EEF0", // Alias for back-compat

          white: "#FFFFFF",
        },
      },
      fontFamily: {
        serif: ["Playfair Display", "serif"],
        sans: ["Outfit", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.5s ease-out",
        blob: "blob 7s infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        blob: {
          "0%": {
            transform: "translate(0px, 0px) scale(1)",
          },
          "33%": {
            transform: "translate(30px, -50px) scale(1.1)",
          },
          "66%": {
            transform: "translate(-20px, 20px) scale(0.9)",
          },
          "100%": {
            transform: "translate(0px, 0px) scale(1)",
          },
        },
      },
      backgroundImage: {
        "gradient-premium": "linear-gradient(135deg, #FDFBF7 0%, #E8EFEA 100%)",
      },
    },
  },
  plugins: [],
};
