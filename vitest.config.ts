import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      exclude: [
        '**/dist/**',
        'src/types/**.ts',
        '**/commitlint.config.ts',
        '**/eslint.config.mjs',
        '**/vitest.config.ts',
      ],
      provider: 'v8',
      reporter: ['text', 'html'],
      thresholds: {
        lines: 80,
        branches: 80,
        functions: 80,
        statements: 80,
      },
    },
  },
});
