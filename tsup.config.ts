import { defineConfig } from 'tsup';

export default defineConfig([
  {
    clean: true,
    sourcemap: true,
    dts: true,
    keepNames: true,
    entry: ['src/*.ts', 'src/*.tsx', '!src/*.test.ts'],
    format: ['cjs', 'esm'],
    target: 'esnext',
    outDir: 'dist',
  },
]);
