import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    testTimeout: 60_000,
    hookTimeout: 120_000,
    globals: true,
    exclude: ['**/node_modules/**', '**/dist/**'],
  },
  resolve: {
    alias: {
      '@/tests': path.resolve(__dirname, './tests'),
      '@': path.resolve(__dirname, './src'),
    },
  },
});
