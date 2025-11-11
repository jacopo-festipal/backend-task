import jsPlugin from "@eslint/js";
import typescriptPlugin from "@typescript-eslint/eslint-plugin";
import parser from "@typescript-eslint/parser";
import eslintConfigPrettier from "eslint-config-prettier";
import importPlugin from "eslint-plugin-import";
import jestPlugin from "eslint-plugin-jest";
import sonarjsPlugin from "eslint-plugin-sonarjs";
import globals from "globals";

function makeMicroMatchPath(path, extensions) {
  const dict = {
    js: ["js", "cjs", "mjs"],
    ts: ["ts", "cts", "mts"],
    jsx: ["tsx"],
  };
  const exts = Array.from(new Set(extensions.map((ext) => dict[ext]).flat()));
  const first = exts[0];
  if (!first) throw new Error("did not match extensions");

  const extensionPattern = exts.length > 1 ? `{${exts.join(",")}}` : first;
  return `${path}.${extensionPattern}`;
}

/**
 * Base configuration without rules
 */
const eslintBaseConfig = {
  ignores: [
    ".git/**",
    "**/artifacts/**",
    "**/assets/**",
    "**/build/**",
    "**/coverage/**",
    "**/dist/**",
    "**/node_modules/**",
    "**/public/**",
    "**/static/**",
  ],
  linterOptions: {
    reportUnusedDisableDirectives: true,
  },
};

/**
 * ESLint's recommended rules for js files
 */
const jsRecommendedRulesConfig = {
  files: [makeMicroMatchPath("src/**/*", ["js", "ts", "tsx"])],
  rules: {
    ...jsPlugin.configs.recommended.rules,
    "constructor-super": "error",
    "no-console": "error",
    "no-else-return": "error",
    "no-nested-ternary": "error",
    "no-self-compare": "error",
    "no-unneeded-ternary": "error",
    "no-unreachable-loop": "error",
    "prefer-const": "error",
    "prefer-exponentiation-operator": "error",
    "prefer-named-capture-group": "error",
    "prefer-numeric-literals": "error",
    "prefer-object-has-own": "error",
    "prefer-rest-params": "error",
    "prefer-spread": "error",
    // TODO: enable after updating eslint to version 9
    // "no-useless-assignment": "error",
    "spaced-comment": ["warn", "always"],
    eqeqeq: "error",
    yoda: ["error", "never", { exceptRange: true }],
    "no-restricted-syntax": [
      "error",
      "ForInStatement",
      {
        selector: "TSEnumDeclaration",
        message:
          "In modern TypeScript, you may not need an enum when an object with `as const` could suffice.",
      },
    ],
  },
};

/**
 * Set of strict rules for typescript
 */
