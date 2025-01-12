import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      animation: {
        wiggle: "bg-fade 4s ease-out both",
      },
      keyframes: {
        "bg-fade": {
          "0%": { backgroundColor: "theme(colors.orange.900)" },
          "75%": { backgroundColor: "theme(colors.orange.900)" },
          "100%": { transform: "transparent" },
        },
      },
    },
  },
  plugins: [
    plugin(({ addVariant }) => {
      addVariant("hover", "@media(any-hover:hover){ &:hover }");
      addVariant("group-hover", "@media(any-hover:hover){ .group:hover & }");
    }),
  ],
};

export default config;
