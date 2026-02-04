/**
 * This is our eslint configuration file for the server.
 * Note: If you make a change here, think about if it should be applied in the client config file as well.
 *
 * ESlint is a way to enforce certain code rules to keep the code base consistent.
 * Have a look at our project repo README or https://eslint.org/ for more information
 */

module.exports = {
  env: {
    node: true,
    es2022: true,
    jest: true,
  },

  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },

  plugins: ["@typescript-eslint", "import", "prettier"],

  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],

  rules: {
    quotes: ["error", "double"],
    "prettier/prettier": "error",
    "import/prefer-default-export": "off",
    "import/extensions": "off",
    "no-console": "warn",
  },
};
