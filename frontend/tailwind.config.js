
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eff6ff",
          100: "#dbeafe",
          500: "#3563eb",
          600: "#2549c7",
          700: "#1d399b",
          950: "#101a35",
        },
      },
      boxShadow: {
        soft: "0 12px 40px rgba(23, 37, 84, 0.08)",
      },
    },
  },
  plugins: [],
};
