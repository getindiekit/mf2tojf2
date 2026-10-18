import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import importPlugin from "eslint-plugin-import-x";
import jsdoc from "eslint-plugin-jsdoc";
import unicorn from "eslint-plugin-unicorn";
import globals from "globals";

export default [
  {
    ...importPlugin.flatConfigs.recommended,
    settings: {
      "import-x/resolver-next": [importPlugin.createNodeResolver()],
    },
  },
  js.configs.recommended,
  jsdoc.configs["flat/recommended"],
  unicorn.configs["recommended"],
  {
    ignores: ["eslint.config.js"],
  },
  {
    files: ["**/*.js"],
    languageOptions: { globals: { ...globals.node }, ecmaVersion: "latest" },
    rules: {
      "import-x/no-cycle": "error",
      "import-x/no-named-as-default": "error",
      "import-x/order": [
        "error",
        {
          alphabetize: { order: "asc" },
          "newlines-between": "always",
        },
      ],
      "unicorn/no-asterisk-prefix-in-documentation-comments": "off",
    },
  },
  prettier,
];
