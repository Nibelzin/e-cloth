/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        accent: "var(--accent)",
        alpha: "var(--alpha)",
        "accent-hover": "var(--accentHover)",
        dark: "rgb(33, 33, 38)",
      },
      boxShadow: {
        focused: "rgba(0, 0, 0, 0.15) 0 0px 0px 4px"
      }
    },
  },
  plugins: [],
}

