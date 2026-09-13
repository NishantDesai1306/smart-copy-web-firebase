import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/emulator/**/*.test.js'],
    fileParallelism: false,
    testTimeout: 30_000,
  },
});
