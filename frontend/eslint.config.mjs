import js from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import reactPlugin from 'eslint-plugin-react';
import ts from 'typescript-eslint';

const importRulesConfig = {
  plugins: {
    import: importPlugin,
  },
  rules: {
    ...importPlugin.configs.rules,
    'import/no-unresolved': 'off', // check done by typescript
    'import/order': [
      'warn',
      {
        'newlines-between': 'always',
        alphabetize: { order: 'asc', caseInsensitive: true },
      },
    ],
    'import/no-default-export': 'warn',
  },
};

// eslint-disable-next-line import/no-default-export
export default ts.config(
  js.configs.recommended,
  ...ts.configs.strict,
  importRulesConfig,
  prettierConfig,
  {
    files: ['**/*.tsx', '**/*.ts', '**/*.jsx', '**/*.js'],
    plugins: {
      react: reactPlugin,
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      'react/jsx-uses-react': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
    },
  },
  {
    files: ['**/*.tsx', '**/*.ts'],

    rules: {
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_' },
      ],
    },
  },
  {
    files: ['**/*.tsx', '**/*.ts'],
    languageOptions: {
      parserOptions: {
        parser: ts.parser,
      },
    },
  },
  {
    ignores: ['build/', 'dist/', 'node_modules/', '.expo/'],
  }
);
