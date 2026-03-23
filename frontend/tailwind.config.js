/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0f172a",
        mist: "#f8fafc",
        line: "#e2e8f0",
        brand: {
          50: "#fff7ed",
          100: "#ffedd5",
          500: "#f97316",
          600: "#ea580c",
          700: "#c2410c",
        },
        teal: {
          500: "#0f766e",
          600: "#115e59",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Manrope", "Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 18px 40px rgba(15, 23, 42, 0.08)",
        card: "0 10px 24px rgba(15, 23, 42, 0.08)",
      },
      backgroundImage: {
        "library-glow":
          "radial-gradient(circle at top left, rgba(249, 115, 22, 0.18), transparent 28%), radial-gradient(circle at top right, rgba(15, 118, 110, 0.16), transparent 28%)",
      },
    },
  },
  plugins: [],
}