const typescriptRulesConfig = {
  files: [makeMicroMatchPath("**/*", ["ts", "jsx"])],
  plugins: {
    "@typescript-eslint": typescriptPlugin,
  },
  languageOptions: {
    parser,
    parserOptions: {
      ecmaFeatures: { modules: true, jsx: true },
      project: "./tsconfig.json",
      jsxPragma: null, // for @typescript/eslint-parser
    },
    globals: globals.browser,
  },
  rules: {
    ...typescriptPlugin.configs["eslint-recommended"].rules,
    ...typescriptPlugin.configs.recommended.rules,
    ...typescriptPlugin.configs["recommended-requiring-type-checking"].rules,

    "@typescript-eslint/prefer-ts-expect-error": "warn",
    "@typescript-eslint/unified-signatures": "warn",
    "@typescript-eslint/no-dynamic-delete": "warn",
    "@typescript-eslint/consistent-type-definitions": ["warn", "type"],
    "@typescript-eslint/naming-convention": [
      "error",
      {
        selector: "variable",
        types: ["boolean"],
        format: ["PascalCase"],
        prefix: ["is", "should", "has", "can", "did", "will"],
      },
    ],
    "no-implied-eval": "off",
    "@typescript-eslint/no-implied-eval": ["error"],
    "no-unused-expressions": "off",
    "@typescript-eslint/no-unused-expressions": ["error"],
    "no-useless-constructor": "off",
    "@typescript-eslint/no-useless-constructor": ["error"],
    "no-invalid-this": "off",
    "@typescript-eslint/no-invalid-this": ["error"],
    "no-shadow": "off",
    "@typescript-eslint/no-shadow": ["error"],
    "no-return-await": "off",
    "@typescript-eslint/return-await": "error",
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        args: "all",
        argsIgnorePattern: "^_",
        caughtErrors: "all",
        caughtErrorsIgnorePattern: "^_",
        destructuredArrayIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        ignoreRestSiblings: true,
      },
    ],
    "@typescript-eslint/no-namespace": [
      "error",
      {
        allowDeclarations: true,
        allowDefinitionFiles: true,
      },
    ],
    "@typescript-eslint/restrict-template-expressions": [
      "error",
      {
        allowNumber: true,
        allowBoolean: true,
      },
    ],
    "@typescript-eslint/array-type": "error",
    "@typescript-eslint/class-literal-property-style": "error",
    "dot-notation": "off",
    "@typescript-eslint/dot-notation": "error",
    "@typescript-eslint/no-base-to-string": "error",
    "@typescript-eslint/no-extraneous-class": "error",
    "@typescript-eslint/no-invalid-void-type": "error",
    "@typescript-eslint/no-meaningless-void-operator": "error",
    "@typescript-eslint/no-unnecessary-type-assertion": "error",
    "@typescript-eslint/no-non-null-asserted-nullish-coalescing": "error",
    "no-throw-literal": "off",
    "@typescript-eslint/no-throw-literal": "error",
    "@typescript-eslint/no-unnecessary-boolean-literal-compare": "error",
    "@typescript-eslint/no-unnecessary-type-arguments": "error",
    "@typescript-eslint/non-nullable-type-assertion-style": "error",
    "@typescript-eslint/prefer-for-of": "error",
    "@typescript-eslint/prefer-function-type": "warn",
    "@typescript-eslint/prefer-includes": "error",
    "@typescript-eslint/prefer-nullish-coalescing": "error",
    "@typescript-eslint/prefer-optional-chain": "error",
    "@typescript-eslint/prefer-reduce-type-parameter": "error",
    "@typescript-eslint/prefer-return-this-type": "error",
    "@typescript-eslint/prefer-string-starts-ends-with": "error",
    "@typescript-eslint/switch-exhaustiveness-check": "error",
    // TODO: Enable it after fixing types
    // '@typescript-eslint/no-unnecessary-condition': 'error',
    "@typescript-eslint/no-non-null-assertion": "error",
    "@typescript-eslint/consistent-type-assertions": [
      "error",
      {
        assertionStyle: "as",
        objectLiteralTypeAssertions: "never",
      },
    ],
    "@typescript-eslint/explicit-function-return-type": [
      "warn",
      {
        allowExpressions: true,
        allowTypedFunctionExpressions: true,
        allowHigherOrderFunctions: true,
        allowConciseArrowFunctionExpressionsStartingWithVoid: true,
      },
    ],
  },
};

/**
 * Set of rules for sonarjs
 */
const sonarjsRulesConfig = {
  files: [makeMicroMatchPath("**/*", ["js", "ts", "jsx"])],
  plugins: {
    sonarjs: sonarjsPlugin,
  },
  rules: {
    ...sonarjsPlugin.configs["recommended-legacy"].rules,
    "sonarjs/elseif-without-else": "warn",
    "sonarjs/no-inverted-boolean-check": "error",
  },
};

/**
 * Set of rules for import
 */
const importRulesConfig = {
  files: [makeMicroMatchPath("**/*", ["js", "ts", "jsx"])],
  plugins: {
    import: importPlugin,
  },
  rules: {
    ...importPlugin.configs.rules,
    "import/no-unresolved": "off", // check done by typescript
    "import/order": [
      "warn",
      {
        "newlines-between": "always",
        alphabetize: { order: "asc", caseInsensitive: true },
      },
    ],
    "import/no-default-export": "warn",
  },
};

/**
 * Override for configuration files in root catalog
 */
const configFilesConfigOverride = {
  files: [makeMicroMatchPath("*", ["ts", "js"])],
  rules: {
    "import/no-default-export": "off",
  },
};

/**
 * Override for utils file
 */
const utilsConfigOverride = {
  files: [makeMicroMatchPath("src/**/utils/**/*", ["ts"])],
  rules: {
    "@typescript-eslint/no-explicit-any": "off",
  },
};

/**
 * Override for test files
 */
const specConfigOverride = {
  files: [makeMicroMatchPath("src/**/*.spec", ["ts", "jsx"])],
  plugins: {
    jest: jestPlugin,
  },
  languageOptions: {
    globals: { ...globals.browser, ...globals.jest },
  },
  rules: {
    // has to be disabled in order to use chai ie. `expect().to.be.true`
    "@typescript-eslint/no-unused-expressions": "off",
  },
};

/**
 * Override for TS ambient module files
 */
const ambientModulesConfigOverride = {
  files: [makeMicroMatchPath("src/**/*.d", ["ts"])],
  rules: {
    "@typescript-eslint/consistent-type-definitions": "off",
    "@typescript-eslint/no-empty-interface": "off",
    "@typescript-eslint/no-unused-vars": "off",
  },
};

const rules = [
  jsRecommendedRulesConfig,
  typescriptRulesConfig,
  importRulesConfig,
  sonarjsRulesConfig,
  eslintConfigPrettier,
];

const overrides = [
  ambientModulesConfigOverride,
  specConfigOverride,
  utilsConfigOverride,
  configFilesConfigOverride,
];

export default [eslintBaseConfig].concat(rules).concat(overrides);
