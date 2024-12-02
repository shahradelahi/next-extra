import { defineConfig } from '@shahrad/eslint-config';

export default defineConfig(
  {
    ignores: ['**/dist', '**/dev'],
  },
  {
    files: ['**/*.test.ts', '**/*.spec.ts'],
    rules: {
      '@typescript-eslint/no-unused-expressions': 'off',
    },
  }
);
