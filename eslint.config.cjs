const tsParser = require('@typescript-eslint/parser');
const reactI18nT = require('./dist/index.js');

/** @type {import('eslint').Linter.FlatConfig[]} */
module.exports = [
  {
    ignores: ['node_modules/**', 'dist/**'],
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      parser: tsParser,
    },
  },
  {
    files: ['examples/**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      parser: tsParser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    plugins: {
      'react-i18n-t': reactI18nT,
    },
    rules: {
      'react-i18n-t/no-chinese-text': 'warn',
    },
  },
];





