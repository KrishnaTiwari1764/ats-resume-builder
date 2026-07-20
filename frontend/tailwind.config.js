/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#12181B",
        "ink-soft": "#5B6B66",
        paper: "#F7F5F0",
        "paper-dim": "#EFEBE1",
        signal: {
          DEFAULT: "#2F6F5E",
          light: "#4C9382",
          dark: "#1F4E42",
        },
        amber: {
          DEFAULT: "#C97A2B",
          light: "#E0A365",
        },
        line: "#D8D3C4",
        "line-dark": "#2A3438",
      },
      fontFamily: {
        display: ["'Fraunces'", "serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      keyframes: {
        sweep: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        sweep: "sweep 2.4s ease-in-out infinite",
        "fade-up": "fade-up 0.5s ease-out both",
      },
    },
  },
  plugins: [],
};
