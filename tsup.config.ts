import { defineConfig } from 'tsup';

export default defineConfig((options) => ({
  clean: !options.watch,
  dts: true,
  splitting: true,
  entry: ['src/*.ts', 'src/*.tsx', '!src/*.test.ts', '!src/*.test.tsx'],
  format: ['cjs', 'esm'],
  external: ['@se-oss/cookies'],
  target: 'esnext',
  outDir: 'dist',
}));
