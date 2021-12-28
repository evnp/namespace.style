module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
    "plugin:jest/recommended",
  ],
  parserOptions: {
    parser: "@typescript-eslint/parser",
  },
  rules: {
    // Prettier code style checks should not block dev builds:
    "prettier/prettier": ["warn"],
    // Enforce and auto-fix double-quotes wherever possible, and don't allow
    // backtick strings unless interpolation is actually being used within them:
    quotes: ["warn", "double", { avoidEscape: true }],
    "no-console": ["warn", { allow: ["error", "warn", "info"] }],
    "no-debugger": "warn",
    "prefer-const": ["warn", { destructuring: "all" }],
    // Turn off in favor of TS version below, which is aware of `import type {...`
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": [
      "warn",
      { ignoreRestSiblings: true },
      // `ignoreRestSiblings` allows easily "ommitting" key/value data from an object:
      // (see https://eslint.org/docs/rules/no-unused-vars#ignorerestsiblings)
    ],
    // Some tests call functions which assert for them, which should be valid:
    "jest/expect-expect": "off",
  },
};
