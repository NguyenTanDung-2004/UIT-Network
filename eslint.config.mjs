import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  js,
  ts,
  {
    ignores: ["**/node_modules/**", "**/.next/**", "**/public/**"],
  },
  {
    rules: {
      "no-unused-vars": "warn", // or 'off' if really needed, but better to fix
      "react/prop-types": "off", // Usually not needed in TS projects
      "react/react-in-jsx-scope": "off", // Not needed with Next.js >= 17
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/no-explicit-any": "warn", // Consider using more specific types
    },
  },
];

export default eslintConfig;
