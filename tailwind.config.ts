import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        nk: {
          black: "#000000",
          ink: "#0a0a0c",
          panel: "#141414",
          panel2: "#1f1f23",
          red: "#e50914",
          redDim: "#8c060d",
          gray: "#808080",
          mist: "#b3b3b3",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Impact", "sans-serif"],
        body: ["var(--font-body)", "Helvetica Neue", "Arial", "sans-serif"],
      },
      backgroundImage: {
        "fade-top": "linear-gradient(to top, rgba(0,0,0,0) 0%, rgba(0,0,0,0.9) 100%)",
        "fade-bottom": "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.95) 100%)",
        "fade-edges": "linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 20%, rgba(0,0,0,0) 70%, rgba(0,0,0,1) 100%)",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-500px 0" },
          "100%": { backgroundPosition: "500px 0" },
        },
        pulseRed: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.55" },
        },
      },
      animation: {
        shimmer: "shimmer 2s infinite linear",
        pulseRed: "pulseRed 1.8s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
