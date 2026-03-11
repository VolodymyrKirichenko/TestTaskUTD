module.exports = {
  root: true,
  env: {
    node: true,
    es2022: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  rules: {
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {argsIgnorePattern: '^_', varsIgnorePattern: '^_'},
    ],
    '@typescript-eslint/no-explicit-any': 'warn',
  },
  overrides: [
    {
      files: ['packages/web/**/*.{ts,tsx}'],
      extends: ['next/core-web-vitals'],
    },
    {
      files: ['**/__tests__/**/*', '*.test.ts', '*.test.tsx'],
      env: {
        jest: true,
      },
    },
  ],
  ignorePatterns: [
    'node_modules',
    'dist',
    '.next',
    'out',
    '*.config.js',
    '*.config.mjs',
  ],
};
