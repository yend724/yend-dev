import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettierConfig from "eslint-config-prettier";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([".next/**", "out/**", "next-env.d.ts"]),
  {
    // Import boundaries (bulletproof-react): app -> features -> shared, one direction only.
    files: ["src/**/*.{ts,tsx}"],
    rules: {
      "func-style": ["error", "expression"],
      "react/function-component-definition": [
        "error",
        {
          namedComponents: "arrow-function",
          unnamedComponents: "arrow-function",
        },
      ],
      "import/no-restricted-paths": [
        "error",
        {
          zones: [
            // A feature must not import from another feature. Add one entry per feature.
            {
              target: "./src/features/ocean",
              from: "./src/features",
              except: ["./ocean"],
            },
            // features must not import from app.
            { target: "./src/features", from: "./src/app" },
            // shared must not import from features or app.
            { target: "./src/shared", from: ["./src/features", "./src/app"] },
          ],
        },
      ],
    },
  },
  prettierConfig,
]);

export default eslintConfig;
