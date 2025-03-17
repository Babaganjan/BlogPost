module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    "airbnb/base",
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
  ],
  ignorePatterns: ["dist", ".eslintrc.cjs"],
  parser: "@typescript-eslint/parser",
  plugins: ["react-refresh", "import"],
  settings: {
    "import/resolver": {
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
    },
  },
  rules: {
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true },
    ],
    "@typescript-eslint/naming-convention": [
      "error",
      {
        selector: "classProperty",
        format: ["snake_case", "camelCase"],
      },
    ],
    "import/extensions": [
      "error",
      "always",
      {
        ts: "never",
        tsx: "never",
        js: "never",
        jsx: "never",
      },
    ],
    "import/no-extraneous-dependencies": [
      "error",
      {
        devDependencies: ["*.d.ts"],
      },
    ],
    "import/no-unresolved": "off",
    // Настройка правила no-param-reassign
    "no-param-reassign": [
      "error",
      {
        props: true,
        ignorePropertyModificationsFor: ["draft", "state"], // Игнорируем state в редюсерах Redux
      },
    ],
  },
};
