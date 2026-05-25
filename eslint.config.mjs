// Flat ESLint config — single source of truth for the whole monorepo.
// Astro source files (.astro) are linted via eslint-plugin-astro.
// TS files use @typescript-eslint without type-aware rules to keep the
// pre-commit hook fast; tsc handles type errors separately.

import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import astro from 'eslint-plugin-astro';
import prettier from 'eslint-config-prettier';
import globals from 'globals';

export default [
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.astro/**',
      '**/.sanity/**',
      '**/sanity.types.ts',
      '**/pnpm-lock.yaml',
      // Python virtualenvs and local tool outputs that may exist in the
      // working directory but are not part of this project's source.
      '**/.venv/**',
      '**/venv/**',
      '**/__pycache__/**',
      '**/graphify-out/**',
      '**/playwright-report/**',
      '**/test-results/**',
    ],
  },

  js.configs.recommended,

  // TS / TSX
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
      globals: { ...globals.browser, ...globals.node, ...globals.es2022 },
    },
    plugins: { '@typescript-eslint': tseslint },
    rules: {
      ...tseslint.configs.recommended.rules,
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      'no-unused-vars': 'off',
    },
  },

  // Astro components
  ...astro.configs.recommended,

  // Astro files: TS already validates DOM types; no-undef false-positives on
  // built-in DOM lib types (e.g. HTMLElementTagNameMap) inside .astro frontmatter.
  {
    files: ['**/*.astro'],
    rules: {
      'no-undef': 'off',
    },
  },

  // Node-side build / seed scripts (Node-only, no DOM).
  {
    files: ['**/scripts/**/*.{js,mjs,cjs}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { ...globals.node, ...globals.es2022 },
    },
  },

  // Prettier — must be last to disable conflicting rules
  prettier,
];
