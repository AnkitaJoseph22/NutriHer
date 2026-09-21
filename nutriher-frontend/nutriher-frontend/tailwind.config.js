/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#FBF6EF",
        creamDeep: "#F3EAE0",
        lavender: "#CBBFE6",
        lavenderDeep: "#A995CE",
        rose: "#DDA9A3",
        roseDeep: "#C68A85",
        mauve: "#9D7C97",
        sage: "#A9B99A",
        sageDeep: "#8AA178",
        plum: "#3B2E3D",
        plumSoft: "#6B5A6C",
        line: "#E7DCEA",
      },
      fontFamily: {
        display: ["'Playfair Display'", "'Cormorant Garamond'", "serif"],
        body: ["Inter", "'DM Sans'", "sans-serif"],
      },
      borderRadius: {
        "4xl": "2rem",
      },
    },
  },
  plugins: [],
};
