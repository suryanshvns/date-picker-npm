import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}", "./stories/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config;
