import { defineConfig } from 'tsup';

export default defineConfig((options) => ({
  clean: !options.watch,
  dts: true,
  entry: ['src/*.ts', 'src/*.tsx', '!src/*.test.ts', '!src/*.test.tsx'],
  format: ['cjs', 'esm'],
  target: 'esnext',
  outDir: 'dist',
}));
