export default [
  {
    files: ["src/**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: {
        window: "readonly", document: "readonly", localStorage: "readonly",
        sessionStorage: "readonly", console: "readonly", alert: "readonly",
        setTimeout: "readonly", fetch: "readonly",
      },
    },
    rules: { "no-unused-vars": "warn", "no-undef": "warn", "no-console": "off" },
  },
];
