import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        takeups: {
          bg: "#05060A",
          panel: "#0E1118",
          elevated: "#151A24",
          border: "#242A36",
          text: "#F4F7FB",
          muted: "#8B93A7",
          blue: "#4F8CFF",
          red: "#FF4F6D",
          gold: "#F5C451",
          success: "#57E389"
        }
      },
      fontFamily: {
        heading: ["var(--font-heading)", "Space Grotesk", "Sora", "Inter", "sans-serif"],
        body: ["var(--font-body)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "ui-monospace", "SFMono-Regular", "monospace"]
      },
      boxShadow: {
        glow: "0 0 40px rgb(79 140 255 / 0.22)",
        redglow: "0 0 40px rgb(255 79 109 / 0.2)"
      }
    }
  },
  plugins: []
};

export default config;
