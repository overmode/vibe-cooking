import coreWebVitals from "eslint-config-next/core-web-vitals";
import typescript from "eslint-config-next/typescript";
import i18next from "eslint-plugin-i18next";

const eslintConfig = [
  ...coreWebVitals,
  ...typescript,
  {
    ignores: ["generated/**", ".next/**", "node_modules/**"],
  },
  {
    // Guard against untranslated UI copy: flag hardcoded JSX text so it can't
    // ship instead of a t() call. Scoped to our own surfaces — shadcn primitives
    // (components/ui) carry intentional sr-only/aria literals we don't localize.
    files: ["app/**/*.tsx", "components/**/*.tsx"],
    ignores: ["components/ui/**"],
    plugins: { i18next },
    rules: {
      "i18next/no-literal-string": ["error", { mode: "jsx-text-only" }],
    },
  },
  {
    // Type-aware pass: deprecations and promise-safety rules need the type
    // checker, so they only run with projectService enabled.
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // Warn-only: external deps deprecate things outside our control, so this
      // shouldn't fail the build.
      "@typescript-eslint/no-deprecated": "warn",
      // Promise safety: catch un-awaited / mishandled promises. attributes:false
      // avoids false positives on async JSX event handlers.
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-misused-promises": [
        "error",
        { checksVoidReturn: { attributes: false } },
      ],
      // Encode house rules the Next preset leaves unenforced.
      "@typescript-eslint/no-non-null-assertion": "error",
      "@typescript-eslint/no-explicit-any": "error",
      // import type hygiene; auto-fixable.
      "@typescript-eslint/consistent-type-imports": [
        "warn",
        { prefer: "type-imports", fixStyle: "inline-type-imports" },
      ],
    },
  },
];

export default eslintConfig;
