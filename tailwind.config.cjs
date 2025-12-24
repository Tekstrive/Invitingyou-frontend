/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          black: "#1a1a1a", // Primary text and elements
          "black-light": "#2d2d2d", // Lighter variation
          mirage: "#1a1a1a", // Alias for back-compat

          cream: "#ccc8B9", // Primary accent color
          "cream-light": "#e8e5df", // Lighter cream for backgrounds
          "cream-dark": "#a49b84", // Darker cream for contrast

          orange: "#ccc8B9", // Alias for back-compat (mapped to cream)
          gold: "#a49b84", // Alias for back-compat (mapped to cream-dark)
          cyan: "#ccc8B9", // Alias for back-compat

          sea: "#a49b84", // Alias for back-compat (mapped to cream-dark)
          sage: "#a49b84", // Alias for back-compat
          sand: "#e8e5df", // Alias for back-compat (mapped to cream-light)

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
        "gradient-premium": "linear-gradient(135deg, #e8e5df 0%, #ccc8B9 100%)",
      },
    },
  },
  plugins: [],
};
